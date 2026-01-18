'use client'

import { create } from 'zustand'

// Types
export type GamePhase = 'menu' | 'tutorial' | 'playing' | 'simulating' | 'result' | 'game-over'
export type SimulationSpeed = 'normal' | 'fast' | 'skip'
export type PlayOutcome = 'completion' | 'touchdown' | 'incomplete' | 'interception' | 'sack' | 'run-gain' | 'run-loss'
export type Coverage = 'cover-0' | 'cover-1' | 'cover-2' | 'cover-3' | 'cover-4' | 'cover-6'
export type Formation = 'shotgun' | 'i-formation' | 'spread' | 'singleback'

export interface Position {
  x: number // 0-100 (percentage of field width)
  y: number // 0-100 (percentage of field depth)
}

export interface Route {
  name: string
  points: Position[]
}

export type PlayType = 'pass' | 'run'

export interface Play {
  id: string
  name: string
  formation: Formation
  playType: PlayType
  description: string
  whyItWorks: string // Why this play beats certain coverages
  routes: { [key: string]: Route }
  beatsCoverages: Coverage[] // Which coverages this play is effective against
}

export interface DefensiveFormation {
  coverage: Coverage
  name: string
  description: string
  strengths: string
  weaknesses: string
  positions: {
    role: string
    position: Position
  }[]
}

export interface SimulationResult {
  outcome: PlayOutcome
  yards: number
  description: string
  isCorrectCall: boolean
}

export interface GameState {
  // Game phase
  phase: GamePhase

  // Current question
  currentQuestion: number
  totalQuestions: number

  // Current scenario
  currentDefense: DefensiveFormation | null
  playOptions: Play[]
  correctPlay: Play | null
  selectedPlay: Play | null

  // Game situation
  down: 1 | 2 | 3 | 4
  yardsToGo: number
  fieldPosition: number // Yard line (0-100)
  timeRemaining: string // "2:00 Q4" etc

  // Score
  score: number
  streak: number
  bestStreak: number

  // Stats
  correctAnswers: number
  totalAnswered: number

  // Simulation
  simulationSpeed: SimulationSpeed
  simulationResult: SimulationResult | null
  simulationProgress: number // 0-100

  // Persisted
  highScore: number
  gamesPlayed: number

  // Actions
  startGame: () => void
  showTutorial: () => void
  skipTutorial: () => void
  selectPlay: (play: Play) => void
  setSimulationSpeed: (speed: SimulationSpeed) => void
  finishSimulation: () => void
  nextQuestion: () => void
  resetGame: () => void
}

