import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
export type ComboType = 
  | 'pair' 
  | 'two_pair' 
  | 'three_kind' 
  | 'straight' 
  | 'flush' 
  | 'full_house' 
  | 'four_kind' 
  | 'straight_flush' 
  | 'royal_flush'
  | 'blackjack'
  | 'lucky_seven'
  | 'ace_high'
  | 'suit_bonus'
  | 'streak'
  | 'joker_synergy';

export interface Combo {
  id: string;
  type: ComboType;
  name: string;
  description: string;
  multiplier: number;
  baseValue: number;
  icon: string;
  color: string;
  isActive: boolean;
  triggeredAt: number;
}

export interface ComboChainDisplayProps {
  combos: Combo[];
  totalMultiplier: number;
  baseScore: number;
  finalScore: number;
  position?: 'left' | 'right';
  showDetails?: boolean;
  isCalculating?: boolean;
}

// Combo configurations
const COMBO_CONFIG: Record<ComboType, { name: string; icon: string; color: string; description: string }> = {
  pair: { 
    name: 'PAIR', 
    icon: '👥', 
    color: '#94a3b8',
    description: 'Two cards of same rank'
  },
  two_pair: { 
    name: 'TWO PAIR', 
    icon: '👥👥', 
    color: '#64748b',
    description: 'Two different pairs'
  },
  three_kind: { 
    name: 'THREE OF A KIND', 
    icon: '👤👤👤', 
    color: '#3b82f6',
    description: 'Three cards of same rank'
  },
  straight: { 
    name: 'STRAIGHT', 
    icon: '📏', 
    color: '#22c55e',
    description: 'Five consecutive ranks'
  },
  flush: { 
    name: 'FLUSH', 
    icon: '💧', 
    color: '#06b6d4',
    description: 'Five cards of same suit'
  },
  full_house: { 
    name: 'FULL HOUSE', 
    icon: '🏠', 
    color: '#a855f7',
    description: 'Three of a kind + Pair'
  },
  four_kind: { 
    name: 'FOUR OF A KIND', 
    icon: '👑', 
    color: '#eab308',
    description: 'Four cards of same rank'
  },
  straight_flush: { 
    name: 'STRAIGHT FLUSH', 
    icon: '🔥', 
    color: '#f97316',
    description: 'Straight + Flush'
  },
  royal_flush: { 
    name: 'ROYAL FLUSH', 
    icon: '👑', 
    color: '#dc2626',
    description: '10-J-Q-K-A of same suit'
  },
  blackjack: { 
    name: 'BLACKJACK', 
    icon: '🃏', 
    color: '#1a1a1a',
    description: 'Ace + 10-value card'
  },
  lucky_seven: { 
    name: 'LUCKY SEVEN', 
    icon: '7️⃣', 
    color: '#22c55e',
    description: 'Hand contains 7'
  },
  ace_high: { 
    name: 'ACE HIGH', 
    icon: '🅰️', 
    color: '#eab308',
    description: 'Ace as 11'
  },
  suit_bonus: { 
    name: 'SUIT BONUS', 
    icon: '♠️', 
    color: '#6366f1',
    description: 'Multiple cards same suit'
  },
  streak: { 
    name: 'WIN STREAK', 
    icon: '🔥', 
    color: '#ef4444',
    description: 'Consecutive wins'
  },
  joker_synergy: { 
    name: 'JOKER SYNERGY', 
    icon: '🤡', 
    color: '#a855f7',
    description: 'Multiple jokers active'
  }
};

// Format multiplier
const formatMultiplier = (multiplier: number): string => {
  if (multiplier >= 1000) return `${(multiplier / 1000).toFixed(1)}k`;
  if (multiplier >= 100) return multiplier.toFixed(0);
  return multiplier.toFixed(multiplier % 1 === 0 ? 0 : 1);
};

/**
 * Individual Combo Card
 */
interface ComboCardProps {
  combo: Combo;
  index: number;
  totalCombos: number;
}

