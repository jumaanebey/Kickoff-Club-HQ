
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
