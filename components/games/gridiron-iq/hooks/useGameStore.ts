'use client'

import { create } from 'zustand'

// Types
export type GamePhase = 'menu' | 'team-select' | 'play-select' | 'pre-snap' | 'playing' | 'post-play' | 'halftime' | 'game-over'
export type Formation = 'shotgun' | 'i-formation' | 'spread' | 'singleback'
export type Coverage = 'man' | 'zone' | 'blitz' | 'prevent'

export interface Position {
  x: number // 0-100 (percentage of field width)
  y: number // 0-100 (percentage of field height, 0 = own endzone)
}

export interface Route {
  name: string
  points: Position[] // Path the receiver runs
  timing: number // When they're "open" (0-1 of route completion)
}

export interface Receiver {
  id: string
  name: string
  position: 'WR1' | 'WR2' | 'WR3' | 'TE' | 'RB'
  startPosition: Position
  route: Route
  currentPosition: Position
  isOpen: boolean
  speed: number // 1-10
  catching: number // 1-10
  targeted: boolean
}

export interface Defender {
  id: string
  position: 'CB1' | 'CB2' | 'S' | 'LB1' | 'LB2' | 'DL'
  startPosition: Position
  currentPosition: Position
  assignment: string | null // Receiver ID for man coverage
  speed: number
  coverage: number // 1-10
}

export interface Play {
  id: string
  name: string
  formation: Formation
  description: string
  footballLesson: string // Educational content
  routes: { [key: string]: Route }
  difficulty: 1 | 2 | 3
  idealCoverage: Coverage[] // Which coverages this play beats
}

export interface GameState {
  // Game phase
  phase: GamePhase

  // Teams
  playerTeam: string
  opponentTeam: string

  // Score
  playerScore: number
  opponentScore: number

  // Clock
  quarter: 1 | 2 | 3 | 4
  timeRemaining: number // seconds in quarter
  playClock: number // seconds to make a throw

  // Field position
  ballPosition: number // Yard line (0-100, 0 = own goal line)
  down: 1 | 2 | 3 | 4
  yardsToGo: number
  driveYards: number

  // Current play
  selectedPlay: Play | null
  receivers: Receiver[]
  defenders: Defender[]
  defenseCoverage: Coverage

  // Play result
  lastPlayResult: {
    type: 'completion' | 'incomplete' | 'interception' | 'touchdown' | 'sack'
    yards: number
    description: string
  } | null

  // Stats
  stats: {
    completions: number
    attempts: number
    yards: number
    touchdowns: number
    interceptions: number
    longestPlay: number
  }

  // High scores
  highScore: number
  gamesPlayed: number

  // Animation state
  throwInProgress: boolean
  ballTrajectory: Position[] | null

  // Actions
  setPhase: (phase: GamePhase) => void
  selectTeam: (team: string) => void
  selectPlay: (play: Play) => void
  snapBall: () => void
  throwBall: (receiverId: string) => void
  scramble: () => void
  tick: (delta: number) => void
  startGame: () => void
  resetGame: () => void
  nextPlay: () => void

  // For animations
  updateReceiverPosition: (id: string, position: Position) => void
  updateDefenderPosition: (id: string, position: Position) => void
}

// NFL Teams for selection
export const NFL_TEAMS = [
  { id: 'chiefs', name: 'Kansas City', color: '#E31837', secondary: '#FFB81C' },
  { id: 'bills', name: 'Buffalo', color: '#00338D', secondary: '#C60C30' },
  { id: 'eagles', name: 'Philadelphia', color: '#004C54', secondary: '#A5ACAF' },
  { id: '49ers', name: 'San Francisco', color: '#AA0000', secondary: '#B3995D' },
  { id: 'cowboys', name: 'Dallas', color: '#003594', secondary: '#869397' },
  { id: 'ravens', name: 'Baltimore', color: '#241773', secondary: '#9E7C0C' },
  { id: 'lions', name: 'Detroit', color: '#0076B6', secondary: '#B0B7BC' },
  { id: 'dolphins', name: 'Miami', color: '#008E97', secondary: '#FC4C02' },
]

// Quarter length in seconds (2 minutes = 120 seconds per quarter)
const QUARTER_LENGTH = 120
const PLAY_CLOCK_MAX = 8 // Seconds to make a read and throw