// Defensive formations
export const DEFENSIVE_FORMATIONS: DefensiveFormation[] = [
  {
    coverage: 'cover-0',
    name: 'Cover 0 (Blitz)',
    description: 'All-out blitz with no deep safety. Man coverage across the board.',
    strengths: 'Maximum pressure on QB, tight man coverage',
    weaknesses: 'No help over the top - vulnerable to deep routes and quick passes',
    positions: [
      { role: 'CB', position: { x: 15, y: 18 } },
      { role: 'CB', position: { x: 85, y: 18 } },
      { role: 'LB', position: { x: 30, y: 22 } },
      { role: 'LB', position: { x: 50, y: 20 } },
      { role: 'LB', position: { x: 70, y: 22 } },
      { role: 'DL', position: { x: 35, y: 16 } },
      { role: 'DL', position: { x: 50, y: 15 } },
      { role: 'DL', position: { x: 65, y: 16 } },
    ]
  },
  {
    coverage: 'cover-1',
    name: 'Cover 1 (Man Free)',
    description: 'Man coverage with one deep safety in the middle of the field.',
    strengths: 'Tight coverage with deep help, good vs intermediate routes',
    weaknesses: 'Vulnerable to crossing routes and pick plays',
    positions: [
      { role: 'CB', position: { x: 12, y: 20 } },
      { role: 'CB', position: { x: 88, y: 20 } },
      { role: 'S', position: { x: 50, y: 45 } },
      { role: 'LB', position: { x: 35, y: 24 } },
      { role: 'LB', position: { x: 65, y: 24 } },
      { role: 'DL', position: { x: 40, y: 16 } },
      { role: 'DL', position: { x: 60, y: 16 } },
    ]
  },
  {
    coverage: 'cover-2',
    name: 'Cover 2 (Zone)',
    description: 'Two deep safeties split the field. Corners play flat zones.',
    strengths: 'Strong vs deep outside routes, good run support',
    weaknesses: 'Soft middle of field, vulnerable to posts and seams',
    positions: [
      { role: 'CB', position: { x: 10, y: 20 } },
      { role: 'CB', position: { x: 90, y: 20 } },
      { role: 'S', position: { x: 25, y: 40 } },
      { role: 'S', position: { x: 75, y: 40 } },
      { role: 'LB', position: { x: 50, y: 25 } },
      { role: 'DL', position: { x: 40, y: 16 } },
      { role: 'DL', position: { x: 60, y: 16 } },
    ]
  },
  {
    coverage: 'cover-3',
    name: 'Cover 3 (Zone)',
    description: 'Three deep defenders split the field into thirds. Four underneath.',
    strengths: 'Good deep coverage, balanced run/pass defense',
    weaknesses: 'Holes in the flats, vulnerable to curl routes',
    positions: [
      { role: 'CB', position: { x: 15, y: 35 } },
      { role: 'CB', position: { x: 85, y: 35 } },
      { role: 'S', position: { x: 50, y: 42 } },
      { role: 'LB', position: { x: 30, y: 22 } },
      { role: 'LB', position: { x: 50, y: 20 } },
      { role: 'LB', position: { x: 70, y: 22 } },
      { role: 'DL', position: { x: 50, y: 16 } },
    ]
  },
  {
    coverage: 'cover-4',
    name: 'Cover 4 (Quarters)',
    description: 'Four deep defenders each take a quarter of the field.',
    strengths: 'Excellent deep coverage, prevents big plays',
    weaknesses: 'Vulnerable underneath, soft vs run and short passes',
    positions: [
      { role: 'CB', position: { x: 15, y: 32 } },
      { role: 'CB', position: { x: 85, y: 32 } },
      { role: 'S', position: { x: 35, y: 38 } },
      { role: 'S', position: { x: 65, y: 38 } },
      { role: 'LB', position: { x: 40, y: 22 } },
      { role: 'LB', position: { x: 60, y: 22 } },
      { role: 'DL', position: { x: 50, y: 16 } },
    ]
  },
  {
    coverage: 'cover-6',
    name: 'Cover 6 (Quarter-Quarter-Half)',
    description: 'Combination coverage - Cover 4 on one side, Cover 2 on the other.',
    strengths: 'Flexible, good vs trips formations',
    weaknesses: 'Can be exploited by quick reads to weak side',
    positions: [
      { role: 'CB', position: { x: 12, y: 20 } },
      { role: 'CB', position: { x: 85, y: 32 } },
      { role: 'S', position: { x: 30, y: 38 } },
      { role: 'S', position: { x: 70, y: 38 } },
      { role: 'LB', position: { x: 45, y: 22 } },
      { role: 'LB', position: { x: 60, y: 24 } },
      { role: 'DL', position: { x: 50, y: 16 } },
    ]
  },
]

// NFL Teams for theming
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

const TOTAL_QUESTIONS = 10

