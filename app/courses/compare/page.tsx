'use client'

import { ThemedHeader } from '@/components/layout/themed-header'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CompareDesignsPage() {
  const { colors } = useTheme()

  const designs = [
    {
      id: 1,
      name: 'Hero with Sidebar Stats',
      description: 'Large hero section with sticky sidebar showing platform stats. Two-column layout with filters in expandable card.',
      features: [
        'Animated gradient hero background',
        'Sticky sidebar with stats (12.5K students, 4.9/5 rating)',
        'CTA card for "Start Assessment"',
        'Two-column grid for courses',
        'Modern, data-driven approach'
      ],
      bestFor: 'Showcasing platform credibility and stats',
      preview: '/courses/preview-1',
      file: 'design-1-hero-sidebar.tsx'
    },
    {
      id: 2,
      name: 'Category Tabs',
      description: 'Clean tab-based navigation with sticky search bar. Horizontal scrolling category tabs for easy filtering.',
      features: [
        'Sticky search bar at top',
        'Horizontal category tabs (pill style)',
        'Expandable filters section',
        '4-column grid layout',
        'Very mobile-friendly, app-like'
      ],
      bestFor: 'Category-heavy browsing, mobile users',
      preview: '/courses/preview-2',
      file: 'design-2-category-tabs.tsx'
    },
    {
      id: 3,
      name: 'Featured Course + Sections',
      description: 'Prominent featured course with courses organized by difficulty level sections.',
      features: [
        'Large featured course card',
        'Organized by difficulty (Beginner → Intermediate → Advanced)',
        'Each section has "View All" button',
        'Story-driven progression',
        'Clean sectioned layout'
      ],
      bestFor: 'Highlighting featured content, emphasizing progression',
      preview: '/courses/preview-3',
      file: 'design-3-featured-grid.tsx'
    },
    {
      id: 4,
      name: 'Masonry/Pinterest Style',
      description: 'Visual masonry layout with left sidebar filters and bold orange hero banner.',
      features: [
        'Pinterest-style column layout',
        'Bold gradient hero banner',
        'Left sidebar with filters + stats',
        'Visual hierarchy with varied heights',
        'Great for visual browsing'
      ],
      bestFor: 'Visual discovery, exploratory browsing',
      preview: '/courses/preview-4',
      file: 'design-4-masonry.tsx'
    },
    {
      id: 5,
      name: 'List View with Toggle',
      description: 'Detailed list view with toggle to switch between list and grid layouts.',
      features: [
        'Detailed list view (thumbnail + full info)',
        'Toggle between list/grid views',
        'Shows instructor, stats, full description',
        'Horizontal card layout',
        'Best for comparing courses'
      ],
      bestFor: 'Users who want detailed information at a glance',
      preview: '/courses/preview-5',
      file: 'design-5-list-view.tsx'
    },
    {
      id: 6,
      name: 'Learning Path',
      description: 'Emphasizes learning journey with visual progression path showing 1 → 2 → 3 levels.',
      features: [
        'Visual learning path on hero',
        'Numbered sections for each level',
        'Visual dividers with arrows',
        '"Begin Your Journey" CTA',
        'Perfect for guided learning'
      ],
      bestFor: 'Beginners needing guidance on where to start',
      preview: '/courses/preview-6',
      file: 'design-6-learning-path.tsx'
    }
  ]

  return (
    <div className={cn('min-h-screen', colors.bg)}>
      <ThemedHeader />

      <div className="container px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className={cn("text-5xl font-black mb-4", colors.text)}>
              Course Page Design Comparison
            </h1>
            <p className={cn("text-xl", colors.textMuted)}>
              Compare 6 different design approaches for the courses page. Click on any design to view it in action.
            </p>
          </div>

          <div className="grid gap-8">
            {designs.map((design) => (
              <div
                key={design.id}
                className={cn(
                  "p-8 rounded-2xl border",
                  colors.bgSecondary,
                  colors.cardBorder
                )}
              >
                <div className="grid lg:grid-cols-[2fr,1fr] gap-8">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-black">
                            {design.id}
                          </div>
                          <h2 className={cn("text-2xl font-black", colors.text)}>
                            {design.name}
                          </h2>
                        </div>
                        <p className={cn("text-sm italic mb-4", colors.textMuted)}>
                          Best for: {design.bestFor}
                        </p>
                      </div>
                    </div>

                    <p className={cn("mb-6", colors.textSecondary)}>
                      {design.description}
                    </p>

                    <div className="mb-6">
                      <h3 className={cn("text-sm font-bold uppercase tracking-wider mb-3", colors.text)}>
                        Key Features
                      </h3>
                      <ul className="space-y-2">
                        {design.features.map((feature, idx) => (
                          <li key={idx} className={cn("flex items-start gap-2 text-sm", colors.textSecondary)}>
                            <span className="text-orange-400 mt-0.5">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-3">
                      <Link href={design.preview}>
                        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Preview Design
                        </Button>
                      </Link>
                      <div className={cn("px-4 py-2 rounded-lg border text-sm font-mono", colors.cardBorder, colors.textMuted)}>
                        {design.file}
                      </div>
                    </div>
                  </div>

                  <div className={cn("rounded-xl border p-4 flex items-center justify-center text-6xl", colors.cardBorder)}>
                    {design.id === 1 && '📊'}
                    {design.id === 2 && '📑'}
                    {design.id === 3 && '⭐'}
                    {design.id === 4 && '🎨'}
                    {design.id === 5 && '📝'}
                    {design.id === 6 && '🎯'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={cn("mt-12 p-8 rounded-2xl border", colors.bgSecondary, colors.cardBorder)}>
            <h3 className={cn("text-xl font-bold mb-4", colors.text)}>How to Use</h3>
            <ol className={cn("space-y-2 text-sm", colors.textSecondary)}>
              <li>1. Click "Preview Design" on any design to see it with real data</li>
              <li>2. Once you've chosen a design, let me know which number (1-6)</li>
              <li>3. I'll replace the current page.tsx with your chosen design</li>
              <li>4. Or I can create a hybrid combining elements from multiple designs</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