// Initial state
const initialState = {
  phase: 'menu' as GamePhase,
  playerTeam: '',
  opponentTeam: '',
  playerScore: 0,
  opponentScore: 0,
  quarter: 1 as const,
  timeRemaining: QUARTER_LENGTH,
  playClock: PLAY_CLOCK_MAX,
  ballPosition: 25, // Start at own 25
  down: 1 as const,
  yardsToGo: 10,
  driveYards: 0,
  selectedPlay: null,
  receivers: [],
  defenders: [],
  defenseCoverage: 'man' as Coverage,
  lastPlayResult: null,
  stats: {
    completions: 0,
    attempts: 0,
    yards: 0,
    touchdowns: 0,
    interceptions: 0,
    longestPlay: 0,
  },
  highScore: 0,
  gamesPlayed: 0,
  throwInProgress: false,
  ballTrajectory: null,
}

// Load persisted data
function loadPersistedData() {
  if (typeof window === 'undefined') return { highScore: 0, gamesPlayed: 0 }
  try {
    const saved = localStorage.getItem('gridiron-iq-stats')
    if (saved) {
      const data = JSON.parse(saved)
      return {
        highScore: data.highScore || 0,
        gamesPlayed: data.gamesPlayed || 0,
      }
    }
  } catch (e) {
    console.error('Failed to load game stats:', e)
  }
  return { highScore: 0, gamesPlayed: 0 }
}

// Save persisted data
function savePersistedData(highScore: number, gamesPlayed: number) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('gridiron-iq-stats', JSON.stringify({ highScore, gamesPlayed }))
  } catch (e) {
    console.error('Failed to save game stats:', e)
  }
}

// Generate defense based on coverage type
function generateDefense(coverage: Coverage, receivers: Receiver[]): Defender[] {
  const defenders: Defender[] = []

  // Cornerbacks
  defenders.push({
    id: 'cb1',
    position: 'CB1',
    startPosition: { x: 15, y: 65 },
    currentPosition: { x: 15, y: 65 },
    assignment: coverage === 'man' ? 'wr1' : null,
    speed: 8,
    coverage: 7,
  })

  defenders.push({
    id: 'cb2',
    position: 'CB2',
    startPosition: { x: 85, y: 65 },
    currentPosition: { x: 85, y: 65 },
    assignment: coverage === 'man' ? 'wr2' : null,
    speed: 7,
    coverage: 7,
  })

  // Safety
  defenders.push({
    id: 's',
    position: 'S',
    startPosition: { x: 50, y: 80 },
    currentPosition: { x: 50, y: 80 },
    assignment: coverage === 'man' ? 'te' : null,
    speed: 8,
    coverage: 8,
  })

  // Linebackers
  defenders.push({
    id: 'lb1',
    position: 'LB1',
    startPosition: { x: 35, y: 55 },
    currentPosition: { x: 35, y: 55 },
    assignment: coverage === 'man' ? 'rb' : null,
    speed: 6,
    coverage: 5,
  })

  defenders.push({
    id: 'lb2',
    position: 'LB2',
    startPosition: { x: 65, y: 55 },
    currentPosition: { x: 65, y: 55 },
    assignment: null,
    speed: 6,
    coverage: 5,
  })

  // D-Line (rush)
  defenders.push({
    id: 'dl',
    position: 'DL',
    startPosition: { x: 50, y: 48 },
    currentPosition: { x: 50, y: 48 },
    assignment: null, // Rushes QB
    speed: coverage === 'blitz' ? 9 : 5,
    coverage: 2,
  })

  return defenders
}

// Random coverage selection based on situation
function selectDefenseCoverage(down: number, yardsToGo: number, ballPosition: number): Coverage {
  const rand = Math.random()

  // Red zone = more man coverage
  if (ballPosition > 80) {
    return rand < 0.6 ? 'man' : 'zone'
  }

  // Long yardage = prevent
  if (yardsToGo > 15) {
    return rand < 0.4 ? 'prevent' : 'zone'
  }

  // Third down = blitz chance
  if (down === 3) {
    if (rand < 0.3) return 'blitz'
    if (rand < 0.6) return 'man'
    return 'zone'
  }

  // Normal distribution
  if (rand < 0.4) return 'man'
  if (rand < 0.8) return 'zone'
  return 'blitz'
}