const ComboCard: React.FC<ComboCardProps> = ({ combo, index, totalCombos }) => {
  const config = COMBO_CONFIG[combo.type];
  const isLast = index === totalCombos - 1;

  return (
    <motion.div
      layout
      initial={{ x: -100, opacity: 0, scale: 0.8 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: -100, opacity: 0, scale: 0.8 }}
      transition={{ 
        type: 'spring',
        stiffness: 400,
        damping: 25,
        delay: index * 0.08
      }}
      className="relative"
    >
      {/* Connector line to next combo */}
      {!isLast && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: index * 0.08 + 0.2, duration: 0.2 }}
          className="absolute -bottom-3 left-6 w-0.5 h-3 origin-top"
          style={{ backgroundColor: config.color }}
        />
      )}

      {/* Combo card */}
      <motion.div
        whileHover={{ scale: 1.02, x: 5 }}
        className="relative flex items-center gap-3 p-3 rounded-xl border-2 overflow-hidden"
        style={{ 
          backgroundColor: `${config.color}15`,
          borderColor: config.color,
          boxShadow: `0 0 20px ${config.color}30, inset 0 0 20px ${config.color}10`
        }}
      >
        {/* Glow effect */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{ 
            background: `radial-gradient(circle at 30% 50%, ${config.color}40, transparent 70%)`
          }}
        />

        {/* Icon */}
        <motion.div
          initial={{ rotate: -180, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: index * 0.08 + 0.1, type: 'spring' }}
          className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-2xl"
          style={{ 
            backgroundColor: `${config.color}30`,
            border: `2px solid ${config.color}`
          }}
        >
          {config.icon}
        </motion.div>

        {/* Info */}
        <div className="relative z-10 flex-1 min-w-0">
          <div 
            className="font-black text-sm uppercase tracking-wider truncate"
            style={{ color: config.color }}
          >
            {config.name}
          </div>
          <div className="text-[10px] text-gray-400 truncate">
            {config.description}
          </div>
        </div>

        {/* Multiplier */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.08 + 0.15, type: 'spring', stiffness: 500 }}
          className="relative z-10 flex flex-col items-end"
        >
          <div 
            className="text-2xl font-black leading-none"
            style={{ color: config.color }}
          >
            ×{formatMultiplier(combo.multiplier)}
          </div>
          <div className="text-[9px] text-gray-500">
            +${combo.baseValue}
          </div>
        </motion.div>

        {/* Animated border pulse */}
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{ 
            border: `1px solid ${config.color}`,
            opacity: 0.3
          }}
        />
      </motion.div>
    </motion.div>
  );
};

/**
 * Total Multiplier Display
 */
interface TotalMultiplierProps {
  totalMultiplier: number;
  baseScore: number;
  finalScore: number;
  comboCount: number;
  isCalculating?: boolean;
}

