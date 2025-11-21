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