// Calculate play outcome based on whether play beats coverage
function calculatePlayOutcome(play: Play, defense: DefensiveFormation, isCorrectCall: boolean): SimulationResult {
  const isRun = play.playType === 'run'

  // Base success rates
  let successRate = isCorrectCall ? 0.75 : 0.30
  let bigPlayRate = isCorrectCall ? 0.25 : 0.05
  let turnoverRate = isCorrectCall ? 0.02 : 0.15

  // Adjust for coverage type
  if (defense.coverage === 'cover-0') {
    // Blitz - high risk/reward
    if (isCorrectCall) {
      bigPlayRate += 0.15 // More big plays against blitz
    } else {
      turnoverRate += 0.10 // More turnovers if wrong call
    }
  }

  const roll = Math.random()

  if (isRun) {
    // Run play outcomes
    if (roll < turnoverRate * 0.3) {
      return {
        outcome: 'run-loss',
        yards: -(Math.floor(Math.random() * 3) + 1),
        description: 'Stuffed in the backfield!',
        isCorrectCall,
      }
    }

    if (roll < successRate) {
      const yards = isCorrectCall
        ? (roll < bigPlayRate ? Math.floor(Math.random() * 20) + 10 : Math.floor(Math.random() * 6) + 3)
        : Math.floor(Math.random() * 4) + 1

      const isTD = yards >= 20 && Math.random() < 0.3
      return {
        outcome: isTD ? 'touchdown' : 'run-gain',
        yards: isTD ? 'TD' as any : yards,
        description: isTD ? 'Breaking tackles... TOUCHDOWN!' : `Gains ${yards} yards!`,
        isCorrectCall,
      }
    }

    return {
      outcome: 'run-loss',
      yards: Math.floor(Math.random() * 2),
      description: 'No hole to run through.',
      isCorrectCall,
    }
  }

  // Pass play outcomes
  if (roll < turnoverRate) {
    return {
      outcome: 'interception',
      yards: 0,
      description: 'Picked off! The defender read it all the way.',
      isCorrectCall,
    }
  }

  if (roll < turnoverRate + 0.08) {
    return {
      outcome: 'sack',
      yards: -(Math.floor(Math.random() * 5) + 3),
      description: 'Sacked! The pressure got there.',
      isCorrectCall,
    }
  }

  if (roll < successRate) {
    const yards = isCorrectCall
      ? (roll < bigPlayRate ? Math.floor(Math.random() * 30) + 15 : Math.floor(Math.random() * 12) + 5)
      : Math.floor(Math.random() * 7) + 2

    const isTD = yards >= 25 && Math.random() < 0.35
    return {
      outcome: isTD ? 'touchdown' : 'completion',
      yards: isTD ? 'TD' as any : yards,
      description: isTD ? 'Wide open... TOUCHDOWN!' : `Caught for ${yards} yards!`,
      isCorrectCall,
    }
  }

  return {
    outcome: 'incomplete',
    yards: 0,
    description: isCorrectCall ? 'Just out of reach!' : 'Tight coverage, no chance.',
    isCorrectCall,
  }
}

// Initial state
const initialState = {
  phase: 'menu' as GamePhase,
  currentQuestion: 0,
  totalQuestions: TOTAL_QUESTIONS,
  currentDefense: null,
  playOptions: [],
  correctPlay: null,
  selectedPlay: null,
  down: 1 as const,
  yardsToGo: 10,
  fieldPosition: 25,
  timeRemaining: '12:00 Q1',
  score: 0,
  streak: 0,
  bestStreak: 0,
  correctAnswers: 0,
  totalAnswered: 0,
  simulationSpeed: 'normal' as SimulationSpeed,
  simulationResult: null as SimulationResult | null,
  simulationProgress: 0,
  highScore: 0,
  gamesPlayed: 0,
}

// Load persisted data
function loadPersistedData() {
  if (typeof window === 'undefined') return { highScore: 0, gamesPlayed: 0 }
  try {
    const saved = localStorage.getItem('gridiron-iq-coach-stats')
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
    localStorage.setItem('gridiron-iq-coach-stats', JSON.stringify({ highScore, gamesPlayed }))
  } catch (e) {
    console.error('Failed to save game stats:', e)
  }
}

// Generate a random game situation
function generateSituation() {
  const downs = [1, 2, 3, 4] as const
  const down = downs[Math.floor(Math.random() * 3)] // Mostly 1st-3rd down

  let yardsToGo: number
  if (down === 1) {
    yardsToGo = 10
  } else if (down === 2) {
    yardsToGo = Math.floor(Math.random() * 8) + 3 // 3-10
  } else {
    yardsToGo = Math.floor(Math.random() * 10) + 1 // 1-10
  }

  const fieldPosition = Math.floor(Math.random() * 60) + 20 // 20-80 yard line

  const quarters = ['Q1', 'Q2', 'Q3', 'Q4']
  const quarter = quarters[Math.floor(Math.random() * 4)]
  const minutes = Math.floor(Math.random() * 12) + 1
  const seconds = Math.floor(Math.random() * 60)
  const timeRemaining = `${minutes}:${seconds.toString().padStart(2, '0')} ${quarter}`

  return { down, yardsToGo, fieldPosition, timeRemaining }
}

// Import playbook - we'll use a subset for the quiz
import { PLAYBOOK } from '../data/playbook'

// Get plays that beat a specific coverage
function getPlaysForCoverage(coverage: Coverage): Play[] {
  const coverageMap: { [key in Coverage]: string[] } = {
    'cover-0': ['blitz', 'man'],
    'cover-1': ['man'],
    'cover-2': ['zone'],
    'cover-3': ['zone'],
    'cover-4': ['zone', 'prevent'],
    'cover-6': ['zone'],
  }

  const targetCoverages = coverageMap[coverage]
  return PLAYBOOK.filter(p =>
    p.idealCoverage?.some(c => targetCoverages.includes(c))
  )
}

