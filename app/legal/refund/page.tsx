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
            <h2 className="text-2xl font-bold mb-4">1. No Refund Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              At Kickoff Club HQ, all sales are final. Due to the digital nature of our courses and immediate access to all content upon purchase, we do not offer refunds. Please review the course details carefully before purchasing.
            </p>
          </section>

          {/* Free Preview */}
          <section>
            <h2 className="text-2xl font-bold mb-4">2. Preview Before You Buy</h2>
            <p className="text-gray-700 leading-relaxed">
              We encourage you to explore our free preview lessons before committing to a paid plan:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
              <li>Access 3-5 free sample lessons</li>
              <li>Experience our teaching style</li>
              <li>View course outlines and descriptions</li>
              <li>Join our community forum</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              This allows you to make an informed decision before purchasing.
            </p>
          </section>

          {/* No Recurring Payments */}
          <section>
            <h2 className="text-2xl font-bold mb-4">3. One-Time Payments</h2>
            <p className="text-gray-700 leading-relaxed">
              Our plans are one-time payments with no automatic renewals:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
              <li><strong>All-Access:</strong> One-time payment of $24.99 provides 2 months of full access</li>
              <li><strong>Coaching Cohort:</strong> One-time payment of $299 for the entire 6-week program</li>
              <li>No surprise charges or automatic renewals</li>
              <li>No cancellation needed</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              After your access period ends, you can choose to purchase again if you wish to continue.
            </p>
          </section>

          {/* Exceptions Only */}
          <section>
            <h2 className="text-2xl font-bold mb-4">4. Exceptions</h2>
            <p className="text-gray-700 leading-relaxed">
              While we maintain a strict no-refund policy, we may consider exceptions only in these circumstances:
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">4.1 Technical Issues</h3>
            <p className="text-gray-700 leading-relaxed">
              If you experience technical problems preventing you from accessing our services, contact support@kickoffclubhq.com. We'll work to resolve the issue. If we cannot resolve it, we may provide an extension or, in rare cases, a refund.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Duplicate Charges</h3>
            <p className="text-gray-700 leading-relaxed">
              If you're accidentally charged twice for the same purchase, we'll refund the duplicate charge immediately. Contact us at billing@kickoffclubhq.com with transaction details.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">4.3 Unauthorized Charges</h3>
            <p className="text-gray-700 leading-relaxed">
              If you believe you've been charged without authorization:
            </p>
            <ol className="list-decimal pl-6 mt-2 space-y-2 text-gray-700">
              <li>Contact us immediately at security@kickoffclubhq.com</li>
              <li>We'll investigate and secure your account</li>
              <li>Legitimate unauthorized charges will be refunded in full</li>
            </ol>
          </section>

          {/* Policy Updates */}
          <section>
            <h2 className="text-2xl font-bold mb-4">5. Policy Updates</h2>
            <p className="text-gray-700 leading-relaxed">
              We may modify this Refund Policy at any time. Changes will be effective immediately upon posting. Continued use of our services after changes constitutes acceptance of the modified policy.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold mb-4">6. Questions and Support</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about our Refund Policy or need assistance:
            </p>
            <div className="mt-4 p-4 bg-gray-100 rounded-lg space-y-2">
              <p className="text-gray-700"><strong>Billing Questions:</strong> billing@kickoffclubhq.com</p>
              <p className="text-gray-700"><strong>Technical Support:</strong> support@kickoffclubhq.com</p>
              <p className="text-gray-700"><strong>Security Issues:</strong> security@kickoffclubhq.com</p>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              We typically respond within 24 hours during business days.
            </p>
          </section>

          {/* Summary Box */}
          <section className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
            <h3 className="text-xl font-bold mb-3 text-red-700">Quick Summary</h3>
            <ul className="space-y-2 text-gray-700">
              <li>❌ <strong>No refunds</strong> - All sales are final</li>
              <li>✅ Free preview lessons available before purchase</li>
              <li>✅ One-time payments - no automatic renewals</li>
              <li>✅ Exceptions for technical issues, duplicate charges, or unauthorized charges only</li>
              <li>✅ Full technical support included</li>
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
