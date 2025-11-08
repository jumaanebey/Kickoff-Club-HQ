import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, Clock, User, Share2, Facebook, Twitter, Linkedin } from 'lucide-react'
import { ShareButtons } from '@/components/social/share-buttons'
import { ThemedHeader } from '@/components/layout/themed-header'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

// Sample blog posts data
const blogPosts: Record<string, any> = {
  'mastering-first-touch': {
    slug: 'mastering-first-touch',
    title: 'Mastering First Touch: The Foundation of Ball Control',
    excerpt: 'Learn the essential techniques and drills to develop a world-class first touch that will elevate your game.',
    category: 'Skills',
    author: {
      name: 'Coach Sarah Thompson',
      role: 'Technical Skills Coach',
      avatar: '/authors/sarah-thompson.jpg'
    },
    date: '2025-01-20',
    readTime: '8 min read',
    image: '/blog/first-touch.jpg',
    content: `
## Why First Touch Matters

Your first touch is arguably the most important skill in football. It's the foundation upon which all your other technical abilities are built. A great first touch gives you time, creates space, and opens up passing options. A poor first touch puts you under pressure and limits your effectiveness.

## The Fundamentals

### Body Positioning

Before the ball even arrives, your body position is crucial:

- **Face the field**: Position your body so you can see as much of the field as possible
- **Stay on your toes**: Be ready to move in any direction
- **Cushion the ball**: Relax the receiving surface to absorb the ball's momentum
- **Use your arms**: Balance and protect yourself from defenders

### Key Techniques

1. **Inside of the foot**: The most versatile and reliable surface for receiving
2. **Outside of the foot**: Great for taking the ball away from pressure
3. **Sole of the foot**: Perfect for stopping the ball dead
4. **Chest and thigh**: Essential for controlling balls out of the air

## Training Drills

### Wall Passes

Find a wall and practice receiving the ball back with different surfaces. Vary the distance and power to simulate different game situations.

**Progression:**
- Start with stationary passes
- Add movement before receiving
- Introduce pressure with a partner
- Practice under fatigue

### Rondo Circle

In groups of 5-6 players, form a circle with 1-2 defenders in the middle. Focus on your first touch to set up quick one or two-touch passes.

### Pressure Drills

Have a partner apply pressure as you receive passes from different angles. This simulates game conditions where you rarely have time and space.

## Common Mistakes to Avoid

- **Standing flat-footed**: Always be on your toes and ready to move
- **Not looking before receiving**: Check your shoulders to scan the field
- **Too hard or too soft**: Find the right balance in cushioning the ball
- **Using the wrong surface**: Choose the appropriate part of your body for each situation

## Game Application

Your first touch should accomplish one of these objectives:

1. **Get the ball out of your feet**: Create space for your next action
2. **Take the ball away from pressure**: Move into open space
3. **Set up a pass**: Position the ball for your strongest foot
4. **Turn and face forward**: Open up the field of play

## Professional Examples

Watch players like Kevin De Bruyne, Luka Modric, and Bernardo Silva. Notice how their first touch:
- Rarely bounces away from them
- Takes them away from pressure
- Sets up their next move
- Allows them to play quickly

## Practice Routine

Dedicate 15-20 minutes of every training session to first touch work:

**Week 1-2**: Focus on the inside of the foot
**Week 3-4**: Add outside of the foot and sole
**Week 5-6**: Incorporate aerial control (chest and thigh)
**Week 7-8**: Apply pressure and game situations

## Key Takeaways

- Your first touch determines your effectiveness on the ball
- Practice with both feet equally
- Simulate game pressure in training
- Focus on quality over quantity
- Be patient - this skill takes thousands of repetitions to master

Remember: A great first touch gives you time. Time gives you options. Options give you success.
    `,
    relatedPosts: ['passing-fundamentals', 'dribbling-basics', 'speed-and-agility']
  },
  'passing-fundamentals': {
    slug: 'passing-fundamentals',
    title: 'Passing Fundamentals: Accuracy, Weight, and Timing',
    excerpt: 'Master the art of passing with proper technique, decision-making, and vision to control the tempo of the game.',
    category: 'Skills',
    author: {
      name: 'Coach Marcus Chen',
      role: 'Tactical Development Coach',
      avatar: '/authors/marcus-chen.jpg'
    },
    date: '2025-01-18',
    readTime: '10 min read',
    image: '/blog/passing.jpg',
    content: `
## The Art of Passing

Passing is the essence of beautiful football. It's what connects players, creates opportunities, and controls games. Great teams are built on great passing, and great passing starts with understanding the fundamentals.

## The Three Pillars of Passing

### 1. Accuracy

Accuracy is non-negotiable. The ball must arrive exactly where your teammate needs it.

**Key Points:**
- Strike through the center of the ball
- Follow through toward your target
- Keep your head down and eyes on the ball
- Plant foot should point at your target

### 2. Weight (Power)

The weight of your pass determines whether your teammate receives it in stride or has to break momentum.

**Considerations:**
- Distance to your target
- Speed of your teammate's movement
- Pressure from defenders
- Surface conditions

### 3. Timing

Even a perfect pass is useless if played at the wrong moment.

**Timing Factors:**
- Your teammate's readiness
- Defender's position
- Space availability
- Game tempo

## Types of Passes

### Short Passes (5-15 yards)

**Technique:**
- Use the inside of your foot
- Short backswing
- Firm but controlled contact
- Low, crisp passes along the ground

### Medium Passes (15-30 yards)

**Technique:**
- Inside or outside of foot depending on situation
- Longer backswing for power
- Can be driven or slightly lofted
- More power through the ball

### Long Passes (30+ yards)

**Technique:**
- Strike under the ball for lift
- Lock your ankle
- Full follow-through
- Lean back slightly for trajectory

### Through Balls

**Key Skills:**
- Timing is everything
- Weight must be perfect
- Consider goalkeeper's position
- Look for runs early

## Vision and Awareness

### Scanning the Field

Before receiving the ball:
- Check both shoulders
- Identify passing options
- Note defender positions
- Recognize space

### Communication

- Call for the ball clearly
- Use hand signals for direction
- Tell teammates about pressure
- Communicate constantly

## Training Drills

### Passing Triangle

Three players form a triangle and pass using:
- One-touch
- Two-touch
- Varied distance
- Both feet

**Progression:** Add a defender in the middle.

### Passing Squares

Four players on corners of a square. Pass and follow your pass, working on:
- Accuracy
- Communication
- Movement after passing
- Different pass types

### Long Ball Practice

Partner up and practice long passes:
- Driven passes
- Lofted passes
- Half-volleys
- Both feet

## Decision Making

### When to Pass

- Teammate is in better position
- Under too much pressure
- Building up play
- Changing point of attack

### When NOT to Pass

- No good options available
- Can dribble into better position
- Shooting opportunity
- Risk of interception too high

## Common Mistakes

1. **Telegraphing passes**: Looking directly at your target too early
2. **Poor first touch**: Not setting up the pass properly
3. **Wrong surface**: Using toe instead of proper technique
4. **No disguise**: Making your intention obvious
5. **Ignoring movement**: Not seeing teammates' runs

## Game Intelligence

### Reading the Game

- Anticipate where space will open
- Recognize patterns of play
- Understand defensive shape
- See two passes ahead

### Playing Forward

Always look to play forward first:
1. Can I play forward?
2. Can I switch play?
3. Can I play to feet?
4. Do I need to play back?

## Professional Study

Watch and learn from masters:
- **Xavi Hernandez**: Vision and tempo control
- **Kevin De Bruyne**: Long passing and through balls
- **Luka Modric**: Pass variety and weight
- **Toni Kroos**: Accuracy and calmness

## Practice Plan

**Daily (15 minutes):**
- Wall passing (both feet)
- Accuracy drills
- First touch into passing

**Weekly (30 minutes):**
- Partner passing drills
- Pressure situations
- Long ball practice
- Game-realistic scenarios

## Key Principles

1. **Quality over quantity**: One good pass is better than three poor ones
2. **Keep it simple**: The simple pass is often the best pass
3. **Play to feet or space**: Know which your teammate prefers
4. **Both feet**: You're half the player if you can't use both
5. **Head up**: Can't find passes if you're looking at the ball

## Conclusion

Passing is about more than just technique. It's about:
- Understanding the game
- Communicating with teammates
- Making intelligent decisions
- Practicing consistently

Master these fundamentals, and you'll become the player who makes everyone around you better.
    `,
    relatedPosts: ['mastering-first-touch', 'vision-awareness', 'midfield-mastery']
  },
  'dribbling-basics': {
    slug: 'dribbling-basics',
    title: 'Dribbling Basics: Close Control and 1v1 Situations',
    excerpt: 'Develop confidence on the ball with essential dribbling techniques, moves, and decision-making in tight spaces.',
    category: 'Skills',
    author: {
      name: 'Coach Alex Rivera',
      role: 'Attack Development Specialist',
      avatar: '/authors/alex-rivera.jpg'
    },
    date: '2025-01-15',
    readTime: '9 min read',
    image: '/blog/dribbling.jpg',
    content: `
## The Power of Dribbling

Dribbling is your personal weapon. It's what allows you to beat defenders, create space, and produce moments of magic. While passing moves the team, dribbling can change games in an instant.

## Close Control Fundamentals

### Ball Mastery Basics

Before you can beat defenders, you need complete control:

**Key Principles:**
- Keep the ball close (within playing distance)
- Use all surfaces of both feet
- Stay low and balanced
- Head up to see defenders and space

### The Perfect Dribbling Stance

- **Knees bent**: Low center of gravity
- **On your toes**: Ready to accelerate
- **Arms out**: Balance and protection
- **Body between ball and defender**: Shield effectively

## Essential Dribbling Moves

### 1. The Step Over

**When to use:** Creating space or changing direction

**Technique:**
1. Approach the ball at pace
2. Circle your foot around the ball
3. Push off with the opposite foot
4. Accelerate away quickly

### 2. The Cruyff Turn

**When to use:** Tight spaces, changing direction 180 degrees

**Technique:**
1. Fake a pass or shot
2. Drag the ball behind your standing leg
3. Turn your body
4. Accelerate in the new direction

### 3. The Body Feint

**When to use:** 1v1 situations, creating doubt in the defender

**Technique:**
1. Drop your shoulder one direction
2. Shift your weight convincingly
3. Push the ball the opposite way
4. Explode past the defender

### 4. La Croqueta (Inside-Inside)

**When to use:** Beating a defender in tight space

**Technique:**
1. Push the ball with inside of one foot
2. Immediately touch with inside of other foot
3. Move your body through the gap
4. Accelerate away

## 1v1 Situations

### Reading the Defender

**Questions to ask:**
- Is he on his heels or toes?
- Which way is he forcing me?
- Is he balanced or leaning?
- How much space is behind him?

### Attacking the Defender

**Golden Rules:**
1. **Attack with pace**: Force them to make decisions
2. **Go at them**: Don't slow down early
3. **Commit them**: Make them move first
4. **Explode past**: Change of pace is deadly

### When to Dribble vs. When to Pass

**Dribble when:**
- You have space to attack
- Defender is isolated
- Creating a scoring chance
- Need to relieve pressure

**Pass when:**
- Teammate is in better position
- Multiple defenders
- Running into traffic
- Better angle for a pass

## Speed Variations

### Changes of Pace

The most effective weapon is changing speed:

1. **Slow to fast**: Lull defender, then explode
2. **Fast to slow**: Sudden stop creates space
3. **Fast to faster**: Peak burst of acceleration

**Practice:**
- Cone dribbling with speed changes
- Stop-and-go drills
- Acceleration sprints with ball

## Training Drills

### Cone Dribbling

Set up cones in various patterns:
- Straight line (speed)
- Zigzag (close control)
- Random (decision making)
- Tight spaces (ball mastery)

**Focus on:**
- Using both feet
- Different surfaces
- Speed variations
- Head up

### 1v1 Shadow Dribbling

Partner mirrors your movements as you dribble. Forces you to:
- Keep ball close
- Change direction quickly
- Protect the ball
- Maintain awareness

### Pressure Dribbling

Have a partner apply light pressure as you dribble in a grid. Gradually increase:
- Size of the grid (smaller = harder)
- Intensity of pressure
- Time limit
- Number of touches required

## Advanced Concepts

### Using Your Body

Your body is your best shield:
- Stay between ball and defender
- Use your arm (without pushing)
- Be strong and balanced
- Protect the ball at all costs

### Spatial Awareness

Always know:
- Where the space is
- Where defenders are
- Where support is
- Where the goal is

### The Exit Plan

Before you dribble, know:
- What happens if you beat the defender?
- What's your next move?
- Where's the support?
- Can you shoot?

## Common Mistakes

1. **Head down**: Can't see space or teammates
2. **Too many touches**: Slows you down
3. **Predictable**: Using the same move every time
4. **No purpose**: Dribbling for the sake of dribbling
5. **Wrong situations**: Trying to dribble when should pass

## Mental Approach

### Confidence

- Trust your ability
- Don't fear making mistakes
- Back yourself in 1v1s
- Take on defenders

### Decision Making

Ask yourself:
- Is this the right time?
- Do I have the space?
- What's the reward vs. risk?
- Can I create something?

## Learning from the Best

Study these dribblers:
- **Lionel Messi**: Close control and balance
- **Neymar Jr**: Flair and creativity
- **Eden Hazard**: Body feints and acceleration
- **Vinicius Jr**: Pure pace and directness

Notice how they:
- Keep it simple when needed
- Explode when space opens
- Protect the ball brilliantly
- Make quick decisions

## 8-Week Development Plan

### Weeks 1-2: Ball Mastery
- 20 minutes daily of ball touches
- Both feet, all surfaces
- Stationary and moving

### Weeks 3-4: Basic Moves
- Learn 3 fundamental moves
- Practice until automatic
- Use in small-sided games

### Weeks 5-6: 1v1 Situations
- Live 1v1 drills
- Decision making under pressure
- Speed variations

### Weeks 7-8: Game Application
- Use in training matches
- Take risks and learn
- Build confidence

## Key Principles

1. **Master the basics first**: Close control before fancy moves
2. **Both feet**: Essential for unpredictability
3. **Head up**: Can't beat what you can't see
4. **Purpose**: Every dribble should have intent
5. **Practice**: Thousands of hours of ball work needed

## Conclusion

Great dribbling combines:
- Technical ability
- Confidence
- Decision making
- Game intelligence

Start with the fundamentals, build your arsenal of moves, and most importantly - practice with purpose. The ball should feel like an extension of your foot.

Remember: The best move is the one that works. Sometimes the simplest solution is the best one.
    `,
    relatedPosts: ['mastering-first-touch', 'speed-and-agility', 'finishing-techniques']
  },
  'speed-and-agility': {
    slug: 'speed-and-agility',
    title: 'Speed and Agility Training for Football Players',
    excerpt: 'Build explosive power, acceleration, and agility with football-specific training methods and exercises.',
    category: 'Training',
    author: {
      name: 'Coach David Martinez',
      role: 'Performance & Conditioning Coach',
      avatar: '/authors/david-martinez.jpg'
    },
    date: '2025-01-12',
    readTime: '12 min read',
    image: '/blog/speed-agility.jpg',
    content: `
## Why Speed Matters in Football

Speed isn't just about running fast in a straight line. In football, it's about:
- First step quickness
- Change of direction ability
- Acceleration and deceleration
- Multi-directional movement
- Reaction time

## Types of Speed in Football

### 1. Linear Speed

Straight-line sprinting ability:
- Chasing long balls
- Counter-attacking runs
- Getting back on defense
- Sprint recovery

### 2. Acceleration

First 5-10 yards of a sprint:
- Most crucial for football
- Beating defenders to space
- Pressing opponents
- Explosive starts

### 3. Agility

Changing direction efficiently:
- Cutting and turning
- Evading defenders
- Defensive positioning
- Quick feet in tight spaces

### 4. Reaction Speed

Mental processing and physical response:
- Reading plays
- Reacting to movements
- Anticipation
- Quick decision making

## Training Components

### Warm-Up Protocol

Never skip the warm-up - it prevents injuries and enhances performance:

**Dynamic Stretching (10 minutes):**
- High knees
- Butt kicks
- Leg swings
- Walking lunges
- Arm circles
- Torso rotations

**Activation Exercises (5 minutes):**
- Glute bridges
- Lateral band walks
- Calf raises
- Ankle circles

### Acceleration Drills

#### 1. Wall Drives

**Purpose:** Develop proper sprint mechanics

**How to:**
1. Lean against wall at 45-degree angle
2. Drive one knee up explosively
3. Extend back leg fully
4. Switch legs
5. Focus on power and form

**Sets/Reps:** 3 sets x 20 drives per leg

#### 2. Resistance Sprints

**Purpose:** Build explosive power

**Methods:**
- Resistance bands
- Sled pushes
- Parachute runs
- Hill sprints

**Protocol:** 6-8 reps x 20 yards, full recovery

#### 3. Flying Sprints

**Purpose:** Maximum velocity development

**How to:**
1. Build up speed for 20 yards
2. Sprint at maximum speed for 20 yards
3. Decelerate for 20 yards

**Sets/Reps:** 4-6 sprints, 2-3 minutes rest

### Agility Training

#### 1. Cone Drills

**T-Drill:**
1. Sprint forward 10 yards
2. Shuffle right 5 yards
3. Shuffle left 10 yards
4. Shuffle right 5 yards
5. Backpedal to start

**Protocol:** 5-6 reps, rest 45 seconds

**5-10-5 Shuttle:**
1. Sprint right 5 yards
2. Touch line
3. Sprint left 10 yards
4. Touch line
5. Sprint right 5 yards

**Protocol:** 4-5 reps per side

#### 2. Ladder Drills

**Benefits:**
- Quick feet
- Coordination
- Footwork patterns
- Neuromuscular development

**Essential Patterns:**
- One foot in each square
- Two feet in each square
- In-in-out-out
- Icky shuffle
- Crossovers

**Protocol:** 3-4 patterns x 3 reps each

#### 3. Reactive Agility

**Partner Mirror Drill:**
1. Face your partner 5 yards apart
2. Partner moves randomly
3. Mirror their movements
4. Quick reactions and changes

**Protocol:** 30-second intervals x 4-6 rounds

### Plyometric Training

#### Box Jumps

**Purpose:** Explosive power development

**Progression:**
1. Box height: Start low (12-18 inches)
2. Increase height as you progress
3. Focus on soft landings
4. Reset between jumps

**Protocol:** 3-4 sets x 5-8 reps

#### Lateral Bounds

**Purpose:** Lateral power and stability

**How to:**
1. Stand on one leg
2. Push off explosively sideways
3. Land on opposite leg
4. Stick the landing
5. Repeat other direction

**Protocol:** 3 sets x 8 bounds per side

#### Depth Jumps

**Purpose:** Reactive strength

**How to:**
1. Step off box (18-24 inches)
2. Land and immediately jump up
3. Minimize ground contact time
4. Maximum height on rebound

**Protocol:** 3-4 sets x 4-6 reps

**CAUTION:** Advanced exercise - proper form essential

## Speed Endurance

### Repeated Sprint Ability

Football requires multiple sprints throughout a match:

**Protocol:**
- 6-10 sprints x 30-40 yards
- 20-30 seconds rest between sprints
- Maintains quality while building endurance

### Interval Training

**High-Intensity Intervals:**
- Sprint 30 seconds
- Rest 90 seconds
- Repeat 8-10 times

**Benefits:**
- Cardiovascular fitness
- Recovery between sprints
- Game-specific conditioning

## Strength Training for Speed

### Lower Body Emphasis

**Essential Exercises:**
1. **Squats**: Back squats, front squats, goblet squats
2. **Deadlifts**: Conventional, Romanian, single-leg
3. **Lunges**: Forward, reverse, walking
4. **Step-ups**: Weighted, explosive
5. **Nordic Curls**: Hamstring strength

**Protocol:**
- 3-4 sets
- 4-8 reps
- Heavy weight (80-90% 1RM)
- Full recovery

### Core Strength

Strong core = efficient power transfer:

**Key Exercises:**
- Planks (front, side)
- Anti-rotation presses
- Dead bugs
- Russian twists
- Medicine ball slams

**Protocol:** 3 sets x 30-60 seconds or 10-15 reps

## Weekly Training Structure

### Sample Week

**Monday:** Speed and acceleration
- Warm-up
- Acceleration drills
- Sprint mechanics
- Cool-down

**Tuesday:** Strength training
- Lower body emphasis
- Core work
- Recovery

**Wednesday:** Agility and change of direction
- Warm-up
- Cone drills
- Ladder work
- Reactive drills

**Thursday:** Recovery/Light technical work
- Active recovery
- Ball work
- Stretching

**Friday:** Plyometrics and power
- Warm-up
- Box jumps
- Bounds
- Speed endurance

**Saturday:** Match or match simulation
**Sunday:** Rest and recovery

## Recovery and Injury Prevention

### Importance of Recovery

Training breaks you down; recovery builds you up:

**Recovery Methods:**
- Proper sleep (8-9 hours)
- Nutrition and hydration
- Active recovery
- Foam rolling
- Stretching
- Ice baths (optional)

### Injury Prevention

**Key Focus Areas:**
1. **Hamstring strength**: Nordic curls, RDLs
2. **Ankle stability**: Balance work, resistance bands
3. **Hip mobility**: Dynamic stretches, mobility work
4. **Proper mechanics**: Quality over quantity

### Mobility Work

**Daily Routine (10-15 minutes):**
- Hip openers
- Ankle mobility
- Thoracic spine rotation
- Hamstring stretches
- Quad stretches

## Nutrition for Speed

### Pre-Training

**2-3 hours before:**
- Complex carbohydrates
- Lean protein
- Moderate fats

**30 minutes before:**
- Quick-digesting carbs
- Light snack
- Hydration

### Post-Training

**Within 30 minutes:**
- Protein shake
- Simple carbohydrates
- Electrolytes

**Within 2 hours:**
- Complete meal
- Protein + carbs + vegetables
- Rehydration

## Measuring Progress

### Testing Protocols

**Every 4-6 weeks, test:**

1. **10-yard sprint**: Acceleration
2. **40-yard sprint**: Speed and acceleration
3. **T-drill**: Agility
4. **Vertical jump**: Power
5. **Broad jump**: Horizontal power

**Track improvements:**
- Keep detailed records
- Note conditions
- Monitor trends
- Adjust training accordingly

## Common Mistakes

1. **Skipping warm-up**: Recipe for injury
2. **Poor form**: Speed with poor mechanics builds bad habits
3. **Overtraining**: Quality over quantity
4. **Neglecting recovery**: Growth happens during rest
5. **No periodization**: Need variation in training
6. **Wrong footwear**: Proper cleats/shoes matter

## Mental Aspects

### Mindset for Speed

- **Compete every rep**: Train like you play
- **Quality focus**: Perfect practice makes perfect
- **Confidence**: Believe in your speed
- **Visualization**: See yourself being fast

## Key Principles

1. **Warm up properly**: Always
2. **Focus on form**: Technique before speed
3. **Progressive overload**: Gradually increase difficulty
4. **Recover adequately**: Rest is part of training
5. **Be consistent**: Regular training yields results
6. **Train specifically**: Football-specific movements

## Conclusion

Speed and agility aren't just genetic gifts - they're trainable skills. With:
- Proper programming
- Consistent effort
- Smart recovery
- Good nutrition

You can dramatically improve your speed and explosiveness.

Remember: The fastest player isn't always the most successful. It's the player who can apply their speed intelligently in game situations.

Start with the fundamentals, progress gradually, and train with purpose. Your speed will come.
    `,
    relatedPosts: ['dribbling-basics', 'strength-conditioning', 'injury-prevention']
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = blogPosts[params.slug]

  if (!post) {
    return {
      title: 'Post Not Found | Kickoff Club Blog',
    }
  }

  return {
    title: `${post.title} | Kickoff Club Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `https://kickoffclubhq.com/blog/${params.slug}`,
    },
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = blogPosts[params.slug]

  if (!post) {
    notFound()
  }

  // Get related posts
  const relatedPostsData = post.relatedPosts
    ?.map((slug: string) => blogPosts[slug])
    .filter(Boolean)
    .slice(0, 3) || []

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <ThemedHeader />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center text-orange-400 hover:text-orange-500 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Link>

        {/* Featured Image */}
        <div className="aspect-video bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg overflow-hidden flex items-center justify-center mb-8">
          <span className="text-white text-8xl">🏈</span>
        </div>

        {/* Post Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-white/10 border-white/20 text-white">{post.category}</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{post.title}</h1>
          <p className="text-xl text-white/70 mb-6">{post.excerpt}</p>

          {/* Author and Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/60 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-white font-medium">{post.author.name}</div>
                <div className="text-white/50 text-xs">{post.author.role}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>

          {/* Share Buttons */}
          <ShareButtons
            url={`https://kickoffclubhq.com/blog/${params.slug}`}
            title={post.title}
            description={post.excerpt}
          />
        </div>

        {/* Post Content */}
        <Card className="mb-8 bg-white/5 backdrop-blur-xl border border-white/10">
          <CardContent className="p-8">
            <div className="prose prose-invert prose-lg max-w-none">
              <div
                className="text-white/80 leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: post.content.replace(/\n### /g, '\n<h3 class="text-2xl font-bold text-white mt-8 mb-4">').replace(/\n## /g, '\n<h2 class="text-3xl font-bold text-white mt-10 mb-6">').replace(/\n# /g, '\n<h1 class="text-4xl font-bold text-white mt-12 mb-8">').replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>').replace(/\n- /g, '\n• ').replace(/\n\d+\. /g, '\n<span class="text-orange-400">➤</span> ') }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Related Posts */}
        {relatedPostsData.length > 0 && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPostsData.map((relatedPost: any) => (
                <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`}>
                  <Card className="h-full bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                    <div className="aspect-video bg-gradient-to-br from-orange-500 to-orange-600 rounded-t-lg overflow-hidden flex items-center justify-center">
                      <span className="text-white text-4xl">🏈</span>
                    </div>
                    <CardContent className="p-4">
                      <Badge className="bg-white/10 border-white/20 text-white text-xs mb-2">{relatedPost.category}</Badge>
                      <h3 className="text-white font-semibold mb-2 line-clamp-2">{relatedPost.title}</h3>
                      <p className="text-white/60 text-sm line-clamp-2">{relatedPost.excerpt}</p>
                      <div className="flex items-center gap-2 text-xs text-white/50 mt-3">
                        <Clock className="h-3 w-3" />
                        <span>{relatedPost.readTime}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <Card className="bg-gradient-to-br from-orange-600/20 to-orange-700/20 backdrop-blur-xl border border-orange-500/30">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-3">Ready to Level Up Your Game?</h3>
            <p className="text-white/70 mb-6">
              Explore our comprehensive football training courses and take your skills to the next level.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/courses">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                  Browse Courses
                </Button>
              </Link>
              <Link href="/blog">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Read More Articles
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
