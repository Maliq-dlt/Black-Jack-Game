<div align="center">
  <h1 align="center">Royale Rogue 🃏</h1>
  <p align="center">
    <strong>High-Stakes Roguelike Blackjack with AI Commentary</strong>
  </p>
  <p align="center">
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#how-to-play">How to Play</a>
  </p>
</div>

---

## 📖 About

**Royale Rogue** is a high-stakes **Roguelike Blackjack** game where you face off against an AI dealer in a battle of wits and luck. Build your deck, collect powerful artifacts, and climb the ascension levels. The dealer, powered by **Google Gemini AI**, reacts to your moves, wins, and losses with dynamic, context-aware commentary.

Will you beat the house or lose it all to the mist?

## ✨ Features

- **🃏 Roguelike Deck Building:** Modify your deck by removing low cards or adding special **Wild Cards** (Bonus Cash, Shield, Gilded) and **Event Cards**.
- **🤖 AI Dealer Commentary:** Powered by **Google Gemini**, the dealer roasts your bad plays and comments on your lucky streaks in real-time.
- **🛡️ Artifacts & Power-ups:** Collect over 30+ unique artifacts (e.g., *Golden Touch*, *Vampiric Gamble*) and consumable power-ups (Peek, Transmute) to break the rules.
- **⚔️ Boss Battles:** Face unique bosses every 5 stages with special traits like *Hidden Card Buff*, *Greedy Dealer*, or *Tax Collector*.
- **🔥 Prestige & Skills:** Earn Prestige Points to unlock permanent upgrades and progress through a skill tree.
- **📅 Daily Challenges:** unique modifiers and leaderboards every day.
- **📈 Comprehensive Stats:** Track your lifetime earnings, win rates, and achievements.

## 🛠 Tech Stack

- **Frontend:** [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **AI Integration:** [Google Generative AI SDK](https://www.npmjs.com/package/@google/generative-ai) (Gemini)

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **pnpm** (preferred) or npm
- A **Google Gemini API Key** (Get one [here](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/royale-blackjack-ai.git
   cd royale-blackjack-ai
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the Development Server:**
   ```bash
   pnpm run dev
   ```
   Open `http://localhost:5173` (or the port shown in terminal) to play.

## 🎮 How to Play

1. **Place Your Bet:** Start small or go all in.
2. **Play Blackjack:** Hit, Stand, Double, or Split. Try to beat the dealer without busting (going over 21).
3. **Use Tools:**
   - **Artifacts:** Passive bonuses (e.g., "Wins pay 1.2x").
   - **Power-ups:** One-time uses (e.g., "Peek at dealer's hole card").
4. **Manage Your Deck:** Visit the **Black Market** to remove cards or buy enhancements.
5. **Survive:** Win consecutive hands to increase the "Heat" and reach Boss stages.
6. **Prestige:** If you lose, spend your earned Prestige Points to get stronger for the next run.

## 📜 License

This project is licensed under the MIT License.

---
<p align="center">Made with ❤️ and ☕ by the Royale Rogue Team</p>
