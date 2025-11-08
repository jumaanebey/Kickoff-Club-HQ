'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, Clock, Headphones, Share2 } from 'lucide-react'
import { ShareButtons } from '@/components/social/share-buttons'
import { ThemedHeader } from '@/components/layout/themed-header'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/lib/utils'

interface PodcastEpisodePageProps {
  params: {
    slug: string
  }
}

// Kickoff Club Podcast episodes with full transcripts
const episodes: Record<string, any> = {
  'four-downs': {
    id: 1,
    title: 'The 4 Downs Thing Everyone Talks About',
    description: 'Why 4 downs for 10 yards is the strategy engine of football. A dad teaches his 7-year-old daughter the most important concept in football while watching a live game together.',
    guest: 'Dad & Daughter (7)',
    duration: '25:30',
    date: '2025-01-15',
    category: 'Fundamentals',
    audioUrl: '/podcasts/episode-01-four-downs.m4a',
    transcript: `A dad and his 7-year-old daughter watch their second football game together. She remembers that teams try to get the ball to the end zone, but doesn't understand what "FIRST DOWN!" means.

**What She Learns:**

The Big Picture - Why Downs Exist
• Teams get FOUR chances to move the ball forward ten yards
• If you make it ten yards, you get four MORE chances
• If you don't make it in four tries, the other team gets the ball

Understanding the Numbers
• "1st & 10" means first try, ten yards to go
• "2nd & 7" means second try, seven yards still needed
• The numbers tell you which try they're on and how many yards they need

The Pressure of Third Down
• Third down is crucial - only one more try left if they don't make it
• The crowd gets loud because it's such an important moment
• Getting a first down resets everything back to "1st & 10"

Fourth Down Decisions
• Option 1: GO FOR IT (risky but could get a first down)
• Option 2: PUNT (strategic giving up to push the other team back)
• Option 3: FIELD GOAL (if close enough to the goalposts for 3 points)

Why First Downs Matter
• Can't score touchdowns without getting first downs along the way
• The end zone might be 80 yards away - that's eight first downs!
• First downs are stepping stones to a touchdown
• Defense is trying to STOP you from getting ten yards

Special Moments:
• She figures out how to read "2nd & 7" all by herself
• Learns about going backwards (negative yardage)
• Understands the pressure of third down
• Calls punting "strategic giving up" (Dad loves this!)
• Watches officials measure with chains to see if team got first down
• Has her breakthrough: "I actually understand this now!"

By halftime, she can predict what the graphic will say and understands why everyone gets so excited about first downs.`,
    shownotes: [
      'Introduction - Remembering last time (0:00)',
      'The Big Picture - Why downs exist (2:30)',
      'Live Play - Seeing "1st & 10" in action (5:45)',
      'Live Play - Understanding the numbers "2nd & 7" (7:20)',
      'Live Play - The pressure of third down (9:40)',
      'Live Play - What is fourth down? Three options (11:30)',
      'Live Play - Putting it all together (15:00)',
      'Live Play - Why first downs matter (17:15)',
      'Live Play - Special situations "3rd & 1" (19:30)',
      'Live Play - The chain gang measurement (21:45)',
      'Outro - Halftime check-in (23:30)',
    ],
  },
  'fantasy-football': {
    id: 2,
    title: 'Can We Talk About Fantasy Football?',
    description: 'Strategy, scarcity, and psychology of fantasy football. Two roommates discuss what makes fantasy football so addictive and how it actually helps you understand the real game better.',
    guest: 'Roommates (M+F)',
    duration: '27:15',
    date: '2025-01-13',
    category: 'Strategy',
    audioUrl: '/podcasts/episode-02-fantasy-football.m4a',
    transcript: `Two roommates explore why fantasy football is so engaging and how it deepens understanding of the real game. They discuss strategy, player positions, and why fantasy makes watching games more exciting.

**Key Topics:**

What Is Fantasy Football?
• You create your own team by drafting real NFL players
• Players score points based on their real-game performance
• You compete against friends in a league
• It's like being a general manager

Why It's So Addictive
• Makes every game matter, not just your favorite team
• Creates personal investment in player performance
• Social competition with friends
• Weekly strategy decisions

How It Helps You Learn Football
• Forces you to learn player positions and roles
• Understand offensive schemes and game plans
• Follow multiple teams and matchups
• Appreciate individual player contributions

The Strategy Element
• Draft strategy - when to pick each position
• Weekly lineup decisions - who to start
• Waiver wire pickups - finding hidden gems
• Trade negotiations with league mates

Understanding Scarcity
• Some positions are more valuable than others
• Injury replacements become crucial
• Bye weeks create strategic challenges
• Consistency vs boom-or-bust players

The fantasy football conversation reveals how the game creates deeper engagement with real football and helps beginners learn positions, statistics, and strategy in a fun, competitive way.`,
    shownotes: [
      'Introduction - Why fantasy football? (0:00)',
      'What is fantasy football actually? (3:15)',
      'How scoring works in fantasy (6:30)',
      'Draft strategy and position value (10:45)',
      'Weekly lineup decisions (15:20)',
      'Why it makes you a better fan (19:40)',
      'The social and competitive aspect (23:10)',
      'Wrap-up - Getting started tips (25:30)',
    ],
  },
  'game-clock': {
    id: 3,
    title: "What's the Deal With the Clock?",
    description: 'How NFL teams weaponize the game clock. A wife explains to her husband why mastering clock management separates good teams from championship teams.',
    guest: 'Wife & Husband',
    duration: '31:20',
    date: '2025-01-12',
    category: 'Strategy',
    audioUrl: '/podcasts/episode-03-game-clock.m4a',
    transcript: `A wife teaches her husband about the strategic complexity of the game clock and why it's one of football's most important elements.

**What He Learns:**

The Basic Setup
• 60-minute game divided into four 15-minute quarters
• Clock runs on some plays, stops on others
• Teams can control the clock strategically
• Two-minute warnings at end of each half

When the Clock Stops
• Incomplete passes
• Players going out of bounds
• Change of possession
• Penalties
• Timeouts
• Two-minute warning

When the Clock Keeps Running
• Running plays that stay inbounds
• Completed passes where receiver stays inbounds
• Quarterback sacked
• Can be used to burn time when leading

Strategic Clock Management
• Leading team wants clock to run (more rushing plays)
• Trailing team wants clock to stop (more passing plays)
• Using timeouts wisely - save them for crucial moments
• The two-minute drill - fast-paced offense

The Two-Minute Drill
• Offense tries to score before half/game ends
• Quick plays, passes to sidelines
• Spike the ball to stop clock
• Managing timeouts becomes crucial
• Can define championship teams

Advanced Strategies
• Taking a knee to end the game
• Running out the clock with run plays
• Intentional grounding to stop clock
• Clock management mistakes can cost games

Why It Matters
• Can turn a loss into a win
• Separates great coaches from good ones
• Creates dramatic end-of-game situations
• Adds chess-like strategy to the sport

The conversation shows how the clock isn't just keeping time - it's a strategic weapon that great teams master.`,
    shownotes: [
      'Introduction - The clock confusion (0:00)',
      'The Big Picture - 60 minutes, four quarters (3:00)',
      'When the clock stops vs keeps running (6:15)',
      'Live example - trailing team strategy (11:30)',
      'Live example - leading team burns clock (16:20)',
      'The two-minute drill explained (20:45)',
      'Advanced strategies and taking a knee (25:10)',
      'Why clock management wins championships (28:40)',
    ],
  },
  'penalties': {
    id: 4,
    title: 'Wait, That\'s Illegal?!',
    description: 'Football penalties explained with consequences. An older brother teaches his sister why those yellow flags matter and how penalties can completely change a game.',
    guest: 'Brother & Sister (20s)',
    duration: '37:10',
    date: '2025-01-10',
    category: 'Rules',
    audioUrl: '/podcasts/episode-04-penalties.m4a',
    transcript: `A brother explains to his sister the complex world of football penalties, why they happen, and how they impact games.

**What She Learns:**

The Basics
• Yellow flags indicate a rule violation
• Penalties result in yardage losses or gains
• Can negate big plays (most frustrating part!)
• Refs announce the penalty and yardage

Common Offensive Penalties
• False start (5 yards) - offensive player moves before snap
• Holding (10 yards) - grabbing/restraining a defender
• Offensive pass interference - pushing defender before catch
• Delay of game (5 yards) - not snapping ball in time

Common Defensive Penalties
• Offside/encroachment (5 yards) - crossing line before snap
• Pass interference - preventing receiver from catching
• Holding (5 yards on defense)
• Roughing the passer (15 yards + automatic first down)

The Big Impact Penalties
• Pass interference - ball placed at spot of foul
• Roughing the passer - automatic first down
• Personal fouls - 15 yards
• Can completely change field position

Penalty Acceptance
• Team that was fouled can decline the penalty
• Take the penalty yards OR the result of play
• Strategic decision based on field position
• Refs ask captain: "Do you accept?"

Why Penalties Matter
• Can kill a scoring drive
• Give the opponent new first downs
• Turn touchdowns into no points
• Momentum killers for teams
• Most penalized teams rarely win

Special Cases
• Offsetting penalties - both teams penalized, replay down
• Dead ball fouls - assessed after play
• Multiple penalties - choose which to enforce

The conversation reveals how penalties add layers of complexity and why discipline is crucial for winning teams.`,
    shownotes: [
      'Introduction - Yellow flags everywhere! (0:00)',
      'What penalties are and why they exist (4:20)',
      'Live example - false start explained (8:15)',
      'Live example - pass interference (12:40)',
      'Offensive penalties that kill drives (17:30)',
      'Defensive penalties that help offense (22:45)',
      'Penalty acceptance - decline or take it? (27:20)',
      'How penalties change games (31:50)',
      'Wrap-up - Most impactful penalties (35:00)',
    ],
  },
  'scoring': {
    id: 5,
    title: 'How Does Scoring Even Work?',
    description: 'The 4 pillars of football scoring demystified. Best friends break down touchdowns, field goals, extra points, and safeties while watching Sunday football.',
    guest: 'Best Friends (F+F)',
    duration: '33:45',
    date: '2025-01-08',
    category: 'Fundamentals',
    audioUrl: '/podcasts/episode-05-scoring.m4a',
    transcript: `Two best friends watch football together as one explains all the ways teams can score points.

**The Four Ways to Score:**

1. Touchdowns (6 points)
• Get the ball into the opponent's end zone
• Cross the goal line with the ball
• Catch the ball in the end zone
• Most exciting way to score
• Biggest point value

2. Extra Points After Touchdown
• PAT (Point After Touchdown) = 1 point
• Kick through goalposts from 15-yard line
• Almost automatic, very high success rate
• This is why touchdowns are "worth 7"

3. Two-Point Conversion (2 points after TD)
• Instead of kicking, run a play from 2-yard line
• Must get ball into end zone
• Risky but worth double
• Used when team needs 2 to tie/lead
• Makes TD worth 8 points total

4. Field Goals (3 points)
• Kick ball through goalposts
• Usually on 4th down when too far for TD
• Kicker attempts from wherever ball is
• Longer distance = harder kick
• Most NFL kickers good up to 50 yards

5. Safety (2 points)
• Rarest scoring play
• Defense tackles offense in their own end zone
• Offense commits penalty in own end zone
• Defense also gets the ball back after
• Can swing momentum dramatically

Why This Matters:
• Teams make strategic decisions based on points available
• Fourth down near goalposts? Try field goal (3) or go for TD (6)?
• Winning by 1 late in game? Might go for 2-point conversion
• Understanding scoring helps you follow the strategy

The conversation breaks down each scoring method and explains when teams choose each option based on field position and game situation.`,
    shownotes: [
      'Introduction - How many points is that? (0:00)',
      'The Big Picture - Four ways to score (3:45)',
      'Touchdowns worth 6 points (6:20)',
      'Extra point kicks - the easy 1 (11:30)',
      'Two-point conversions - the risky 2 (15:50)',
      'Field goals worth 3 points (20:15)',
      'Safeties - the rare 2 points (25:40)',
      'Live examples of each scoring type (28:30)',
      'Why scoring choices are strategic (31:20)',
    ],
  },
  'touchdown-rules': {
    id: 6,
    title: 'Touchdown Is Six Points... But Why?',
    description: 'Hidden rules that make touchdowns worth 6 points. A boyfriend explains to his girlfriend the surprisingly complex rules around what actually counts as a touchdown.',
    guest: 'Boyfriend & Girlfriend',
    duration: '29:50',
    date: '2025-01-06',
    category: 'Rules',
    audioUrl: '/podcasts/episode-06-touchdown-rules.m4a',
    transcript: `A boyfriend explains to his girlfriend the surprisingly specific rules about what counts as a touchdown.

**Touchdown Rules:**

The Goal Line
• The line at the front of the end zone
• Ball just needs to "break the plane"
• Even if player is tackled, if ball crossed line = TD
• Doesn't matter where player's body is
• Just the ball needs to cross

Breaking the Plane
• The moment the ball crosses the goal line
• Play is dead immediately
• Player can fumble AFTER and still counts
• This is why you see players reaching/diving
• Most dramatic plays happen at goal line

Catching in the End Zone
• Must have possession of ball
• Two feet (or one knee/hip) must be in bounds
• Must maintain control through the fall
• If drop ball = incomplete, no touchdown
• Sideline catches are hardest to judge

The Football Move Rule
• Receiver must make a "football move" if hit immediately
• Can't just bobble and touch end zone
• Must show clear possession
• This causes lots of review debates
• Refs look for clear control

Fumbles at the Goal Line
• Fumble into end zone that goes out = turnover (touchback)
• Defending team gets ball at their 20-yard line
• One of the cruelest rules in football
• Players warned to never reach/fumble at goal line
• Has cost teams championships

Review and Challenges
• All touchdowns are automatically reviewed
• Refs check if ball broke plane
• Check if receiver had possession
• Can overturn call on field
• Takes several minutes for close calls

Why the Rules Matter:
• Touchdowns are worth 6 points - huge impact
• Refs must get it right every time
• Even inches matter in these calls
• Understanding rules helps you see the game like a ref

The conversation reveals how complex touchdown rules can be and why so many calls get challenged and reviewed.`,
    shownotes: [
      'Introduction - What counts as a touchdown? (0:00)',
      'The goal line and "breaking the plane" (4:15)',
      'Live example - diving for the pylon (8:45)',
      'Catching rules in the end zone (12:30)',
      'The football move requirement (17:20)',
      'Fumbles at the goal line - the cruel rule (21:40)',
      'Why everything is reviewed (25:10)',
      'Wrap-up - Close calls and controversies (27:50)',
    ],
  },
  'strategy-blueprint': {
    id: 7,
    title: 'The Strategy Blueprint No One Explains',
    description: 'Understanding offensive and defensive schemes. Coworkers discuss why football is actually a giant chess match disguised as a contact sport.',
    guest: 'Coworkers (M+M)',
    duration: '26:30',
    date: '2025-01-04',
    category: 'Strategy',
    audioUrl: '/podcasts/episode-07-strategy-blueprint.m4a',
    transcript: `Two coworkers discuss the strategic chess match happening on every play of football.

**Offensive Strategy:**

The Play Call
• Coaches design plays in advance
• Quarterback gets play call from sideline
• Tells teammates the play in huddle
• Players line up in specific formations
• All happens in 30-40 seconds

Formation Types
• I-formation - power running
• Shotgun - passing plays
• Spread - spread defense thin
• Goal line - power push for short yards
• Each formation suggests strategy

Run vs Pass
• Running - safer, controls clock, gains short yards
• Passing - riskier, stops clock, gains big yards
• Teams balance based on game situation
• Trailing = more passes
• Leading = more runs

Play Action
• Fake a run, then pass
• Tricks defense into coming forward
• Creates open receivers behind defenders
• One of most effective play types
• Requires good running game to work

**Defensive Strategy:**

Reading the Formation
• Defense adjusts based on offensive formation
• Shotgun usually means pass
• Tight formation usually means run
• Defenses try to predict play type

Zone vs Man Coverage
• Man = each defender covers a specific player
• Zone = each defender covers an area
• Both have strengths and weaknesses
• Offenses try to attack weak spots

The Blitz
• Sending extra defenders to rush quarterback
• High risk, high reward
• Can force quick throws or sacks
• Leaves fewer defenders in coverage
• Great QBs punish blitzes

Why Strategy Matters:
• Physical talent alone doesn't win
• Coaching and play-calling crucial
• Chess match between coordinators
• Adjustments at halftime can swing games

The conversation shows how football is as much mental as physical, with coaches and players constantly trying to outsmart each other.`,
    shownotes: [
      'Introduction - More than just hitting (0:00)',
      'Offensive play calling and formations (3:40)',
      'Run vs pass - when to use each (8:15)',
      'Play action and misdirection (12:25)',
      'Defensive formations and coverage (15:50)',
      'Zone vs man coverage explained (19:20)',
      'The blitz - high risk, high reward (22:10)',
      'Why strategy wins championships (24:40)',
    ],
  },
  'coaching-strategy': {
    id: 8,
    title: 'Why Is Everyone Yelling About the Coach?',
    description: 'Coaching decisions and their impact on games. A mom teaches her adult son how coaching strategy wins (and loses) championships.',
    guest: 'Mom & Adult Son',
    duration: '34:20',
    date: '2025-01-02',
    category: 'Strategy',
    audioUrl: '/podcasts/episode-08-coaching-strategy.m4a',
    transcript: `A mom explains to her son why coaching decisions are so crucial and why fans get so emotional about them.

**What Coaches Control:**

Play Calling
• Offensive coordinator calls offensive plays
• Defensive coordinator calls defensive plays
• Head coach oversees everything
• Real-time decisions every 40 seconds
• Balancing aggression vs conservative

Game Management
• When to use timeouts
• When to challenge a call
• When to go for it on 4th down vs punt
• Clock management
• Each decision can change outcome

Personnel Decisions
• Which players are on field for each play
• Substitutions based on situation
• Managing injuries and fatigue
• Special teams choices
• Matchup advantages

Halftime Adjustments
• Analyzing what's working/not working
• Changing strategy for second half
• Fixing mistakes and exploiting weaknesses
• Can completely turn games around
• Separates great coaches from good

Fourth Down Decisions
• Most criticized coaching calls
• Go for it, punt, or kick field goal?
• Analytics vs gut feeling
• Field position matters
• Game score and time matters

Risk vs Reward
• Aggressive coaches go for it more
• Conservative coaches play safe
• Both can work with right execution
• Fans always second-guess decisions
• Results determine if it was "right"

Why Coaches Get Blamed:
• Players execute, coaches decide
• Bad call can waste great play by players
• Conservative calls frustrate fans
• Aggressive calls that fail get crucified
• Easier to blame coach than players

Famous Coaching Decisions:
• Going for 2 to win instead of kicking PAT to tie
• Not running ball at goal line (resulting in interception)
• Icing own kicker with bad timeout
• Can become historic moments

The conversation reveals how coaches orchestrate the entire game and why their decisions are scrutinized so intensely.`,
    shownotes: [
      'Introduction - Coaching controversies (0:00)',
      'What coaches actually control (4:30)',
      'Play calling - real-time chess (9:15)',
      'Game management and clock decisions (14:40)',
      'Fourth down - go for it or play safe? (19:25)',
      'Halftime adjustments that change games (24:10)',
      'Why coaches get all the blame (28:30)',
      'Famous coaching decisions in history (31:40)',
    ],
  },
  'super-bowl': {
    id: 9,
    title: 'Super Bowl... Make It Make Sense',
    description: 'How the NFL playoffs and Super Bowl actually work. A grandpa explains to his teenage grandson why the Super Bowl is called "the big game" and how teams actually get there.',
    guest: 'Grandpa & Grandson (teen)',
    duration: '32:10',
    date: '2024-12-30',
    category: 'Fundamentals',
    audioUrl: '/podcasts/episode-09-super-bowl.m4a',
    transcript: `A grandpa explains to his teenage grandson how the NFL season works and why the Super Bowl is such a big deal.

**The NFL Season Structure:**

Regular Season
• 18 weeks (each team plays 17 games)
• Teams divided into two conferences: AFC and NFC
• Each conference has 4 divisions
• 4 teams in each division
• Teams play division rivals twice
• Win-loss record determines playoff spots

The Playoff Picture
• 7 teams from each conference make playoffs
• 14 teams total (out of 32)
• 4 division winners guaranteed spots
• 3 "wild card" teams (best records that didn't win division)
• Seeding 1-7 based on record

The Playoff Bracket
• Single elimination - lose once, you're out
• Wild Card Round (seeds 2-7 play)
• #1 seed gets a bye (automatic advancement)
• Divisional Round (4 teams left per conference)
• Conference Championships (2 teams left per conference)
• Winners go to Super Bowl

Why the Super Bowl Is Special:
• Only two teams left out of 32
• AFC champion vs NFC champion
• Winner is world champion
• Biggest sporting event in America
• Most watched TV broadcast of year

The Super Bowl Experience
• Played at neutral site (rotates cities)
• Two weeks between conference championship and Super Bowl
• Media coverage is massive
• Halftime show is huge production
• Commercials cost millions
• National holiday-like atmosphere

Pressure and Legacy
• Winning Super Bowl defines careers
• Players judged by championships
• Coaches' legacies made or broken
• Can turn good QB into all-time great
• Losing the Super Bowl haunts players

Why Everyone Watches
• Even non-fans watch for commercials and halftime
• Super Bowl parties are cultural tradition
• Huge sports betting event
• Unites the country for one game
• Creates unforgettable moments

The History
• Played since 1967
• Some teams have never won
• Some dynasties win multiple times
• Upsets create legendary stories
• Roman numerals count the games (Super Bowl LIX = 59th)

The conversation shows why the Super Bowl is more than just a game - it's a cultural phenomenon that caps off the entire NFL season.`,
    shownotes: [
      'Introduction - What makes it so big? (0:00)',
      'The NFL season structure (3:50)',
      'How playoffs work - the bracket (8:30)',
      'Wild card teams and seeding (13:15)',
      'The road to the Super Bowl (17:40)',
      'Why it\'s called "the big game" (22:20)',
      'Super Bowl traditions and culture (26:10)',
      'Historic moments and dynasties (29:30)',
    ],
  },
  'i-get-it-now': {
    id: 10,
    title: 'I Think I Actually Get It Now!',
    description: 'Putting it all together - from complete beginner to confident fan. The dad and daughter return to wrap up their football learning journey and celebrate how far they\'ve come.',
    guest: 'Dad & Daughter (7)',
    duration: '32:25',
    date: '2024-12-28',
    category: 'Fundamentals',
    audioUrl: '/podcasts/episode-10-penalty-cost.m4a',
    transcript: `The dad and daughter from episode 1 return to watch another game, and this time she understands what's happening! They celebrate how far she's come and review everything she's learned.

**Her Journey:**

Where She Started
• Didn't know what a touchdown was
• Confused about downs and first downs
• Didn't understand the clock
• Flags confused her
• Couldn't follow the game

What She Knows Now
• Reads down and distance graphics perfectly
• Predicts play calling decisions
• Understands why teams go for it or punt
• Recognizes common penalties
• Follows the clock strategy
• Appreciates good coaching

Watching the Game Together
• She explains plays to dad (role reversal!)
• Predicts what will happen on 4th down
• Notices when defense is blitzing
• Understands two-minute drill urgency
• Catches ref mistakes
• Celebrates first downs with confidence

The Breakthrough Moments
• "They're going to punt because it's too far for a field goal"
• "That's pass interference! The defender held him!"
• "They need to hurry - only 2 minutes left!"
• "Dad, why did the coach call a timeout there? That's bad!"
• Each shows deep understanding

Why Understanding Football Matters
• Connects her to family traditions
• Can watch games with friends
• Appreciates the strategy, not just the hitting
• Feels confident, not confused
• Became a real fan

What Made It Click
• Starting with the big picture
• Learning by watching real games
• Dad explaining consequences
• Lots of repetition
• Patience and encouragement
• Building on previous knowledge

Her Favorite Part
• The strategic chess match
• Fourth down decisions
• Clock management drama
• When underdogs win
• Last-minute comebacks

Looking Forward
• She wants to play in a fantasy league
• Planning to watch playoffs with dad
• Teaching her friends what she learned
• Excited for Super Bowl party
• Already a real football fan

The Lesson
• Anyone can learn football if taught well
• Start with fundamentals, build complexity
• Real games are the best teacher
• It's about the journey, not just the destination

The episode comes full circle, showing that with the right teaching approach, even a 7-year-old can go from complete confusion to confident understanding. It's a celebration of learning and the bond between a dad and daughter over football.`,
    shownotes: [
      'Introduction - She\'s back and confident! (0:00)',
      'Reviewing what she\'s learned (4:20)',
      'Watching the game - she explains to dad (9:30)',
      'Her predictions and analysis (14:45)',
      'The breakthrough moments (19:10)',
      'What made football finally click (23:40)',
      'Her favorite parts of the game (27:15)',
      'Looking forward - playoffs and Super Bowl (30:00)',
    ],
  },
}

