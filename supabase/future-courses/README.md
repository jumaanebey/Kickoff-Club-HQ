# Future Courses (Pending Lessons)

These courses exist in the database but have been unpublished because they don't have video lessons yet.

## To Re-publish a Course

1. Add lessons to the course in Supabase
2. Run the SQL to publish:
```sql
UPDATE courses SET is_published = true WHERE slug = 'course-slug-here';
```

## Courses Awaiting Content (14 total)

| Course | Category | Tier | Difficulty |
|--------|----------|------|------------|
| Understanding Downs & Distance | general | free | beginner |
| Field Positions Masterclass | general | basic | intermediate |
| Offensive Strategy Guide | general | premium | advanced |
| Defensive Schemes Explained | defense | basic | intermediate |
| Special Teams: The Third Phase | special_teams | free | beginner |
| Quarterback Elite Training | quarterback | premium | advanced |
| Linebacker: Captain of Defense | defense | basic | intermediate |
| Wide Receiver Route Tree | wide_receiver | basic | intermediate |
| Common Penalties Explained | general | free | beginner |
| Clock Management Mastery | general | premium | advanced |
| Offensive Formations 101 | general | basic | intermediate |
| Defensive Coverages: Cover 1-4 | defense | premium | advanced |
| History of Football | general | free | beginner |
| Football Equipment Guide | general | free | beginner |

## Re-publish All (when ready)

```sql
UPDATE courses SET is_published = true WHERE slug IN (
  'understanding-downs-distance',
  'field-positions-masterclass',
  'offensive-strategy-guide',
  'defensive-schemes-explained',
  'special-teams-third-phase',
  'quarterback-elite-training',
  'linebacker-captain-defense',
  'wide-receiver-route-tree',
  'common-penalties-explained',
  'clock-management-mastery',
  'offensive-formations-101',
  'defensive-coverages-cover-1-4',
  'history-of-football',
  'football-equipment-guide'
);
```
