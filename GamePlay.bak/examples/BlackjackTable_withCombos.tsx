import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Rank, Suit } from '../types';
import { ComboChainDisplay, ComboPopup } from '../components/ComboChainDisplay';
import { useComboSystem } from '../hooks/useComboSystem';
import { useGameJuice } from '../hooks/useGameJuice';
import CardComponent from './CardComponent_withJuice';

interface BlackjackTableProps {
  playerHand: Card[];
  dealerHand: Card[];
  gameState: 'betting' | 'playing' | 'dealer' | 'result';
  result?: 'win' | 'lose' | 'push' | 'blackjack';
  winStreak: number;
  activeJokers: number;
}

/**
 * BlackjackTable dengan Combo System Integration
 * 
 * Features:
 * - Auto-detects hand combos (pair, blackjack, etc.)
 * - Shows combo chain display
 * - Integrates with game juice
 * - Calculates final payout with multipliers
 */
export const BlackjackTable: React.FC<BlackjackTableProps> = ({
  playerHand,
  dealerHand,
  gameState,
  result,
  winStreak,
  activeJokers
}) => {
  const juice = useGameJuice();
  const {
    combos,
    activeCombos,
    totalMultiplier,
    baseScore,
    finalScore,
    activateCombo,
    deactivateAllCombos,
    updateStreak,
    checkJokerSynergy,
    recentCombo,
    showComboPopup,
    hideComboPopup
  } = useComboSystem({
    maxCombos: 15,
    comboDecayTime: 0,
    onComboActivate: (combo) => {
      showComboPopup(combo);
      // Trigger juice effect
      juice.screenShake('light');
    }
  });

  const [showComboDisplay, setShowComboDisplay] = useState(true);
  const [lastResult, setLastResult] = useState<string | null>(null);

  // Hand analysis functions
  const getHandValue = useCallback((hand: Card[]): number => {
    let value = 0;
    let aces = 0;
    
    for (const card of hand) {
      if (card.rank === Rank.Ace) {
        aces++;
        value += 11;
      } else if (['J', 'Q', 'K'].includes(card.rank)) {
        value += 10;
      } else {
        value += parseInt(card.rank);
      }
    }
    
    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }
    
    return value;
  }, []);

  const hasPair = useCallback((hand: Card[]): boolean => {
    if (hand.length < 2) return false;
    const ranks = hand.map(c => c.rank);
    return ranks[0] === ranks[1];
  }, []);

  const isBlackjack = useCallback((hand: Card[]): boolean => {
    if (hand.length !== 2) return false;
    const value = getHandValue(hand);
    return value === 21;
  }, [getHandValue]);

  const hasLuckySeven = useCallback((hand: Card[]): boolean => {
    return hand.some(c => c.rank === Rank.Seven);
  }, []);

  const hasAceHigh = useCallback((hand: Card[]): boolean => {
    return hand.some(c => c.rank === Rank.Ace) && getHandValue(hand) <= 21;
  }, [getHandValue]);

  const getSuitCounts = useCallback((hand: Card[]): Record<string, number> => {
    const counts: Record<string, number> = {};
    for (const card of hand) {
      counts[card.suit] = (counts[card.suit] || 0) + 1;
    }
    return counts;
  }, []);

  // Check for combos when hand changes
  useEffect(() => {
    if (gameState === 'playing' || gameState === 'dealer') {
      // Clear old hand combos
      const handComboTypes = ['pair', 'blackjack', 'lucky_seven', 'ace_high', 'suit_bonus'];
      activeCombos
        .filter(c => handComboTypes.includes(c.type))
        .forEach(c => deactivateAllCombos());

      // Check for new combos
      if (isBlackjack(playerHand)) {
        activateCombo('blackjack');
        juice.blackjackCelebration();
      } else if (hasPair(playerHand)) {
        activateCombo('pair');
      }

      if (hasLuckySeven(playerHand)) {
        activateCombo('lucky_seven');
      }

      if (hasAceHigh(playerHand)) {
        activateCombo('ace_high');
      }

      // Suit bonus
      const suitCounts = getSuitCounts(playerHand);
      const maxSuitCount = Math.max(...Object.values(suitCounts), 0);
      if (maxSuitCount >= 3) {
        const multiplier = 1 + (maxSuitCount - 3) * 0.3;
        activateCombo('suit_bonus', multiplier);
      }
    }
  }, [playerHand, gameState]);

  // Update streak
  useEffect(() => {
    updateStreak(winStreak);
  }, [winStreak, updateStreak]);

  // Update joker synergy
  useEffect(() => {
    checkJokerSynergy(activeJokers);
  }, [activeJokers, checkJokerSynergy]);

  // Handle game result
  useEffect(() => {
    if (result && result !== lastResult) {
      setLastResult(result);
      
      if (result === 'win' || result === 'blackjack') {
        // Big win celebration if high multiplier
        if (totalMultiplier >= 3) {
          juice.winCelebration(true);
        } else {
          juice.winCelebration(false);
        }
      } else if (result === 'lose') {
        juice.lossImpact(false);
        // Clear combos on loss (optional)
        // deactivateAllCombos();
      }
    }

    // Reset last result when entering new round
    if (gameState === 'betting') {
      setLastResult(null);
      deactivateAllCombos();
    }
  }, [result, gameState, totalMultiplier, juice, lastResult, deactivateAllCombos]);

  // Calculate final payout
  const baseBet = 100;
  const finalPayout = Math.floor(baseBet * totalMultiplier);

  return (
    <div className="relative min-h-screen bg-zinc-900">
      {/* Combo Chain Display */}
      <AnimatePresence>
        {showComboDisplay && activeCombos.length > 0 && (
          <ComboChainDisplay
            combos={combos}
            totalMultiplier={totalMultiplier}
            baseScore={baseBet}
            finalScore={finalPayout}
            position="right"
            showDetails={true}
            isCalculating={gameState === 'dealer'}
          />
        )}
      </AnimatePresence>

      {/* Combo Popup */}
      <AnimatePresence>
        {recentCombo && (
          <ComboPopup 
            combo={recentCombo}
            onComplete={hideComboPopup}
          />
        )}
      </AnimatePresence>

      {/* Mini Combo Indicator */}
      {activeCombos.length > 0 && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => setShowComboDisplay(!showComboDisplay)}
          className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #eab30820, #ca8a0420)',
            border: '2px solid #eab308',
            boxShadow: '0 0 20px rgba(234, 179, 8, 0.3)'
          }}
        >
          <motion.span
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          >
            ⚡
          </motion.span>
          <span className="text-yellow-400 font-black">
            ×{totalMultiplier.toFixed(1)}
          </span>
          <span className="text-yellow-500/70 text-sm">
            ({activeCombos.length})
          </span>
        </motion.button>
      )}

      {/* Game Table */}
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        {/* Dealer Hand */}
        <div className="mb-16">
          <h3 className="text-white/50 text-sm uppercase tracking-widest mb-4 text-center">
            Dealer
          </h3>
          <div className="flex gap-2 justify-center">
            {dealerHand.map((card, index) => (
              <CardComponent
                key={card.id}
                card={card}
                index={index}
                isHidden={gameState === 'playing' && index === 1}
              />
            ))}
          </div>
        </div>

        {/* Payout Display */}
        {activeCombos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 px-8 py-4 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
              border: '2px solid #eab308',
              boxShadow: '0 0 40px rgba(234, 179, 8, 0.2)'
            }}
          >
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-xs text-yellow-500/70 uppercase">Base Bet</div>
                <div className="text-xl font-bold text-white">${baseBet}</div>
              </div>
              <div className="text-2xl text-yellow-500">×</div>
              <div className="text-center">
                <div className="text-xs text-yellow-500/70 uppercase">Multiplier</div>
                <div className="text-2xl font-black text-yellow-400">
                  {totalMultiplier.toFixed(2)}
                </div>
              </div>
              <div className="text-2xl text-yellow-500">=</div>
              <div className="text-center">
                <div className="text-xs text-yellow-500/70 uppercase">Payout</div>
                <motion.div
                  key={finalPayout}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="text-3xl font-black text-yellow-400"
                >
                  ${finalPayout.toLocaleString()}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Player Hand */}
        <div>
          <h3 className="text-white/50 text-sm uppercase tracking-widest mb-4 text-center">
            Your Hand ({getHandValue(playerHand)})
          </h3>
          <div className="flex gap-2 justify-center">
            {playerHand.map((card, index) => (
              <CardComponent
                key={card.id}
                card={card}
                index={index}
                isWinning={result === 'win' || result === 'blackjack'}
                isLosing={result === 'lose'}
              />
            ))}
          </div>
        </div>

        {/* Active Combos List (Bottom) */}
        {activeCombos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-2 flex-wrap justify-center max-w-2xl"
          >
            {activeCombos.map((combo) => (
              <motion.div
                key={combo.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: `${combo.color}30`,
                  border: `1px solid ${combo.color}`,
                  color: combo.color
                }}
              >
                {combo.name} ×{combo.multiplier.toFixed(1)}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BlackjackTable;
