'use client'

import { useEffect, useState, useMemo } from 'react'
import { useGameStore } from '../hooks/useGameStore'
import { Button } from '@/components/ui/button'
import { RotateCcw, Home, Share2, Trophy, Coins, Target, Skull, Lightbulb, GraduationCap, Flame } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useGameProgress } from '@/hooks/use-game-progress'
import { useAudio } from '../hooks/useAudio'
import { useHaptics } from '../hooks/useHaptics'
import { markFirstRunComplete } from './StartScreen'
import { updatePlayerStats } from './CharacterSelect'

// Football facts for the "Today You Learned" section
const FOOTBALL_FACTS = [
  {
    term: 'Blitz',
    definition: 'When extra defenders rush the quarterback instead of covering receivers. It\'s a high-risk, high-reward play!',
  },
  {
    term: 'Safety',
    definition: 'Worth 2 points, it happens when the offense is tackled in their own end zone. The defense also gets the ball back!',
  },
  {
    term: 'Touchdown',
    definition: 'Worth 6 points, scored when a player carries the ball into the opponent\'s end zone or catches it there.',
  },
  {
    term: 'Field Goal',
    definition: 'Worth 3 points, scored by kicking the ball through the goalposts. Teams often try this on 4th down.',
  },
  {
    term: 'Quarterback',
    definition: 'The leader of the offense who throws passes and calls plays. They touch the ball on almost every offensive play!',
  },
  {
    term: 'First Down',
    definition: 'The offense has 4 tries (downs) to move the ball 10 yards. When they do, they get a fresh set of 4 downs!',
  },
  {
    term: 'Interception',
    definition: 'When a defender catches a pass meant for the offense. It\'s a turnover and the defense gets the ball!',
  },
  {
    term: 'Fumble',
    definition: 'When a player drops the ball while running. Either team can recover it - very exciting moments!',
  },
  {
    term: 'Huddle',
    definition: 'When players gather in a circle to discuss the next play. It keeps the strategy secret from the opponent!',
  },
  {
    term: 'End Zone',
    definition: 'The 10-yard area at each end of the field. Score a touchdown by getting the ball here!',
  },
  {
    term: 'Hail Mary',
    definition: 'A desperate, long pass thrown at the end of a half, hoping for a miracle catch in the end zone.',
  },
  {
    term: 'Sack',
    definition: 'When the quarterback is tackled behind the line of scrimmage. Defenders love getting sacks!',
  },
  {
    term: 'Two-Point Conversion',
    definition: 'After a touchdown, teams can try to score 2 extra points by running or passing into the end zone instead of kicking.',
  },
  {
    term: 'Snap',
    definition: 'The action that starts every play - the center passes the ball between their legs to the quarterback.',
  },
  {
    term: 'Red Zone',
    definition: 'The area between the 20-yard line and the goal line. Offenses need to score when they get here!',
  },
]

// Tips based on death cause
const DEATH_TIPS: Record<string, string> = {
  hurdle: 'Jump over hurdles with the up arrow or swipe up. Time it right!',
  defender: 'Defenders can be dodged by switching lanes early. Watch their movement!',
  barrier: 'Barriers block the whole lane - switch lanes quickly to avoid them!',
  tackledummy: 'Slide under tackle dummies with the down arrow or swipe down.',
}

// Near-miss threshold constants
const FEVER_THRESHOLD = 100
const COIN_MILESTONE = 100

