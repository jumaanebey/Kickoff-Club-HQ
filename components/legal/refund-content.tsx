'use client'

import { LegalPageWrapper, LegalSection, LegalSubSection, LegalParagraph, LegalList, LegalOrderedList, LegalInfoBox } from './legal-page-wrapper'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'

export function RefundContent() {
  const { colors } = useTheme()

  return (
    <LegalPageWrapper
      title="Refund Policy"
      lastUpdated="November 4, 2025"
      footerLinks={[
        { href: '/legal/privacy', label: 'Privacy Policy' },
        { href: '/legal/terms', label: 'Terms of Service' },
        { href: '/legal/cookies', label: 'Cookie Policy' },
      ]}
    >
      <LegalSection title="1. No Refund Policy">
        <LegalParagraph>
          At Kickoff Club HQ, all sales are final. Due to the digital nature of our courses and immediate access to all content upon purchase, we do not offer refunds. Please review the course details carefully before purchasing.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="2. Preview Before You Buy">
        <LegalParagraph>
          We encourage you to explore our free preview lessons before committing to a paid plan:
        </LegalParagraph>
        <LegalList>
          <li>Access 3-5 free sample lessons</li>
          <li>Experience our teaching style</li>
          <li>View course outlines and descriptions</li>
          <li>Join our community forum</li>
        </LegalList>
        <LegalParagraph>
          This allows you to make an informed decision before purchasing.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="3. Cancellation Policy">
        <LegalParagraph>
          You can cancel your subscription at any time:
        </LegalParagraph>

        <LegalSubSection title="3.1 How to Cancel">
          <LegalList>
            <li>Cancel through your account dashboard at <code className={cn("text-sm px-2 py-1 rounded", colors.bgTertiary)}>/dashboard/subscription</code></li>
            <li>Use the Stripe billing portal (click "Manage Subscription")</li>
            <li>Contact support@kickoffclubhq.com</li>
          </LegalList>
        </LegalSubSection>

        <LegalSubSection title="3.2 What Happens When You Cancel">
          <LegalList>
            <li>You keep access until the end of your current billing period</li>
            <li><strong>No refunds</strong> for the current billing period</li>
            <li>No future charges after cancellation</li>
            <li>You can re-subscribe at any time</li>
            <li>Your progress and data are preserved</li>
          </LegalList>
        </LegalSubSection>

        <LegalSubSection title="3.3 Subscription Plans">
          <LegalList>
            <li><strong>All-Access:</strong> $24.99 first month, then $4.99/month after. Cancel anytime.</li>
            <li><strong>Coaching Cohort:</strong> One-time payment of $299 for the entire 6-week program</li>
          </LegalList>
          <LegalParagraph>
            <strong>Note:</strong> When you cancel, you will not receive a refund for the current billing period, but you will have access until the end of that period.
          </LegalParagraph>
        </LegalSubSection>
      </LegalSection>

      <LegalSection title="4. Exceptions">
        <LegalParagraph>
          While we maintain a strict no-refund policy, we may consider exceptions only in these circumstances:
        </LegalParagraph>

        <LegalSubSection title="4.1 Technical Issues">
          <LegalParagraph>
            If you experience technical problems preventing you from accessing our services, contact support@kickoffclubhq.com. We'll work to resolve the issue. If we cannot resolve it, we may provide an extension or, in rare cases, a refund.
          </LegalParagraph>
        </LegalSubSection>

        <LegalSubSection title="4.2 Duplicate Charges">
          <LegalParagraph>
            If you're accidentally charged twice for the same purchase, we'll refund the duplicate charge immediately. Contact us at billing@kickoffclubhq.com with transaction details.
          </LegalParagraph>
        </LegalSubSection>

        <LegalSubSection title="4.3 Unauthorized Charges">
          <LegalParagraph>
            If you believe you've been charged without authorization:
          </LegalParagraph>
          <LegalOrderedList>
            <li>Contact us immediately at security@kickoffclubhq.com</li>
            <li>We'll investigate and secure your account</li>
            <li>Legitimate unauthorized charges will be refunded in full</li>
          </LegalOrderedList>
        </LegalSubSection>
      </LegalSection>

      <LegalSection title="5. Questions and Support">
        <LegalParagraph>
          If you have questions about our Refund Policy or need assistance:
        </LegalParagraph>
        <LegalInfoBox>
          <div className="space-y-2">
            <p className={cn(colors.textSecondary)}><strong>Billing Questions:</strong> billing@kickoffclubhq.com</p>
            <p className={cn(colors.textSecondary)}><strong>Technical Support:</strong> support@kickoffclubhq.com</p>
            <p className={cn(colors.textSecondary)}><strong>Security Issues:</strong> security@kickoffclubhq.com</p>
          </div>
        </LegalInfoBox>
        <LegalParagraph>
          We typically respond within 24 hours during business days.
        </LegalParagraph>
      </LegalSection>

      <section className={cn("border-l-4 border-red-500 p-6 rounded-r-lg", colors.bgSecondary)}>
        <h3 className={cn("text-xl font-bold mb-3", "text-red-600")}>Quick Summary</h3>
        <ul className={cn("space-y-2", colors.textSecondary)}>
          <li>❌ <strong>No refunds</strong> - All sales are final</li>
          <li>✅ Cancel anytime - keep access until end of billing period</li>
          <li>✅ Free preview lessons available before purchase</li>
          <li>✅ Exceptions for technical issues, duplicate charges, or unauthorized charges only</li>
          <li>✅ Full technical support included</li>
        </ul>
      </section>
    </LegalPageWrapper>
  )
}
