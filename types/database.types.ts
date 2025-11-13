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