export const useGameStore = create<GameState>((set, get) => ({
  ...initialState,
  ...loadPersistedData(),

  setPhase: (phase) => set({ phase }),

  selectTeam: (team) => {
    // Pick random opponent
    const opponents = NFL_TEAMS.filter(t => t.id !== team)
    const opponent = opponents[Math.floor(Math.random() * opponents.length)]
    set({ playerTeam: team, opponentTeam: opponent.id, phase: 'play-select' })
  },

  selectPlay: (play) => {
    const state = get()

    // Generate receivers from play routes
    const receivers: Receiver[] = Object.entries(play.routes).map(([pos, route]) => ({
      id: pos.toLowerCase(),
      name: pos,
      position: pos as Receiver['position'],
      startPosition: getReceiverStartPosition(pos, play.formation),
      route,
      currentPosition: getReceiverStartPosition(pos, play.formation),
      isOpen: false,
      speed: 7 + Math.floor(Math.random() * 3),
      catching: 6 + Math.floor(Math.random() * 4),
      targeted: false,
    }))

    // Select defense coverage
    const coverage = selectDefenseCoverage(state.down, state.yardsToGo, state.ballPosition)

    // Generate defenders
    const defenders = generateDefense(coverage, receivers)

    set({
      selectedPlay: play,
      receivers,
      defenders,
      defenseCoverage: coverage,
      phase: 'pre-snap',
      playClock: PLAY_CLOCK_MAX,
    })
  },

  snapBall: () => {
    set({ phase: 'playing' })
  },

  throwBall: (receiverId) => {
    const state = get()
    if (state.throwInProgress || state.phase !== 'playing') return

    const receiver = state.receivers.find(r => r.id === receiverId)
    if (!receiver) return

    set({ throwInProgress: true })

    // Mark receiver as targeted
    set({
      receivers: state.receivers.map(r =>
        r.id === receiverId ? { ...r, targeted: true } : r
      )
    })

    // Calculate completion probability
    const defender = state.defenders.find(d => d.assignment === receiverId)
    const distanceToDefender = defender
      ? Math.hypot(
          receiver.currentPosition.x - defender.currentPosition.x,
          receiver.currentPosition.y - defender.currentPosition.y
        )
      : 100

    // Base completion chance
    let completionChance = 0.5

    // Open receiver bonus
    if (receiver.isOpen) completionChance += 0.35

    // Distance from defender bonus
    completionChance += Math.min(0.2, distanceToDefender / 100)

    // Receiver skill bonus
    completionChance += receiver.catching * 0.02

    // Timing bonus (throwing when receiver expects it)
    const routeProgress = calculateRouteProgress(receiver)
    const timingDiff = Math.abs(routeProgress - receiver.route.timing)
    completionChance -= timingDiff * 0.3

    // Random factor
    const roll = Math.random()
    const isComplete = roll < completionChance
    const isInterception = !isComplete && roll > 0.95 && distanceToDefender < 20

    // Calculate yards gained
    const yardsGained = isComplete
      ? Math.floor((receiver.currentPosition.y - 45) * 0.6) + Math.floor(Math.random() * 5)
      : 0

    const isTouchdown = isComplete && (state.ballPosition + yardsGained >= 100)

    // Delay for throw animation
    setTimeout(() => {
      const currentState = get()

      let resultType: 'completion' | 'incomplete' | 'interception' | 'touchdown' | 'sack'
      let description = ''

      if (isTouchdown) {
        resultType = 'touchdown'
        description = `TOUCHDOWN! ${receiver.name} catches it in the end zone!`
      } else if (isInterception) {
        resultType = 'interception'
        description = `INTERCEPTED! The defender jumps the route!`
      } else if (isComplete) {
        resultType = 'completion'
        description = `Complete to ${receiver.name} for ${yardsGained} yards!`
      } else {
        resultType = 'incomplete'
        description = `Incomplete! ${receiver.name} couldn't hold on.`
      }

      // Update stats
      const newStats = { ...currentState.stats }
      newStats.attempts++
      if (isComplete || isTouchdown) {
        newStats.completions++
        newStats.yards += isTouchdown ? (100 - state.ballPosition) : yardsGained
        if (yardsGained > newStats.longestPlay) newStats.longestPlay = yardsGained
      }
      if (isTouchdown) newStats.touchdowns++
      if (isInterception) newStats.interceptions++

      // Calculate new game state
      let newBallPosition = currentState.ballPosition
      let newDown = currentState.down
      let newYardsToGo = currentState.yardsToGo
      let newDriveYards = currentState.driveYards
      let newPlayerScore = currentState.playerScore
      let newOpponentScore = currentState.opponentScore
      let newTimeRemaining = currentState.timeRemaining - 5 // Each play takes ~5 seconds
      let newQuarter = currentState.quarter

      if (isTouchdown) {
        newPlayerScore += 7 // TD + PAT assumed
        newBallPosition = 25 // Kickoff touchback
        newDown = 1
        newYardsToGo = 10
        newDriveYards = 0
      } else if (isInterception) {
        // Opponent gets ball
        newOpponentScore += 3 // Assume FG eventually
        newBallPosition = 25
        newDown = 1
        newYardsToGo = 10
        newDriveYards = 0
      } else if (isComplete) {
        newBallPosition += yardsGained
        newDriveYards += yardsGained
        if (yardsGained >= newYardsToGo) {
          // First down!
          newDown = 1
          newYardsToGo = 10
        } else {
          newDown = (newDown + 1) as 1 | 2 | 3 | 4
          newYardsToGo -= yardsGained
        }
      } else {
        // Incomplete
        newDown = (newDown + 1) as 1 | 2 | 3 | 4
      }

      // Check for turnover on downs
      if (newDown > 4) {
        newOpponentScore += 3 // Assume opponent FG
        newBallPosition = 25
        newDown = 1
        newYardsToGo = 10
        newDriveYards = 0
      }

      // Check quarter
      if (newTimeRemaining <= 0) {
        newTimeRemaining = QUARTER_LENGTH
        if (newQuarter < 4) {
          newQuarter = (newQuarter + 1) as 1 | 2 | 3 | 4
        }
      }

      // Check game over
      const isGameOver = currentState.quarter === 4 && newTimeRemaining <= 0

      set({
        throwInProgress: false,
        lastPlayResult: {
          type: resultType,
          yards: yardsGained,
          description,
        },
        stats: newStats,
        ballPosition: newBallPosition,
        down: newDown as 1 | 2 | 3 | 4,
        yardsToGo: newYardsToGo,
        driveYards: newDriveYards,
        playerScore: newPlayerScore,
        opponentScore: newOpponentScore,
        timeRemaining: newTimeRemaining,
        quarter: newQuarter as 1 | 2 | 3 | 4,
        phase: isGameOver ? 'game-over' : (newQuarter === 3 && currentState.quarter === 2 ? 'halftime' : 'post-play'),
      })

      // Save high score if game over
      if (isGameOver) {
        const finalScore = newPlayerScore
        const current = get()
        if (finalScore > current.highScore) {
          savePersistedData(finalScore, current.gamesPlayed + 1)
          set({ highScore: finalScore, gamesPlayed: current.gamesPlayed + 1 })
        } else {
          savePersistedData(current.highScore, current.gamesPlayed + 1)
          set({ gamesPlayed: current.gamesPlayed + 1 })
        }
      }
    }, 800) // Throw animation time
  },

  scramble: () => {
    const state = get()
    if (state.throwInProgress || state.phase !== 'playing') return

    // Scramble for random yards (1-8)
    const yardsGained = Math.floor(Math.random() * 8) + 1

    setTimeout(() => {
      const currentState = get()

      let newBallPosition = currentState.ballPosition + yardsGained
      let newDown = currentState.down
      let newYardsToGo = currentState.yardsToGo
      let newDriveYards = currentState.driveYards + yardsGained
      let newPlayerScore = currentState.playerScore
      let newTimeRemaining = currentState.timeRemaining - 8 // Scrambles take longer
      let newQuarter = currentState.quarter

      const isTouchdown = newBallPosition >= 100

      if (isTouchdown) {
        newPlayerScore += 7
        newBallPosition = 25
        newDown = 1
        newYardsToGo = 10
        newDriveYards = 0
      } else if (yardsGained >= newYardsToGo) {
        newDown = 1
        newYardsToGo = 10
      } else {
        newDown = (newDown + 1) as 1 | 2 | 3 | 4
        newYardsToGo -= yardsGained
      }

      if (newDown > 4) {
        newBallPosition = 25
        newDown = 1
        newYardsToGo = 10
        newDriveYards = 0
      }

      if (newTimeRemaining <= 0) {
        newTimeRemaining = QUARTER_LENGTH
        if (newQuarter < 4) {
          newQuarter = (newQuarter + 1) as 1 | 2 | 3 | 4
        }
      }

      const isGameOver = currentState.quarter === 4 && newTimeRemaining <= 0

      set({
        lastPlayResult: {
          type: isTouchdown ? 'touchdown' : 'completion',
          yards: yardsGained,
          description: isTouchdown
            ? `TOUCHDOWN! QB scrambles into the end zone!`
            : `QB scrambles for ${yardsGained} yards!`,
        },
        stats: {
          ...currentState.stats,
          yards: currentState.stats.yards + yardsGained,
          touchdowns: currentState.stats.touchdowns + (isTouchdown ? 1 : 0),
        },
        ballPosition: newBallPosition,
        down: newDown as 1 | 2 | 3 | 4,
        yardsToGo: newYardsToGo,
        driveYards: newDriveYards,
        playerScore: newPlayerScore,
        timeRemaining: newTimeRemaining,
        quarter: newQuarter as 1 | 2 | 3 | 4,
        phase: isGameOver ? 'game-over' : 'post-play',
      })
    }, 600)
  },

  tick: (delta) => {
    const state = get()
    if (state.phase !== 'playing') return

    // Update play clock
    const newPlayClock = state.playClock - delta

    // Sack if play clock expires
    if (newPlayClock <= 0) {
      set({
        lastPlayResult: {
          type: 'sack',
          yards: -7,
          description: 'SACKED! Took too long to throw!',
        },
        down: Math.min(4, state.down + 1) as 1 | 2 | 3 | 4,
        yardsToGo: state.yardsToGo + 7,
        ballPosition: Math.max(1, state.ballPosition - 7),
        timeRemaining: state.timeRemaining - 6,
        phase: 'post-play',
      })
      return
    }

    // Update receiver positions along routes
    const updatedReceivers = state.receivers.map(receiver => {
      const routeProgress = Math.min(1, (PLAY_CLOCK_MAX - newPlayClock) / 3) // Routes complete in 3 seconds
      const routeIndex = Math.floor(routeProgress * (receiver.route.points.length - 1))
      const nextIndex = Math.min(routeIndex + 1, receiver.route.points.length - 1)
      const subProgress = (routeProgress * (receiver.route.points.length - 1)) - routeIndex

      const currentPoint = receiver.route.points[routeIndex]
      const nextPoint = receiver.route.points[nextIndex]

      const newPosition = {
        x: currentPoint.x + (nextPoint.x - currentPoint.x) * subProgress,
        y: currentPoint.y + (nextPoint.y - currentPoint.y) * subProgress,
      }

      // Check if open (based on route timing)
      const isOpen = Math.abs(routeProgress - receiver.route.timing) < 0.15

      return {
        ...receiver,
        currentPosition: newPosition,
        isOpen,
      }
    })

    // Update defender positions (chase receivers or zones)
    const updatedDefenders = state.defenders.map(defender => {
      if (defender.position === 'DL') {
        // Rush towards QB (center of field, y=45)
        const targetY = 45
        const newY = defender.currentPosition.y - delta * defender.speed * 3
        return {
          ...defender,
          currentPosition: {
            x: defender.currentPosition.x,
            y: Math.max(targetY, newY),
          },
        }
      }

      if (state.defenseCoverage === 'man' && defender.assignment) {
        // Follow assigned receiver
        const targetReceiver = updatedReceivers.find(r => r.id === defender.assignment)
        if (targetReceiver) {
          const dx = targetReceiver.currentPosition.x - defender.currentPosition.x
          const dy = targetReceiver.currentPosition.y - defender.currentPosition.y
          const dist = Math.hypot(dx, dy)

          if (dist > 5) {
            const speed = defender.speed * delta * 8
            return {
              ...defender,
              currentPosition: {
                x: defender.currentPosition.x + (dx / dist) * speed,
                y: defender.currentPosition.y + (dy / dist) * speed,
              },
            }
          }
        }
      } else {
        // Zone coverage - move to zone area
        const zoneTargets: { [key: string]: Position } = {
          CB1: { x: 20, y: 70 },
          CB2: { x: 80, y: 70 },
          S: { x: 50, y: 85 },
          LB1: { x: 30, y: 60 },
          LB2: { x: 70, y: 60 },
        }

        const target = zoneTargets[defender.position]
        if (target) {
          const dx = target.x - defender.currentPosition.x
          const dy = target.y - defender.currentPosition.y
          const dist = Math.hypot(dx, dy)

          if (dist > 2) {
            const speed = defender.speed * delta * 5
            return {
              ...defender,
              currentPosition: {
                x: defender.currentPosition.x + (dx / dist) * speed,
                y: defender.currentPosition.y + (dy / dist) * speed,
              },
            }
          }
        }
      }

      return defender
    })

    set({
      playClock: newPlayClock,
      receivers: updatedReceivers,
      defenders: updatedDefenders,
    })
  },

  startGame: () => {
    set({
      ...initialState,
      ...loadPersistedData(),
      phase: 'team-select',
    })
  },

  resetGame: () => {
    set({
      ...initialState,
      ...loadPersistedData(),
    })
  },

  nextPlay: () => {
    const state = get()

    // Check for halftime
    if (state.quarter === 2 && state.phase === 'halftime') {
      set({ phase: 'play-select', quarter: 3 })
      return
    }

    set({
      phase: 'play-select',
      selectedPlay: null,
      receivers: [],
      defenders: [],
      lastPlayResult: null,
      throwInProgress: false,
    })
  },

  updateReceiverPosition: (id, position) => {
    set(state => ({
      receivers: state.receivers.map(r =>
        r.id === id ? { ...r, currentPosition: position } : r
      )
    }))
  },

  updateDefenderPosition: (id, position) => {
    set(state => ({
      defenders: state.defenders.map(d =>
        d.id === id ? { ...d, currentPosition: position } : d
      )
    }))
  },
}))

