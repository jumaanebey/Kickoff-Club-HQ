/**
 * Email service using Resend
 * Configure your Resend API key in .env.local:
 * RESEND_API_KEY=your_api_key_here
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@kickoffclubhq.com'

interface EmailOptions {
  to: string
  subject: string
  html: string
}

/**
 * Send an email using Resend API
 */
async function sendEmail({ to, subject, html }: EmailOptions) {
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, skipping email send')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to,
        subject,
        html
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Resend API error: ${error}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error('Email send error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(to: string, name: string) {
  return sendEmail({
    to,
    subject: 'Welcome to Kickoff Club HQ!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 40px 20px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { color: #666; font-size: 14px; text-align: center; padding: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Kickoff Club HQ!</h1>
            </div>
            <div class="content">
              <h2>Hi ${name},</h2>
              <p>We're thrilled to have you join our community of football enthusiasts!</p>
              <p>You now have access to our comprehensive library of football training courses designed by championship coaches.</p>

              <h3>What's Next?</h3>
              <ul>
                <li>Browse our 50+ expert courses</li>
                <li>Start with beginner-friendly content</li>
                <li>Track your progress and earn certificates</li>
                <li>Join our community of 10,000+ students</li>
              </ul>

              <a href="https://kickoffclubhq.com/courses" class="button">Browse Courses</a>

              <p>Need help getting started? Check out our <a href="https://kickoffclubhq.com/help">Help Center</a> or reply to this email.</p>

              <p>Let's get started on your football journey!</p>
              <p>- The Kickoff Club HQ Team</p>
            </div>
            <div class="footer">
              <p>Kickoff Club HQ - Master Football with Expert Coaches</p>
              <p><a href="https://kickoffclubhq.com">kickoffclubhq.com</a></p>
            </div>
          </div>
        </body>
      </html>
    `
  })
}

/**
 * Send course enrollment confirmation
 */
export async function sendEnrollmentEmail(
  to: string,
  name: string,
  courseName: string,
  courseSlug: string
) {
  return sendEmail({
    to,
    subject: `You're enrolled in ${courseName}!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 40px 20px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { color: #666; font-size: 14px; text-align: center; padding: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 You're Enrolled!</h1>
            </div>
            <div class="content">
              <h2>Hi ${name},</h2>
              <p>Great news! You're now enrolled in <strong>${courseName}</strong>.</p>
              <p>You can start learning right away and access all course materials at your own pace.</p>

              <a href="https://kickoffclubhq.com/courses/${courseSlug}" class="button">Start Learning</a>

              <p>Remember to check your progress in your dashboard and earn your certificate upon completion!</p>

              <p>Happy learning!</p>
              <p>- The Kickoff Club HQ Team</p>
            </div>
            <div class="footer">
              <p>Kickoff Club HQ - Master Football with Expert Coaches</p>
            </div>
          </div>
        </body>
      </html>
    `
  })
}

/**
 * Send course completion congratulations
 */
export async function sendCourseCompletionEmail(
  to: string,
  name: string,
  courseName: string,
  courseId: string
) {
  return sendEmail({
    to,
    subject: `🎓 Congratulations on completing ${courseName}!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 40px 20px; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { color: #666; font-size: 14px; text-align: center; padding: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Congratulations!</h1>
              <p style="font-size: 24px; margin: 20px 0;">You completed ${courseName}</p>
            </div>
            <div class="content">
              <h2>Hi ${name},</h2>
              <p>We're excited to celebrate this achievement with you! You've successfully completed <strong>${courseName}</strong>.</p>

              <p>Your dedication and hard work have paid off. You can now download your certificate of completion.</p>

              <a href="https://kickoffclubhq.com/dashboard/certificates/${courseId}" class="button">View Your Certificate</a>

              <h3>What's Next?</h3>
              <p>Keep the momentum going by exploring more courses:</p>
              <ul>
                <li>Continue with advanced topics</li>
                <li>Try a different position or specialty</li>
                <li>Share your success with the community</li>
              </ul>

              <a href="https://kickoffclubhq.com/courses">Browse More Courses</a>

              <p>Keep up the great work!</p>
              <p>- The Kickoff Club HQ Team</p>
            </div>
            <div class="footer">
              <p>Kickoff Club HQ - Master Football with Expert Coaches</p>
            </div>
          </div>
        </body>
      </html>
    `
  })
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(to: string, resetLink: string) {
  return sendEmail({
    to,
    subject: 'Reset Your Password - Kickoff Club HQ',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 40px 20px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { color: #666; font-size: 14px; text-align: center; padding: 20px; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Reset Your Password</h1>
            </div>
            <div class="content">
              <p>We received a request to reset your password for your Kickoff Club HQ account.</p>

              <p>Click the button below to reset your password:</p>

              <a href="${resetLink}" class="button">Reset Password</a>

              <p>This link will expire in 1 hour for security reasons.</p>

              <div class="warning">
                <p><strong>⚠️ Security Notice:</strong></p>
                <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
              </div>

              <p>Need help? Contact our support team at support@kickoffclubhq.com</p>
            </div>
            <div class="footer">
              <p>Kickoff Club HQ - Master Football with Expert Coaches</p>
            </div>
          </div>
        </body>
      </html>
    `
  })
}

/**
 * Send weekly progress digest
 */
export async function sendWeeklyDigestEmail(
  to: string,
  name: string,
  stats: {
    coursesInProgress: number
    lessonsCompleted: number
    watchTimeMinutes: number
  }
) {
  return sendEmail({
    to,
    subject: '📊 Your Weekly Learning Progress',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 40px 20px; }
            .stat-card { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 10px 0; text-align: center; }
            .stat-number { font-size: 36px; font-weight: bold; color: #667eea; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { color: #666; font-size: 14px; text-align: center; padding: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 Your Weekly Progress</h1>
            </div>
            <div class="content">
              <h2>Hi ${name},</h2>
              <p>Here's a summary of your learning progress this week:</p>

              <div class="stat-card">
                <div class="stat-number">${stats.coursesInProgress}</div>
                <div>Courses In Progress</div>
              </div>

              <div class="stat-card">
                <div class="stat-number">${stats.lessonsCompleted}</div>
                <div>Lessons Completed</div>
              </div>

              <div class="stat-card">
                <div class="stat-number">${stats.watchTimeMinutes}</div>
                <div>Minutes Watched</div>
              </div>

              <p>Keep up the great work! Consistency is key to mastering football fundamentals.</p>

              <a href="https://kickoffclubhq.com/dashboard/analytics" class="button">View Full Analytics</a>

              <p>- The Kickoff Club HQ Team</p>
            </div>
            <div class="footer">
              <p>Kickoff Club HQ - Master Football with Expert Coaches</p>
              <p><a href="https://kickoffclubhq.com/dashboard/settings">Update email preferences</a></p>
            </div>
          </div>
        </body>
      </html>
    `
  })
}
