import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Terms of Service | Kickoff Club HQ',
  description: 'Read the terms and conditions for using Kickoff Club HQ services.',
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary-500">
            Kickoff Club HQ
          </Link>
          <Button variant="outline" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="container max-w-4xl py-12">
        <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
        <p className="text-gray-600 mb-8">
          <strong>Last Updated:</strong> November 4, 2025
        </p>

        <div className="prose prose-lg max-w-none space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms of Service ("Terms") constitute a legally binding agreement between you and Kickoff Club HQ ("Company," "we," "us," or "our") concerning your access to and use of the Kickoff Club HQ website and services.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              By accessing or using our services, you agree that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you must not access or use our services.
            </p>
          </section>

          {/* Account Registration */}
          <section>
            <h2 className="text-2xl font-bold mb-4">2. Account Registration</h2>
            <h3 className="text-xl font-semibold mb-3">2.1 Account Creation</h3>
            <p className="text-gray-700 leading-relaxed">
              To access certain features, you must register for an account. When creating an account, you agree to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your password</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Age Requirements</h3>
            <p className="text-gray-700 leading-relaxed">
              You must be at least 13 years old to use our services. If you are under 18, you must have parental or guardian consent.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">2.3 Account Termination</h3>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to suspend or terminate your account at any time for violations of these Terms or for any other reason at our sole discretion.
            </p>
          </section>

          {/* Subscription Services */}
          <section>
            <h2 className="text-2xl font-bold mb-4">3. Subscription and Payment</h2>
            <h3 className="text-xl font-semibold mb-3">3.1 Subscription Plans</h3>
            <p className="text-gray-700 leading-relaxed">
              We offer the following subscription tiers:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
              <li><strong>Free:</strong> Access to free courses and community features</li>
              <li><strong>Basic ($19/month):</strong> Access to all Basic tier courses</li>
              <li><strong>Premium ($49/month):</strong> Access to all courses and premium features</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">3.2 Billing</h3>
            <p className="text-gray-700 leading-relaxed">
              By subscribing, you agree to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
              <li>Pay all fees associated with your subscription</li>
              <li>Automatic monthly billing until cancelled</li>
              <li>Fees are non-refundable except as required by law or our Refund Policy</li>
              <li>We may change prices with 30 days' notice</li>
              <li>You are responsible for all applicable taxes</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">3.3 Cancellation</h3>
            <p className="text-gray-700 leading-relaxed">
              You may cancel your subscription at any time through your account settings or the billing portal. Upon cancellation:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
              <li>You will retain access until the end of your current billing period</li>
              <li>No refunds will be provided for partial months</li>
              <li>Your account will revert to the Free tier</li>
              <li>You may re-subscribe at any time</li>
            </ul>
          </section>

          {/* Content and Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold mb-4">4. Content and Intellectual Property</h2>
            <h3 className="text-xl font-semibold mb-3">4.1 Our Content</h3>
            <p className="text-gray-700 leading-relaxed">
              All content on Kickoff Club HQ, including courses, videos, text, graphics, logos, and software, is owned by us or our licensors and is protected by copyright, trademark, and other intellectual property laws.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">4.2 License to Use</h3>
            <p className="text-gray-700 leading-relaxed">
              We grant you a limited, non-exclusive, non-transferable license to access and use our services for personal, non-commercial purposes. You may not:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
              <li>Copy, modify, or distribute our content</li>
              <li>Download or record course videos (except designated downloadable resources)</li>
              <li>Share your account credentials with others</li>
              <li>Use our content for commercial purposes</li>
              <li>Reverse engineer or decompile any software</li>
              <li>Remove any copyright or proprietary notices</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">4.3 User-Generated Content</h3>
            <p className="text-gray-700 leading-relaxed">
              When you post comments, reviews, or other content ("User Content"), you grant us a worldwide, non-exclusive, royalty-free license to use, display, and distribute your User Content in connection with our services.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              You represent that your User Content does not violate any third-party rights and complies with these Terms.
            </p>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="text-2xl font-bold mb-4">5. Acceptable Use Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree not to use our services to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Post offensive, harassing, or inappropriate content</li>
              <li>Spam, phish, or distribute malware</li>
              <li>Impersonate others or provide false information</li>
              <li>Interfere with or disrupt our services</li>
              <li>Scrape, crawl, or use automated tools without permission</li>
              <li>Attempt to gain unauthorized access to systems</li>
              <li>Share course content outside the platform</li>
            </ul>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-2xl font-bold mb-4">6. Disclaimers and Limitation of Liability</h2>
            <h3 className="text-xl font-semibold mb-3">6.1 Service Availability</h3>
            <p className="text-gray-700 leading-relaxed">
              Our services are provided "as is" and "as available." We do not guarantee uninterrupted, secure, or error-free access. We may modify, suspend, or discontinue services at any time without notice.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">6.2 Educational Content</h3>
            <p className="text-gray-700 leading-relaxed">
              Our courses are for educational purposes only. We do not guarantee:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
              <li>Specific results or outcomes</li>
              <li>Job placement or career advancement</li>
              <li>Athletic performance improvement</li>
              <li>Accuracy or completeness of information</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">6.3 Limitation of Liability</h3>
            <p className="text-gray-700 leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, DATA, OR GOODWILL.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE TWELVE MONTHS BEFORE THE CLAIM AROSE.
            </p>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-bold mb-4">7. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify, defend, and hold harmless Kickoff Club HQ, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including attorneys' fees) arising from:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
              <li>Your use of our services</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Your User Content</li>
            </ul>
          </section>

          {/* Dispute Resolution */}
          <section>
            <h2 className="text-2xl font-bold mb-4">8. Dispute Resolution</h2>
            <h3 className="text-xl font-semibold mb-3">8.1 Informal Resolution</h3>
            <p className="text-gray-700 leading-relaxed">
              If you have a dispute with us, you agree to first contact us at support@kickoffclubhq.com to attempt to resolve it informally.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">8.2 Arbitration</h3>
            <p className="text-gray-700 leading-relaxed">
              If informal resolution fails, disputes will be resolved through binding arbitration rather than in court, except you may assert claims in small claims court.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">8.3 Class Action Waiver</h3>
            <p className="text-gray-700 leading-relaxed">
              You agree that disputes will be resolved individually, not as part of a class or representative action.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold mb-4">9. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We may modify these Terms at any time. We will notify you of material changes by email or through our services. Your continued use after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          {/* General Provisions */}
          <section>
            <h2 className="text-2xl font-bold mb-4">10. General Provisions</h2>
            <h3 className="text-xl font-semibold mb-3">10.1 Governing Law</h3>
            <p className="text-gray-700 leading-relaxed">
              These Terms are governed by and construed in accordance with the laws of the United States, without regard to conflict of law principles.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">10.2 Severability</h3>
            <p className="text-gray-700 leading-relaxed">
              If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full effect.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">10.3 Entire Agreement</h3>
            <p className="text-gray-700 leading-relaxed">
              These Terms, along with our Privacy Policy and Refund Policy, constitute the entire agreement between you and Kickoff Club HQ.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold mb-4">11. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              For questions about these Terms, please contact us:
            </p>
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <p className="text-gray-700"><strong>Email:</strong> legal@kickoffclubhq.com</p>
              <p className="text-gray-700 mt-2"><strong>Support:</strong> support@kickoffclubhq.com</p>
            </div>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t flex gap-6">
          <Link href="/legal/privacy" className="text-primary-500 hover:underline">
            Privacy Policy
          </Link>
          <Link href="/legal/refund" className="text-primary-500 hover:underline">
            Refund Policy
          </Link>
          <Link href="/legal/cookies" className="text-primary-500 hover:underline">
            Cookie Policy
          </Link>
        </div>
      </div>
    </div>
  )
}
