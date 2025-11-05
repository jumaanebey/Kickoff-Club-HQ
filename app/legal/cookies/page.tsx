import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Cookie Policy | Kickoff Club HQ',
  description: 'Learn about how Kickoff Club HQ uses cookies and similar tracking technologies.',
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="container max-w-4xl py-12">
        <h1 className="text-4xl font-bold mb-6">Cookie Policy</h1>
        <p className="text-gray-600 mb-8">
          <strong>Last Updated:</strong> November 4, 2025
        </p>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. What Are Cookies?</h2>
            <p className="text-gray-700 leading-relaxed">
              Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Types of Cookies We Use</h2>

            <h3 className="text-xl font-semibold mb-3">2.1 Essential Cookies</h3>
            <p className="text-gray-700 leading-relaxed">
              These cookies are necessary for our website to function properly:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
              <li><strong>Authentication:</strong> Keep you logged in</li>
              <li><strong>Security:</strong> Protect against fraud and abuse</li>
              <li><strong>Session Management:</strong> Remember your preferences during your visit</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Analytics Cookies</h3>
            <p className="text-gray-700 leading-relaxed">
              These help us understand how visitors use our website:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
              <li>Pages visited and time spent</li>
              <li>How you navigate through our site</li>
              <li>Error messages encountered</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">2.3 Functional Cookies</h3>
            <p className="text-gray-700 leading-relaxed">
              These enhance your experience by remembering your choices:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
              <li>Language preferences</li>
              <li>Video player settings</li>
              <li>Course progress tracking</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Managing Cookies</h2>
            <p className="text-gray-700 leading-relaxed">
              You can control cookies through your browser settings. Most browsers allow you to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
              <li>View and delete cookies</li>
              <li>Block third-party cookies</li>
              <li>Block all cookies</li>
              <li>Clear cookies when you close your browser</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Note:</strong> Blocking essential cookies may prevent you from using certain features of our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Third-Party Cookies</h2>
            <p className="text-gray-700 leading-relaxed">
              We use the following third-party services that may set cookies:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
              <li><strong>Stripe:</strong> Payment processing and fraud prevention</li>
              <li><strong>Supabase:</strong> Authentication and database services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              Questions about our use of cookies? Contact us at privacy@kickoffclubhq.com
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t flex gap-6">
          <Link href="/legal/privacy" className="text-primary-500 hover:underline">
            Privacy Policy
          </Link>
          <Link href="/legal/terms" className="text-primary-500 hover:underline">
            Terms of Service
          </Link>
          <Link href="/legal/refund" className="text-primary-500 hover:underline">
            Refund Policy
          </Link>
        </div>
      </div>
    </div>
  )
}
