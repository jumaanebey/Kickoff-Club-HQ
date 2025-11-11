// Email template functions for Resend

interface WelcomeEmailData {
  userName: string
  userEmail: string
}

export function getWelcomeEmailTemplate(data: WelcomeEmailData) {
  return {
    subject: 'Welcome to Kickoff Club HQ! 🏈',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Kickoff Club HQ</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Kickoff Club HQ! 🏈</h1>
          </div>

          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 18px; margin-bottom: 20px;">Hey ${data.userName},</p>

            <p>We're excited to have you join our community of football enthusiasts! You're now part of a platform dedicated to helping you master the fundamentals of football.</p>

            <h2 style="color: #667eea; font-size: 20px; margin-top: 30px;">🚀 Here's what you can do now:</h2>

            <ul style="background: white; padding: 20px 20px 20px 40px; border-radius: 8px; margin: 20px 0;">
              <li style="margin-bottom: 12px;"><strong>Explore our courses</strong> - Browse through structured courses for all skill levels</li>
              <li style="margin-bottom: 12px;"><strong>Learn from experts</strong> - Get insights from experienced coaches and players</li>
              <li style="margin-bottom: 12px;"><strong>Take quizzes</strong> - Test your knowledge and earn achievements</li>
              <li style="margin-bottom: 12px;"><strong>Track your progress</strong> - Build learning streaks and unlock badges</li>
            </ul>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://kickoffclubhq.com/courses" style="background: #667eea; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Browse Courses</a>
            </div>

            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
              Need help? Reply to this email or visit our <a href="https://kickoffclubhq.com/support" style="color: #667eea;">support center</a>.
            </p>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
            <p>Kickoff Club HQ - Master Football Fundamentals</p>
            <p>You're receiving this because you signed up at kickoffclubhq.com</p>
          </div>
        </body>
      </html>
    `
  }
}

interface CourseCompletionEmailData {
  userName: string
  courseName: string
  courseSlug: string
  completionDate: string
}

export function getCourseCompletionEmailTemplate(data: CourseCompletionEmailData) {
  return {
    subject: `🎉 Congratulations! You completed ${data.courseName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Course Completed!</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
            <div style="font-size: 60px; margin-bottom: 15px;">🏆</div>
            <h1 style="color: white; margin: 0; font-size: 28px;">Congratulations!</h1>
          </div>

          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 18px; margin-bottom: 20px;">Great job, ${data.userName}!</p>

            <p>You've successfully completed <strong>${data.courseName}</strong>! This is a significant achievement and shows your dedication to improving your skills.</p>

            <div style="background: white; border-left: 4px solid #10b981; padding: 20px; margin: 25px 0; border-radius: 4px;">
              <p style="margin: 0; color: #047857;"><strong>Course:</strong> ${data.courseName}</p>
              <p style="margin: 8px 0 0 0; color: #6b7280;">Completed on ${new Date(data.completionDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>

            <h2 style="color: #10b981; font-size: 20px; margin-top: 30px;">🎯 What's next?</h2>

            <ul style="background: white; padding: 20px 20px 20px 40px; border-radius: 8px; margin: 20px 0;">
              <li style="margin-bottom: 12px;">Review the course material anytime</li>
              <li style="margin-bottom: 12px;">Explore our other courses to continue learning</li>
              <li style="margin-bottom: 12px;">Share your achievement with friends</li>
              <li style="margin-bottom: 12px;">Apply what you learned on the field!</li>
            </ul>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://kickoffclubhq.com/courses/${data.courseSlug}" style="background: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; margin-right: 10px;">View Course</a>
              <a href="https://kickoffclubhq.com/courses" style="background: white; color: #10b981; border: 2px solid #10b981; padding: 12px 26px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">More Courses</a>
            </div>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
            <p>Kickoff Club HQ - Master Football Fundamentals</p>
          </div>
        </body>
      </html>
    `
  }
}

interface WeeklyDigestEmailData {
  userName: string
  stats: {
    coursesInProgress: number
    lessonsCompleted: number
    currentStreak: number
    newCourses: Array<{
      title: string
      slug: string
    }>
  }
}

export function getWeeklyDigestEmailTemplate(data: WeeklyDigestEmailData) {
  return {
    subject: '📊 Your Weekly Learning Summary',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Weekly Digest</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">📊 Your Weekly Summary</h1>
          </div>

          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 18px; margin-bottom: 20px;">Hi ${data.userName},</p>

            <p>Here's a quick look at your learning progress this week:</p>

            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 25px 0;">
              <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="font-size: 32px; font-weight: bold; color: #3b82f6;">${data.stats.coursesInProgress}</div>
                <div style="font-size: 12px; color: #6b7280; margin-top: 5px;">Courses<br/>In Progress</div>
              </div>

              <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="font-size: 32px; font-weight: bold; color: #10b981;">${data.stats.lessonsCompleted}</div>
                <div style="font-size: 12px; color: #6b7280; margin-top: 5px;">Lessons<br/>Completed</div>
              </div>

              <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="font-size: 32px; font-weight: bold; color: #f59e0b;">${data.stats.currentStreak}</div>
                <div style="font-size: 12px; color: #6b7280; margin-top: 5px;">Day<br/>Streak 🔥</div>
              </div>
            </div>

            ${data.stats.newCourses.length > 0 ? `
              <h2 style="color: #3b82f6; font-size: 20px; margin-top: 30px;">🆕 New Courses This Week</h2>

              <ul style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; list-style: none;">
                ${data.stats.newCourses.map(course => `
                  <li style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb;">
                    <a href="https://kickoffclubhq.com/courses/${course.slug}" style="color: #3b82f6; text-decoration: none; font-weight: 500;">
                      ${course.title} →
                    </a>
                  </li>
                `).join('')}
              </ul>
            ` : ''}

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://kickoffclubhq.com/dashboard" style="background: #3b82f6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">View Dashboard</a>
            </div>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
            <p>Kickoff Club HQ - Master Football Fundamentals</p>
            <p><a href="https://kickoffclubhq.com/settings/emails" style="color: #9ca3af;">Update email preferences</a></p>
          </div>
        </body>
      </html>
    `
  }
}

interface AchievementUnlockedEmailData {
  userName: string
  achievementName: string
  achievementDescription: string
  achievementIcon: string
  pointsEarned: number
}

export function getAchievementUnlockedEmailTemplate(data: AchievementUnlockedEmailData) {
  return {
    subject: `🏅 Achievement Unlocked: ${data.achievementName}!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Achievement Unlocked!</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
            <div style="font-size: 80px; margin-bottom: 15px;">${data.achievementIcon}</div>
            <h1 style="color: white; margin: 0; font-size: 28px;">Achievement Unlocked!</h1>
          </div>

          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 18px; margin-bottom: 20px;">Awesome work, ${data.userName}!</p>

            <div style="background: white; border: 2px solid #f59e0b; padding: 25px; margin: 25px 0; border-radius: 8px; text-align: center;">
              <h2 style="color: #d97706; margin: 0 0 10px 0; font-size: 24px;">${data.achievementName}</h2>
              <p style="color: #6b7280; margin: 10px 0;">${data.achievementDescription}</p>
              <div style="display: inline-block; background: #fef3c7; color: #92400e; padding: 8px 16px; border-radius: 20px; margin-top: 15px; font-weight: bold;">
                +${data.pointsEarned} Points
              </div>
            </div>

            <p>Keep up the great work! Your dedication to learning is paying off.</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://kickoffclubhq.com/dashboard" style="background: #f59e0b; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">View All Achievements</a>
            </div>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
            <p>Kickoff Club HQ - Master Football Fundamentals</p>
          </div>
        </body>
      </html>
    `
  }
}