const TotalMultiplier: React.FC<TotalMultiplierProps> = ({
  totalMultiplier,
  baseScore,
  finalScore,
  comboCount,
  isCalculating
}) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, delay: 0.3 }}
      className="relative mt-4 p-4 rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
        border: '2px solid #eab308',
        boxShadow: '0 0 40px rgba(234, 179, 8, 0.3), inset 0 0 40px rgba(234, 179, 8, 0.05)'
      }}
    >
      {/* Animated background */}
      <motion.div
        animate={{ 
          background: [
            'radial-gradient(circle at 0% 0%, rgba(234, 179, 8, 0.2), transparent 50%)',
            'radial-gradient(circle at 100% 100%, rgba(234, 179, 8, 0.2), transparent 50%)',
            'radial-gradient(circle at 0% 0%, rgba(234, 179, 8, 0.2), transparent 50%)'
          ]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0"
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-yellow-500/70 uppercase tracking-widest font-bold">
            Total Multiplier
          </span>
          <span className="text-xs text-gray-500">
            {comboCount} Combo{comboCount !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Main multiplier */}
        <div className="flex items-baseline gap-2">
          <motion.span
            key={totalMultiplier}
            initial={{ scale: 1.5, color: '#fff' }}
            animate={{ scale: 1, color: '#eab308' }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="text-5xl font-black"
          >
            ×{formatMultiplier(totalMultiplier)}
          </motion.span>
        </div>

        {/* Score breakdown */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Base</span>
            <span className="text-white font-mono">${baseScore.toLocaleString()}</span>
          </div>
          
          {isCalculating ? (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="flex justify-between text-lg mt-1"
            >
              <span className="text-yellow-500 font-bold">Calculating...</span>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between text-lg mt-1"
            >
              <span className="text-yellow-500 font-bold">Total</span>
              <motion.span 
                key={finalScore}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-yellow-400 font-black font-mono"
              >
                ${finalScore.toLocaleString()}
              </motion.span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
      <div className="absolute bottom-2 left-2 w-2 h-2 bg-yellow-500 rounded-full animate-pulse delay-150" />
    </motion.div>
  );
};

/**
 * Main Combo Chain Display Component
 */
export const ComboChainDisplay: React.FC<ComboChainDisplayProps> = ({
  combos,
  totalMultiplier,
  baseScore,
  finalScore,
  position = 'right',
  showDetails = true,
  isCalculating = false
}) => {
  const activeCombos = useMemo(() => 
    combos.filter(c => c.isActive).sort((a, b) => a.triggeredAt - b.triggeredAt),
    [combos]
  );

  const positionClasses = {
    left: 'left-4',
    right: 'right-4'
  };

  return (
    <div 
      className={`fixed top-1/4 ${positionClasses[position]} z-40 w-72`}
      style={{ transform: 'translateY(-25%)' }}
    >
      <AnimatePresence mode="popLayout">
        {activeCombos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: position === 'right' ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: position === 'right' ? 100 : -100 }}
            className="space-y-2"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 mb-3"
            >
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                className="text-xl"
              >
                ⚡
              </motion.span>
              <span className="text-sm font-black uppercase tracking-widest text-white/80">
                Active Combos
              </span>
            </motion.div>

            {/* Combo list */}
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {activeCombos.map((combo, index) => (
                  <ComboCard
                    key={combo.id}
                    combo={combo}
                    index={index}
                    totalCombos={activeCombos.length}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Total multiplier */}
            {showDetails && (
              <TotalMultiplier
                totalMultiplier={totalMultiplier}
                baseScore={baseScore}
                finalScore={finalScore}
                comboCount={activeCombos.length}
                isCalculating={isCalculating}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state hint */}
      {activeCombos.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-white/30 text-sm"
        >
          No active combos
        </motion.div>
      )}
    </div>
  );
};

/**
 * Mini Combo Indicator (for compact display)
 */
interface MiniComboIndicatorProps {
  comboCount: number;
  totalMultiplier: number;
  onClick?: () => void;
}

export const MiniComboIndicator: React.FC<MiniComboIndicatorProps> = ({
  comboCount,
  totalMultiplier,
  onClick
}) => {
  if (comboCount === 0) return null;

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-full"
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
        ×{formatMultiplier(totalMultiplier)}
      </span>
      <span className="text-yellow-500/70 text-sm">
        ({comboCount})
      </span>
    </motion.button>
  );
};

/**
 * Combo Popup (for individual combo notifications)
 */
interface ComboPopupProps {
  combo: Combo;
  onComplete?: () => void;
}

export const ComboPopup: React.FC<ComboPopupProps> = ({ combo, onComplete }) => {
  if (!combo) return null;
  const config = COMBO_CONFIG[combo.type];

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0, opacity: 0, y: -50 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      onAnimationComplete={onComplete}
      className="fixed top-1/3 left-1/2 -translate-x-1/2 z-50 px-8 py-4 rounded-2xl"
      style={{
        background: `linear-gradient(135deg, ${config.color}30, ${config.color}10)`,
        border: `3px solid ${config.color}`,
        boxShadow: `0 0 60px ${config.color}50, inset 0 0 40px ${config.color}20`
      }}
    >
      <div className="flex items-center gap-4">
        <motion.div
          initial={{ rotate: -360, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 0.1, type: 'spring' }}
          className="text-5xl"
        >
          {config.icon}
        </motion.div>
        <div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-3xl font-black uppercase"
            style={{ color: config.color }}
          >
            {config.name}
          </motion.div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-bold"
            style={{ color: config.color }}
          >
            ×{formatMultiplier(combo.multiplier)} MULTIPLIER
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ComboChainDisplay;
