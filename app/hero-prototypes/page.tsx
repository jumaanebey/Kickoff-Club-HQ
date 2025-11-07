import { HeroDesign1 } from '@/components/hero/hero-design-1'
import { HeroDesign2 } from '@/components/hero/hero-design-2'
import { HeroDesign3 } from '@/components/hero/hero-design-3'
import { HeroDesign4 } from '@/components/hero/hero-design-4'
import { HeroDesign5 } from '@/components/hero/hero-design-5'
import { HeroDesign6 } from '@/components/hero/hero-design-6'
import { HeroDesign7 } from '@/components/hero/hero-design-7'
import { HeroDesign8 } from '@/components/hero/hero-design-8'
import { HeroDesign9 } from '@/components/hero/hero-design-9'

export const metadata = {
  title: 'Hero Design Prototypes | Kickoff Club HQ',
  description: 'Preview of nine different hero section designs - from standard to premium custom designs',
}

export default function HeroPrototypesPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="container px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Hero Design Prototypes</h1>
          <p className="text-sm text-gray-600 mt-1">Scroll to preview each design variation</p>
        </div>
      </div>

      {/* Design 1 */}
      <div className="border-b-8 border-gray-300">
        <div className="bg-blue-600 text-white py-3 px-4">
          <div className="container">
            <h2 className="text-xl font-bold">Design 1: Bold & Minimalist</h2>
            <p className="text-sm text-blue-100">Centered layout • Grid background • Animated blobs • Avatar trust badges</p>
          </div>
        </div>
        <HeroDesign1 />
      </div>

      {/* Design 2 */}
      <div className="border-b-8 border-gray-300">
        <div className="bg-orange-600 text-white py-3 px-4">
          <div className="container">
            <h2 className="text-xl font-bold">Design 2: Split-Screen Layout</h2>
            <p className="text-sm text-orange-100">Two-column grid • Feature checklist • Floating stat cards • Video preview</p>
          </div>
        </div>
        <HeroDesign2 />
      </div>

      {/* Design 3 */}
      <div className="border-b-8 border-gray-300">
        <div className="bg-green-600 text-white py-3 px-4">
          <div className="container">
            <h2 className="text-xl font-bold">Design 3: Card-Based Interactive</h2>
            <p className="text-sm text-green-100">Feature cards grid • Video preview • Floating metrics • Highlighted text effect</p>
          </div>
        </div>
        <HeroDesign3 />
      </div>

      {/* Design 4 */}
      <div className="border-b-8 border-gray-300">
        <div className="bg-purple-600 text-white py-3 px-4">
          <div className="container">
            <h2 className="text-xl font-bold">Design 4: Premium Split-Screen</h2>
            <p className="text-sm text-purple-100">Animated underline • Icon features • Multiple floating cards • Gradient visual</p>
          </div>
        </div>
        <HeroDesign4 />
      </div>

      {/* Design 5 */}
      <div className="border-b-8 border-gray-300">
        <div className="bg-indigo-600 text-white py-3 px-4">
          <div className="container">
            <h2 className="text-xl font-bold">Design 5: Course Preview Focus</h2>
            <p className="text-sm text-indigo-100">Feature pills • Video card with course info • Layered floating cards • Avatar trust bar</p>
          </div>
        </div>
        <HeroDesign5 />
      </div>

      {/* Design 6 */}
      <div className="border-b-8 border-gray-300">
        <div className="bg-teal-600 text-white py-3 px-4">
          <div className="container">
            <h2 className="text-xl font-bold">Design 6: Dashboard Style</h2>
            <p className="text-sm text-teal-100">Icon grid benefits • Rotating cards • Live indicator • Three-column stats grid</p>
          </div>
        </div>
        <HeroDesign6 />
      </div>

      {/* PREMIUM TIER DESIGNS */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-white py-8 px-4">
        <div className="container text-center">
          <h2 className="text-3xl font-black mb-2">✨ PREMIUM CUSTOM DESIGNS ✨</h2>
          <p className="text-white/90 text-lg">Hand-crafted, agency-level designs that separate you from AI templates</p>
        </div>
      </div>

      {/* Design 7 */}
      <div className="border-b-8 border-gray-300">
        <div className="bg-black text-white py-3 px-4">
          <div className="container">
            <h2 className="text-xl font-bold">Design 7: Dark Glassmorphic 🌟</h2>
            <p className="text-sm text-gray-300">Dark theme • Bento grid • Glassmorphism • Ambient glow effects • Noise texture • Custom kerning</p>
          </div>
        </div>
        <HeroDesign7 />
      </div>

      {/* Design 8 */}
      <div className="border-b-8 border-gray-300">
        <div className="bg-stone-800 text-white py-3 px-4">
          <div className="container">
            <h2 className="text-xl font-bold">Design 8: Editorial Magazine 🌟</h2>
            <p className="text-sm text-stone-300">Magazine layout • Serif typography • Editorial top bar • Numbered sections • Minimal color palette</p>
          </div>
        </div>
        <HeroDesign8 />
      </div>

      {/* Design 9 */}
      <div className="border-b-8 border-gray-300">
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-3 px-4">
          <div className="container">
            <h2 className="text-xl font-bold">Design 9: Immersive Depth 🌟</h2>
            <p className="text-sm text-blue-200">Mesh gradients • Layered depth • Animated orbs • Grid mask • Course preview cards • Stats dashboard</p>
          </div>
        </div>
        <HeroDesign9 />
      </div>

      {/* Footer */}
      <div className="bg-white py-8 px-4">
        <div className="container text-center">
          <p className="text-gray-600 mb-2">Select your preferred design and we'll integrate it into the homepage.</p>
          <p className="text-sm text-gray-500">⭐ Premium designs (7-9) offer the most distinctive, custom look</p>
        </div>
      </div>
    </div>
  )
}