export function GameOverScreen() {
  const { phase, score, coins, distance, highScore, previousHighScore, deathCause, feverMeter, isFirstRunMode, startGame } = useGameStore()
  const { markGameCompleted } = useGameProgress()
  const [isNewHighScore, setIsNewHighScore] = useState(false)
  const { play } = useAudio()
  const { vibrate } = useHaptics()

  // Select a random football fact for this game over screen
  const todaysFact = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * FOOTBALL_FACTS.length)
    return FOOTBALL_FACTS[randomIndex]
  }, [phase]) // Re-select when game phase changes

  // Calculate near-miss stats
  const nearMissStats = useMemo(() => {
    const stats: { message: string; icon: 'distance' | 'coins' | 'fever' }[] = []

    // Check if player was close to their previous high score
    if (!isNewHighScore && previousHighScore > 0) {
      const distanceFromHighScore = previousHighScore - score
      if (distanceFromHighScore > 0 && distanceFromHighScore <= previousHighScore * 0.2) {
        // Within 20% of high score
        stats.push({
          message: `You were ${Math.floor(distanceFromHighScore).toLocaleString()} points from your high score!`,
          icon: 'distance',
        })
      }
    }

    // Check coins to next milestone
    const coinsToMilestone = COIN_MILESTONE - (coins % COIN_MILESTONE)
    if (coinsToMilestone <= 20 && coinsToMilestone > 0) {
      stats.push({
        message: `${coinsToMilestone} more coins to reach ${Math.ceil(coins / COIN_MILESTONE) * COIN_MILESTONE}!`,
        icon: 'coins',
      })
    }

    // Check fever meter progress
    const feverProgress = feverMeter
    if (feverProgress >= 70 && feverProgress < FEVER_THRESHOLD) {
      const feverNeeded = FEVER_THRESHOLD - feverProgress
      stats.push({
        message: `${Math.floor(feverNeeded)}% more to activate Fever Mode!`,
        icon: 'fever',
      })
    }

    return stats
  }, [score, coins, feverMeter, previousHighScore, isNewHighScore])

  // Save progress and play sound when game ends
  useEffect(() => {
    if (phase === 'gameover') {
      play('gameOver')
      vibrate('gameOver')
      if (score > 0) {
        markGameCompleted('blitz-rush-3d', score, coins)
        // Update player stats for character unlocks
        updatePlayerStats(Math.floor(score))
        const isNew = score > previousHighScore
        setIsNewHighScore(isNew)
        if (isNew) {
          vibrate('newHighScore')
        }
      }
      // Mark first run as complete after first game ends
      if (isFirstRunMode) {
        markFirstRunComplete()
      }
    }
  }, [phase, score, coins, previousHighScore, isFirstRunMode, markGameCompleted, play, vibrate])

  if (phase !== 'gameover') return null

  const handleShare = () => {
    // Build share text with score, fact, and challenge
    const factLine = `Today I learned: ${todaysFact.term} - ${todaysFact.definition.split('.')[0]}.`
    const challengeLine = `Think you can beat ${Math.floor(score).toLocaleString()} points? I dare you!`

    const text = `I scored ${Math.floor(score).toLocaleString()} in Blitz Rush 3D!\n\n${factLine}\n\n${challengeLine}`
    const url = window.location.href

    if (navigator.share) {
      navigator.share({ title: 'Blitz Rush 3D', text, url })
    } else {
      navigator.clipboard.writeText(`${text}\n\n${url}`)
      alert('Score copied to clipboard!')
    }
  }

  // Get the quick tip based on death cause
  const quickTip = deathCause ? DEATH_TIPS[deathCause] : null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="bg-slate-900 border-2 border-slate-700 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl w-full max-w-sm sm:max-w-md shadow-2xl relative overflow-hidden my-auto"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-24 sm:w-32 h-24 sm:h-32 bg-red-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-24 sm:w-32 h-24 sm:h-32 bg-blue-500/20 rounded-full blur-3xl" />

          <div className="relative text-center flex flex-col items-center gap-3 sm:gap-4 md:gap-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-700">
              <Skull className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-red-500" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black italic text-white uppercase tracking-tighter">
                Game Over
              </h2>
              {isNewHighScore && (
                <div className="bg-yellow-400 text-black text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full inline-block animate-bounce">
                  NEW HIGH SCORE!
                </div>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 w-full">
              <div className="bg-slate-800/50 p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl border border-white/5">
                <div className="flex items-center gap-1.5 sm:gap-2 text-slate-400 text-[10px] sm:text-xs font-bold uppercase mb-0.5 sm:mb-1">
                  <Trophy className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Score
                </div>
                <div className="text-lg sm:text-xl md:text-2xl font-black text-white">{Math.floor(score).toLocaleString()}</div>
              </div>
              <div className="bg-slate-800/50 p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl border border-white/5">
                <div className="flex items-center gap-1.5 sm:gap-2 text-slate-400 text-[10px] sm:text-xs font-bold uppercase mb-0.5 sm:mb-1">
                  <Coins className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Coins
                </div>
                <div className="text-lg sm:text-xl md:text-2xl font-black text-yellow-400">{coins}</div>
              </div>
              <div className="bg-slate-800/50 p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl border border-white/5 col-span-2">
                <div className="flex items-center gap-1.5 sm:gap-2 text-slate-400 text-[10px] sm:text-xs font-bold uppercase mb-0.5 sm:mb-1">
                  <Target className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Distance
                </div>
                <div className="text-base sm:text-lg md:text-xl font-bold text-slate-200">{Math.floor(distance)}m</div>
              </div>
            </div>

            {/* Near Miss Stats - "Almost" Psychology */}
            {nearMissStats.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full space-y-1.5 sm:space-y-2"
              >
                {nearMissStats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5"
                  >
                    <div className="flex items-center gap-2 text-orange-300 text-xs sm:text-sm font-medium">
                      {stat.icon === 'distance' && <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />}
                      {stat.icon === 'coins' && <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />}
                      {stat.icon === 'fever' && <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />}
                      <span>{stat.message}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Quick Tip based on death cause */}
            {quickTip && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full bg-blue-500/15 border border-blue-500/30 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5"
              >
                <div className="flex items-start gap-2 text-blue-300">
                  <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <div className="text-[10px] sm:text-xs font-bold uppercase text-blue-400 mb-0.5">Quick Tip</div>
                    <div className="text-xs sm:text-sm">{quickTip}</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Today You Learned - Football Facts */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="w-full bg-gradient-to-r from-emerald-500/15 to-teal-500/15 border border-emerald-500/30 rounded-lg sm:rounded-xl px-3 py-2.5 sm:px-4 sm:py-3"
            >
              <div className="flex items-start gap-2 text-emerald-300">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <div className="text-[10px] sm:text-xs font-bold uppercase text-emerald-400 mb-1">Today You Learned</div>
                  <div className="text-sm sm:text-base font-bold text-white mb-0.5">{todaysFact.term}</div>
                  <div className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">{todaysFact.definition}</div>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <div className="flex flex-col gap-2 sm:gap-3 w-full mt-1 sm:mt-2">
              <Button
                onClick={() => startGame()}
                className="bg-yellow-400 hover:bg-yellow-300 text-black font-black py-4 sm:py-5 md:py-6 rounded-xl sm:rounded-2xl text-base sm:text-lg shadow-[0_4px_0_#ca8a04] active:translate-y-1 active:shadow-none transition-all"
              >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> REPLAY
              </Button>

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="border-slate-700 hover:bg-slate-800 text-slate-200 py-3 sm:py-4 md:py-6 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base"
                >
                  <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" /> SHARE
                </Button>
                <Link href="/games/blitz-rush" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full border-slate-700 hover:bg-slate-800 text-slate-200 py-3 sm:py-4 md:py-6 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base"
                  >
                    <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" /> MENU
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
