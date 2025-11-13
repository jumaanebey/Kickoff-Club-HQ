export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type SubscriptionTier = 'free' | 'basic' | 'premium'
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'expired'
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'
export type CourseCategory =
  | 'quarterback'
  | 'wide_receiver'
  | 'running_back'
  | 'offensive_line'
  | 'defense'
  | 'special_teams'
  | 'general'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          bio: string | null
          role: string
          subscription_tier: SubscriptionTier
          subscription_status: SubscriptionStatus
          total_points: number
          achievement_count: number
          follower_count: number
          following_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          bio?: string | null
          role?: string
          subscription_tier?: SubscriptionTier
          subscription_status?: SubscriptionStatus
          total_points?: number
          achievement_count?: number
          follower_count?: number
          following_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          bio?: string | null
          role?: string
          subscription_tier?: SubscriptionTier
          subscription_status?: SubscriptionStatus
          total_points?: number
          achievement_count?: number
          follower_count?: number
          following_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          slug: string
          description: string
          thumbnail_url: string | null
          instructor_name: string
          instructor_bio: string | null
          instructor_avatar: string | null
          category: CourseCategory
          difficulty_level: DifficultyLevel
          duration_minutes: number
          tier_required: SubscriptionTier
          is_published: boolean
          order_index: number
          enrolled_count: number
          average_rating: number
          review_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description: string
          thumbnail_url?: string | null
          instructor_name: string
          instructor_bio?: string | null
          instructor_avatar?: string | null
          category: CourseCategory
          difficulty_level: DifficultyLevel
          duration_minutes: number
          tier_required?: SubscriptionTier
          is_published?: boolean
          order_index?: number
          enrolled_count?: number
          average_rating?: number
          review_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string
          thumbnail_url?: string | null
          instructor_name?: string
          instructor_bio?: string | null
          instructor_avatar?: string | null
          category?: CourseCategory
          difficulty_level?: DifficultyLevel
          duration_minutes?: number
          tier_required?: SubscriptionTier
          is_published?: boolean
          order_index?: number
          enrolled_count?: number
          average_rating?: number
          review_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          course_id: string
          title: string
          slug: string
          description: string | null
          video_id: string
          video_url: string | null
          duration_seconds: number
          thumbnail_url: string | null
          order_index: number
          resources: Json | null
          is_free: boolean
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          slug: string
          description?: string | null
          video_id: string
          video_url?: string | null
          duration_seconds?: number
          thumbnail_url?: string | null
          order_index?: number
          resources?: Json | null
          is_free?: boolean
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          slug?: string
          description?: string | null
          video_id?: string
          video_url?: string | null
          duration_seconds?: number
          thumbnail_url?: string | null
          order_index?: number
          resources?: Json | null
          is_free?: boolean
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          completed: boolean
          completion_date: string | null
          watch_time_seconds: number
          last_position_seconds: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          completed?: boolean
          completion_date?: string | null
          watch_time_seconds?: number
          last_position_seconds?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          completed?: boolean
          completion_date?: string | null
          watch_time_seconds?: number
          last_position_seconds?: number
          created_at?: string
          updated_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          enrolled_at: string
          completed_at: string | null
          progress_percentage: number
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          enrolled_at?: string
          completed_at?: string | null
          progress_percentage?: number
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          enrolled_at?: string
          completed_at?: string | null
          progress_percentage?: number
        }
      }
      lesson_quiz_questions: {
        Row: {
          id: string
          lesson_id: string
          question: string
          order_index: number
          points: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lesson_id: string
          question: string
          order_index?: number
          points?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lesson_id?: string
          question?: string
          order_index?: number
          points?: number
          created_at?: string
          updated_at?: string
        }
      }
      lesson_quiz_options: {
        Row: {
          id: string
          question_id: string
          option_text: string
          is_correct: boolean
          explanation: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          question_id: string
          option_text: string
          is_correct?: boolean
          explanation?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          question_id?: string
          option_text?: string
          is_correct?: boolean
          explanation?: string | null
          order_index?: number
          created_at?: string
        }
      }
      lesson_quiz_attempts: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          score: number
          max_score: number
          percentage: number
          passed: boolean
          completed_at: string
          time_spent_seconds: number
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          score?: number
          max_score?: number
          percentage?: number
          passed?: boolean
          completed_at?: string
          time_spent_seconds?: number
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          score?: number
          max_score?: number
          percentage?: number
          passed?: boolean
          completed_at?: string
          time_spent_seconds?: number
        }
      }
      lesson_quiz_answers: {
        Row: {
          id: string
          attempt_id: string
          question_id: string
          selected_option_id: string | null
          is_correct: boolean
          points_earned: number
          answered_at: string
        }
        Insert: {
          id?: string
          attempt_id: string
          question_id: string
          selected_option_id?: string | null
          is_correct?: boolean
          points_earned?: number
          answered_at?: string
        }
        Update: {
          id?: string
          attempt_id?: string
          question_id?: string
          selected_option_id?: string | null
          is_correct?: boolean
          points_earned?: number
          answered_at?: string
        }
      }
      course_reviews: {
        Row: {
          id: string
          user_id: string
          course_id: string
          rating: number
          review_title: string | null
          review_text: string | null
          is_verified_completion: boolean
          helpful_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          rating: number
          review_title?: string | null
          review_text?: string | null
          is_verified_completion?: boolean
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          rating?: number
          review_title?: string | null
          review_text?: string | null
          is_verified_completion?: boolean
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      review_helpfulness: {
        Row: {
          id: string
          review_id: string
          user_id: string
          is_helpful: boolean
          created_at: string
        }
        Insert: {
          id?: string
          review_id: string
          user_id: string
          is_helpful: boolean
          created_at?: string
        }
        Update: {
          id?: string
          review_id?: string
          user_id?: string
          is_helpful?: boolean
          created_at?: string
        }
      }
      lesson_bookmarks: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          timestamp_seconds: number
          title: string | null
          note: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          timestamp_seconds: number
          title?: string | null
          note?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          timestamp_seconds?: number
          title?: string | null
          note?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      course_favorites: {
        Row: {
          id: string
          user_id: string
          course_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          created_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          badge_icon: string | null
          badge_url: string | null
          points: number
          category: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description: string
          badge_icon?: string | null
          badge_url?: string | null
          points?: number
          category?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          badge_icon?: string | null
          badge_url?: string | null
          points?: number
          category?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          earned_at: string
          progress: number
          metadata: Json | null
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          earned_at?: string
          progress?: number
          metadata?: Json | null
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          earned_at?: string
          progress?: number
          metadata?: Json | null
        }
      }
      course_certificates: {
        Row: {
          id: string
          user_id: string
          course_id: string
          certificate_number: string
          issued_at: string
          completion_date: string
          final_score: number | null
          certificate_url: string | null
          is_public: boolean
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          certificate_number?: string
          issued_at?: string
          completion_date: string
          final_score?: number | null
          certificate_url?: string | null
          is_public?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          certificate_number?: string
          issued_at?: string
          completion_date?: string
          final_score?: number | null
          certificate_url?: string | null
          is_public?: boolean
        }
      }
      lesson_comments: {
        Row: {
          id: string
          lesson_id: string
          user_id: string
          content: string
          is_pinned: boolean
          is_edited: boolean
          like_count: number
          reply_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lesson_id: string
          user_id: string
          content: string
          is_pinned?: boolean
          is_edited?: boolean
          like_count?: number
          reply_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lesson_id?: string
          user_id?: string
          content?: string
          is_pinned?: boolean
          is_edited?: boolean
          like_count?: number
          reply_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      comment_replies: {
        Row: {
          id: string
          comment_id: string
          user_id: string
          content: string
          is_edited: boolean
          like_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          comment_id: string
          user_id: string
          content: string
          is_edited?: boolean
          like_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          comment_id?: string
          user_id?: string
          content?: string
          is_edited?: boolean
          like_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      comment_likes: {
        Row: {
          id: string
          user_id: string
          comment_id: string | null
          reply_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          comment_id?: string | null
          reply_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          comment_id?: string | null
          reply_id?: string | null
          created_at?: string
        }
      }
      learning_paths: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          thumbnail_url: string | null
          difficulty_level: DifficultyLevel
          estimated_hours: number
          is_published: boolean
          order_index: number
          enrolled_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description: string
          thumbnail_url?: string | null
          difficulty_level: DifficultyLevel
          estimated_hours?: number
          is_published?: boolean
          order_index?: number
          enrolled_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          thumbnail_url?: string | null
          difficulty_level?: DifficultyLevel
          estimated_hours?: number
          is_published?: boolean
          order_index?: number
          enrolled_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      learning_path_courses: {
        Row: {
          id: string
          learning_path_id: string
          course_id: string
          order_index: number
          is_required: boolean
          created_at: string
        }
        Insert: {
          id?: string
          learning_path_id: string
          course_id: string
          order_index?: number
          is_required?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          learning_path_id?: string
          course_id?: string
          order_index?: number
          is_required?: boolean
          created_at?: string
        }
      }
      user_learning_paths: {
        Row: {
          id: string
          user_id: string
          learning_path_id: string
          enrolled_at: string
          completed_at: string | null
          progress_percentage: number
          current_course_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          learning_path_id: string
          enrolled_at?: string
          completed_at?: string | null
          progress_percentage?: number
          current_course_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          learning_path_id?: string
          enrolled_at?: string
          completed_at?: string | null
          progress_percentage?: number
          current_course_id?: string | null
        }
      }
      course_prerequisites: {
        Row: {
          id: string
          course_id: string
          prerequisite_course_id: string
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          prerequisite_course_id: string
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          prerequisite_course_id?: string
          created_at?: string
        }
      }
      lesson_notes: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_streaks: {
        Row: {
          id: string
          user_id: string
          current_streak: number
          longest_streak: number
          last_activity_date: string | null
          total_active_days: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          current_streak?: number
          longest_streak?: number
          last_activity_date?: string | null
          total_active_days?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          current_streak?: number
          longest_streak?: number
          last_activity_date?: string | null
          total_active_days?: number
          created_at?: string
          updated_at?: string
        }
      }
      daily_activity_log: {
        Row: {
          id: string
          user_id: string
          activity_date: string
          lessons_completed: number
          watch_time_seconds: number
          quizzes_passed: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activity_date: string
          lessons_completed?: number
          watch_time_seconds?: number
          quizzes_passed?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          activity_date?: string
          lessons_completed?: number
          watch_time_seconds?: number
          quizzes_passed?: number
          created_at?: string
        }
      }
      leaderboard_entries: {
        Row: {
          id: string
          user_id: string
          leaderboard_type: string
          score: number
          rank: number | null
          period_start: string | null
          period_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          leaderboard_type: string
          score?: number
          rank?: number | null
          period_start?: string | null
          period_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          leaderboard_type?: string
          score?: number
          rank?: number | null
          period_start?: string | null
          period_end?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      practice_drills: {
        Row: {
          id: string
          title: string
          slug: string
          description: string
          instructions: string | null
          thumbnail_url: string | null
          course_id: string | null
          category: CourseCategory
          difficulty_level: DifficultyLevel
          estimated_minutes: number
          drill_type: string
          passing_score: number
          is_published: boolean
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description: string
          instructions?: string | null
          thumbnail_url?: string | null
          course_id?: string | null
          category: CourseCategory
          difficulty_level: DifficultyLevel
          estimated_minutes?: number
          drill_type: string
          passing_score?: number
          is_published?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string
          instructions?: string | null
          thumbnail_url?: string | null
          course_id?: string | null
          category?: CourseCategory
          difficulty_level?: DifficultyLevel
          estimated_minutes?: number
          drill_type?: string
          passing_score?: number
          is_published?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      drill_attempts: {
        Row: {
          id: string
          user_id: string
          drill_id: string
          score: number
          max_score: number
          percentage: number
          passed: boolean
          completed_at: string
          time_spent_seconds: number
          feedback: string | null
        }
        Insert: {
          id?: string
          user_id: string
          drill_id: string
          score?: number
          max_score?: number
          percentage?: number
          passed?: boolean
          completed_at?: string
          time_spent_seconds?: number
          feedback?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          drill_id?: string
          score?: number
          max_score?: number
          percentage?: number
          passed?: boolean
          completed_at?: string
          time_spent_seconds?: number
          feedback?: string | null
        }
      }
      drill_scores: {
        Row: {
          id: string
          user_id: string
          drill_id: string
          best_score: number
          best_percentage: number
          attempts_count: number
          first_attempt_at: string
          last_attempt_at: string
        }
        Insert: {
          id?: string
          user_id: string
          drill_id: string
          best_score?: number
          best_percentage?: number
          attempts_count?: number
          first_attempt_at?: string
          last_attempt_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          drill_id?: string
          best_score?: number
          best_percentage?: number
          attempts_count?: number
          first_attempt_at?: string
          last_attempt_at?: string
        }
      }
      study_groups: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          avatar_url: string | null
          owner_id: string
          is_public: boolean
          member_limit: number | null
          member_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          avatar_url?: string | null
          owner_id: string
          is_public?: boolean
          member_limit?: number | null
          member_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          avatar_url?: string | null
          owner_id?: string
          is_public?: boolean
          member_limit?: number | null
          member_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      group_members: {
        Row: {
          id: string
          group_id: string
          user_id: string
          role: string
          joined_at: string
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          role?: string
          joined_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          user_id?: string
          role?: string
          joined_at?: string
        }
      }
      group_progress: {
        Row: {
          id: string
          group_id: string
          course_id: string
          members_enrolled: number
          members_completed: number
          avg_progress_percentage: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          group_id: string
          course_id: string
          members_enrolled?: number
          members_completed?: number
          avg_progress_percentage?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          course_id?: string
          members_enrolled?: number
          members_completed?: number
          avg_progress_percentage?: number
          created_at?: string
          updated_at?: string
        }
      }
      group_invitations: {
        Row: {
          id: string
          group_id: string
          invited_email: string
          invited_by: string
          status: string
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          group_id: string
          invited_email: string
          invited_by: string
          status?: string
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          invited_email?: string
          invited_by?: string
          status?: string
          expires_at?: string | null
          created_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          color: string | null
          usage_count: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          color?: string | null
          usage_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          color?: string | null
          usage_count?: number
          created_at?: string
        }
      }
      course_tags: {
        Row: {
          course_id: string
          tag_id: string
          created_at: string
        }
        Insert: {
          course_id: string
          tag_id: string
          created_at?: string
        }
        Update: {
          course_id?: string
          tag_id?: string
          created_at?: string
        }
      }
      lesson_tags: {
        Row: {
          lesson_id: string
          tag_id: string
          created_at: string
        }
        Insert: {
          lesson_id: string
          tag_id: string
          created_at?: string
        }
        Update: {
          lesson_id?: string
          tag_id?: string
          created_at?: string
        }
      }
      activity_feed: {
        Row: {
          id: string
          user_id: string
          activity_type: string
          title: string
          description: string | null
          metadata: Json | null
          is_public: boolean
          like_count: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activity_type: string
          title: string
          description?: string | null
          metadata?: Json | null
          is_public?: boolean
          like_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          activity_type?: string
          title?: string
          description?: string | null
          metadata?: Json | null
          is_public?: boolean
          like_count?: number
          created_at?: string
        }
      }
      activity_likes: {
        Row: {
          id: string
          activity_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          activity_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          activity_id?: string
          user_id?: string
          created_at?: string
        }
      }
      user_follows: {
        Row: {
          id: string
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          id?: string
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          id?: string
          follower_id?: string
          following_id?: string
          created_at?: string
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Course = Database['public']['Tables']['courses']['Row']
export type Lesson = Database['public']['Tables']['lessons']['Row']
export type UserProgress = Database['public']['Tables']['user_progress']['Row']
export type Enrollment = Database['public']['Tables']['enrollments']['Row']

// Quiz types
export type LessonQuizQuestion = Database['public']['Tables']['lesson_quiz_questions']['Row']
export type LessonQuizOption = Database['public']['Tables']['lesson_quiz_options']['Row']
export type LessonQuizAttempt = Database['public']['Tables']['lesson_quiz_attempts']['Row']
export type LessonQuizAnswer = Database['public']['Tables']['lesson_quiz_answers']['Row']

// Review types
export type CourseReview = Database['public']['Tables']['course_reviews']['Row']
export type ReviewHelpfulness = Database['public']['Tables']['review_helpfulness']['Row']

// Bookmark types
export type LessonBookmark = Database['public']['Tables']['lesson_bookmarks']['Row']
export type CourseFavorite = Database['public']['Tables']['course_favorites']['Row']

// Achievement types
export type Achievement = Database['public']['Tables']['achievements']['Row']
export type UserAchievement = Database['public']['Tables']['user_achievements']['Row']
export type CourseCertificate = Database['public']['Tables']['course_certificates']['Row']

// Discussion types
export type LessonComment = Database['public']['Tables']['lesson_comments']['Row']
export type CommentReply = Database['public']['Tables']['comment_replies']['Row']
export type CommentLike = Database['public']['Tables']['comment_likes']['Row']

// Learning path types
export type LearningPath = Database['public']['Tables']['learning_paths']['Row']
export type LearningPathCourse = Database['public']['Tables']['learning_path_courses']['Row']
export type UserLearningPath = Database['public']['Tables']['user_learning_paths']['Row']
export type CoursePrerequisite = Database['public']['Tables']['course_prerequisites']['Row']

// Notes and streak types
export type LessonNote = Database['public']['Tables']['lesson_notes']['Row']
export type UserStreak = Database['public']['Tables']['user_streaks']['Row']
export type DailyActivityLog = Database['public']['Tables']['daily_activity_log']['Row']
export type LeaderboardEntry = Database['public']['Tables']['leaderboard_entries']['Row']

// Practice drill types
export type PracticeDrill = Database['public']['Tables']['practice_drills']['Row']
export type DrillAttempt = Database['public']['Tables']['drill_attempts']['Row']
export type DrillScore = Database['public']['Tables']['drill_scores']['Row']

// Study group types
export type StudyGroup = Database['public']['Tables']['study_groups']['Row']
export type GroupMember = Database['public']['Tables']['group_members']['Row']
export type GroupProgress = Database['public']['Tables']['group_progress']['Row']
export type GroupInvitation = Database['public']['Tables']['group_invitations']['Row']

// Tag and activity types
export type Tag = Database['public']['Tables']['tags']['Row']
export type CourseTag = Database['public']['Tables']['course_tags']['Row']
export type LessonTag = Database['public']['Tables']['lesson_tags']['Row']
export type ActivityFeed = Database['public']['Tables']['activity_feed']['Row']
export type ActivityLike = Database['public']['Tables']['activity_likes']['Row']
export type UserFollow = Database['public']['Tables']['user_follows']['Row']

// Composite types
export type CourseWithLessons = Course & {
  lessons: Lesson[]
}

export type LessonWithProgress = Lesson & {
  progress?: UserProgress
}

export type CourseWithReviews = Course & {
  reviews: CourseReview[]
}

export type QuizQuestionWithOptions = LessonQuizQuestion & {
  options: LessonQuizOption[]
}

export type QuizAttemptWithAnswers = LessonQuizAttempt & {
  answers: LessonQuizAnswer[]
}

export type CommentWithReplies = LessonComment & {
  replies: CommentReply[]
  user: Profile
}

export type LearningPathWithCourses = LearningPath & {
  courses: (LearningPathCourse & { course: Course })[]
}

export type DrillWithAttempts = PracticeDrill & {
  attempts: DrillAttempt[]
  bestScore?: DrillScore
}

export type StudyGroupWithMembers = StudyGroup & {
  members: (GroupMember & { user: Profile })[]
  owner: Profile
}

export type ActivityWithUser = ActivityFeed & {
  user: Profile
  likes: ActivityLike[]
}
