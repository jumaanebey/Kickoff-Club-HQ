'use client'

import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'

export function SimplePrivacyContent() {
  const { colors } = useTheme()

  return (
    <div className={cn("min-h-screen", colors.bgSecondary)}>
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className={cn("text-4xl font-bold mb-4", colors.text)}>Privacy Policy</h1>
        <p className={cn("mb-8", colors.textMuted)}>Last updated: April 19, 2026</p>

        <div className="prose prose-lg max-w-none">
          <h2 className={cn("text-2xl font-bold mt-6 mb-3", colors.text)}>1. Introduction</h2>
          <p className={cn(colors.textSecondary)}>
            Kickoff Club HQ ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and protect your information when you use our website and services.
          </p>

          <h2 className={cn("text-2xl font-bold mt-6 mb-3", colors.text)}>2. Information We Collect</h2>
          <h3 className={cn("text-xl font-semibold mt-4 mb-2", colors.textSecondary)}>Information you provide to us:</h3>
          <ul className={cn("list-disc pl-6 space-y-1", colors.textSecondary)}>
            <li>Account information (name, email address, password)</li>
            <li>Profile information (age, skill level, goals)</li>
            <li>Payment information (processed securely through Stripe)</li>
            <li>Communication with our support team</li>
          </ul>

          <h3 className={cn("text-xl font-semibold mt-4 mb-2", colors.textSecondary)}>Information we collect automatically:</h3>
          <ul className={cn("list-disc pl-6 space-y-1", colors.textSecondary)}>
            <li>Usage data (pages visited, features used)</li>
            <li>Device information (browser type, operating system)</li>
            <li>Cookies and similar technologies</li>
          </ul>

          <h2 className={cn("text-2xl font-bold mt-6 mb-3", colors.text)}>3. How We Use Your Information</h2>
          <p className={cn(colors.textSecondary)}>We use your information to:</p>
          <ul className={cn("list-disc pl-6 space-y-1", colors.textSecondary)}>
            <li>Provide and improve our services</li>
            <li>Process your payments and subscriptions</li>
            <li>Send you course updates and educational content</li>
            <li>Respond to your questions and support requests</li>
            <li>Analyze usage patterns to improve our platform</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className={cn("text-2xl font-bold mt-6 mb-3", colors.text)}>4. How We Share Your Information</h2>
          <p className={cn(colors.textSecondary)}>We may share your information with:</p>
          <ul className={cn("list-disc pl-6 space-y-1", colors.textSecondary)}>
            <li>
              <strong>Service Providers:</strong> Companies that help us operate our platform (payment processors, hosting providers, analytics services)
            </li>
            <li>
              <strong>Legal Requirements:</strong> When required by law or to protect our rights
            </li>
            <li>
              <strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition
            </li>
          </ul>
          <p className={cn("mt-2", colors.textSecondary)}>We do not sell your personal information to third parties.</p>

          <h2 className={cn("text-2xl font-bold mt-6 mb-3", colors.text)}>5. Your Rights</h2>
          <p className={cn(colors.textSecondary)}>You have the right to:</p>
          <ul className={cn("list-disc pl-6 space-y-1", colors.textSecondary)}>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to or restrict processing</li>
            <li>Data portability</li>
            <li>Withdraw consent at any time</li>
          </ul>

          <h2 className={cn("text-2xl font-bold mt-6 mb-3", colors.text)}>6. Third-Party Services</h2>
          <p className={cn(colors.textSecondary)}>We use the following third-party services:</p>
          <ul className={cn("list-disc pl-6 space-y-1", colors.textSecondary)}>
            <li><strong>Supabase:</strong> Authentication and database hosting</li>
            <li><strong>Stripe:</strong> Payment processing (we do not store credit card numbers)</li>
            <li><strong>Vercel:</strong> Website hosting</li>
          </ul>
          <p className={cn("mt-2", colors.textSecondary)}>These providers process data on our behalf under their respective privacy policies.</p>

          <h2 className={cn("text-2xl font-bold mt-6 mb-3", colors.text)}>7. Data Security</h2>
          <p className={cn(colors.textSecondary)}>
            We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
          </p>

          <h2 className={cn("text-2xl font-bold mt-6 mb-3", colors.text)}>8. Cookies</h2>
          <p className={cn(colors.textSecondary)}>
            We use essential cookies for authentication and session management. We may use analytics cookies to understand how users interact with our platform. You can control cookie preferences through your browser settings. We do not use advertising cookies.
          </p>

          <h2 className={cn("text-2xl font-bold mt-6 mb-3", colors.text)}>9. Data Retention</h2>
          <p className={cn(colors.textSecondary)}>
            We retain your data for as long as your account is active. If you request account deletion, we will process it within 30 days. Some data may be retained as required by law or for legitimate business purposes (e.g., fraud prevention).
          </p>

          <h2 className={cn("text-2xl font-bold mt-6 mb-3", colors.text)}>10. California Residents (CCPA)</h2>
          <p className={cn(colors.textSecondary)}>
            If you are a California resident, you have the right to: (1) know what personal information we collect, (2) request deletion of your data, (3) opt out of the sale of personal information (we do not sell your data), and (4) not be discriminated against for exercising your rights. Contact privacy@kickoffclubhq.com to exercise these rights. We will respond within 45 days.
          </p>

          <h2 className={cn("text-2xl font-bold mt-6 mb-3", colors.text)}>11. Children&apos;s Privacy</h2>
          <p className={cn(colors.textSecondary)}>
            Kickoff Club HQ is intended for users 13 years of age and older. We do not knowingly collect personal information from children under 13. If we learn that we have collected information from a child under 13, we will delete it promptly. If you believe a child has provided us with personal information, please contact us.
          </p>

          <h2 className={cn("text-2xl font-bold mt-6 mb-3", colors.text)}>12. Data Breach Notification</h2>
          <p className={cn(colors.textSecondary)}>
            In the event of a data breach that compromises your personal information, we will notify affected users within 72 hours of discovery via email.
          </p>

          <h2 className={cn("text-2xl font-bold mt-6 mb-3", colors.text)}>13. Changes to This Policy</h2>
          <p className={cn(colors.textSecondary)}>
            We may update this Privacy Policy from time to time. We will notify you of material changes by updating the &ldquo;Last updated&rdquo; date and, for significant changes, by email.
          </p>

          <h2 className={cn("text-2xl font-bold mt-6 mb-3", colors.text)}>14. Contact Us</h2>
          <p className={cn(colors.textSecondary)}>
            If you have any questions about this Privacy Policy or our data practices, please contact us:
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