// Get decoy plays that DON'T beat the coverage
function getDecoyPlays(coverage: Coverage, exclude: Play[]): Play[] {
  const excludeIds = exclude.map(p => p.id)
  return PLAYBOOK.filter(p => !excludeIds.includes(p.id))
}

export const useGameStore = create<GameState>((set, get) => ({
  ...initialState,
  ...loadPersistedData(),

  startGame: () => {
    const situation = generateSituation()
    const defense = DEFENSIVE_FORMATIONS[Math.floor(Math.random() * DEFENSIVE_FORMATIONS.length)]

    // Get plays that beat this coverage
    const goodPlays = getPlaysForCoverage(defense.coverage)
    const correctPlay = goodPlays[Math.floor(Math.random() * goodPlays.length)]

    // Get 3 decoy plays
    const decoys = getDecoyPlays(defense.coverage, [correctPlay])
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)

    // Shuffle all 4 options
    const playOptions = [correctPlay, ...decoys].sort(() => Math.random() - 0.5)

    set({
      phase: 'playing',
      currentQuestion: 1,
      currentDefense: defense,
      playOptions,
      correctPlay,
      selectedPlay: null,
      ...situation,
      score: 0,
      streak: 0,
      correctAnswers: 0,
      totalAnswered: 0,
    })
  },

  showTutorial: () => set({ phase: 'tutorial' }),

  skipTutorial: () => {
    get().startGame()
  },

  selectPlay: (play) => {
    const state = get()
    const isCorrect = play.id === state.correctPlay?.id

    // Calculate play outcome
    const simulationResult = calculatePlayOutcome(play, state.currentDefense!, isCorrect)

    set({
      selectedPlay: play,
      phase: 'simulating',
      simulationResult,
      simulationProgress: 0,
    })
  },

  setSimulationSpeed: (speed) => {
    set({ simulationSpeed: speed })
  },

  finishSimulation: () => {
    const state = get()
    const isCorrect = state.selectedPlay?.id === state.correctPlay?.id

    // Calculate points
    let points = 0
    if (isCorrect) {
      points = 100 + (state.streak * 25) // Bonus for streak
    }

    // Bonus points for touchdowns
    if (state.simulationResult?.outcome === 'touchdown') {
      points += 50
    }

    const newStreak = isCorrect ? state.streak + 1 : 0
    const newBestStreak = Math.max(state.bestStreak, newStreak)

    set({
      phase: 'result',
      score: state.score + points,
      streak: newStreak,
      bestStreak: newBestStreak,
      correctAnswers: state.correctAnswers + (isCorrect ? 1 : 0),
      totalAnswered: state.totalAnswered + 1,
    })
  },

  nextQuestion: () => {
    const state = get()

    // Check if game is over
    if (state.currentQuestion >= state.totalQuestions) {
      // Save high score
      const finalScore = state.score
      if (finalScore > state.highScore) {
        savePersistedData(finalScore, state.gamesPlayed + 1)
        set({
          phase: 'game-over',
          highScore: finalScore,
          gamesPlayed: state.gamesPlayed + 1,
        })
      } else {
        savePersistedData(state.highScore, state.gamesPlayed + 1)
        set({
          phase: 'game-over',
          gamesPlayed: state.gamesPlayed + 1,
        })
      }
      return
    }

    // Generate next question
    const situation = generateSituation()
    const defense = DEFENSIVE_FORMATIONS[Math.floor(Math.random() * DEFENSIVE_FORMATIONS.length)]

    const goodPlays = getPlaysForCoverage(defense.coverage)
    const correctPlay = goodPlays[Math.floor(Math.random() * goodPlays.length)]

    const decoys = getDecoyPlays(defense.coverage, [correctPlay])
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)

    const playOptions = [correctPlay, ...decoys].sort(() => Math.random() - 0.5)

    set({
      phase: 'playing',
      currentQuestion: state.currentQuestion + 1,
      currentDefense: defense,
      playOptions,
      correctPlay,
      selectedPlay: null,
      ...situation,
    })
  },

  resetGame: () => {
    set({
      ...initialState,
      ...loadPersistedData(),
    })
  },
}))
