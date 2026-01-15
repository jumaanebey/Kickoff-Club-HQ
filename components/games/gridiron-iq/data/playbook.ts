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

  // Additional routes
  stick: (x, y) => ({
    name: 'Stick',
    points: [
      { x, y },
      { x, y: y + 6 },
      { x: x > 50 ? x - 3 : x + 3, y: y + 6 },
    ],
    timing: 0.4,
  }),

  angle: (x, y) => ({
    name: 'Angle',
    points: [
      { x, y },
      { x: x > 50 ? x + 5 : x - 5, y: y + 2 },
      { x: x > 50 ? x - 10 : x + 10, y: y + 12 },
    ],
    timing: 0.55,
  }),

  comeback: (x, y) => ({
    name: 'Comeback',
    points: [
      { x, y },
      { x, y: y + 15 },
      { x, y: y + 12 },
    ],
    timing: 0.7,
  }),

  skinny: (x, y) => ({
    name: 'Skinny Post',
    points: [
      { x, y },
      { x, y: y + 10 },
      { x: x > 50 ? x - 8 : x + 8, y: y + 22 },
    ],
    timing: 0.7,
  }),

  sail: (x, y) => ({
    name: 'Sail',
    points: [
      { x, y },
      { x, y: y + 8 },
      { x: x > 50 ? x + 10 : x - 10, y: y + 18 },
    ],
    timing: 0.65,
  }),

  drive: (x, y) => ({
    name: 'Drive',
    points: [
      { x, y },
      { x, y: y + 5 },
      { x: x > 50 ? x - 15 : x + 15, y: y + 8 },
    ],
    timing: 0.5,
  }),

  option: (x, y) => ({
    name: 'Option',
    points: [
      { x, y },
      { x, y: y + 8 },
      { x: x > 50 ? x - 8 : x + 8, y: y + 10 },
    ],
    timing: 0.55,
  }),

  texas: (x, y) => ({
    name: 'Texas',
    points: [
      { x, y },
      { x: x > 50 ? x + 12 : x - 12, y: y },
      { x: x > 50 ? x + 5 : x - 5, y: y + 15 },
    ],
    timing: 0.6,
  }),

  sluggo: (x, y) => ({
    name: 'Sluggo',
    points: [
      { x, y },
      { x: x > 50 ? x - 5 : x + 5, y: y + 5 },
      { x, y: y + 8 },
      { x, y: y + 25 },
    ],
    timing: 0.75,
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
  {
    id: 'hb-dive',
    name: 'HB Dive',
    formation: 'i-formation',
    playType: 'run',
    description: 'Straight ahead power run',
    footballLesson: 'HB DIVE is the simplest run in football - just run straight ahead! It\'s great for short yardage when you need 1-2 yards. The fullback leads and the RB follows.',
    routes: {
      RB: RB_RUN_ROUTE('center'),
      WR1: ROUTES.go(10, 14),
      WR2: ROUTES.go(90, 14),
    },
    difficulty: 1,
    idealCoverage: ['prevent', 'zone'],
    runGap: 'center',
  },
  {
    id: 'jet-sweep',
    name: 'Jet Sweep',
    formation: 'spread',
    playType: 'run',
    description: 'WR motion into handoff',
    footballLesson: 'JET SWEEP uses pre-snap motion to get a fast WR the ball running full speed. The motion freezes the defense - they don\'t know if it\'s run or pass until it\'s too late!',
    routes: {
      RB: RB_RUN_ROUTE('left-outside'),
      WR1: ROUTES.flat(5, 14),
      WR2: ROUTES.go(95, 14),
      WR3: ROUTES.go(25, 14),
    },
    difficulty: 2,
    idealCoverage: ['zone', 'man'],
    runGap: 'left-outside',
  },
  {
    id: 'stretch-left',
    name: 'Stretch Left',
    formation: 'shotgun',
    playType: 'run',
    description: 'Outside zone to the left',
    footballLesson: 'STRETCH plays test the defense\'s discipline. If they over-pursue, cut back. If they stay home, bounce it outside. Reading the backside is key!',
    routes: {
      RB: RB_RUN_ROUTE('left-outside'),
      WR1: ROUTES.go(10, 14),
      WR2: ROUTES.hitch(90, 14),
    },
    difficulty: 1,
    idealCoverage: ['man', 'blitz'],
    runGap: 'left-outside',
  },
  {
    id: 'trap',
    name: 'Trap Play',
    formation: 'i-formation',
    playType: 'run',
    description: 'Let defender through, then trap block',
    footballLesson: 'TRAP plays let a defender into the backfield on purpose, then blindside block him! It punishes aggressive defenders and opens big holes.',
    routes: {
      RB: RB_RUN_ROUTE('right-guard'),
      WR1: ROUTES.go(10, 14),
      WR2: ROUTES.go(90, 14),
    },
    difficulty: 2,
    idealCoverage: ['blitz', 'man'],
    runGap: 'right-guard',
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
  {
    id: 'stick',
    name: 'Stick Concept',
    formation: 'shotgun',
    playType: 'pass',
    description: 'Quick TE stick with flat underneath',
    footballLesson: 'STICK is a 3-level concept. The TE runs 6 yards and stops (sticks), the flat goes underneath, and a go route clears out deep. Simple but effective!',
    routes: {
      WR1: ROUTES.go(10, 14),
      WR2: ROUTES.flat(90, 14),
      TE: ROUTES.stick(65, 14),
      RB: ROUTES.checkdown(45, 8),
    },
    difficulty: 1,
    idealCoverage: ['zone', 'man'],
  },
  {
    id: 'bench',
    name: 'Bench Route',
    formation: 'spread',
    playType: 'pass',
    description: 'Sideline route between zones',
    footballLesson: 'BENCH routes sit in the dead spot between the corner and safety in Cover 2. The receiver runs to the sideline and sits - easy throw, easy catch!',
    routes: {
      WR1: ROUTES.out(5, 14),
      WR2: ROUTES.out(95, 14),
      WR3: ROUTES.slant(25, 14),
      RB: ROUTES.flat(50, 8),
    },
    difficulty: 1,
    idealCoverage: ['zone'],
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
  {
    id: 'texas',
    name: 'Texas Concept',
    formation: 'shotgun',
    playType: 'pass',
    description: 'RB angle route with go route clear-out',
    footballLesson: 'TEXAS features the RB running an angle route - out to the flat, then cutting upfield. It\'s deadly in the red zone because linebackers lose the RB in traffic!',
    routes: {
      WR1: ROUTES.go(10, 14),
      WR2: ROUTES.corner(90, 14),
      TE: ROUTES.flat(65, 14),
      RB: ROUTES.texas(45, 8),
    },
    difficulty: 2,
    idealCoverage: ['zone', 'man'],
  },
  {
    id: 'sail',
    name: 'Sail Concept',
    formation: 'singleback',
    playType: 'pass',
    description: 'Deep corner with flat underneath',
    footballLesson: 'SAIL stretches the defense vertically with a corner route, flat, and checkdown. The corner takes the top off while the flat gets underneath. Classic 3-level read!',
    routes: {
      WR1: ROUTES.sail(15, 14),
      WR2: ROUTES.go(85, 14),
      TE: ROUTES.flat(65, 14),
      RB: ROUTES.angle(50, 8),
    },
    difficulty: 2,
    idealCoverage: ['zone'],
  },
  {
    id: 'drive',
    name: 'Drive Concept',
    formation: 'spread',
    playType: 'pass',
    description: 'Quick crossing routes underneath',
    footballLesson: 'DRIVE has shallow crossing routes going opposite directions. It creates traffic for man coverage defenders and finds soft spots in zone. Quick rhythm throw!',
    routes: {
      WR1: ROUTES.drive(5, 14),
      WR2: ROUTES.drive(95, 14),
      WR3: ROUTES.go(25, 14),
      RB: ROUTES.flat(50, 8),
    },
    difficulty: 2,
    idealCoverage: ['man', 'blitz'],
  },
  {
    id: 'spacing',
    name: 'Spacing Concept',
    formation: 'spread',
    playType: 'pass',
    description: '5 receivers spread across the field',
    footballLesson: 'SPACING puts 5 receivers at different spots across the field at the same depth. The defense can\'t cover everyone - someone is always open!',
    routes: {
      WR1: ROUTES.hitch(5, 14),
      WR2: ROUTES.hitch(95, 14),
      WR3: ROUTES.stick(30, 14),
      TE: ROUTES.stick(70, 14),
      RB: ROUTES.flat(50, 8),
    },
    difficulty: 2,
    idealCoverage: ['man', 'zone'],
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
  {
    id: 'double-post',
    name: 'Double Post',
    formation: 'spread',
    playType: 'pass',
    description: 'Two post routes attack the safeties',
    footballLesson: 'DOUBLE POST puts two receivers on post routes, forcing both safeties to make a choice. If they both go to one post, the other is WIDE open for a TD!',
    routes: {
      WR1: ROUTES.post(10, 14),
      WR2: ROUTES.post(90, 14),
      WR3: ROUTES.dig(25, 14),
      TE: ROUTES.flat(75, 14),
      RB: ROUTES.checkdown(50, 8),
    },
    difficulty: 3,
    idealCoverage: ['man', 'zone'],
  },
  {
    id: 'flood',
    name: 'Flood Right',
    formation: 'shotgun',
    playType: 'pass',
    description: 'Three routes to one side of the field',
    footballLesson: 'FLOOD overloads one side of the field with 3 receivers at different depths. Zone defenses can\'t cover all three - read the defender and throw to the open man!',
    routes: {
      WR1: ROUTES.go(10, 14),
      WR2: ROUTES.corner(90, 14),
      TE: ROUTES.curl(70, 14),
      RB: ROUTES.flat(60, 8),
    },
    difficulty: 3,
    idealCoverage: ['zone'],
  },
  {
    id: 'yankee',
    name: 'Yankee Concept',
    formation: 'shotgun',
    playType: 'pass',
    description: 'Deep crossing routes',
    footballLesson: 'YANKEE features deep crossing routes that test the secondary. Against man, the crosses create natural picks. Against zone, find the soft spots!',
    routes: {
      WR1: ROUTES.post(10, 14),
      WR2: ROUTES.dig(90, 14),
      TE: ROUTES.seam(65, 14),
      RB: ROUTES.wheel(45, 8),
    },
    difficulty: 3,
    idealCoverage: ['man', 'zone'],
  },
  {
    id: 'sluggo-seam',
    name: 'Sluggo Seam',
    formation: 'singleback',
    playType: 'pass',
    description: 'Slant-and-go with seam option',
    footballLesson: 'SLUGGO (slant-and-go) fakes a slant then goes deep. The defender bites on the slant fake and gets beat deep. Patience and selling the fake is everything!',
    routes: {
      WR1: ROUTES.sluggo(15, 14),
      WR2: ROUTES.go(85, 14),
      TE: ROUTES.seam(65, 14),
      RB: ROUTES.flat(50, 8),
    },
    difficulty: 3,
    idealCoverage: ['man'],
  },
  {
    id: 'china',
    name: 'China Concept',
    formation: 'spread',
    playType: 'pass',
    description: 'Deep comeback with underneath options',
    footballLesson: 'CHINA features a deep comeback route that sits at 15 yards. The receiver stems deep, then snaps back. It\'s hard to defend because the ball arrives as he turns!',
    routes: {
      WR1: ROUTES.comeback(5, 14),
      WR2: ROUTES.comeback(95, 14),
      WR3: ROUTES.slant(25, 14),
      RB: ROUTES.angle(50, 8),
    },
    difficulty: 3,
    idealCoverage: ['man', 'zone'],
  },
  {
    id: 'y-cross',
    name: 'Y-Cross',
    formation: 'singleback',
    playType: 'pass',
    description: 'TE crosses the entire field',
    footballLesson: 'Y-CROSS has the tight end run across the entire field. Play-action freezes linebackers, and the TE finds open grass in the middle. A Mahomes favorite!',
    routes: {
      WR1: ROUTES.go(10, 14),
      WR2: ROUTES.go(90, 14),
      TE: ROUTES.dig(30, 14),
      RB: ROUTES.flat(50, 8),
    },
    difficulty: 3,
    idealCoverage: ['zone', 'blitz'],
  },
  {
    id: 'hail-mary',
    name: 'Hail Mary',
    formation: 'spread',
    playType: 'pass',
    description: 'Desperation deep throw',
    footballLesson: 'HAIL MARY is the ultimate desperation play. Everyone goes deep to the end zone, and you throw it up and pray! Used at the end of halves when you need a miracle.',
    routes: {
      WR1: ROUTES.go(15, 14),
      WR2: ROUTES.go(85, 14),
      WR3: ROUTES.go(35, 14),
      TE: ROUTES.go(65, 14),
      RB: ROUTES.go(50, 8),
    },
    difficulty: 3,
    idealCoverage: ['man', 'blitz'],
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
