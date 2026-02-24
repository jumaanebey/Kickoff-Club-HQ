// 100+ football terms for the terminology collection feature
// Players discover terms by encountering labels in-game, answering trivia, or viewing definitions

export type TermCategory = 'positions' | 'rules' | 'terminology' | 'strategy' | 'history'
export type TermDifficulty = 'rookie' | 'starter' | 'pro' | 'all-pro'

export interface FootballTerm {
  id: string
  term: string
  definition: string
  category: TermCategory
  difficulty: TermDifficulty
}

export const FOOTBALL_TERMS: FootballTerm[] = [
  // ═══════════════════════════════════════════════════════════════
  // POSITIONS (30 terms)
  // ═══════════════════════════════════════════════════════════════
  { id: 'quarterback', term: 'Quarterback (QB)', definition: 'The leader of the offense who throws passes, hands off the ball, and calls plays at the line of scrimmage.', category: 'positions', difficulty: 'rookie' },
  { id: 'running-back', term: 'Running Back (RB)', definition: 'An offensive player who carries the ball on running plays and catches short passes out of the backfield.', category: 'positions', difficulty: 'rookie' },
  { id: 'wide-receiver', term: 'Wide Receiver (WR)', definition: 'An offensive player who lines up wide and runs routes to catch passes from the quarterback.', category: 'positions', difficulty: 'rookie' },
  { id: 'tight-end', term: 'Tight End (TE)', definition: 'A versatile offensive player who lines up on the line of scrimmage, both blocking and catching passes.', category: 'positions', difficulty: 'rookie' },
  { id: 'center', term: 'Center (C)', definition: 'The offensive lineman who snaps the ball to the quarterback and calls blocking assignments for the line.', category: 'positions', difficulty: 'rookie' },
  { id: 'offensive-line', term: 'Offensive Line (OL)', definition: 'The five players (C, LG, RG, LT, RT) who protect the quarterback and open running lanes.', category: 'positions', difficulty: 'rookie' },
  { id: 'kicker', term: 'Kicker (K)', definition: 'The specialist who kicks field goals, extra points, and kickoffs.', category: 'positions', difficulty: 'rookie' },
  { id: 'linebacker', term: 'Linebacker (LB)', definition: 'A defensive player who lines up behind the defensive line, stopping runs, rushing the QB, and covering receivers.', category: 'positions', difficulty: 'starter' },
  { id: 'cornerback', term: 'Cornerback (CB)', definition: 'A defensive back who covers wide receivers one-on-one and tries to intercept passes.', category: 'positions', difficulty: 'starter' },
  { id: 'safety', term: 'Safety (S)', definition: 'A defensive back who plays deep, serving as the last line of defense against big plays.', category: 'positions', difficulty: 'starter' },
  { id: 'defensive-end', term: 'Defensive End (DE)', definition: 'A defensive lineman who lines up at the edge and rushes the quarterback from the outside.', category: 'positions', difficulty: 'starter' },
  { id: 'defensive-tackle', term: 'Defensive Tackle (DT)', definition: 'A defensive lineman who lines up in the interior to stop inside runs and push the pocket.', category: 'positions', difficulty: 'starter' },
  { id: 'fullback', term: 'Fullback (FB)', definition: 'A powerful offensive player who primarily blocks for the running back and occasionally carries the ball.', category: 'positions', difficulty: 'starter' },
  { id: 'punter', term: 'Punter (P)', definition: 'The specialist who kicks (punts) the ball to the opposing team, usually on 4th down.', category: 'positions', difficulty: 'starter' },
  { id: 'free-safety', term: 'Free Safety (FS)', definition: 'A safety who roams the deep part of the field reading the quarterback and reacting to plays.', category: 'positions', difficulty: 'pro' },
  { id: 'strong-safety', term: 'Strong Safety (SS)', definition: 'A safety who lines up on the strong side (tight end side) and plays closer to the line of scrimmage.', category: 'positions', difficulty: 'pro' },
  { id: 'nickelback', term: 'Nickelback (NB)', definition: 'A 5th defensive back added in passing situations, named because a nickel is the 5th coin.', category: 'positions', difficulty: 'pro' },
  { id: 'slot-receiver', term: 'Slot Receiver', definition: 'A receiver who lines up between the outside WR and the offensive line, often running shorter routes.', category: 'positions', difficulty: 'pro' },
  { id: 'nose-tackle', term: 'Nose Tackle (NT)', definition: 'A large defensive tackle who lines up directly over the center in a 3-4 defense.', category: 'positions', difficulty: 'pro' },
  { id: 'left-tackle', term: 'Left Tackle (LT)', definition: 'The offensive lineman who protects the QB\'s blind side — one of the most valuable positions.', category: 'positions', difficulty: 'pro' },
  { id: 'right-guard', term: 'Right Guard (RG)', definition: 'An interior offensive lineman who blocks on the right side of the center.', category: 'positions', difficulty: 'pro' },
  { id: 'long-snapper', term: 'Long Snapper (LS)', definition: 'A specialist who accurately snaps the ball on punts and field goal attempts.', category: 'positions', difficulty: 'starter' },
  { id: 'kick-returner', term: 'Kick Returner (KR)', definition: 'A player who catches and returns kickoffs, trying to gain maximum field position.', category: 'positions', difficulty: 'starter' },
  { id: 'outside-linebacker', term: 'Outside Linebacker (OLB)', definition: 'A linebacker who plays on the edge, responsible for rushing the passer and covering the flat.', category: 'positions', difficulty: 'pro' },
  { id: 'mike-linebacker', term: 'MIKE Linebacker', definition: 'The middle linebacker who calls defensive plays and identifies the offense\'s blocking schemes.', category: 'positions', difficulty: 'all-pro' },
  { id: 'edge-rusher', term: 'EDGE Rusher', definition: 'A hybrid DE/OLB whose primary responsibility is getting to the quarterback.', category: 'positions', difficulty: 'all-pro' },
  { id: 'gunner', term: 'Gunner', definition: 'A special teams player who sprints downfield on punts to tackle the return man.', category: 'positions', difficulty: 'all-pro' },
  { id: 'holder', term: 'Holder', definition: 'The player who catches the snap and holds the ball in place for field goals and extra points.', category: 'positions', difficulty: 'pro' },
  { id: 'return-specialist', term: 'Return Specialist', definition: 'A fast player who specializes in returning kickoffs and punts for maximum yardage.', category: 'positions', difficulty: 'starter' },
  { id: 'dime-back', term: 'Dime Back', definition: 'A 6th defensive back added in obvious passing situations — named because a dime is worth more than a nickel.', category: 'positions', difficulty: 'all-pro' },

  // ═══════════════════════════════════════════════════════════════
  // RULES (20 terms)
  // ═══════════════════════════════════════════════════════════════
  { id: 'touchdown', term: 'Touchdown (TD)', definition: 'Worth 6 points, scored when a player carries or catches the ball in the opponent\'s end zone.', category: 'rules', difficulty: 'rookie' },
  { id: 'field-goal', term: 'Field Goal (FG)', definition: 'Worth 3 points, scored by kicking the ball through the goalposts from a placekick.', category: 'rules', difficulty: 'rookie' },
  { id: 'first-down', term: 'First Down', definition: 'Earned when the offense advances 10+ yards, giving them a fresh set of 4 downs.', category: 'rules', difficulty: 'rookie' },
  { id: 'safety-score', term: 'Safety (Score)', definition: 'Worth 2 points for the defense, scored when the ball carrier is tackled in their own end zone.', category: 'rules', difficulty: 'starter' },
  { id: 'two-point-conversion', term: 'Two-Point Conversion', definition: 'After a touchdown, the offense can try to score 2 extra points by running or passing into the end zone.', category: 'rules', difficulty: 'starter' },
  { id: 'extra-point', term: 'Extra Point (PAT)', definition: 'A kick after a touchdown worth 1 point, taken from the 15-yard line.', category: 'rules', difficulty: 'rookie' },
  { id: 'pass-interference', term: 'Pass Interference (PI)', definition: 'A penalty for illegally contacting a receiver while the ball is in the air.', category: 'rules', difficulty: 'starter' },
  { id: 'false-start', term: 'False Start', definition: 'A 5-yard penalty when an offensive player moves before the ball is snapped.', category: 'rules', difficulty: 'starter' },
  { id: 'holding', term: 'Holding', definition: 'A penalty for illegally grabbing an opponent — 10 yards on offense, 5 yards on defense.', category: 'rules', difficulty: 'starter' },
  { id: 'offsides', term: 'Offsides', definition: 'A penalty when a player crosses the line of scrimmage before the ball is snapped.', category: 'rules', difficulty: 'starter' },
  { id: 'intentional-grounding', term: 'Intentional Grounding', definition: 'A penalty when the QB intentionally throws the ball away with no eligible receiver nearby to avoid a sack.', category: 'rules', difficulty: 'pro' },
  { id: 'roughing-the-passer', term: 'Roughing the Passer', definition: 'A 15-yard penalty for hitting the quarterback late or excessively after they release the ball.', category: 'rules', difficulty: 'pro' },
  { id: 'encroachment', term: 'Encroachment', definition: 'When a defensive player crosses the line and contacts an offensive player before the snap.', category: 'rules', difficulty: 'pro' },
  { id: 'touchback', term: 'Touchback', definition: 'When a kick goes into the end zone and is not returned — ball placed at the 25-yard line.', category: 'rules', difficulty: 'pro' },
  { id: 'turnover-on-downs', term: 'Turnover on Downs', definition: 'When the offense fails to gain enough yards in 4 downs, giving the ball to the other team.', category: 'rules', difficulty: 'starter' },
  { id: 'horse-collar', term: 'Horse-Collar Tackle', definition: 'An illegal tackle where a defender grabs the inside collar of the shoulder pads — 15-yard penalty.', category: 'rules', difficulty: 'all-pro' },
  { id: 'illegal-formation', term: 'Illegal Formation', definition: 'A penalty when the offense doesn\'t have at least 7 players on the line of scrimmage at the snap.', category: 'rules', difficulty: 'all-pro' },
  { id: 'fair-catch', term: 'Fair Catch', definition: 'A signal (waving one arm) that the returner won\'t run, granting them protection from being tackled.', category: 'rules', difficulty: 'starter' },
  { id: 'delay-of-game', term: 'Delay of Game', definition: 'A 5-yard penalty when the offense doesn\'t snap the ball before the play clock expires (40 seconds).', category: 'rules', difficulty: 'starter' },
  { id: 'facemask', term: 'Facemask', definition: 'A 15-yard penalty for grabbing an opponent\'s facemask — a dangerous and illegal action.', category: 'rules', difficulty: 'starter' },

  // ═══════════════════════════════════════════════════════════════
  // TERMINOLOGY (30 terms)
  // ═══════════════════════════════════════════════════════════════
  { id: 'interception', term: 'Interception (INT)', definition: 'When a defensive player catches a pass intended for the offense — a turnover!', category: 'terminology', difficulty: 'rookie' },
  { id: 'fumble', term: 'Fumble', definition: 'When a player loses possession of the ball while running or being tackled. Either team can recover it.', category: 'terminology', difficulty: 'rookie' },
  { id: 'sack', term: 'Sack', definition: 'When the quarterback is tackled behind the line of scrimmage before they can throw the ball.', category: 'terminology', difficulty: 'rookie' },
  { id: 'end-zone', term: 'End Zone', definition: 'The 10-yard scoring area at each end of the field. Get the ball here for a touchdown!', category: 'terminology', difficulty: 'rookie' },
  { id: 'huddle', term: 'Huddle', definition: 'When players gather in a circle to discuss and plan the next play before lining up.', category: 'terminology', difficulty: 'rookie' },
  { id: 'snap', term: 'Snap', definition: 'The center passes the ball between their legs to the quarterback to start every play.', category: 'terminology', difficulty: 'rookie' },
  { id: 'punt', term: 'Punt', definition: 'A kick on 4th down where the kicking team gives up the ball to push the opponent back.', category: 'terminology', difficulty: 'rookie' },
  { id: 'goalposts', term: 'Goalposts', definition: 'The Y-shaped yellow structure at each end of the field used for field goals and extra points.', category: 'terminology', difficulty: 'rookie' },
  { id: 'blitz', term: 'Blitz', definition: 'When extra defenders rush the quarterback instead of dropping into coverage — high risk, high reward!', category: 'terminology', difficulty: 'starter' },
  { id: 'red-zone', term: 'Red Zone', definition: 'The area between the opponent\'s 20-yard line and the goal line — prime scoring territory.', category: 'terminology', difficulty: 'starter' },
  { id: 'hail-mary', term: 'Hail Mary', definition: 'A desperate long pass thrown at the end of a half, hoping for a miracle catch in the end zone.', category: 'terminology', difficulty: 'starter' },
  { id: 'play-action', term: 'Play Action', definition: 'A fake handoff by the QB designed to trick the defense into thinking it\'s a run play before passing.', category: 'terminology', difficulty: 'starter' },
  { id: 'audible', term: 'Audible', definition: 'When the QB changes the play at the line of scrimmage by calling out a new set of instructions.', category: 'terminology', difficulty: 'starter' },
  { id: 'onside-kick', term: 'Onside Kick', definition: 'A short kickoff where the kicking team tries to recover the ball — a high-risk desperation play.', category: 'terminology', difficulty: 'starter' },
  { id: 'lateral', term: 'Lateral', definition: 'A backward or sideways pass that any player can throw at any time during a play.', category: 'terminology', difficulty: 'starter' },
  { id: 'screen-pass', term: 'Screen Pass', definition: 'A short pass to a receiver or back behind a wall of blockers, designed to exploit an aggressive pass rush.', category: 'terminology', difficulty: 'starter' },
  { id: 'line-of-scrimmage', term: 'Line of Scrimmage', definition: 'The imaginary line across the field where the ball is placed before each play begins.', category: 'terminology', difficulty: 'rookie' },
  { id: 'neutral-zone', term: 'Neutral Zone', definition: 'The area between the tips of the ball. No player can enter it before the snap.', category: 'terminology', difficulty: 'starter' },
  { id: 'goal-line', term: 'Goal Line', definition: 'The line at the front of the end zone — the ball must cross it for a touchdown.', category: 'terminology', difficulty: 'rookie' },
  { id: 'pick-six', term: 'Pick Six', definition: 'When a defender intercepts a pass and returns it all the way for a touchdown (6 points).', category: 'terminology', difficulty: 'pro' },
  { id: 'pocket', term: 'Pocket', definition: 'The protected area formed by offensive linemen around the QB during a pass play.', category: 'terminology', difficulty: 'pro' },
  { id: 'bootleg', term: 'Bootleg', definition: 'When the QB fakes a handoff one direction then rolls out the opposite way to pass or run.', category: 'terminology', difficulty: 'pro' },
  { id: 'rpo', term: 'RPO (Run-Pass Option)', definition: 'A play where the QB reads a defender to decide whether to hand off, keep, or throw.', category: 'terminology', difficulty: 'pro' },
  { id: 'man-coverage', term: 'Man Coverage', definition: 'A defensive scheme where each defender is assigned to cover a specific offensive player.', category: 'terminology', difficulty: 'pro' },
  { id: 'scramble', term: 'Scramble', definition: 'When the QB runs from the pocket to avoid a sack, looking to throw or run for yards.', category: 'terminology', difficulty: 'pro' },
  { id: 'yac', term: 'Yards After Catch (YAC)', definition: 'The distance a receiver runs after catching a pass — a key stat for evaluating playmakers.', category: 'terminology', difficulty: 'pro' },
  { id: 'hot-route', term: 'Hot Route', definition: 'A quick route a receiver runs when a blitz is detected — an automatic adjustment to beat the pressure.', category: 'terminology', difficulty: 'all-pro' },
  { id: 'slant-route', term: 'Slant Route', definition: 'A quick inside route at a 45-degree angle, one of the most common short passing concepts.', category: 'terminology', difficulty: 'all-pro' },
  { id: 'wheel-route', term: 'Wheel Route', definition: 'A route that curves from the flat upfield along the sideline, often exploiting slow linebackers.', category: 'terminology', difficulty: 'all-pro' },
  { id: 'swim-move', term: 'Swim Move', definition: 'A pass rush technique where a defender swings their arm over a blocker to get past them.', category: 'terminology', difficulty: 'all-pro' },
  { id: 'seam-route', term: 'Seam Route', definition: 'A vertical route run between zones in the defense — threading the needle for big gains.', category: 'terminology', difficulty: 'all-pro' },
  { id: 'bunch-formation', term: 'Bunch Formation', definition: 'Three receivers aligned close together, creating confusion about defensive assignments.', category: 'terminology', difficulty: 'all-pro' },
  { id: 'pre-snap-motion', term: 'Pre-Snap Motion', definition: 'A player moving before the snap to reveal the defense\'s coverage and create mismatches.', category: 'terminology', difficulty: 'all-pro' },
  { id: 'icing-the-kicker', term: 'Icing the Kicker', definition: 'Calling a timeout right before a field goal attempt to disrupt the kicker\'s rhythm.', category: 'terminology', difficulty: 'starter' },

  // ═══════════════════════════════════════════════════════════════
  // STRATEGY (15 terms)
  // ═══════════════════════════════════════════════════════════════
  { id: 'west-coast-offense', term: 'West Coast Offense', definition: 'An offensive system emphasizing short, horizontal passes to stretch the defense and create YAC.', category: 'strategy', difficulty: 'pro' },
  { id: 'cover-2', term: 'Cover 2', definition: 'A zone defense that splits the deep field between two safeties, each covering half.', category: 'strategy', difficulty: 'pro' },
  { id: 'cover-3', term: 'Cover 3', definition: 'A zone defense that divides the deep field into thirds — two CBs and one safety each cover a third.', category: 'strategy', difficulty: 'all-pro' },
  { id: 'prevent-defense', term: 'Prevent Defense', definition: 'A conservative defense with extra deep coverage to prevent big plays, used to protect a lead.', category: 'strategy', difficulty: 'pro' },
  { id: 'tampa-2', term: 'Tampa 2', definition: 'A Cover 2 variant where the MLB drops into deep middle zone, fixing the typical Cover 2 weakness.', category: 'strategy', difficulty: 'all-pro' },
  { id: 'gap-integrity', term: 'Gap Integrity', definition: 'Each defender maintaining responsibility for their assigned gap between offensive linemen.', category: 'strategy', difficulty: 'all-pro' },
  { id: 'zone-read', term: 'Zone Read', definition: 'The QB reads an unblocked defender to decide whether to hand off to the RB or keep the ball.', category: 'strategy', difficulty: 'all-pro' },
  { id: 'zone-running', term: 'Zone Running', definition: 'A blocking scheme where linemen block zones instead of specific players, letting the RB find holes.', category: 'strategy', difficulty: 'all-pro' },
  { id: 'nickel-defense', term: 'Nickel Defense', definition: 'A defensive formation with 5 defensive backs, used in obvious passing situations.', category: 'strategy', difficulty: 'pro' },
  { id: 'stacking-the-box', term: 'Stacking the Box', definition: 'Placing 8+ defenders near the line of scrimmage to stop the run, leaving fewer in coverage.', category: 'strategy', difficulty: 'pro' },
  { id: 'two-minute-drill', term: 'Two-Minute Drill', definition: 'A fast-paced offensive strategy used at the end of a half to score quickly.', category: 'strategy', difficulty: 'starter' },
  { id: 'no-huddle', term: 'No-Huddle Offense', definition: 'Skipping the huddle to run plays quickly, preventing the defense from substituting.', category: 'strategy', difficulty: 'starter' },
  { id: 'read-option', term: 'Read Option', definition: 'A play where the QB reads a defender to decide between handing off, keeping, or throwing.', category: 'strategy', difficulty: 'pro' },
  { id: 'power-run', term: 'Power Run', definition: 'A downhill running play where a pulling guard leads the way for the ball carrier.', category: 'strategy', difficulty: 'pro' },
  { id: 'draw-play', term: 'Draw Play', definition: 'A running play disguised as a pass — the QB drops back then hands off to a back running up the middle.', category: 'strategy', difficulty: 'pro' },

  // ═══════════════════════════════════════════════════════════════
  // HISTORY (10 terms)
  // ═══════════════════════════════════════════════════════════════
  { id: 'super-bowl', term: 'Super Bowl', definition: 'The NFL championship game, played annually and the most-watched sporting event in the US.', category: 'history', difficulty: 'rookie' },
  { id: 'lombardi-trophy', term: 'Lombardi Trophy', definition: 'The trophy awarded to the Super Bowl champion, named after legendary coach Vince Lombardi.', category: 'history', difficulty: 'pro' },
  { id: 'nfl-draft', term: 'NFL Draft', definition: 'The annual event where NFL teams select eligible college players, picking in reverse order of their record.', category: 'history', difficulty: 'starter' },
  { id: 'pro-bowl', term: 'Pro Bowl', definition: 'The NFL\'s all-star game (now the Pro Bowl Games) featuring the league\'s best players.', category: 'history', difficulty: 'starter' },
  { id: 'heisman-trophy', term: 'Heisman Trophy', definition: 'The award given annually to the most outstanding player in college football.', category: 'history', difficulty: 'pro' },
  { id: 'nfl-combine', term: 'NFL Combine', definition: 'A week-long showcase where draft prospects perform physical tests (40-yard dash, bench press, etc.).', category: 'history', difficulty: 'pro' },
  { id: 'hall-of-fame', term: 'Hall of Fame', definition: 'The Pro Football Hall of Fame in Canton, Ohio, honoring the greatest players and contributors.', category: 'history', difficulty: 'starter' },
  { id: 'afc-nfc', term: 'AFC & NFC', definition: 'The two conferences in the NFL — American Football Conference and National Football Conference.', category: 'history', difficulty: 'starter' },
  { id: 'playoff-system', term: 'NFL Playoffs', definition: 'The postseason tournament of 14 teams competing in single-elimination games to reach the Super Bowl.', category: 'history', difficulty: 'starter' },
  { id: 'salary-cap', term: 'Salary Cap', definition: 'The maximum amount of money an NFL team can spend on player salaries — promotes competitive balance.', category: 'history', difficulty: 'pro' },
]

// Total: 109 terms

// Helpers
export function getTermsByCategory(category: TermCategory): FootballTerm[] {
  return FOOTBALL_TERMS.filter(t => t.category === category)
}

export function getTermById(id: string): FootballTerm | undefined {
  return FOOTBALL_TERMS.find(t => t.id === id)
}

export function getCategoryCount(): Record<TermCategory, number> {
  const counts: Record<TermCategory, number> = {
    positions: 0,
    rules: 0,
    terminology: 0,
    strategy: 0,
    history: 0,
  }
  for (const term of FOOTBALL_TERMS) {
    counts[term.category]++
  }
  return counts
}

export const TOTAL_TERMS = FOOTBALL_TERMS.length

export const CATEGORY_LABELS: Record<TermCategory, string> = {
  positions: 'Positions',
  rules: 'Rules',
  terminology: 'Terminology',
  strategy: 'Strategy',
  history: 'History',
}