export default function PodcastEpisodePage({ params }: PodcastEpisodePageProps) {
  const { colors } = useTheme()
  const episode = episodes[params.slug]

  if (!episode) {
    notFound()
  }

  return (
    <div className={cn('min-h-screen', colors.bg)}>
      <ThemedHeader activePage="podcast" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          href="/podcast"
          className="inline-flex items-center text-orange-400 hover:text-orange-500 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to All Episodes
        </Link>

        {/* Episode Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-white/10 border-white/20 text-white">{episode.category}</Badge>
            <span className="text-sm text-white/60">Episode {episode.id}</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{episode.title}</h1>
          <p className="text-xl text-white/70 mb-4">{episode.description}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-white/60 mb-6">
            <div className="flex items-center gap-1">
              <Headphones className="h-4 w-4" />
              <span>{episode.guest}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(episode.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{episode.duration}</span>
            </div>
          </div>

          {/* Share Buttons */}
          <ShareButtons
            url={`https://kickoffclubhq.com/podcast/${params.slug}`}
            title={episode.title}
            description={episode.description}
          />
        </div>

        {/* Audio Player */}
        <Card className="mb-8 bg-gradient-to-r from-orange-600/20 to-orange-700/20 backdrop-blur-xl border border-orange-500/30">
          <CardContent className="p-8">
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Headphones className="h-12 w-12 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <div className="text-white mb-4">
                  <div className="text-sm text-white/70 mb-1">Now Playing</div>
                  <div className="font-semibold">Episode {episode.id}: {episode.title.split('with')[0].trim()}</div>
                </div>

                {/* Audio Element */}
                <audio
                  controls
                  className="w-full"
                >
                  <source src={episode.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Show Notes */}
        <Card className="mb-8 bg-white/5 backdrop-blur-xl border border-white/10">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Show Notes</h2>
            <ul className="space-y-2">
              {episode.shownotes.map((note: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-orange-400 mt-1">•</span>
                  <span className="text-white/70">{note}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Transcript */}
        <Card className="mb-8 bg-white/5 backdrop-blur-xl border border-white/10">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Episode Transcript</h2>
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-white/70 leading-relaxed">
                {episode.transcript}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscribe CTA */}
        <Card className="bg-gradient-to-br from-orange-600/20 to-orange-700/20 backdrop-blur-xl border border-orange-500/30">
          <CardContent className="p-8 text-center">
            <Headphones className="h-12 w-12 mx-auto mb-4 text-orange-400" />
            <h3 className="text-2xl font-bold text-white mb-3">Subscribe to the Podcast</h3>
            <p className="text-white/70 mb-6">
              Get notified when we release new episodes with expert coaches and training insights.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                Listen on Spotify
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Listen on Apple Podcasts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
