import { Play, Route } from '../hooks/useGameStore'

// Run gap types for run plays
export type RunGap = 'left-outside' | 'left-guard' | 'center' | 'right-guard' | 'right-outside'

// Route templates - real NFL route tree
const ROUTES: { [key: string]: (startX: number, startY: number) => Route } = {
  // Quick routes (short timing)
  slant: (x, y) => ({
    name: 'Slant',
    points: [
      { x, y },
      { x, y: y + 5 },
      { x: x > 50 ? x - 20 : x + 20, y: y + 15 },
    ],
    timing: 0.4,
  }),

  hitch: (x, y) => ({
    name: 'Hitch',
    points: [
      { x, y },
      { x, y: y + 8 },
      { x, y: y + 6 }, // Come back
    ],
    timing: 0.5,
  }),

  out: (x, y) => ({
    name: 'Out',
    points: [
      { x, y },
      { x, y: y + 10 },
      { x: x > 50 ? x + 15 : x - 15, y: y + 10 },
    ],
    timing: 0.55,
  }),

  flat: (x, y) => ({
    name: 'Flat',
    points: [
      { x, y },
      { x: x > 50 ? x + 20 : x - 20, y: y + 3 },
    ],
    timing: 0.3,
  }),

  // Medium routes
  curl: (x, y) => ({
    name: 'Curl',
    points: [
      { x, y },
      { x, y: y + 12 },
      { x: x > 50 ? x - 5 : x + 5, y: y + 10 },
    ],
    timing: 0.6,
  }),

  dig: (x, y) => ({
    name: 'Dig',
    points: [
      { x, y },
      { x, y: y + 12 },
      { x: x > 50 ? x - 25 : x + 25, y: y + 12 },
    ],
    timing: 0.65,
  }),

  corner: (x, y) => ({
    name: 'Corner',
    points: [
      { x, y },
      { x, y: y + 10 },
      { x: x > 50 ? x + 12 : x - 12, y: y + 20 },
    ],
    timing: 0.7,
  }),

  post: (x, y) => ({
    name: 'Post',
    points: [
      { x, y },
      { x, y: y + 12 },
      { x: 50, y: y + 25 },
    ],
    timing: 0.75,
  }),

  // Deep routes
  go: (x, y) => ({
    name: 'Go/Streak',
    points: [
      { x, y },
      { x, y: y + 15 },
      { x, y: y + 35 },
    ],
    timing: 0.85,
  }),

  seam: (x, y) => ({
    name: 'Seam',
    points: [
      { x, y },
      { x: x > 50 ? x - 5 : x + 5, y: y + 10 },
      { x: x > 50 ? x - 10 : x + 10, y: y + 30 },
    ],
    timing: 0.8,
  }),

  // RB routes
  swing: (x, y) => ({
    name: 'Swing',
    points: [
      { x, y },
      { x: x > 50 ? x + 15 : x - 15, y: y + 2 },
      { x: x > 50 ? x + 25 : x - 25, y: y + 8 },
    ],
    timing: 0.45,
  }),

  wheel: (x, y) => ({
    name: 'Wheel',
    points: [
      { x, y },
      { x: x > 50 ? x + 15 : x - 15, y: y },
      { x: x > 50 ? x + 15 : x - 15, y: y + 25 },
    ],
    timing: 0.75,
  }),

  checkdown: (x, y) => ({
    name: 'Checkdown',
    points: [
      { x, y },
      { x, y: y + 3 },
      { x: x > 50 ? x + 8 : x - 8, y: y + 5 },
    ],
    timing: 0.35,
  }),
}

// Run route for the RB (just shows path)
// Starts from backfield (y: 8), runs through gap, continues upfield
const RB_RUN_ROUTE = (gap: RunGap) => {
  const gapX: { [key: string]: number } = {
    'left-outside': 20,
    'left-guard': 35,
    'center': 50,
    'right-guard': 65,
    'right-outside': 80,
  }
  const targetX = gapX[gap] || 50

  return {
    name: 'Run',
    points: [
      { x: 50, y: 8 },      // Start in backfield
      { x: targetX, y: 20 }, // Hit the gap at LOS
      { x: targetX, y: 40 }, // Continue upfield
    ],
    timing: 0.3,
  }
}

