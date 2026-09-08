'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/shared/utils'
import { Clock, Flame, Trophy, RefreshCw, CheckCircle2, XCircle, Play } from 'lucide-react'
import confetti from 'canvas-confetti'
import { useGameSound } from '@/hooks/use-game-sound'
import { useGameProgress } from '@/hooks/use-game-progress'

const GAME_ID = 'two-minute-drill'
const START_CLOCK = 120 // 2:00 on the clock

type Phase = 'menu' | 'playing' | 'gameover'

interface PlayOption {
  label: string
  yards: number // yards gained (can be negative for a sack)
  clockCost: number // seconds burned off the clock
  smart: boolean // is this the correct call for the situation?
  note: string // teaching blurb shown after the pick
}

interface Scenario {
  context: string // e.g. "Down 4, no timeouts left"
  options: PlayOption[]
}

// Curated, football-authentic scenarios. The "smart" option teaches real
// two-minute-drill clock management: stop the clock when you're short on time,
// take the high-percentage play on short yardage, protect the lead, etc.
const SCENARIOS: Scenario[] = [
  {
    context: 'Trailing by 4 · clock running · need to move fast',
    options: [
      { label: 'Sideline out route', yards: 12, clockCost: 4, smart: true, note: 'Out of bounds stops the clock — ideal when you’re racing the clock.' },
      { label: 'Run up the middle', yards: 5, clockCost: 9, smart: false, note: 'Stays in bounds, clock keeps running. Avoid runs when chasing the clock.' },
      { label: 'Checkdown to RB', yards: 4, clockCost: 8, smart: false, note: 'Safe, but in-bounds — the clock bleeds while you’re behind.' },
      { label: 'Deep shot, double-covered', yards: -2, clockCost: 6, smart: false, note: 'Forcing it into coverage risks a turnover. Take the sure yards.' },
    ],
  },
  {
    context: '3rd & 2 · midfield · need to keep the drive alive',
    options: [
      { label: 'Quick slant', yards: 8, clockCost: 5, smart: true, note: 'High-percentage throw that moves the chains. Live to play another down.' },
      { label: 'Hail Mary', yards: 0, clockCost: 6, smart: false, note: 'Low-percentage gamble when you only need 2. Wrong call.' },
      { label: 'QB sneak', yards: 1, clockCost: 8, smart: false, note: 'Comes up short of the sticks — and burns clock.' },
      { label: 'Screen pass', yards: 3, clockCost: 6, smart: false, note: 'Gets the first, but slower-developing and risks a loss vs. blitz.' },
    ],
  },
  {
    context: '0:38 left · no timeouts · ball at midfield',
    options: [
      { label: 'Spike the ball', yards: 0, clockCost: 2, smart: true, note: 'Stops the clock with no timeouts left so you can set up the next play.' },
      { label: 'Huddle up', yards: 0, clockCost: 18, smart: false, note: 'You have no timeouts — huddling wastes precious seconds.' },
      { label: 'Deep crossing route', yards: 14, clockCost: 11, smart: false, note: 'Great yards, but in-bounds with no way to stop the clock = disaster.' },
      { label: 'Draw play', yards: 6, clockCost: 12, smart: false, note: 'A run here with no timeouts can end the game.' },
    ],
  },
  {
    context: '4th & 4 · red zone · must convert',
    options: [
      { label: 'Fade to the corner', yards: 18, clockCost: 5, smart: true, note: 'High-value throw to a covered spot only your guy can reach. Touchdown range.' },
      { label: 'Run it up the gut', yards: 2, clockCost: 9, smart: false, note: 'Comes up short of the first down. Turnover on downs.' },
      { label: 'Field goal', yards: 0, clockCost: 5, smart: false, note: 'You need a touchdown, not 3. Don’t settle here.' },
      { label: 'Punt', yards: 0, clockCost: 5, smart: false, note: 'Never punt when you need points in the two-minute drill.' },
    ],
  },
  {
    context: '2nd & 10 · clock running · plenty of field',
    options: [
      { label: 'Comeback to the sideline', yards: 11, clockCost: 4, smart: true, note: 'Chunk yards AND gets out of bounds to stop the clock. Perfect.' },
      { label: 'Hand off, inside zone', yards: 7, clockCost: 9, smart: false, note: 'Decent yards but eats clock you can’t spare.' },
      { label: 'Five-step drop, scan deep', yards: 0, clockCost: 7, smart: false, note: 'Holding the ball too long risks a sack and burns time.' },
      { label: 'Kneel down', yards: -1, clockCost: 1, smart: false, note: 'You kneel to protect a lead, not when you’re driving.' },
    ],
  },
  {
    context: 'Up by 2 · 1:15 left · opponent has 1 timeout',
    options: [
      { label: 'Run inside, stay in bounds', yards: 4, clockCost: 6, smart: true, note: 'Protecting a lead: keep the clock moving and force them to use timeouts.' },
      { label: 'Throw deep down the sideline', yards: 22, clockCost: 4, smart: false, note: 'Incompletions stop YOUR clock and help them. Don’t throw it away.' },
      { label: 'Quick out of bounds', yards: 6, clockCost: 3, smart: false, note: 'Stopping the clock helps the trailing team — exactly what you don’t want.' },
      { label: 'Fumble-prone trick play', yards: 9, clockCost: 7, smart: false, note: 'Never risk the ball when you’re protecting a lead.' },
    ],
  },
  {
    context: '3rd & 15 · clock running · long way to go',
    options: [
      { label: 'Dig route past the sticks', yards: 17, clockCost: 6, smart: true, note: 'Take the throw that actually gets the first down — don’t play it short.' },
      { label: 'Checkdown short', yards: 5, clockCost: 6, smart: false, note: 'Comes up well short on 3rd & 15. Sets up 4th & long.' },
      { label: 'Draw play', yards: 8, clockCost: 9, smart: false, note: 'Runs rarely cover 15 yards — and the clock keeps rolling.' },
      { label: 'Screen behind the line', yards: 3, clockCost: 6, smart: false, note: 'Too short for the down and distance.' },
    ],
  },
  {
    context: 'Goal-to-go from the 3 · 0:09 left · 1 timeout',
    options: [
      { label: 'Quick slant, snap fast', yards: 3, clockCost: 4, smart: true, note: 'Fast-hitting throw into the end zone — leaves time to spare if it falls incomplete.' },
      { label: 'Power run', yards: 2, clockCost: 8, smart: false, note: 'Stopped at the 1 — and the clock may expire before you can spike.' },
      { label: 'Five-receiver scramble drill', yards: 0, clockCost: 9, smart: false, note: 'Holding the ball at 0:09 risks a game-ending sack.' },
      { label: 'Kick the field goal', yards: 0, clockCost: 4, smart: false, note: 'Goal-to-go down a TD: you need 7, not 3.' },
    ],
  },
]

