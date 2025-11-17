'use client'

import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'

export function SimpleCookiesContent() {
  const { colors } = useTheme()

  return (
    <div className={cn("min-h-screen", colors.bgSecondary)}>
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className={cn("text-4xl font-bold mb-4", colors.text)}>Cookie Policy</h1>
        <p className={cn("mb-8", colors.textMuted)}>Last updated: November 11, 2025</p>

        <div className="prose prose-lg max-w-none">
          <h2 className={cn("text-2xl font-bold mt-6 mb-3", colors.text)}>1. What Are Cookies?</h2>
          <p className={cn(colors.textSecondary)}>
            Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
          </p>

          <h2 className={cn("text-2xl font-bold mt-6 mb-3", colors.text)}>2. How We Use Cookies</h2>
          <p className={cn(colors.textSecondary)}>
            Kickoff Club HQ uses cookies to:
          </p>
          <ul className={cn("list-disc pl-6 space-y-1", colors.textSecondary)}>
            <li>Keep you signed in to your account</li>
            <li>Remember your preferences and settings</li>
            <li>Understand how you use our platform</li>
            <li>Improve our services and user experience</li>
            <li>Deliver personalized content and recommendations</li>
            <li>Provide security features</li>
          </ul>

          <h2 className={cn("text-2xl font-bold mt-6 mb-3", colors.text)}>3. Types of Cookies We Use</h2>

          <h3 className={cn("text-xl font-semibold mt-4 mb-2", colors.textSecondary)}>Essential Cookies</h3>
          <p className={cn(colors.textSecondary)}>
            These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. You cannot opt-out of these cookies.
          </p>

          <h3 className={cn("text-xl font-semibold mt-4 mb-2", colors.textSecondary)}>Performance Cookies</h3>
          <p className={cn(colors.textSecondary)}>
            These cookies collect information about how you use our website, such as which pages you visit most often. This data helps us optimize our platform and improve user experience.
          </p>

          <h3 className={cn("text-xl font-semibold mt-4 mb-2", colors.textSecondary)}>Functionality Cookies</h3>
          <p className={cn(colors.textSecondary)}>
            These cookies allow our website to remember choices you make (such as your username, language, or region) and provide enhanced, personalized features.
          </p>

          <h2 className={cn("text-2xl font-bold mt-6 mb-3", colors.text)}>4. Third-Party Cookies</h2>
          <p className={cn(colors.textSecondary)}>
            We use third-party services that may set their own cookies:
          </p>
          <ul className={cn("list-disc pl-6 space-y-1", colors.textSecondary)}>
            <li>Google Analytics - for website analytics</li>
            <li>Stripe - for payment processing</li>
            <li>Vercel - for hosting and performance monitoring</li>
            <li>YouTube - for video content delivery</li>
          </ul>

          <h2 className={cn("text-2xl font-bold mt-6 mb-3", colors.text)}>5. Managing Cookies</h2>
          <p className={cn(colors.textSecondary)}>
            You can control and manage cookies in several ways. Most browsers allow you to refuse or accept cookies through their settings. Please note that if you choose to disable cookies, some features of our website may not function properly.
          </p>

          <h2 className={cn("text-2xl font-bold mt-6 mb-3", colors.text)}>6. Contact Us</h2>
          <p className={cn(colors.textSecondary)}>
            If you have questions about our use of cookies, please contact us:
          </p>
          <ul className={cn("list-disc pl-6 space-y-1 mt-2", colors.textSecondary)}>
            <li>Email: <a href="mailto:privacy@kickoffclubhq.com" className={cn(colors.link, colors.linkHover, "hover:underline")}>privacy@kickoffclubhq.com</a></li>
            <li>Website: <a href="/contact" className={cn(colors.link, colors.linkHover, "hover:underline")}>Contact Form</a></li>
          </ul>
        </div>
      </div>
    </div>
  )
}
