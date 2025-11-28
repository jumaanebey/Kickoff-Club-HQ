<<<<<<< HEAD
# Kickoff Club HQ - Mobile Game PRD

## 1. Executive Summary
**Kickoff Club HQ** is a mobile-first football management simulation game ("Clash of Clans meets Madden"). Players build their franchise headquarters, train units, and simulate matches to climb the leaderboard. This is distinct from the **Kickoff Club Web Platform**, which is an educational hub for learning football concepts.

**Core Distinction:**
*   **Mobile App:** **Game-First**. Focus on resource management, base building, and match simulation.
*   **Website:** **Education-First**. Focus on video courses, quizzes, and community learning.

---

## 2. Core Gameplay Loop (Mobile)

### A. Base Building (The "HQ")
*   **Mechanic:** Isometric city-builder. Players place and upgrade buildings on a grid.
*   **Goal:** Increase resource production and unlock gameplay features.
*   **Resources:**
    *   **Coins:** Used for buildings and decor. Earned from Matches and Stadium income.
    *   **XP:** Used for User Level. Earned from upgrades and matches.
    *   **Energy:** Used to play matches. Regenerates over time.
    *   **Knowledge Points (KP):** (Future) Used for "Tech Tree" research.

### B. Squad Management
*   **Mechanic:** Train generic units into specialized roles.
*   **Unit Types:**
    *   Offensive Line (OL)
    *   Skill Positions (WR/RB)
    *   Defensive Line (DL)
    *   Secondary (DB)
    *   Special Teams (ST)
*   **States:** `Idle` -> `Training` (Time-gated) -> `Ready`.
*   **Stats:** Training increases the "Team Rating" (OVR).

### C. Match Simulation
*   **Mechanic:** Asynchronous simulation (Auto-Battler).
*   **Input:** Player chooses a **Strategy** (e.g., "Aggressive Pass", "Balanced Run").
*   **Calculation:** `(My Team Rating + Strategy Bonus) vs (Opponent Rating + RNG)`.
*   **Outcome:** Win/Loss, Score, Coins/XP Reward.

---

## 3. Asset Inventory & Needs

### ✅ Existing Assets (Ready for Mobile)
These assets have been generated and processed (PNG Sprites).

| Category | Asset Name | Levels/Variants | Status |
| :--- | :--- | :--- | :--- |
| **Buildings** | **Stadium** | Lvl 1, Lvl 3, Lvl 5 | ✅ Ready |
| **Buildings** | **Headquarters** | Lvl 1, Lvl 3, Lvl 5 | ✅ Ready |
| **Buildings** | **Practice Field** | Lvl 1, Lvl 3, Lvl 5 | ✅ Ready |
| **Buildings** | **Film Room** | Lvl 1, Lvl 3, Lvl 5 | ✅ Ready |
| **Buildings** | **Weight Room** | Lvl 1, Lvl 3, Lvl 5 | ✅ Ready |
| **Decor** | **Team Bus** | - | ✅ Ready |
| **Decor** | **Tailgate Tent** | - | ✅ Ready |
| **Decor** | **Statue of Legends** | - | ✅ Ready |
| **Decor** | **Club Fountain** | - | ✅ Ready |
| **Decor** | **Merch Stand** | - | ✅ Ready |
| **Decor** | **Parking Lot** | - | ✅ Ready |
| **Units** | **All 5 Groups** | Idle, Training, Ready | ✅ Ready |
| **UI** | **Icons** | Coins, XP, Energy, Ranks | ✅ Ready |

### 🚧 Missing Assets (Required for "Polish")
To achieve a smooth, premium feel, we need to fill the gaps.

| Priority | Category | Asset Name | Reason |
| :--- | :--- | :--- | :--- |
| **High** | **Buildings** | All Buildings (Lvl 2 & Lvl 4) | Smooth visual progression (1->2->3->4->5). |
| **High** | **Buildings** | Medical Center | Core gameplay: Energy regeneration. |
| **High** | **Buildings** | Scouting Office | Core gameplay: Finding better units. |
| **Medium** | **Decor** | Roads (Straight, Corner, T) | Connects buildings visually. |
| **Medium** | **Decor** | Nature (Trees, Hedges) | "Juice" / Beautification. |
| **Low** | **UI** | Match Sim Overlay | Visuals for the match screen (Scoreboard, Field). |

---

## 4. Technical Architecture

