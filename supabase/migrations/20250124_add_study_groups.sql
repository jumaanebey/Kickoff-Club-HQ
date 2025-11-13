-- Add Study Groups
-- Collaborative learning groups for teams and coaches

-- Study groups table - team/coach groups
CREATE TABLE study_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  avatar_url TEXT,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT FALSE NOT NULL,
  member_limit INTEGER,
  member_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Group members table - users in groups
CREATE TABLE group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member' NOT NULL, -- 'owner', 'admin', 'member'
  joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(group_id, user_id)
);

-- Group progress - aggregated group learning progress
CREATE TABLE group_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  members_enrolled INTEGER DEFAULT 0 NOT NULL,
  members_completed INTEGER DEFAULT 0 NOT NULL,
  avg_progress_percentage INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(group_id, course_id)
);

-- Group invitations table
CREATE TABLE group_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
  invited_email VARCHAR(255) NOT NULL,
  invited_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending' NOT NULL, -- 'pending', 'accepted', 'declined', 'expired'
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(group_id, invited_email)
);

-- Create indexes
CREATE INDEX idx_study_groups_slug ON study_groups(slug);
CREATE INDEX idx_study_groups_owner ON study_groups(owner_id);
CREATE INDEX idx_study_groups_public ON study_groups(is_public);

CREATE INDEX idx_group_members_group_id ON group_members(group_id);
CREATE INDEX idx_group_members_user_id ON group_members(user_id);
CREATE INDEX idx_group_members_role ON group_members(role);

CREATE INDEX idx_group_progress_group_id ON group_progress(group_id);
CREATE INDEX idx_group_progress_course_id ON group_progress(course_id);

CREATE INDEX idx_group_invitations_group_id ON group_invitations(group_id);
CREATE INDEX idx_group_invitations_email ON group_invitations(invited_email);
CREATE INDEX idx_group_invitations_status ON group_invitations(status);

-- Triggers
CREATE TRIGGER update_study_groups_updated_at BEFORE UPDATE ON study_groups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_group_progress_updated_at BEFORE UPDATE ON group_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update group member count
CREATE OR REPLACE FUNCTION update_group_member_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE study_groups
  SET member_count = (
    SELECT COUNT(*) FROM group_members WHERE group_id = COALESCE(NEW.group_id, OLD.group_id)
  )
  WHERE id = COALESCE(NEW.group_id, OLD.group_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER group_member_count_changed
  AFTER INSERT OR DELETE ON group_members
  FOR EACH ROW
  EXECUTE FUNCTION update_group_member_count();

-- RLS Policies
ALTER TABLE study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_invitations ENABLE ROW LEVEL SECURITY;

-- Study groups - public groups visible to all, private only to members
CREATE POLICY "Anyone can view public study groups"
  ON study_groups FOR SELECT
  USING (is_public = TRUE OR auth.uid() = owner_id OR EXISTS (
    SELECT 1 FROM group_members WHERE group_id = study_groups.id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create study groups"
  ON study_groups FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Group owners can update their groups"
  ON study_groups FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Group owners can delete their groups"
  ON study_groups FOR DELETE
  USING (auth.uid() = owner_id);

-- Group members - members can view, owners/admins can manage
CREATE POLICY "Group members can view member list"
  ON group_members FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM study_groups WHERE id = group_members.group_id AND is_public = TRUE)
    OR EXISTS (SELECT 1 FROM group_members gm WHERE gm.group_id = group_members.group_id AND gm.user_id = auth.uid())
  );

CREATE POLICY "Users can join groups"
  ON group_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Group owners/admins can remove members"
  ON group_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_id = group_members.group_id
        AND user_id = auth.uid()
        AND role IN ('owner', 'admin')
    )
  );

-- Group progress - visible to group members
CREATE POLICY "Group members can view group progress"
  ON group_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_id = group_progress.group_id AND user_id = auth.uid()
    )
  );

-- Group invitations - inviter and invitee can see
CREATE POLICY "Users can view their invitations"
  ON group_invitations FOR SELECT
  USING (
    auth.uid() = invited_by
    OR EXISTS (SELECT 1 FROM profiles WHERE email = group_invitations.invited_email AND id = auth.uid())
  );

CREATE POLICY "Group members can create invitations"
  ON group_invitations FOR INSERT
  WITH CHECK (
    auth.uid() = invited_by AND EXISTS (
      SELECT 1 FROM group_members
      WHERE group_id = group_invitations.group_id
        AND user_id = auth.uid()
        AND role IN ('owner', 'admin')
    )
  );

-- Comments
COMMENT ON TABLE study_groups IS 'Collaborative learning groups for teams/coaches';
COMMENT ON TABLE group_members IS 'Members of study groups';
COMMENT ON TABLE group_progress IS 'Aggregated progress tracking for groups';
COMMENT ON TABLE group_invitations IS 'Pending invitations to join groups';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Study groups created successfully!';
  RAISE NOTICE '';
  RAISE NOTICE 'New features:';
  RAISE NOTICE '  ✅ study_groups - Team/coach groups';
  RAISE NOTICE '  ✅ group_members - Group membership management';
  RAISE NOTICE '  ✅ group_progress - Track group learning progress';
  RAISE NOTICE '  ✅ group_invitations - Invite users to groups';
  RAISE NOTICE '';
  RAISE NOTICE '👥 Teams can now learn together!';
END $$;
