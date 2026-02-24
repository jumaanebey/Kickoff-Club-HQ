// Educational label data for obstacles — maps obstacle types to football positions/terms
// This file is the canonical data source; ObstacleLabels.ts in the engine references it

export interface ObstacleLabelData {
  label: string
  definition: string
  color: string
  relatedTermId?: string // Links to terminology collection
}

export type ObstacleCategory =
  | 'hurdle'
  | 'defender'
  | 'barrier'
  | 'tackledummy'
  | 'doublehurdle'
  | 'rollingbarrel'
  | 'twolanewall'
  | 'sprintzone'

export const OBSTACLE_LABELS: Record<ObstacleCategory, ObstacleLabelData[]> = {
  defender: [
    { label: 'LINEBACKER', definition: 'Linebackers line up behind the defensive line to stop runs and rush the QB.', color: '#dc2626', relatedTermId: 'linebacker' },
    { label: 'SAFETY', definition: 'Safeties are the last line of defense, playing deep to prevent big plays.', color: '#dc2626', relatedTermId: 'safety' },
    { label: 'CORNERBACK', definition: 'Cornerbacks cover wide receivers and try to intercept passes.', color: '#dc2626', relatedTermId: 'cornerback' },
    { label: 'DEFENSIVE END', definition: 'Defensive ends rush the quarterback from the outside edge.', color: '#dc2626', relatedTermId: 'defensive-end' },
    { label: 'NICKELBACK', definition: 'A nickelback is an extra defensive back added when expecting a pass play.', color: '#dc2626', relatedTermId: 'nickelback' },
    { label: 'DEFENSIVE TACKLE', definition: 'Defensive tackles clog the middle of the line to stop inside runs.', color: '#dc2626', relatedTermId: 'defensive-tackle' },
    { label: 'FREE SAFETY', definition: 'Free safeties roam the deep part of the field reading the quarterback.', color: '#dc2626', relatedTermId: 'free-safety' },
    { label: 'STRONG SAFETY', definition: 'Strong safeties play closer to the line and help stop the run.', color: '#dc2626', relatedTermId: 'strong-safety' },
    { label: 'OUTSIDE LINEBACKER', definition: 'Outside linebackers play on the edge, rushing the passer or covering the flat.', color: '#dc2626', relatedTermId: 'outside-linebacker' },
    { label: 'EDGE RUSHER', definition: 'Edge rushers are hybrid DE/OLBs whose primary job is sacking the QB.', color: '#dc2626', relatedTermId: 'edge-rusher' },
  ],
  barrier: [
    { label: 'OFFENSIVE LINE', definition: 'The offensive line protects the quarterback and creates running lanes.', color: '#f97316', relatedTermId: 'offensive-line' },
    { label: 'BLOCKING SLED', definition: 'Blocking sleds help linemen practice their blocking technique.', color: '#f97316' },
    { label: 'LEFT TACKLE', definition: 'The left tackle protects the QB\'s blind side — one of the most important positions.', color: '#f97316', relatedTermId: 'left-tackle' },
    { label: 'RIGHT GUARD', definition: 'Right guards block on the interior, protecting against inside rushers.', color: '#f97316', relatedTermId: 'right-guard' },
  ],
  hurdle: [
    { label: 'LINE OF SCRIMMAGE', definition: 'The imaginary line where the ball is placed before each play.', color: '#ef4444', relatedTermId: 'line-of-scrimmage' },
    { label: 'NEUTRAL ZONE', definition: 'The space between the offensive and defensive lines at the snap.', color: '#ef4444', relatedTermId: 'neutral-zone' },
    { label: 'HURDLE', definition: 'Hurdling in football means jumping over a defender — risky but exciting!', color: '#ef4444' },
    { label: 'GOAL LINE', definition: 'The goal line marks the front of the end zone — cross it for a touchdown!', color: '#ef4444', relatedTermId: 'goal-line' },
  ],
  tackledummy: [
    { label: 'TACKLE DUMMY', definition: 'Training equipment used to practice tackling form safely.', color: '#2563eb' },
    { label: 'BLOCKING PAD', definition: 'Pads used in practice to simulate contact without injury.', color: '#2563eb' },
    { label: 'PRACTICE SLED', definition: 'Weighted sleds that simulate the resistance of blocking a defender.', color: '#2563eb' },
  ],
  doublehurdle: [
    { label: 'DOUBLE HURDLE', definition: 'Two stacked hurdles requiring a precisely timed high jump.', color: '#ef4444' },
    { label: 'AGILITY DRILL', definition: 'Football players train with agility drills to improve quickness and footwork.', color: '#ef4444' },
  ],
  rollingbarrel: [
    { label: 'BARREL ROLL', definition: 'A moving obstacle that tests your timing and lane awareness.', color: '#a16207' },
    { label: 'FUMBLE DRILL', definition: 'Barrel-like obstacles simulate the chaos of a loose ball on the field.', color: '#a16207', relatedTermId: 'fumble' },
  ],
  twolanewall: [
    { label: 'WALL BLOCK', definition: 'A two-lane wall forces you to find the single open lane quickly.', color: '#f97316' },
    { label: 'POCKET COLLAPSE', definition: 'When the offensive line breaks down, the QB must escape the collapsing pocket.', color: '#f97316', relatedTermId: 'pocket' },
  ],
  sprintzone: [
    { label: 'SPRINT ZONE', definition: 'A narrow corridor that rewards precise lane positioning.', color: '#22c55e' },
    { label: 'SEAM ROUTE', definition: 'A seam route runs between zones in the defense — like threading the needle!', color: '#22c55e', relatedTermId: 'seam-route' },
  ],
}

// Get a random label for an obstacle type
export function getRandomLabel(obstacleType: ObstacleCategory): ObstacleLabelData {
  const labels = OBSTACLE_LABELS[obstacleType]
  return labels[Math.floor(Math.random() * labels.length)]
}
