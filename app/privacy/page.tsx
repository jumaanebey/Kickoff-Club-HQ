export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: November 11, 2025</p>

        <div className="prose prose-lg max-w-none">
          <h2>1. Introduction</h2>
          <p>
            Kickoff Club HQ ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and protect your information when you use our website and services.
          </p>

          <h2>2. Information We Collect</h2>
          <h3>Information you provide to us:</h3>
          <ul>
            <li>Account information (name, email address, password)</li>
            <li>Profile information (age, skill level, goals)</li>
            <li>Payment information (processed securely through Stripe)</li>
            <li>Communication with our support team</li>
          </ul>

          <h3>Information we collect automatically:</h3>
          <ul>
            <li>Usage data (pages visited, features used)</li>
            <li>Device information (browser type, operating system)</li>
            <li>Cookies and similar technologies</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide and improve our services</li>
            <li>Process your payments and subscriptions</li>
            <li>Send you course updates and educational content</li>
            <li>Respond to your questions and support requests</li>
            <li>Analyze usage patterns to improve our platform</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>4. How We Share Your Information</h2>
          <p>We may share your information with:</p>
          <ul>
            <li>
              <strong>Service Providers:</strong> Companies that help us operate our platform (payment processors, hosting providers, analytics services)
            </li>
            <li>
              <strong>Legal Requirements:</strong> When required by law or to protect our rights
            </li>
            <li>
              <strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition
            </li>
          </ul>
          <p>We do not sell your personal information to third parties.</p>

          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to or restrict processing</li>
            <li>Data portability</li>
            <li>Withdraw consent at any time</li>
          </ul>

          <h2>6. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
          </p>

          <h2>7. Cookies</h2>
          <p>
            We use cookies and similar tracking technologies to enhance your experience, analyze usage, and deliver personalized content. You can control cookies through your browser settings. For more information, see our <a href="/cookies" className="text-green-600 hover:underline">Cookie Policy</a>.
          </p>

          <h2>8. Children's Privacy</h2>
          <p>
            Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
          </p>

          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <ul>
            <li>Email: <a href="mailto:privacy@kickoffclubhq.com" className="text-green-600 hover:underline">privacy@kickoffclubhq.com</a></li>
            <li>Website: <a href="/contact" className="text-green-600 hover:underline">Contact Form</a></li>
          </ul>
        </div>
      </div>
    </div>
  )
}
