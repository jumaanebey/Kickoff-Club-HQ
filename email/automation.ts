import { Resend } from 'resend'
import { supabase } from '@/database/supabase'
import {
  getWelcomeEmailTemplate,
  getCourseCompletionEmailTemplate,
  getWeeklyDigestEmailTemplate,
  getAchievementUnlockedEmailTemplate
} from './templates'

const resend = new Resend(process.env.RESEND_API_KEY)

// Track sent emails to avoid duplicates
async function trackEmail(
  userId: string,
  emailType: string,
  metadata?: any
) {
  await supabase.from('email_tracking').insert({
    user_id: userId,
    email_type: emailType,
    sent_at: new Date().toISOString(),
    metadata
  })
}

async function hasEmailBeenSent(
  userId: string,
  emailType: string,
  withinDays?: number
): Promise<boolean> {
  let query = supabase
    .from('email_tracking')
    .select('id')
    .eq('user_id', userId)
    .eq('email_type', emailType)

  if (withinDays) {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - withinDays)
    query = query.gte('sent_at', cutoffDate.toISOString())
  }

  const { data } = await query.single()
  return !!data
}

// ========== WELCOME EMAIL ==========

export async function sendWelcomeEmail(userId: string, userEmail: string, userName: string) {
  // Check if welcome email already sent
  const alreadySent = await hasEmailBeenSent(userId, 'welcome')
  if (alreadySent) return

  const template = getWelcomeEmailTemplate({ userName, userEmail })

  try {
    await resend.emails.send({
      from: 'Kickoff Club HQ <noreply@kickoffclubhq.com>',
      to: userEmail,
      subject: template.subject,
      html: template.html
    })

    await trackEmail(userId, 'welcome')
  } catch (error) {
    console.error('Error sending welcome email:', error)
  }
}

// ========== COURSE COMPLETION EMAIL ==========

export async function sendCourseCompletionEmail(
  userId: string,
  userEmail: string,
  userName: string,
  courseId: string
) {
  // Check if already sent for this course
  const alreadySent = await hasEmailBeenSent(userId, `course_completion_${courseId}`)
  if (alreadySent) return

  // Get course details
  const { data: course } = await supabase
    .from('courses')
    .select('title, slug')
    .eq('id', courseId)
    .single()

  if (!course) return

  const template = getCourseCompletionEmailTemplate({
    userName,
    courseName: course.title,
    courseSlug: course.slug,
    completionDate: new Date().toISOString()
  })

  try {
    await resend.emails.send({
      from: 'Kickoff Club HQ <noreply@kickoffclubhq.com>',
      to: userEmail,
      subject: template.subject,
      html: template.html
    })

    await trackEmail(userId, `course_completion_${courseId}`, { course_id: courseId })
  } catch (error) {
    console.error('Error sending course completion email:', error)
  }
}

// ========== WEEKLY DIGEST EMAIL ==========

export async function sendWeeklyDigestEmail(userId: string) {
  // Only send once per week
  const alreadySent = await hasEmailBeenSent(userId, 'weekly_digest', 7)
  if (alreadySent) return

  // Get user details
  const { data: profile } = await supabase
    .from('profiles')
    .select('email, full_name')
    .eq('id', userId)
    .single()

  if (!profile) return

  // Get user stats
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('id, completed_at')
    .eq('user_id', userId)

  const coursesInProgress = enrollments?.filter(e => !e.completed_at).length || 0

  const { count: lessonsCompleted } = await supabase
    .from('user_progress')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('completed', true)
    .gte('completion_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

  const { data: streak } = await supabase
    .from('user_streaks')
    .select('current_streak')
    .eq('user_id', userId)
    .single()

  // Get new courses from last week
  const { data: newCourses } = await supabase
    .from('courses')
    .select('title, slug')
    .eq('is_published', true)
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .limit(3)

  const template = getWeeklyDigestEmailTemplate({
    userName: profile.full_name || 'there',
    stats: {
      coursesInProgress,
      lessonsCompleted: lessonsCompleted || 0,
      currentStreak: streak?.current_streak || 0,
      newCourses: newCourses || []
    }
  })

  try {
    await resend.emails.send({
      from: 'Kickoff Club HQ <noreply@kickoffclubhq.com>',
      to: profile.email,
      subject: template.subject,
      html: template.html
    })

    await trackEmail(userId, 'weekly_digest')
  } catch (error) {
    console.error('Error sending weekly digest email:', error)
  }
}

// ========== ACHIEVEMENT UNLOCKED EMAIL ==========

export async function sendAchievementUnlockedEmail(
  userId: string,
  userEmail: string,
  userName: string,
  achievement: {
    name: string
    description: string
    icon: string
    points_reward: number
  }
) {
  // Check if already sent for this achievement
  const alreadySent = await hasEmailBeenSent(userId, `achievement_${achievement.name}`)
  if (alreadySent) return

  const template = getAchievementUnlockedEmailTemplate({
    userName,
    achievementName: achievement.name,
    achievementDescription: achievement.description,
    achievementIcon: achievement.icon,
    pointsEarned: achievement.points_reward
  })

  try {
    await resend.emails.send({
      from: 'Kickoff Club HQ <noreply@kickoffclubhq.com>',
      to: userEmail,
      subject: template.subject,
      html: template.html
    })

    await trackEmail(userId, `achievement_${achievement.name}`, { achievement_name: achievement.name })
  } catch (error) {
    console.error('Error sending achievement email:', error)
  }
}

// ========== RE-ENGAGEMENT EMAIL ==========

export async function sendReEngagementEmail(userId: string) {
  // Only send if user hasn't been active in 14 days and hasn't received re-engagement email in 30 days
  const alreadySent = await hasEmailBeenSent(userId, 're_engagement', 30)
  if (alreadySent) return

  const { data: profile } = await supabase
    .from('profiles')
    .select('email, full_name')
    .eq('id', userId)
    .single()

  if (!profile) return

  // Check last activity
  const { data: streak } = await supabase
    .from('user_streaks')
    .select('last_activity_date')
    .eq('user_id', userId)
    .single()

  if (streak) {
    const lastActivity = new Date(streak.last_activity_date)
    const daysSinceActivity = (Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)

    if (daysSinceActivity < 14) return // User is still active
  }

  try {
    await resend.emails.send({
      from: 'Kickoff Club HQ <noreply@kickoffclubhq.com>',
      to: profile.email,
      subject: "We miss you! Come back and continue your football journey",
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1>We miss you, ${profile.full_name || 'there'}! 🏈</h1>
            <p>It's been a while since you last visited Kickoff Club HQ. Your courses are waiting for you!</p>
            <p>Don't lose your progress - come back and pick up where you left off.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://kickoffclubhq.com/dashboard" style="background: #667eea; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Continue Learning</a>
            </div>
          </body>
        </html>
      `
    })

    await trackEmail(userId, 're_engagement')
  } catch (error) {
    console.error('Error sending re-engagement email:', error)
  }
}
