export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: November 11, 2025</p>

        <div className="prose prose-lg max-w-none">
          <h2>1. What Are Cookies?</h2>
          <p>
            Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
          </p>

          <h2>2. How We Use Cookies</h2>
          <p>
            Kickoff Club HQ uses cookies to:
          </p>
          <ul>
            <li>Keep you signed in to your account</li>
            <li>Remember your preferences and settings</li>
            <li>Understand how you use our platform</li>
            <li>Improve our services and user experience</li>
            <li>Deliver personalized content and recommendations</li>
            <li>Provide security features</li>
          </ul>

          <h2>3. Types of Cookies We Use</h2>

          <h3>Essential Cookies</h3>
          <p>
            These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. You cannot opt-out of these cookies.
          </p>

          <h3>Performance Cookies</h3>
          <p>
            These cookies collect information about how you use our website, such as which pages you visit most often. This data helps us optimize our platform and improve user experience.
          </p>

          <h3>Functionality Cookies</h3>
          <p>
            These cookies allow our website to remember choices you make (such as your username, language, or region) and provide enhanced, personalized features.
          </p>

          <h3>Analytics Cookies</h3>
          <p>
            We use analytics services like Google Analytics to understand how visitors interact with our website. These cookies help us improve our content and services.
          </p>

          <h3>Advertising Cookies</h3>
          <p>
            These cookies may be set by our advertising partners to build a profile of your interests and show you relevant ads on other websites.
          </p>

          <h2>4. Third-Party Cookies</h2>
          <p>
            We use third-party services that may set their own cookies:
          </p>
          <ul>
            <li>Google Analytics - for website analytics</li>
            <li>Stripe - for payment processing</li>
            <li>Vercel - for hosting and performance monitoring</li>
            <li>YouTube - for video content delivery</li>
          </ul>

          <h2>5. Managing Cookies</h2>
          <p>
            You can control and manage cookies in several ways:
          </p>

          <h3>Browser Settings</h3>
          <p>
            Most browsers allow you to refuse or accept cookies through their settings. Please note that if you choose to disable cookies, some features of our website may not function properly.
          </p>

          <h3>Opt-Out Tools</h3>
          <p>
            You can opt out of certain third-party cookies:
          </p>
          <ul>
            <li>
              <a href="https://tools.google.com/dlpage/gaoptout" className="text-green-600 hover:underline" target="_blank" rel="noopener noreferrer">
                Google Analytics Opt-out Browser Add-on
              </a>
            </li>
            <li>
              <a href="https://optout.networkadvertising.org/" className="text-green-600 hover:underline" target="_blank" rel="noopener noreferrer">
                NAI Opt-Out Tool
              </a>
            </li>
          </ul>

          <h2>6. Cookie Duration</h2>
          <p>
            Cookies may be either "session" cookies or "persistent" cookies:
          </p>
          <ul>
            <li>
              <strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser
            </li>
            <li>
              <strong>Persistent Cookies:</strong> Remain on your device until they expire or you delete them
            </li>
          </ul>

          <h2>7. Updates to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time to reflect changes in our practices or for legal reasons. We will notify you of any material changes by posting the new policy on this page.
          </p>

          <h2>8. Contact Us</h2>
          <p>
            If you have questions about our use of cookies, please contact us:
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
