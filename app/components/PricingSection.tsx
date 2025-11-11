import Link from 'next/link'
import { Check } from 'lucide-react'

export function PricingSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600">
            Choose the perfect plan for your football journey. Cancel anytime.
          </p>
        </div>

        {/* Pricing Cards - FIXED: Clear pricing model */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {/* FREE Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
            <h3 className="text-2xl font-bold mb-2">Starter Pack</h3>
            <p className="text-gray-600 mb-6">
              Casual fan? This is all you need to know.
            </p>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">$0</span>
                <span className="text-gray-600">/forever</span>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">3 essential podcast episodes</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Public community forum</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Progress tracking</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Mobile & desktop access</span>
              </div>
            </div>

            <Link href="/sign-up?plan=free">
              <button className="w-full py-3 px-6 border-2 border-gray-300 text-gray-900 rounded-lg hover:border-green-600 hover:text-green-600 transition-colors font-semibold">
                Get Started Free
              </button>
            </Link>
          </div>

          {/* ALL-ACCESS Plan - FIXED: Clear monthly pricing */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-green-600 relative">
            {/* Popular Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </span>
            </div>

            <h3 className="text-2xl font-bold mb-2">All-Access</h3>
            <p className="text-gray-600 mb-6">
              Everything you need to learn football
            </p>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">$19.99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Billed monthly • Cancel anytime
              </p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">All video courses</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Private community access</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Progress tracking</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Download lesson materials</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Priority support</span>
              </div>
            </div>

            <Link href="/sign-up?plan=all-access">
              <button className="w-full py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">
                Get Full Access
              </button>
            </Link>
          </div>

          {/* COACHING COHORT Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
            <h3 className="text-2xl font-bold mb-2">Coaching Cohort</h3>
            <p className="text-gray-600 mb-6">
              6-week intensive coaching program
            </p>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">$299</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                One-time payment • 6 weeks
              </p>
            </div>

            <div className="space-y-3 mb-8">
              <p className="text-sm font-semibold text-gray-900">
                Everything in All-Access, plus:
              </p>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">6-week coaching program</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Limited to 15 athletes per cohort</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Live group sessions (2x/week)</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Film review + Q&A</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Personalized training plan</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Private cohort community</span>
              </div>
            </div>

            <Link href="/waitlist">
              <button className="w-full py-3 px-6 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold">
                Join Waitlist
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
