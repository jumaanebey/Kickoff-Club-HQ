'use client'

import { LegalPageWrapper, LegalSection, LegalSubSection, LegalParagraph, LegalList, LegalOrderedList, LegalInfoBox } from './legal-page-wrapper'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'

export function PrivacyContent() {
  const { colors } = useTheme()

  return (
    <LegalPageWrapper
      title="Privacy Policy"
      lastUpdated="November 4, 2025"
      footerLinks={[
        { href: '/legal/terms', label: 'Terms of Service' },
        { href: '/legal/refund', label: 'Refund Policy' },
        { href: '/legal/cookies', label: 'Cookie Policy' },
      ]}
    >
      <LegalSection title="1. Introduction">
        <LegalParagraph>
          Welcome to Kickoff Club HQ ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
        </LegalParagraph>
        <LegalParagraph>
          By accessing or using Kickoff Club HQ, you agree to this Privacy Policy. If you do not agree with our policies and practices, please do not use our services.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="2. Information We Collect">
        <LegalSubSection title="2.1 Personal Information">
          <LegalParagraph>
            We collect information that you voluntarily provide to us when you:
          </LegalParagraph>
          <LegalList>
            <li>Register for an account</li>
            <li>Subscribe to our services</li>
            <li>Enroll in courses</li>
            <li>Post comments or reviews</li>
            <li>Contact our support team</li>
            <li>Sign up for our newsletter</li>
          </LegalList>
          <LegalParagraph>
            This information may include:
          </LegalParagraph>
          <LegalList>
            <li>Name and email address</li>
            <li>Username and password</li>
            <li>Payment information (processed securely through Stripe)</li>
            <li>Profile information and preferences</li>
            <li>Course progress and completion data</li>
          </LegalList>
        </LegalSubSection>

        <LegalSubSection title="2.2 Automatically Collected Information">
          <LegalParagraph>
            When you access our services, we automatically collect certain information, including:
          </LegalParagraph>
          <LegalList>
            <li>Device information (browser type, operating system)</li>
            <li>IP address and location data</li>
            <li>Usage data (pages visited, time spent, clicks)</li>
            <li>Cookies and similar tracking technologies</li>
            <li>Log data and error reports</li>
          </LegalList>
        </LegalSubSection>
      </LegalSection>

      <LegalSection title="3. How We Use Your Information">
        <LegalParagraph>
          We use the information we collect to:
        </LegalParagraph>
        <LegalList>
          <li>Provide, maintain, and improve our services</li>
          <li>Process your subscriptions and payments</li>
          <li>Send you course updates, receipts, and important notices</li>
          <li>Respond to your comments, questions, and support requests</li>
          <li>Track your course progress and issue certificates</li>
          <li>Personalize your learning experience</li>
          <li>Send marketing communications (with your consent)</li>
          <li>Detect and prevent fraud, abuse, and security issues</li>
          <li>Comply with legal obligations</li>
          <li>Analyze usage patterns and improve our platform</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="4. Information Sharing and Disclosure">
        <LegalParagraph>
          We do not sell, trade, or rent your personal information to third parties. We may share your information with:
        </LegalParagraph>

        <LegalSubSection title="4.1 Service Providers">
          <LegalList>
            <li><strong>Stripe:</strong> Payment processing</li>
            <li><strong>Supabase:</strong> Database and authentication</li>
            <li><strong>Resend:</strong> Email delivery</li>
            <li><strong>Vercel:</strong> Hosting and infrastructure</li>
          </LegalList>
        </LegalSubSection>

        <LegalSubSection title="4.2 Legal Requirements">
          <LegalParagraph>
            We may disclose your information if required by law or in response to valid requests by public authorities (e.g., court orders, subpoenas).
          </LegalParagraph>
        </LegalSubSection>

        <LegalSubSection title="4.3 Business Transfers">
          <LegalParagraph>
            If we are involved in a merger, acquisition, or sale of assets, your information may be transferred. We will notify you before your information becomes subject to a different privacy policy.
          </LegalParagraph>
        </LegalSubSection>
      </LegalSection>

      <LegalSection title="5. Data Security">
        <LegalParagraph>
          We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
        </LegalParagraph>
        <LegalList>
          <li>Encryption of data in transit and at rest</li>
          <li>Secure authentication and authorization</li>
          <li>Regular security audits and updates</li>
          <li>Access controls and monitoring</li>
          <li>Secure payment processing through PCI-compliant providers</li>
        </LegalList>
        <LegalParagraph>
          However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="6. Your Rights and Choices">
        <LegalParagraph>
          You have the following rights regarding your personal information:
        </LegalParagraph>
        <LegalList>
          <li><strong>Access:</strong> Request a copy of your personal data</li>
          <li><strong>Correction:</strong> Update or correct inaccurate information</li>
          <li><strong>Deletion:</strong> Request deletion of your account and data</li>
          <li><strong>Opt-out:</strong> Unsubscribe from marketing emails</li>
          <li><strong>Data Portability:</strong> Receive your data in a portable format</li>
          <li><strong>Objection:</strong> Object to certain processing activities</li>
        </LegalList>
        <LegalParagraph>
          To exercise these rights, please contact us at privacy@kickoffclubhq.com
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="7. Cookies and Tracking Technologies">
        <LegalParagraph>
          We use cookies and similar tracking technologies to enhance your experience. Cookies are small data files stored on your device. We use:
        </LegalParagraph>
        <LegalList>
          <li><strong>Essential Cookies:</strong> Required for authentication and security</li>
          <li><strong>Analytics Cookies:</strong> Help us understand how you use our services</li>
          <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
        </LegalList>
        <LegalParagraph>
          You can control cookies through your browser settings. Note that disabling cookies may affect functionality.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="8. Children's Privacy">
        <LegalParagraph>
          Our services are not intended for children under 13. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="9. International Data Transfers">
        <LegalParagraph>
          Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="10. Changes to This Privacy Policy">
        <LegalParagraph>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date. We encourage you to review this policy periodically.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="11. Contact Us">
        <LegalParagraph>
          If you have any questions about this Privacy Policy, please contact us:
        </LegalParagraph>
        <LegalInfoBox>
          <p className={cn(colors.textSecondary)}><strong>Email:</strong> privacy@kickoffclubhq.com</p>
          <p className={cn("mt-2", colors.textSecondary)}><strong>Mail:</strong> Kickoff Club HQ Legal Department</p>
        </LegalInfoBox>
      </LegalSection>
    </LegalPageWrapper>
  )
}
