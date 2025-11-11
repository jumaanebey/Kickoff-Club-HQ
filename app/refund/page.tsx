export default function RefundPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Refund Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: November 11, 2025</p>

        <div className="prose prose-lg max-w-none">
          <h2>1. Overview</h2>
          <p>
            At Kickoff Club HQ, we want you to be completely satisfied with your purchase. This Refund Policy outlines the circumstances under which refunds may be issued.
          </p>

          <h2>2. Monthly Subscriptions</h2>
          <p>
            Monthly subscriptions to our All-Access plan can be canceled at any time. Upon cancellation:
          </p>
          <ul>
            <li>You will retain access to paid content until the end of your current billing period</li>
            <li>No refund will be issued for the current billing period</li>
            <li>No further charges will be made after the current period ends</li>
          </ul>

          <h2>3. 7-Day Money-Back Guarantee</h2>
          <p>
            We offer a 7-day money-back guarantee for first-time subscribers to our All-Access plan. If you're not satisfied with our content within the first 7 days of your subscription, we will issue a full refund.
          </p>

          <h3>To request a refund:</h3>
          <ul>
            <li>Contact us within 7 days of your initial purchase</li>
            <li>Provide your account email and reason for the refund request</li>
            <li>Allow 5-10 business days for processing</li>
          </ul>

          <h2>4. Coaching Cohort Program</h2>
          <p>
            The Coaching Cohort program has a special refund policy due to its limited capacity:
          </p>
          <ul>
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

          <h2>5. Exceptions</h2>
          <p>
            Refunds will not be issued if:
          </p>
          <ul>
            <li>Your account was terminated for violating our Terms of Service</li>
            <li>You are requesting a refund after the 7-day guarantee period (for subscriptions)</li>
            <li>You have previously received a refund from us</li>
            <li>Payment was made through a third-party that has its own refund policy</li>
          </ul>

          <h2>6. How to Request a Refund</h2>
          <p>
            To request a refund, please contact our support team:
          </p>
          <ul>
            <li>Email: <a href="mailto:refunds@kickoffclubhq.com" className="text-green-600 hover:underline">refunds@kickoffclubhq.com</a></li>
            <li>Include your account email, order number, and reason for refund</li>
            <li>Allow 5-10 business days for processing</li>
          </ul>

          <h2>7. Processing Time</h2>
          <p>
            Approved refunds will be processed within 5-10 business days and credited to your original payment method. The time it takes for the refund to appear in your account depends on your payment provider.
          </p>

          <h2>8. Changes to This Policy</h2>
          <p>
            We reserve the right to modify this Refund Policy at any time. Changes will be posted on this page with an updated revision date.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about our Refund Policy, please contact us:
          </p>
          <ul>
            <li>Email: <a href="mailto:refunds@kickoffclubhq.com" className="text-green-600 hover:underline">refunds@kickoffclubhq.com</a></li>
            <li>Website: <a href="/contact" className="text-green-600 hover:underline">Contact Form</a></li>
          </ul>
        </div>
      </div>
    </div>
  )
}
