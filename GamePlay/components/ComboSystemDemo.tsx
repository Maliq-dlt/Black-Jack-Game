import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ComboChainDisplay, ComboPopup, MiniComboIndicator, ComboType } from './ComboChainDisplay';
import { useComboSystem } from '../hooks/useComboSystem';

/**
 * ComboSystemDemo - Demo lengkap untuk combo system
 * 
 * Menunjukkan cara penggunaan ComboChainDisplay dengan useComboSystem
 */
export const ComboSystemDemo: React.FC = () => {
  const {
    combos,
    activeCombos,
    totalMultiplier,
    baseScore,
    finalScore,
    comboCount,
    activateCombo,
    deactivateCombo,
    deactivateAllCombos,
    updateStreak,
    checkJokerSynergy
  } = useComboSystem({
    maxCombos: 15,
    comboDecayTime: 0, // Don't auto-expire for demo
    onComboActivate: (combo) => {
      setRecentCombo(combo);
      setTimeout(() => setRecentCombo(null), 2000);
    }
  });

  const [recentCombo, setRecentCombo] = useState<typeof combos[0] | null>(null);
  const [streakCount, setStreakCount] = useState(0);
  const [jokerCount, setJokerCount] = useState(0);
  const [showDisplay, setShowDisplay] = useState(true);

  // Hand simulation
  const simulateHand = (handType: ComboType) => {
    activateCombo(handType);
  };

  // Simulate win streak
  const addWin = () => {
    const newStreak = streakCount + 1;
    setStreakCount(newStreak);
    updateStreak(newStreak);
  };

  const resetStreak = () => {
    setStreakCount(0);
    updateStreak(0);
  };

  // Simulate jokers
  const addJoker = () => {
    const newCount = jokerCount + 1;
    setJokerCount(newCount);
    checkJokerSynergy(newCount);
  };

  const removeJoker = () => {
    const newCount = Math.max(0, jokerCount - 1);
    setJokerCount(newCount);
    checkJokerSynergy(newCount);
  };

  // Calculate simulated payout
  const simulatedPayout = Math.floor(100 * totalMultiplier);

  return (
    <div className="min-h-screen bg-zinc-900 p-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-600 rounded-full blur-[150px]" />
      </div>

      {/* Combo Popup */}
      <AnimatePresence>
        {recentCombo && (
          <ComboPopup 
            combo={recentCombo} 
            onComplete={() => setRecentCombo(null)}
          />
        )}
      </AnimatePresence>

      {/* Combo Chain Display */}
      {showDisplay && (
        <ComboChainDisplay
          combos={combos}
          totalMultiplier={totalMultiplier}
          baseScore={baseScore}
          finalScore={finalScore}
          position="right"
          showDetails={true}
        />
      )}

      {/* Mini indicator (for compact view) */}
      <div className="fixed top-4 right-4 z-50">
        <MiniComboIndicator
          comboCount={comboCount}
          totalMultiplier={totalMultiplier}
          onClick={() => setShowDisplay(!showDisplay)}
        />
      </div>

      {/* Main content */}
      <div className="max-w-2xl relative z-10">
        <h1 className="text-4xl font-bold text-white mb-2">⚡ Combo System Demo</h1>
        <p className="text-gray-400 mb-8">Dynamic combo chain display like Balatro</p>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-800 p-4 rounded-xl">
            <div className="text-gray-400 text-xs uppercase">Combos</div>
            <div className="text-2xl font-bold text-white">{comboCount}</div>
          </div>
          <div className="bg-zinc-800 p-4 rounded-xl">
            <div className="text-gray-400 text-xs uppercase">Multiplier</div>
            <div className="text-2xl font-bold text-yellow-400">×{totalMultiplier.toFixed(2)}</div>
          </div>
          <div className="bg-zinc-800 p-4 rounded-xl">
            <div className="text-gray-400 text-xs uppercase">Base Score</div>
            <div className="text-2xl font-bold text-white">${baseScore}</div>
          </div>
          <div className="bg-zinc-800 p-4 rounded-xl border-2 border-yellow-500/50">
            <div className="text-yellow-500 text-xs uppercase">Final</div>
            <div className="text-2xl font-bold text-yellow-400">${finalScore.toFixed(0)}</div>
          </div>
        </div>

        {/* Hand Combos */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">🎴 Hand Combos</h2>
          <div className="grid grid-cols-3 gap-2">
            {[
              { type: 'pair' as ComboType, label: 'Pair', color: 'bg-gray-600' },
              { type: 'two_pair' as ComboType, label: 'Two Pair', color: 'bg-gray-500' },
              { type: 'three_kind' as ComboType, label: 'Three of a Kind', color: 'bg-blue-600' },
              { type: 'straight' as ComboType, label: 'Straight', color: 'bg-green-600' },
              { type: 'flush' as ComboType, label: 'Flush', color: 'bg-cyan-600' },
              { type: 'full_house' as ComboType, label: 'Full House', color: 'bg-purple-600' },
              { type: 'four_kind' as ComboType, label: 'Four of a Kind', color: 'bg-yellow-600' },
              { type: 'straight_flush' as ComboType, label: 'Straight Flush', color: 'bg-orange-600' },
              { type: 'royal_flush' as ComboType, label: 'Royal Flush', color: 'bg-red-600' },
            ].map(({ type, label, color }) => (
              <motion.button
                key={type}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => simulateHand(type)}
                className={`${color} text-white py-3 px-4 rounded-lg font-bold text-sm`}
              >
                {label}
              </motion.button>
            ))}
          </div>
        </section>

        {/* Special Combos */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">⭐ Special Combos</h2>
          <div className="grid grid-cols-3 gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => simulateHand('blackjack')}
              className="bg-zinc-800 text-white py-3 px-4 rounded-lg font-bold border border-zinc-700"
            >
              🃏 Blackjack
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => simulateHand('lucky_seven')}
              className="bg-zinc-800 text-white py-3 px-4 rounded-lg font-bold border border-zinc-700"
            >
              7️⃣ Lucky Seven
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => simulateHand('ace_high')}
              className="bg-zinc-800 text-white py-3 px-4 rounded-lg font-bold border border-zinc-700"
            >
              🅰️ Ace High
            </motion.button>
          </div>
        </section>

        {/* Streak Control */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">🔥 Win Streak</h2>
          <div className="bg-zinc-800 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400">Current Streak</span>
              <span className="text-2xl font-bold text-orange-400">{streakCount} wins</span>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addWin}
                className="flex-1 bg-orange-600 text-white py-2 rounded-lg font-bold"
              >
                + Add Win
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetStreak}
                className="px-4 bg-zinc-700 text-white rounded-lg font-bold"
              >
                Reset
              </motion.button>
            </div>
          </div>
        </section>

        {/* Joker Control */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">🤡 Joker Synergy</h2>
          <div className="bg-zinc-800 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400">Active Jokers</span>
              <span className="text-2xl font-bold text-purple-400">{jokerCount}</span>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addJoker}
                className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-bold"
              >
                + Add Joker
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={removeJoker}
                className="px-4 bg-zinc-700 text-white rounded-lg font-bold"
              >
                -
              </motion.button>
            </div>
          </div>
        </section>

        {/* Payout Simulation */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">💰 Payout Simulation</h2>
          <div className="bg-gradient-to-r from-yellow-900/50 to-amber-900/50 p-6 rounded-xl border border-yellow-500/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-yellow-500/70 text-sm uppercase">Base Bet</div>
                <div className="text-3xl font-bold text-white">$100</div>
              </div>
              <div className="text-4xl text-yellow-500">×</div>
              <div>
                <div className="text-yellow-500/70 text-sm uppercase">Multiplier</div>
                <div className="text-3xl font-bold text-yellow-400">{totalMultiplier.toFixed(2)}</div>
              </div>
              <div className="text-4xl text-yellow-500">=</div>
              <div>
                <div className="text-yellow-500/70 text-sm uppercase">Payout</div>
                <motion.div 
                  key={simulatedPayout}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="text-4xl font-black text-yellow-400"
                >
                  ${simulatedPayout.toLocaleString()}
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Controls */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">🎮 Controls</h2>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={deactivateAllCombos}
              className="flex-1 bg-red-600 text-white py-3 rounded-lg font-bold"
            >
              Clear All Combos
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDisplay(!showDisplay)}
              className="flex-1 bg-zinc-700 text-white py-3 rounded-lg font-bold"
            >
              {showDisplay ? 'Hide' : 'Show'} Display
            </motion.button>
          </div>
        </section>

        {/* Integration Code */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-white mb-4">📖 Integration Code</h2>
          <div className="bg-zinc-950 p-4 rounded-xl overflow-x-auto">
            <pre className="text-sm text-green-400">
{`// 1. Import components and hook
import { ComboChainDisplay, ComboPopup } from './components/ComboChainDisplay';
import { useComboSystem } from './hooks/useComboSystem';

// 2. Use the hook in your game component
function BlackjackGame() {
  const {
    combos,
    totalMultiplier,
    activateCombo,
    deactivateAllCombos
  } = useComboSystem();

  // 3. Check for combos when hand is dealt
  const checkHand = (hand: Card[]) => {
    if (isBlackjack(hand)) {
      activateCombo('blackjack');
    }
    if (hasPair(hand)) {
      activateCombo('pair');
    }
    // ... etc
  };

  // 4. Render the combo display
  return (
    <>
      <ComboChainDisplay
        combos={combos}
        totalMultiplier={totalMultiplier}
        baseScore={100}
        finalScore={100 * totalMultiplier}
        position="right"
      />
      {/* Your game UI */}
    </>
  );
}`}
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ComboSystemDemo;
