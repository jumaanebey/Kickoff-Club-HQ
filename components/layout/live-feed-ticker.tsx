'use client'

import { cn } from '@/shared/utils'

interface TickerItem {
  emoji: string
  text: string
  highlight: string
}

const tickerItems: TickerItem[] = [
  // Educational Tips
  { emoji: '🏈', highlight: 'Did you know?', text: 'A touchdown is worth 6 points, not 7' },
  { emoji: '💡', highlight: 'Quick tip:', text: 'The offense has 4 downs to move 10 yards' },
  // Feature Highlights
  { emoji: '🎬', highlight: 'Watch:', text: 'How Downs Work - Free lesson' },
  { emoji: '🎙️', highlight: 'Listen:', text: 'The Kickoff Podcast - New episodes weekly' },
  { emoji: '🎮', highlight: 'Play:', text: 'Blitz Rush - Test your knowledge' },
  // Platform Announcements
  { emoji: '📱', highlight: 'Coming Soon:', text: 'Mobile app - Join the waitlist!' },
  { emoji: '🔥', highlight: '50% off', text: 'launch pricing for early members' },
  // Vibe
  { emoji: '👋', highlight: 'Welcome', text: 'to Kickoff Club HQ' },
  { emoji: '🎯', highlight: 'No judgment.', text: 'No gatekeeping. Just football.' },
]

export function LiveFeedTicker() {
  // Duplicate items for seamless loop
  const allItems = [...tickerItems, ...tickerItems]

  return (
    <div className="fixed top-[72px] left-0 right-0 z-[999] bg-gray-900 border-b-2 border-orange-500 overflow-hidden h-11">
      <div className="w-full h-full flex items-center overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap">
          {allItems.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="flex items-center gap-2 px-8 text-white text-sm font-semibold">
                <span>{item.emoji}</span>
                <span>
                  <span className="text-orange-400">{item.highlight}</span> {item.text}
                </span>
              </div>
              <span className="text-orange-500 px-2 text-xs">◆</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
