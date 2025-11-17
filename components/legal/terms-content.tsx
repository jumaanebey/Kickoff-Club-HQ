'use client'

import { LegalPageWrapper, LegalSection, LegalSubSection, LegalParagraph, LegalList, LegalInfoBox } from './legal-page-wrapper'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'

export function TermsContent() {
  const { colors } = useTheme()

  return (
    <LegalPageWrapper
      title="Terms of Service"
      lastUpdated="November 4, 2025"
      footerLinks={[
        { href: '/legal/privacy', label: 'Privacy Policy' },
        { href: '/legal/refund', label: 'Refund Policy' },
        { href: '/legal/cookies', label: 'Cookie Policy' },
      ]}
    >
      <LegalSection title="1. Agreement to Terms">
        <LegalParagraph>
          These Terms of Service ("Terms") constitute a legally binding agreement between you and Kickoff Club HQ ("Company," "we," "us," or "our") concerning your access to and use of the Kickoff Club HQ website and services.
        </LegalParagraph>
        <LegalParagraph>
          By accessing or using our services, you agree that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you must not access or use our services.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="2. Account Registration">
        <LegalSubSection title="2.1 Account Creation">
          <LegalParagraph>
            To access certain features, you must register for an account. When creating an account, you agree to:
          </LegalParagraph>
          <LegalList>
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain and promptly update your account information</li>
            <li>Maintain the security of your password</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Notify us immediately of any unauthorized use</li>
          </LegalList>
        </LegalSubSection>

        <LegalSubSection title="2.2 Age Requirements">
          <LegalParagraph>
            You must be at least 13 years old to use our services. If you are under 18, you must have parental or guardian consent.
          </LegalParagraph>
        </LegalSubSection>

        <LegalSubSection title="2.3 Account Termination">
          <LegalParagraph>
            We reserve the right to suspend or terminate your account at any time for violations of these Terms or for any other reason at our sole discretion.
          </LegalParagraph>
        </LegalSubSection>
      </LegalSection>

      <LegalSection title="3. Subscription and Payment">
        <LegalSubSection title="3.1 Subscription Plans">
          <LegalParagraph>
            We offer the following subscription tiers:
          </LegalParagraph>
          <LegalList>
            <li><strong>Free:</strong> Access to free courses and community features</li>
            <li><strong>Basic ($19/month):</strong> Access to all Basic tier courses</li>
            <li><strong>Premium ($49/month):</strong> Access to all courses and premium features</li>
          </LegalList>
        </LegalSubSection>

        <LegalSubSection title="3.2 Billing">
          <LegalParagraph>
            By subscribing, you agree to:
          </LegalParagraph>
          <LegalList>
            <li>Pay all fees associated with your subscription</li>
            <li>Automatic monthly billing until cancelled</li>
            <li>Fees are non-refundable except as required by law or our Refund Policy</li>
            <li>We may change prices with 30 days' notice</li>
            <li>You are responsible for all applicable taxes</li>
          </LegalList>
        </LegalSubSection>

        <LegalSubSection title="3.3 Cancellation">
          <LegalParagraph>
            You may cancel your subscription at any time through your account settings or the billing portal. Upon cancellation:
          </LegalParagraph>
          <LegalList>
            <li>You will retain access until the end of your current billing period</li>
            <li>No refunds will be provided for partial months</li>
            <li>Your account will revert to the Free tier</li>
            <li>You may re-subscribe at any time</li>
          </LegalList>
        </LegalSubSection>
      </LegalSection>

      <LegalSection title="4. Content and Intellectual Property">
        <LegalSubSection title="4.1 Our Content">
          <LegalParagraph>
            All content on Kickoff Club HQ, including courses, videos, text, graphics, logos, and software, is owned by us or our licensors and is protected by copyright, trademark, and other intellectual property laws.
          </LegalParagraph>
        </LegalSubSection>

        <LegalSubSection title="4.2 License to Use">
          <LegalParagraph>
            We grant you a limited, non-exclusive, non-transferable license to access and use our services for personal, non-commercial purposes. You may not:
          </LegalParagraph>
          <LegalList>
            <li>Copy, modify, or distribute our content</li>
            <li>Download or record course videos (except designated downloadable resources)</li>
            <li>Share your account credentials with others</li>
            <li>Use our content for commercial purposes</li>
            <li>Reverse engineer or decompile any software</li>
            <li>Remove any copyright or proprietary notices</li>
          </LegalList>
        </LegalSubSection>

        <LegalSubSection title="4.3 User-Generated Content">
          <LegalParagraph>
            When you post comments, reviews, or other content ("User Content"), you grant us a worldwide, non-exclusive, royalty-free license to use, display, and distribute your User Content in connection with our services.
          </LegalParagraph>
          <LegalParagraph>
            You represent that your User Content does not violate any third-party rights and complies with these Terms.
          </LegalParagraph>
        </LegalSubSection>
      </LegalSection>

      <LegalSection title="5. Acceptable Use Policy">
        <LegalParagraph>
          You agree not to use our services to:
        </LegalParagraph>
        <LegalList>
          <li>Violate any laws or regulations</li>
          <li>Infringe on intellectual property rights</li>
          <li>Post offensive, harassing, or inappropriate content</li>
          <li>Spam, phish, or distribute malware</li>
          <li>Impersonate others or provide false information</li>
          <li>Interfere with or disrupt our services</li>
          <li>Scrape, crawl, or use automated tools without permission</li>
          <li>Attempt to gain unauthorized access to systems</li>
          <li>Share course content outside the platform</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="6. Disclaimers and Limitation of Liability">
        <LegalSubSection title="6.1 Service Availability">
          <LegalParagraph>
            Our services are provided "as is" and "as available." We do not guarantee uninterrupted, secure, or error-free access. We may modify, suspend, or discontinue services at any time without notice.
          </LegalParagraph>
        </LegalSubSection>

        <LegalSubSection title="6.2 Educational Content">
          <LegalParagraph>
            Our courses are for educational purposes only. We do not guarantee:
          </LegalParagraph>
          <LegalList>
            <li>Specific results or outcomes</li>
            <li>Job placement or career advancement</li>
            <li>Athletic performance improvement</li>
            <li>Accuracy or completeness of information</li>
          </LegalList>
        </LegalSubSection>

        <LegalSubSection title="6.3 Limitation of Liability">
          <LegalParagraph>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, DATA, OR GOODWILL.
          </LegalParagraph>
          <LegalParagraph>
            OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE TWELVE MONTHS BEFORE THE CLAIM AROSE.
          </LegalParagraph>
        </LegalSubSection>
      </LegalSection>

      <LegalSection title="7. Contact Information">
        <LegalParagraph>
          For questions about these Terms, please contact us:
        </LegalParagraph>
        <LegalInfoBox>
          <p className={cn(colors.textSecondary)}><strong>Email:</strong> legal@kickoffclubhq.com</p>
          <p className={cn("mt-2", colors.textSecondary)}><strong>Support:</strong> support@kickoffclubhq.com</p>
        </LegalInfoBox>
      </LegalSection>
    </LegalPageWrapper>
  )
}
