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
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          bio?: string | null
          subscription_tier?: SubscriptionTier
          subscription_status?: SubscriptionStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          bio?: string | null
          subscription_tier?: SubscriptionTier
          subscription_status?: SubscriptionStatus
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
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Course = Database['public']['Tables']['courses']['Row']
export type Lesson = Database['public']['Tables']['lessons']['Row']
export type UserProgress = Database['public']['Tables']['user_progress']['Row']
export type Enrollment = Database['public']['Tables']['enrollments']['Row']

export type CourseWithLessons = Course & {
  lessons: Lesson[]
}

export type LessonWithProgress = Lesson & {
  progress?: UserProgress
}