### Database Schema (`user_hq` table)
*   `user_id` (UUID)
*   `coins` (Int)
*   `xp` (Int)
*   `energy` (Int) - *New*
*   `last_energy_update` (Timestamp) - *New*
*   `building_levels` (JSONB): `{ "stadium": 1, "medical": 2, ... }`
*   `decor_slots` (JSONB): `[ { "id": "fountain", "x": 10, "y": 20 }, ... ]`
*   `units` (JSONB): `{ "ol": { "count": 5, "level": 2 }, ... }` - *New*

### Shared Logic (Mobile & Web)
*   **Supabase:** Single source of truth for user data.
*   **Assets:** Hosted on Web (`/public/kickoff-club-assets`), downloaded by Mobile App on launch.

---

## 5. Implementation Roadmap

### Phase 1: The "Loop" (Current Focus)
1.  **Finish Assets:** Generate Lvl 2/4 buildings and Medical/Scouting centers.
2.  **Implement Energy:** Add `energy` column to DB and regeneration logic.
3.  **Implement Sim Match:** Create a simple "Battle" button that runs the sim logic and awards coins.

### Phase 2: The "Depth"
1.  **Unit Training:** Add UI to assign units to the Practice Field.
2.  **Decor Placement:** Allow "Drag and Drop" placement of decor (currently fixed slots on Web, needs grid logic on Mobile).

### Phase 3: The "Social"
1.  **Leaderboards:** Rank players by XP/Team Rating.
2.  **Visiting:** Visit other players' HQs.

---

## 6. Action Items
1.  **Wait for API Quota:** To generate the remaining High Priority assets.
2.  **Database Update:** Add `energy` and `units` columns to `user_hq`.
3.  **Sim Logic:** Write the `simulateMatch` server action.
=======
# Kickoff Club HQ - Games Expansion Plan

## Objective
Create a suite of 6 interactive mini-games to gamify the learning process of American Football. These games should be accessible, mobile-friendly, and reinforce the concepts taught in the courses.

## 1. Guess the Penalty (Existing)
*   **Concept:** Users watch a short clip or see a scenario description and must identify the correct penalty.
*   **Status:** Implemented.
*   **Improvement:** Add more scenarios, video clips, and a "Streak" mode.

## 2. Play Caller (The Quarterback Mind)
*   **Concept:** Users are presented with a defensive formation (e.g., Cover 2, Blitz) and must select the best offensive play to counter it (e.g., Run up middle, Quick Slant, Screen Pass).
*   **Mechanics:**
    *   Image of defense shown.
    *   3 Play options presented.
    *   Immediate feedback with explanation ("Correct! A screen pass counters the blitz by getting the ball out fast.").
*   **Assets Needed:** Diagrams of defensive formations.

## 3. Formation Frenzy (Drag & Drop)
*   **Concept:** Users must arrange players on the field to match a specific formation name.
*   **Mechanics:**
    *   Prompt: "Set up the I-Formation".
    *   User drags icons (QB, RB, FB, WR, TE, OL) to grid positions.
    *   "Check Formation" button validates the layout.
*   **Assets Needed:** Player position icons.

## 4. Route Runner (Tracing)
*   **Concept:** Learn route trees by tracing the path on the screen.
*   **Mechanics:**
    *   Prompt: "Run a Post Route".
    *   User draws the line on the field.
    *   Accuracy score based on how close they are to the ideal path.
*   **Assets Needed:** Touch/Mouse drawing canvas.

## 5. Signal Caller (Ref School)
*   **Concept:** Rapid-fire identification of referee hand signals.
*   **Mechanics:**
    *   Image of a referee making a signal pops up.
    *   4 multiple choice options (e.g., "Holding", "Offsides", "Touchdown").
    *   Time limit (e.g., 5 seconds per signal).
*   **Assets Needed:** Illustrations or photos of referee signals.

## 6. Clock Manager (Two-Minute Drill)
*   **Concept:** Simulate the high-pressure end-of-game management.
*   **Mechanics:**
    *   Scenario: "Down by 4, 20 seconds left, no timeouts, ball on 30 yard line. Clock running. What do you do?"
    *   Options: "Spike the ball", "Hail Mary", "Run play".
    *   Wrong choice results in "Game Over" (Time runs out).
*   **Assets Needed:** Digital clock UI, scoreboard UI.

## Implementation Strategy
*   **Tech Stack:** React, Framer Motion (for animations), Zustand (for game state).
*   **Integration:** All games will live under `/games/[game-slug]`.
*   **Rewards:** Users earn "Yards" or "Touchdowns" for completing games, which contribute to their profile level.
>>>>>>> origin/main
