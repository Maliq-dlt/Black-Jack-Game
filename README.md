# Royale Blackjack AI

A high-stakes, roguelike Blackjack adventure where you battle against the house using deck-building mechanics, artifacts, and strategy.

![Royale Blackjack AI Banner](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

## Overview

**Royale Blackjack AI** (also known as *Royale Rogue*) combines the classic thrill of Blackjack with deep roguelike progression. Climb the ranks, defeat bosses with unique traits, and build powerful synergies using artifacts and wild cards.

Powered by **Google Gemini**, the AI dealer reacts to your every move—taunting your losses, respecting your wins, and commenting on your risky plays in real-time.

## Key Features

*   **🃏 Roguelike Progression**: Survive as long as you can. Manage your bankroll (Health), climb through stages, and face "The House" in high-stakes boss battles.
*   **🏺 Artifact System**: Collect over 30 unique artifacts like **Golden Touch** (win bonus), **Vampiric Gamble** (heal on pushes), and **Lucky Seven** to break the standard rules of Blackjack.
*   **⚔️ Boss Battles**: Face unique bosses with cheat-like traits, such as:
    *   **Greedy Dealer**: Hits on soft 17.
    *   **Hidden Card Buff**: Swaps low hidden cards for 10s.
    *   **Tax Collector**: Penalizes every hit with a fee.
*   **🔮 Deck Building**: Visit the **Black Market** to remove weak cards from your deck, purchase **Wild Cards** (Bonus Cash, Shielded, Gilded), and buy consumables like "Peek" or "Transmute".
*   **🤖 AI Dealer Commentary**: The dealer has a voice. Using the Google Gemini API, the dealer provides context-aware commentary based on the game state and your performance.
*   **🎨 Immersive Visuals**: Features a gritty "noir" aesthetic, 3D card flip animations, particle effects, and a reactive dynamic soundtrack.

## Getting Started

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/royale-blackjack-ai.git
    cd royale-blackjack-ai
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  **Configure AI (Optional but Recommended)**:
    To enable the dynamic dealer commentary, you need a Google Gemini API key.

    *   Create a file named `.env.local` in the root directory.
    *   Add your API key:
        ```env
        GEMINI_API_KEY=your_api_key_here
        ```

### Running the Game

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

## How to Play

1.  **Place Your Bets**: Start with a small bankroll. Bet wisely to survive the early rounds.
2.  **Play Blackjack**: Hit, Stand, Double, or Split. Try to beat the dealer without going over 21.
3.  **Earn & Upgrade**: Winning hands earns you chips.
4.  **Visit the Shop**: Between rounds, spend your earnings on **Artifacts** (passive bonuses) or **Power-ups** (one-time use items).
5.  **Defeat the Boss**: Every 5th stage is a Boss Battle. Defeat them to earn Rare Artifacts and progress to the next table level.
6.  **Don't Go Broke**: If your bankroll hits $0, the run ends.

## Tech Stack

*   **Frontend**: React, TypeScript, Vite
*   **Styling**: Tailwind CSS
*   **Animations**: Framer Motion
*   **AI**: Google Generative AI (Gemini)

---

*Built for the Google AI Studio competition.*
