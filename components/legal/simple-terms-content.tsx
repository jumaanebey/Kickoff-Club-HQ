'use client'

import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'

export function SimpleTermsContent() {
  const { colors } = useTheme()

  return (
    <div className={cn("min-h-screen", colors.bgSecondary)}>
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className={cn("text-4xl font-bold mb-4", colors.text)}>Terms of Service</h1>
        <p className={cn("mb-8", colors.textMuted)}>Last updated: November 11, 2025</p>

        <div className="prose prose-lg max-w-none">
          <h2 className={cn("text-2xl font-bold mt-6 mb-3", colors.text)}>1. Acceptance of Terms</h2>
          <p className={cn(colors.textSecondary)}>
            By accessing and using Kickoff Club HQ, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our services.
          </p>

          <h2 className={cn("text-2xl font-bold mt-6 mb-3", colors.text)}>2. Use License</h2>
          <p className={cn(colors.textSecondary)}>
            Permission is granted to temporarily access the materials (courses, videos, information) on Kickoff Club HQ for personal, non-commercial use only. This is the grant of a license, not a transfer of title.
          </p>

          <h3 className={cn("text-xl font-semibold mt-4 mb-2", colors.textSecondary)}>Under this license you may not:</h3>
          <ul className={cn("list-disc pl-6 space-y-1", colors.textSecondary)}>
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>Attempt to decompile or reverse engineer any software on Kickoff Club HQ</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
          </ul>

          <h2 className={cn("text-2xl font-bold mt-6 mb-3", colors.text)}>3. Account Responsibilities</h2>
          <p className={cn(colors.textSecondary)}>
            You are responsible for safeguarding your account credentials and for any activities or actions under your account. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
          </p>

          <h2 className={cn("text-2xl font-bold mt-6 mb-3", colors.text)}>4. Subscription and Payment</h2>
          <p className={cn(colors.textSecondary)}>
            Subscriptions are billed in advance on a monthly or annual basis. Payment is processed through our third-party payment processor, Stripe. All fees are non-refundable except as required by law or as explicitly stated in our Refund Policy.
          </p>

          <h2 className={cn("text-2xl font-bold mt-6 mb-3", colors.text)}>5. Content Ownership</h2>
          <p className={cn(colors.textSecondary)}>
            All content on Kickoff Club HQ, including but not limited to text, graphics, logos, videos, and software, is the property of Kickoff Club HQ and protected by copyright laws.
          </p>

          <h2 className={cn("text-2xl font-bold mt-6 mb-3", colors.text)}>6. User Conduct</h2>
          <p className={cn(colors.textSecondary)}>You agree not to:</p>
          <ul className={cn("list-disc pl-6 space-y-1", colors.textSecondary)}>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe on the intellectual property rights of others</li>
            <li>Upload viruses or malicious code</li>
            <li>Spam, phish, or engage in other deceptive practices</li>
            <li>Harass, abuse, or harm other users</li>
          </ul>

          <h2 className={cn("text-2xl font-bold mt-6 mb-3", colors.text)}>7. Termination</h2>
          <p className={cn(colors.textSecondary)}>
            We may terminate or suspend your account and access to our services immediately, without prior notice or liability, for any reason, including breach of these Terms of Service.
          </p>

          <h2 className={cn("text-2xl font-bold mt-6 mb-3", colors.text)}>8. Contact Us</h2>
          <p className={cn(colors.textSecondary)}>
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <ul className={cn("list-disc pl-6 space-y-1 mt-2", colors.textSecondary)}>
            <li>Email: <a href="mailto:legal@kickoffclubhq.com" className={cn(colors.link, colors.linkHover, "hover:underline")}>legal@kickoffclubhq.com</a></li>
            <li>Website: <a href="/contact" className={cn(colors.link, colors.linkHover, "hover:underline")}>Contact Form</a></li>
          </ul>
        </div>
      </div>
    </div>
  )
}