function yardLine(pos: number): string {
  // pos: 0 = own goal line, 100 = opponent goal line
  if (pos >= 100) return 'GOAL'
  if (pos <= 0) return 'OWN GOAL'
  if (pos < 50) return `OWN ${pos}`
  if (pos > 50) return `OPP ${100 - pos}`
  return 'MIDFIELD'
}

function fmtClock(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function TwoMinuteDrillGame() {
  const { playSound } = useGameSound()
  const { progress, markGameCompleted } = useGameProgress()

  const [phase, setPhase] = useState<Phase>('menu')
  const [clock, setClock] = useState(START_CLOCK)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(1)
  const [ballPos, setBallPos] = useState(25)
  const [down, setDown] = useState(1)
  const [distance, setDistance] = useState(10)
  const [touchdowns, setTouchdowns] = useState(0)
  const [scenario, setScenario] = useState<Scenario | null>(null)
  const [locked, setLocked] = useState(false)
  const [picked, setPicked] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<{ text: string; good: boolean } | null>(null)
  const [flash, setFlash] = useState<string | null>(null)

  const queueRef = useRef<Scenario[]>([])
  const savedRef = useRef(false)

  const best = progress[GAME_ID]?.highScore ?? 0

  const nextScenario = useCallback(() => {
    if (queueRef.current.length === 0) queueRef.current = shuffle(SCENARIOS)
    const next = queueRef.current.shift()!
    // shuffle the option order so positions aren't memorized
    setScenario({ ...next, options: shuffle(next.options) })
    setLocked(false)
    setPicked(null)
  }, [])

  const startGame = useCallback(() => {
    playSound('start')
    setClock(START_CLOCK)
    setScore(0)
    setCombo(1)
    setBallPos(25)
    setDown(1)
    setDistance(10)
    setTouchdowns(0)
    setFeedback(null)
    setFlash(null)
    savedRef.current = false
    queueRef.current = shuffle(SCENARIOS)
    setPhase('playing')
    nextScenario()
  }, [nextScenario, playSound])

  // Game clock
  useEffect(() => {
    if (phase !== 'playing') return
    const id = setInterval(() => {
      setClock((c) => {
        if (c <= 1) {
          clearInterval(id)
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [phase])

  // End the game when the clock hits 0
  useEffect(() => {
    if (phase === 'playing' && clock <= 0) {
      setPhase('gameover')
      playSound(score > best ? 'win' : 'wrong')
      if (!savedRef.current) {
        savedRef.current = true
        markGameCompleted(GAME_ID, score, Math.floor(score / 50))
      }
      if (score > best && best > 0) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } })
      }
    }
  }, [clock, phase, score, best, markGameCompleted, playSound])

  const handlePick = (idx: number) => {
    if (locked || !scenario || phase !== 'playing') return
    const opt = scenario.options[idx]
    setLocked(true)
    setPicked(idx)

    // Burn the clock for this play
    setClock((c) => Math.max(0, c - opt.clockCost))

    // Advance the ball
    let newPos = ballPos + opt.yards
    let td = false
    if (newPos >= 100) {
      newPos = 25 // touchback after the score, new possession
      td = true
    }
    if (newPos < 1) newPos = 1

    // Scoring + combo
    let gained: number
    if (opt.smart) {
      const newCombo = combo + 1
      gained = (10 + Math.max(0, opt.yards)) * combo
      setCombo(newCombo)
      playSound('correct')
      setFlash(`SMART CALL  ·  x${combo}`)
    } else {
      gained = Math.max(0, opt.yards)
      setCombo(1)
      playSound('wrong')
      setFlash(null)
    }

    if (td) {
      const tdPoints = 100 * combo
      gained += tdPoints
      setTouchdowns((t) => t + 1)
      playSound('win')
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.7 } })
      setFlash('TOUCHDOWN!')
    }
    setScore((s) => s + gained)

    // First-down / downs logic
    if (td) {
      setDown(1)
      setDistance(10)
      setBallPos(25)
    } else {
      const gainedFirst = opt.yards >= distance
      if (gainedFirst) {
        setDown(1)
        setDistance(Math.min(10, 100 - newPos))
        setBallPos(newPos)
      } else if (down >= 4) {
        // Turnover on downs — new possession, combo resets
        setCombo(1)
        setDown(1)
        setDistance(10)
        setBallPos(25)
        setFlash('TURNOVER ON DOWNS')
      } else {
        setDown((d) => d + 1)
        setDistance((dist) => Math.max(1, dist - opt.yards))
        setBallPos(newPos)
      }
    }

    setFeedback({ text: opt.note, good: opt.smart || td })

    // Next snap
    setTimeout(() => {
      setFeedback(null)
      setFlash(null)
      if (clock - opt.clockCost > 0) nextScenario()
    }, 1600)
  }

  const downText = ['1st', '2nd', '3rd', '4th'][Math.min(down - 1, 3)]
  const clockLow = clock <= 30

  // ---- MENU ----
  if (phase === 'menu') {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-8 sm:p-10 text-center shadow-2xl">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-300 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full mb-6">
            <Clock className="w-4 h-4" /> Beat the clock
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading uppercase text-white mb-3">Two-Minute Drill</h2>
          <p className="text-white/70 mb-6 max-w-md mx-auto">
            You’ve got 2:00 on the clock. Read each situation, call the smart play, and march down the
            field. Manage the clock, stack combos, and score before time runs out.
          </p>
          <div className="grid grid-cols-3 gap-3 text-left mb-8 text-sm">
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-orange-300 font-bold mb-1">Smart calls</p>
              <p className="text-white/60 text-xs">Build your combo multiplier</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-orange-300 font-bold mb-1">Clock</p>
              <p className="text-white/60 text-xs">Every play burns time</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-orange-300 font-bold mb-1">Score</p>
              <p className="text-white/60 text-xs">Drives + touchdowns</p>
            </div>
          </div>
          {best > 0 && (
            <p className="text-white/50 text-sm mb-4 flex items-center justify-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400" /> Best: {best.toLocaleString()}
            </p>
          )}
          <button
            onClick={startGame}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg shadow-orange-500/30"
          >
            <Play className="w-5 h-5" /> Start Drill
          </button>
        </div>
      </div>
    )
  }

  // ---- GAME OVER ----
  if (phase === 'gameover') {
    const isBest = score >= best
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-8 sm:p-10 text-center shadow-2xl">
          <h2 className="text-2xl font-heading uppercase text-white/60 mb-2">Time Expired</h2>
          <p className="text-6xl font-heading text-orange-400 mb-2">{score.toLocaleString()}</p>
          <p className="text-white/60 mb-6">
            {touchdowns} touchdown{touchdowns === 1 ? '' : 's'} · final score
          </p>
          {isBest && (
            <div className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-300 text-sm font-bold px-4 py-2 rounded-full mb-6">
              <Trophy className="w-4 h-4" /> New personal best!
            </div>
          )}
          {!isBest && best > 0 && (
            <p className="text-white/50 text-sm mb-6">Best: {best.toLocaleString()}</p>
          )}
          <div>
            <button
              onClick={startGame}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg shadow-orange-500/30"
            >
              <RefreshCw className="w-5 h-5" /> Run It Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ---- PLAYING ----
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Scoreboard */}
      <div className="rounded-t-2xl bg-slate-950 border border-white/10 border-b-0 px-5 py-4 flex items-center justify-between">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-wider text-white/40">Score</p>
          <p className="text-2xl font-heading text-white tabular-nums">{score.toLocaleString()}</p>
        </div>
        <motion.div
          animate={clockLow ? { scale: [1, 1.08, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1 }}
          className={cn(
            'text-center px-5 py-1 rounded-lg',
            clockLow ? 'bg-red-500/20' : 'bg-white/5'
          )}
        >
          <p className="text-[10px] uppercase tracking-wider text-white/40">Clock</p>
          <p
            className={cn(
              'text-3xl font-heading tabular-nums',
              clockLow ? 'text-red-400' : 'text-white'
            )}
          >
            {fmtClock(clock)}
          </p>
        </motion.div>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-wider text-white/40">Combo</p>
          <p
            className={cn(
              'text-2xl font-heading tabular-nums flex items-center gap-1',
              combo > 1 ? 'text-orange-400' : 'text-white/40'
            )}
          >
            {combo > 1 && <Flame className="w-5 h-5" />}x{combo}
          </p>
        </div>
      </div>

      {/* Field situation bar */}
      <div className="bg-gradient-to-r from-green-900 to-emerald-900 border-x border-white/10 px-5 py-3">
        <div className="flex items-center justify-between text-white text-sm font-bold">
          <span>
            {downText} & {distance >= 100 - ballPos ? 'Goal' : distance}
          </span>
          <span className="text-green-200">Ball on {yardLine(ballPos)}</span>
        </div>
        {/* Field progress bar */}
        <div className="mt-2 h-2 bg-black/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-orange-400"
            animate={{ width: `${ballPos}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          />
        </div>
      </div>

      {/* Play call panel */}
      <div className="rounded-b-2xl bg-slate-900 border border-white/10 border-t-0 p-5 relative overflow-hidden">
        <AnimatePresence>
          {flash && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-orange-500 text-white font-heading uppercase text-sm px-4 py-1.5 rounded-full shadow-lg"
            >
              {flash}
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-white/50 text-xs uppercase tracking-wider mb-1">Situation</p>
        <p className="text-center text-white font-bold mb-5">{scenario?.context}</p>

        <div className="grid sm:grid-cols-2 gap-3">
          {scenario?.options.map((opt, idx) => {
            const isPicked = picked === idx
            const reveal = locked
            return (
              <button
                key={`${opt.label}-${idx}`}
                onClick={() => handlePick(idx)}
                disabled={locked}
                className={cn(
                  'relative text-left rounded-xl px-4 py-3 border transition-all',
                  'bg-white/5 border-white/10 text-white',
                  !locked && 'hover:bg-white/10 hover:border-orange-400/50 hover:scale-[1.02] cursor-pointer',
                  reveal && opt.smart && 'bg-green-500/20 border-green-400',
                  reveal && isPicked && !opt.smart && 'bg-red-500/20 border-red-400',
                  reveal && !opt.smart && !isPicked && 'opacity-50'
                )}
              >
                <span className="font-bold">{opt.label}</span>
                {reveal && (
                  <span className="absolute top-3 right-3">
                    {opt.smart ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : isPicked ? (
                      <XCircle className="w-5 h-5 text-red-400" />
                    ) : null}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={cn(
                'mt-4 rounded-xl px-4 py-3 text-sm',
                feedback.good ? 'bg-green-500/10 text-green-200' : 'bg-red-500/10 text-red-200'
              )}
            >
              {feedback.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
