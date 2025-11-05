import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Refund Policy | Kickoff Club HQ',
  description: 'Learn about our refund policy and how to request a refund for Kickoff Club HQ subscriptions.',
}

export default function RefundPolicyPage() {
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
        <h1 className="text-4xl font-bold mb-6">Refund Policy</h1>
        <p className="text-gray-600 mb-8">
          <strong>Last Updated:</strong> November 4, 2025
        </p>

        <div className="prose prose-lg max-w-none space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Our Commitment</h2>
            <p className="text-gray-700 leading-relaxed">
              At Kickoff Club HQ, we stand behind the quality of our courses and services. We want you to be completely satisfied with your purchase. This Refund Policy explains our refund terms and how to request a refund if you're not satisfied.
            </p>
          </section>

          {/* 30-Day Money-Back Guarantee */}
          <section>
            <h2 className="text-2xl font-bold mb-4">2. 30-Day Money-Back Guarantee</h2>
            <h3 className="text-xl font-semibold mb-3">2.1 Eligibility</h3>
            <p className="text-gray-700 leading-relaxed">
              We offer a <strong>30-day money-back guarantee</strong> for new subscribers. If you're not completely satisfied with your subscription, you may request a full refund within 30 days of your initial purchase.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">2.2 What's Covered</h3>
            <p className="text-gray-700 leading-relaxed">
              The 30-day guarantee applies to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
              <li>First-time Basic subscription purchases</li>
              <li>First-time Premium subscription purchases</li>
              <li>Upgrades from Basic to Premium (for the upgrade amount)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">2.3 What's NOT Covered</h3>
            <p className="text-gray-700 leading-relaxed">
              The guarantee does NOT apply to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
              <li>Renewal payments after the first billing cycle</li>
              <li>Free tier (no purchase required)</li>
              <li>Accounts with previous refunds</li>
              <li>Accounts suspected of abuse or fraud</li>
            </ul>
          </section>

          {/* Refund Process */}
          <section>
            <h2 className="text-2xl font-bold mb-4">3. How to Request a Refund</h2>
            <h3 className="text-xl font-semibold mb-3">3.1 Refund Request</h3>
            <p className="text-gray-700 leading-relaxed">
              To request a refund, please follow these steps:
            </p>
            <ol className="list-decimal pl-6 mt-2 space-y-3 text-gray-700">
              <li>
                <strong>Contact Support:</strong> Email us at refunds@kickoffclubhq.com with:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Your account email</li>
                  <li>Subscription plan (Basic or Premium)</li>
                  <li>Purchase date</li>
                  <li>Reason for refund (optional but helpful)</li>
                </ul>
              </li>
              <li>
                <strong>Confirmation:</strong> We'll verify your eligibility and respond within 2 business days
              </li>
              <li>
                <strong>Processing:</strong> If approved, refunds are processed within 5-7 business days
              </li>
              <li>
                <strong>Refund Method:</strong> Refunds are issued to your original payment method
              </li>
            </ol>

            <h3 className="text-xl font-semibold mb-3 mt-6">3.2 Processing Time</h3>
            <p className="text-gray-700 leading-relaxed">
              Once approved:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
              <li><strong>Credit/Debit Cards:</strong> 5-10 business days</li>
              <li><strong>PayPal:</strong> 3-5 business days</li>
              <li><strong>Bank Transfers:</strong> 7-14 business days</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Processing times may vary depending on your financial institution.
            </p>
          </section>

          {/* Subscription Cancellations */}
          <section>
            <h2 className="text-2xl font-bold mb-4">4. Subscription Cancellations</h2>
            <h3 className="text-xl font-semibold mb-3">4.1 Cancel Anytime</h3>
            <p className="text-gray-700 leading-relaxed">
              You can cancel your subscription at any time through:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
              <li>Your account dashboard at <code className="text-sm bg-gray-100 px-2 py-1 rounded">/dashboard/subscription</code></li>
              <li>The Stripe billing portal (click "Manage Subscription")</li>
              <li>Contacting support@kickoffclubhq.com</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Access After Cancellation</h3>
            <p className="text-gray-700 leading-relaxed">
              When you cancel:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
              <li>You keep access until the end of your current billing period</li>
              <li>No partial month refunds are provided</li>
              <li>You can re-subscribe at any time</li>
              <li>Your progress and data are preserved</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">4.3 Automatic Renewal</h3>
            <p className="text-gray-700 leading-relaxed">
              Unless you cancel, your subscription automatically renews each month. You will not receive a refund for automatic renewal charges unless you cancel within 30 days of your <em>initial</em> subscription.
            </p>
          </section>

          {/* Special Circumstances */}
          <section>
            <h2 className="text-2xl font-bold mb-4">5. Special Circumstances</h2>
            <h3 className="text-xl font-semibold mb-3">5.1 Technical Issues</h3>
            <p className="text-gray-700 leading-relaxed">
              If you experience technical problems preventing you from accessing our services, contact support@kickoffclubhq.com. We'll work to resolve the issue or provide an appropriate refund or extension.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">5.2 Duplicate Charges</h3>
            <p className="text-gray-700 leading-relaxed">
              If you're accidentally charged twice, we'll refund the duplicate charge immediately. Contact us at billing@kickoffclubhq.com with transaction details.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">5.3 Unauthorized Charges</h3>
            <p className="text-gray-700 leading-relaxed">
              If you believe you've been charged without authorization:
            </p>
            <ol className="list-decimal pl-6 mt-2 space-y-2 text-gray-700">
              <li>Contact us immediately at security@kickoffclubhq.com</li>
              <li>We'll investigate and secure your account</li>
              <li>Legitimate unauthorized charges will be refunded in full</li>
            </ol>
          </section>

          {/* Pro-Rated Refunds */}
          <section>
            <h2 className="text-2xl font-bold mb-4">6. Pro-Rated Refunds and Downgrades</h2>
            <h3 className="text-xl font-semibold mb-3">6.1 Downgrades</h3>
            <p className="text-gray-700 leading-relaxed">
              If you downgrade from Premium to Basic:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
              <li>The change takes effect at your next billing cycle</li>
              <li>You retain Premium access until then</li>
              <li>No pro-rated refunds for the current month</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">6.2 Upgrades</h3>
            <p className="text-gray-700 leading-relaxed">
              If you upgrade from Basic to Premium:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
              <li>You're charged the difference immediately</li>
              <li>Pro-rated credit applied for unused Basic time</li>
              <li>Premium access starts immediately</li>
            </ul>
          </section>

          {/* Course Completion */}
          <section>
            <h2 className="text-2xl font-bold mb-4">7. Course Completion and Certificates</h2>
            <p className="text-gray-700 leading-relaxed">
              Earned certificates and course completion records remain valid even after cancellation or refund. However:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
              <li>You may not use course materials commercially</li>
              <li>You cannot claim refunds after completing courses in the 30-day period</li>
              <li>Certificates cannot be revoked unless obtained fraudulently</li>
            </ul>
          </section>

          {/* Abuse Prevention */}
          <section>
            <h2 className="text-2xl font-bold mb-4">8. Abuse Prevention</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to deny refunds in cases of:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
              <li>Multiple refund requests from the same user</li>
              <li>Completing most or all courses before requesting a refund</li>
              <li>Downloading all course materials before refund request</li>
              <li>Violating our Terms of Service</li>
              <li>Fraudulent activity or abuse of our services</li>
            </ul>
          </section>

          {/* Exceptions */}
          <section>
            <h2 className="text-2xl font-bold mb-4">9. Exceptions and Modifications</h2>
            <p className="text-gray-700 leading-relaxed">
              We may modify this Refund Policy at any time. Changes will be effective immediately upon posting. Continued use of our services after changes constitutes acceptance of the modified policy.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              In exceptional circumstances, we may make exceptions to this policy at our sole discretion.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold mb-4">10. Questions and Support</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about our Refund Policy or need assistance:
            </p>
            <div className="mt-4 p-4 bg-gray-100 rounded-lg space-y-2">
              <p className="text-gray-700"><strong>Refund Requests:</strong> refunds@kickoffclubhq.com</p>
              <p className="text-gray-700"><strong>Billing Questions:</strong> billing@kickoffclubhq.com</p>
              <p className="text-gray-700"><strong>General Support:</strong> support@kickoffclubhq.com</p>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              We typically respond within 24 hours during business days.
            </p>
          </section>

          {/* Summary Box */}
          <section className="bg-primary-50 border-l-4 border-primary-500 p-6 rounded-r-lg">
            <h3 className="text-xl font-bold mb-3 text-primary-700">Quick Summary</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✅ 30-day money-back guarantee for new subscriptions</li>
              <li>✅ Cancel anytime, keep access until end of billing period</li>
              <li>✅ Refunds processed within 5-7 business days</li>
              <li>✅ Full support for technical issues</li>
              <li>❌ No refunds for renewals or partial months</li>
              <li>❌ No refunds after course completion</li>
            </ul>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t flex gap-6">
          <Link href="/legal/privacy" className="text-primary-500 hover:underline">
            Privacy Policy
          </Link>
          <Link href="/legal/terms" className="text-primary-500 hover:underline">
            Terms of Service
          </Link>
          <Link href="/legal/cookies" className="text-primary-500 hover:underline">
            Cookie Policy
          </Link>
        </div>
      </div>
    </div>
  )
}