// The Playbook - Real NFL concepts with educational content
export const PLAYBOOK: Play[] = [
  // === RUN PLAYS ===
  {
    id: 'inside-zone',
    name: 'Inside Zone',
    formation: 'shotgun',
    playType: 'run',
    description: 'RB reads the blocks and hits the open hole',
    footballLesson: 'INSIDE ZONE is the most common run play in football. The offensive line blocks in one direction while the RB reads the blocks and cuts to the open hole. It\'s all about patience and vision!',
    routes: {
      RB: RB_RUN_ROUTE('center'),
      WR1: ROUTES.go(10, 14),
      WR2: ROUTES.go(90, 14),
    },
    difficulty: 1,
    idealCoverage: ['zone', 'prevent'],
    runGap: 'center',
  },
  {
    id: 'outside-zone',
    name: 'Outside Zone',
    formation: 'shotgun',
    playType: 'run',
    description: 'Stretch play to the edge',
    footballLesson: 'OUTSIDE ZONE (or "stretch") has the RB running toward the sideline while the line blocks horizontally. The RB looks for a cutback lane if the defense over-pursues. Speed wins here!',
    routes: {
      RB: RB_RUN_ROUTE('right-outside'),
      WR1: ROUTES.hitch(10, 14),
      WR2: ROUTES.go(90, 14),
    },
    difficulty: 1,
    idealCoverage: ['man', 'zone'],
    runGap: 'right-outside',
  },
  {
    id: 'power-run',
    name: 'Power',
    formation: 'i-formation',
    playType: 'run',
    description: 'Downhill run with a pulling guard',
    footballLesson: 'POWER is a gap-scheme run where a guard "pulls" (runs around) to lead block for the RB. It creates a numbers advantage at the point of attack. Physical, downhill football!',
    routes: {
      RB: RB_RUN_ROUTE('right-guard'),
      WR1: ROUTES.go(10, 14),
      WR2: ROUTES.go(90, 14),
    },
    difficulty: 2,
    idealCoverage: ['blitz', 'man'],
    runGap: 'right-guard',
  },
  {
    id: 'counter',
    name: 'Counter',
    formation: 'shotgun',
    playType: 'run',
    description: 'Misdirection run to fool the defense',
    footballLesson: 'COUNTER fakes one direction then runs the other way. Two pulling linemen lead the way. The misdirection freezes linebackers and creates big play potential!',
    routes: {
      RB: RB_RUN_ROUTE('left-guard'),
      WR1: ROUTES.slant(10, 14),
      WR2: ROUTES.go(90, 14),
    },
    difficulty: 2,
    idealCoverage: ['man', 'zone'],
    runGap: 'left-guard',
  },
  {
    id: 'draw',
    name: 'Draw Play',
    formation: 'shotgun',
    playType: 'run',
    description: 'Fake pass, hand off to RB',
    footballLesson: 'DRAW plays fake a pass to pull defenders upfield, then hand off. It\'s deadly against aggressive pass rushers. The key is patience - let the defense commit first!',
    routes: {
      RB: RB_RUN_ROUTE('center'),
      WR1: ROUTES.go(10, 14),
      WR2: ROUTES.go(90, 14),
      TE: ROUTES.seam(65, 14),
    },
    difficulty: 2,
    idealCoverage: ['blitz', 'prevent'],
    runGap: 'center',
  },
  {
    id: 'toss-sweep',
    name: 'Toss Sweep',
    formation: 'singleback',
    playType: 'run',
    description: 'Pitch to RB running wide',
    footballLesson: 'TOSS SWEEP gets the ball to the edge fast. The QB pitches to the RB who runs toward the sideline with blockers in front. It\'s all about speed and turning the corner!',
    routes: {
      RB: RB_RUN_ROUTE('left-outside'),
      WR1: ROUTES.hitch(10, 14),
      WR2: ROUTES.go(90, 14),
    },
    difficulty: 1,
    idealCoverage: ['zone', 'prevent'],
    runGap: 'left-outside',
  },

  // === PASS PLAYS - BEGINNER (Difficulty 1) ===
  {
    id: 'slants',
    name: 'Double Slants',
    formation: 'shotgun',
    playType: 'pass',
    description: 'Quick passes to receivers cutting across the middle',
    footballLesson: 'SLANT ROUTES are quick diagonal cuts toward the middle of the field. They\'re great against man coverage because the receiver can use their body to shield the defender.',
    routes: {
      WR1: ROUTES.slant(10, 14),
      WR2: ROUTES.slant(90, 14),
      TE: ROUTES.flat(65, 14),
      RB: ROUTES.checkdown(45, 8),
    },
    difficulty: 1,
    idealCoverage: ['man', 'blitz'],
  },
  {
    id: 'quick-out',
    name: 'Quick Out',
    formation: 'shotgun',
    playType: 'pass',
    description: 'Fast throw to the sideline',
    footballLesson: 'OUT ROUTES break toward the sideline. The QB throws before the receiver turns - this is called "throwing with anticipation." It\'s the key to NFL timing!',
    routes: {
      WR1: ROUTES.out(10, 14),
      WR2: ROUTES.hitch(90, 14),
      TE: ROUTES.curl(65, 14),
      RB: ROUTES.swing(45, 8),
    },
    difficulty: 1,
    idealCoverage: ['zone'],
  },
  {
    id: 'hitch-screen',
    name: 'Hitch & Screen',
    formation: 'spread',
    playType: 'pass',
    description: 'Short passes with yards after catch potential',
    footballLesson: 'A HITCH route is a quick stop-and-turn. The receiver catches it and immediately looks upfield. SCREENS get the ball to playmakers in space with blockers ahead.',
    routes: {
      WR1: ROUTES.hitch(5, 14),
      WR2: ROUTES.hitch(95, 14),
      WR3: ROUTES.flat(25, 14),
      RB: ROUTES.swing(50, 8),
    },
    difficulty: 1,
    idealCoverage: ['blitz', 'man'],
  },

  // === INTERMEDIATE PLAYS (Difficulty 2) ===
  {
    id: 'curl-flat',
    name: 'Curl-Flat Combo',
    formation: 'singleback',
    playType: 'pass',
    description: 'High-low concept to stress zone defense',
    footballLesson: 'CURL-FLAT is a "high-low" concept. The curl sits behind the linebacker while the flat runs underneath. If the LB drops back, throw the flat. If he stays shallow, throw the curl!',
    routes: {
      WR1: ROUTES.curl(15, 14),
      WR2: ROUTES.go(85, 14),
      TE: ROUTES.flat(65, 14),
      RB: ROUTES.checkdown(50, 8),
    },
    difficulty: 2,
    idealCoverage: ['zone'],
  },
  {
    id: 'smash',
    name: 'Smash Concept',
    formation: 'shotgun',
    playType: 'pass',
    description: 'Corner route with a hitch underneath',
    footballLesson: 'SMASH combines a corner route with a hitch. The corner goes deep to the sideline while the hitch sits short. Read the cornerback - if he sinks with the corner, throw the hitch!',
    routes: {
      WR1: ROUTES.hitch(10, 14),
      WR2: ROUTES.corner(90, 14),
      TE: ROUTES.dig(65, 14),
      RB: ROUTES.swing(45, 8),
    },
    difficulty: 2,
    idealCoverage: ['zone', 'man'],
  },
  {
    id: 'mesh',
    name: 'Mesh Concept',
    formation: 'spread',
    playType: 'pass',
    description: 'Crossing routes that create picks',
    footballLesson: 'MESH has two receivers cross each other at 5-6 yards. In man coverage, this creates natural "picks" as defenders collide. It\'s one of the most effective plays against man-to-man!',
    routes: {
      WR1: ROUTES.dig(5, 14),
      WR2: ROUTES.dig(95, 14),
      WR3: ROUTES.corner(25, 14),
      RB: ROUTES.flat(50, 8),
    },
    difficulty: 2,
    idealCoverage: ['man'],
  },
  {
    id: 'levels',
    name: 'Levels Concept',
    formation: 'shotgun',
    playType: 'pass',
    description: 'Three receivers at different depths',
    footballLesson: 'LEVELS puts receivers at three different depths - short, medium, and deep on the same side. This "floods" a zone and guarantees someone is open. Read high to low!',
    routes: {
      WR1: ROUTES.dig(10, 14),
      WR2: ROUTES.go(90, 14),
      TE: ROUTES.curl(65, 14),
      RB: ROUTES.flat(45, 8),
    },
    difficulty: 2,
    idealCoverage: ['zone'],
  },

  // === ADVANCED PLAYS (Difficulty 3) ===
  {
    id: 'four-verticals',
    name: 'Four Verticals',
    formation: 'spread',
    playType: 'pass',
    description: 'Send everyone deep',
    footballLesson: 'FOUR VERTICALS sends 4 receivers deep down the field. The key is reading the safeties - if they split wide, throw the seams. If they stay middle, hit the outside receivers!',
    routes: {
      WR1: ROUTES.go(5, 14),
      WR2: ROUTES.go(95, 14),
      WR3: ROUTES.seam(25, 14),
      TE: ROUTES.seam(75, 14),
      RB: ROUTES.checkdown(50, 8),
    },
    difficulty: 3,
    idealCoverage: ['man', 'blitz'],
  },
  {
    id: 'post-wheel',
    name: 'Post-Wheel',
    formation: 'shotgun',
    playType: 'pass',
    description: 'Attack the deep middle and sideline',
    footballLesson: 'POST-WHEEL attacks Cover 2 defense. The post draws the safety to the middle, opening up the wheel route on the sideline. It\'s a TD play when you read it right!',
    routes: {
      WR1: ROUTES.post(10, 14),
      WR2: ROUTES.go(90, 14),
      TE: ROUTES.curl(65, 14),
      RB: ROUTES.wheel(45, 8),
    },
    difficulty: 3,
    idealCoverage: ['zone'],
  },
  {
    id: 'pa-deep-cross',
    name: 'PA Deep Cross',
    formation: 'i-formation',
    playType: 'pass',
    description: 'Play-action with crossing routes',
    footballLesson: 'PLAY-ACTION fakes the run to freeze linebackers. The deep cross (a "dig" or "drive" route) comes open when the LBs bite on the fake. Timing is everything!',
    routes: {
      WR1: ROUTES.post(10, 14),
      WR2: ROUTES.dig(90, 14),
      TE: ROUTES.seam(70, 14),
      RB: ROUTES.flat(50, 6),
    },
    difficulty: 3,
    idealCoverage: ['zone', 'man'],
  },
  {
    id: 'dagger',
    name: 'Dagger Concept',
    formation: 'shotgun',
    playType: 'pass',
    description: 'Seam route with dig underneath',
    footballLesson: 'DAGGER is deadly against Cover 2. The seam (or "post-seam") holds the safety while the dig comes underneath. If the safety bites on the dig, the seam is a touchdown!',
    routes: {
      WR1: ROUTES.go(10, 14),
      WR2: ROUTES.seam(90, 14),
      WR3: ROUTES.dig(75, 14),
      RB: ROUTES.swing(45, 8),
    },
    difficulty: 3,
    idealCoverage: ['zone'],
  },
]

// Get plays by difficulty
export function getPlaysByDifficulty(difficulty: 1 | 2 | 3): Play[] {
  return PLAYBOOK.filter(p => p.difficulty === difficulty)
}

// Get random plays for selection (mix of difficulties based on game state)
export function getPlaySelection(quarter: number, down: number, yardsToGo: number): Play[] {
  // More advanced plays become available as game progresses
  const maxDifficulty = quarter >= 3 ? 3 : quarter >= 2 ? 2 : 1

  // Long yardage = more deep plays
  const needsDeep = yardsToGo > 10

  const available = PLAYBOOK.filter(p => {
    if (p.difficulty > maxDifficulty) return false
    if (needsDeep && p.difficulty === 1) return false // Need better plays for long yardage
    return true
  })

  // Shuffle and return 4 plays
  const shuffled = [...available].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 4)
}

// Get play that beats a specific coverage
export function getIdealPlay(coverage: string): Play | null {
  const matching = PLAYBOOK.filter(p => p.idealCoverage.includes(coverage as any))
  if (matching.length === 0) return null
  return matching[Math.floor(Math.random() * matching.length)]
}
