export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-gray-600 mb-8">Last updated: November 11, 2025</p>

        <div className="prose prose-lg max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Kickoff Club HQ, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our services.
          </p>

          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily access the materials (courses, videos, information) on Kickoff Club HQ for personal, non-commercial use only. This is the grant of a license, not a transfer of title.
          </p>

          <h3>Under this license you may not:</h3>
          <ul>
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>Attempt to decompile or reverse engineer any software on Kickoff Club HQ</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
          </ul>

          <h2>3. Account Responsibilities</h2>
          <p>
            You are responsible for safeguarding your account credentials and for any activities or actions under your account. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
          </p>

          <h2>4. Subscription and Payment</h2>
          <p>
            Subscriptions are billed in advance on a monthly or annual basis. Payment is processed through our third-party payment processor, Stripe. All fees are non-refundable except as required by law or as explicitly stated in our Refund Policy.
          </p>

          <h2>5. Content Ownership</h2>
          <p>
            All content on Kickoff Club HQ, including but not limited to text, graphics, logos, videos, and software, is the property of Kickoff Club HQ and protected by copyright laws.
          </p>

          <h2>6. User Conduct</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe on the intellectual property rights of others</li>
            <li>Upload viruses or malicious code</li>
            <li>Spam, phish, or engage in other deceptive practices</li>
            <li>Harass, abuse, or harm other users</li>
          </ul>

          <h2>7. Termination</h2>
          <p>
            We may terminate or suspend your account and access to our services immediately, without prior notice or liability, for any reason, including breach of these Terms of Service.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            In no event shall Kickoff Club HQ be liable for any damages (including, without limitation, damages for loss of data or profit) arising out of the use or inability to use our services.
          </p>

          <h2>9. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new Terms of Service on this page.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <ul>
            <li>Email: <a href="mailto:legal@kickoffclubhq.com" className="text-green-600 hover:underline">legal@kickoffclubhq.com</a></li>
            <li>Website: <a href="/contact" className="text-green-600 hover:underline">Contact Form</a></li>
          </ul>
        </div>
      </div>
    </div>
  )
}