// Helper functions
function getReceiverStartPosition(position: string, formation: Formation): Position {
  const positions: { [key: string]: { [key: string]: Position } } = {
    shotgun: {
      WR1: { x: 10, y: 48 },
      WR2: { x: 90, y: 48 },
      WR3: { x: 75, y: 45 },
      TE: { x: 65, y: 45 },
      RB: { x: 45, y: 40 },
    },
    spread: {
      WR1: { x: 5, y: 48 },
      WR2: { x: 95, y: 48 },
      WR3: { x: 25, y: 48 },
      TE: { x: 75, y: 48 },
      RB: { x: 50, y: 40 },
    },
    'i-formation': {
      WR1: { x: 10, y: 48 },
      WR2: { x: 90, y: 48 },
      TE: { x: 70, y: 45 },
      RB: { x: 50, y: 35 },
    },
    singleback: {
      WR1: { x: 15, y: 48 },
      WR2: { x: 85, y: 48 },
      WR3: { x: 25, y: 45 },
      TE: { x: 65, y: 45 },
      RB: { x: 50, y: 38 },
    },
  }

  return positions[formation]?.[position] || { x: 50, y: 45 }
}

function calculateRouteProgress(receiver: Receiver): number {
  const startPos = receiver.startPosition
  const currentPos = receiver.currentPosition
  const route = receiver.route

  if (route.points.length < 2) return 0

  // Calculate total route distance
  let totalDist = 0
  for (let i = 1; i < route.points.length; i++) {
    totalDist += Math.hypot(
      route.points[i].x - route.points[i-1].x,
      route.points[i].y - route.points[i-1].y
    )
  }

  // Calculate distance traveled
  const distFromStart = Math.hypot(
    currentPos.x - startPos.x,
    currentPos.y - startPos.y
  )

  return Math.min(1, distFromStart / Math.max(1, totalDist))
}
