'use client'

import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'

export function SimpleRefundContent() {
  const { colors } = useTheme()

  return (
    <div className={cn("min-h-screen", colors.bgSecondary)}>
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className={cn("text-4xl font-bold mb-4", colors.text)}>Refund Policy</h1>
        <p className={cn("mb-8", colors.textMuted)}>Last updated: November 11, 2025</p>

        <div className="prose prose-lg max-w-none">
          <h2 className={cn("text-2xl font-bold mt-6 mb-3", colors.text)}>1. Overview</h2>
          <p className={cn(colors.textSecondary)}>
            At Kickoff Club HQ, we want you to be completely satisfied with your purchase. This Refund Policy outlines the circumstances under which refunds may be issued.
          </p>

          <h2 className={cn("text-2xl font-bold mt-6 mb-3", colors.text)}>2. Monthly Subscriptions</h2>
          <p className={cn(colors.textSecondary)}>
            Monthly subscriptions to our All-Access plan can be canceled at any time. Upon cancellation:
          </p>
          <ul className={cn("list-disc pl-6 space-y-1", colors.textSecondary)}>
            <li>You will retain access to paid content until the end of your current billing period</li>
            <li>No refund will be issued for the current billing period</li>
            <li>No further charges will be made after the current period ends</li>
          </ul>

          <h2 className={cn("text-2xl font-bold mt-6 mb-3", colors.text)}>3. 7-Day Money-Back Guarantee</h2>
          <p className={cn(colors.textSecondary)}>
            We offer a 7-day money-back guarantee for first-time subscribers to our All-Access plan. If you're not satisfied with our content within the first 7 days of your subscription, we will issue a full refund.
          </p>

          <h3 className={cn("text-xl font-semibold mt-4 mb-2", colors.textSecondary)}>To request a refund:</h3>
          <ul className={cn("list-disc pl-6 space-y-1", colors.textSecondary)}>
            <li>Contact us within 7 days of your initial purchase</li>
            <li>Provide your account email and reason for the refund request</li>
            <li>Allow 5-10 business days for processing</li>
          </ul>

          <h2 className={cn("text-2xl font-bold mt-6 mb-3", colors.text)}>4. Coaching Cohort Program</h2>
          <p className={cn(colors.textSecondary)}>
            The Coaching Cohort program has a special refund policy due to its limited capacity:
          </p>
          <ul className={cn("list-disc pl-6 space-y-1", colors.textSecondary)}>
            <li>
              <strong>Before Program Starts:</strong> Full refund available up to 48 hours before the cohort start date
            </li>
            <li>
              <strong>Within First Week:</strong> 50% refund available if you withdraw during the first week
            </li>
            <li>
              <strong>After First Week:</strong> No refunds available due to the personalized nature of the coaching
            </li>
          </ul>

          <h2 className={cn("text-2xl font-bold mt-6 mb-3", colors.text)}>5. How to Request a Refund</h2>
          <p className={cn(colors.textSecondary)}>
            To request a refund, please contact our support team:
          </p>
          <ul className={cn("list-disc pl-6 space-y-1 mt-2", colors.textSecondary)}>
            <li>Email: <a href="mailto:refunds@kickoffclubhq.com" className={cn(colors.link, colors.linkHover, "hover:underline")}>refunds@kickoffclubhq.com</a></li>
            <li>Include your account email, order number, and reason for refund</li>
            <li>Allow 5-10 business days for processing</li>
          </ul>

          <h2 className={cn("text-2xl font-bold mt-6 mb-3", colors.text)}>6. Contact Us</h2>
          <p className={cn(colors.textSecondary)}>
            If you have any questions about our Refund Policy, please contact us:
          </p>
          <ul className={cn("list-disc pl-6 space-y-1 mt-2", colors.textSecondary)}>
            <li>Email: <a href="mailto:refunds@kickoffclubhq.com" className={cn(colors.link, colors.linkHover, "hover:underline")}>refunds@kickoffclubhq.com</a></li>
            <li>Website: <a href="/contact" className={cn(colors.link, colors.linkHover, "hover:underline")}>Contact Form</a></li>
          </ul>
        </div>
      </div>
    </div>
  )
}
