import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BossData, BossTrait } from '../types';
import { useGameJuice } from '../hooks/useGameJuice';

interface BossBattleUIProps {
  boss: BossData | null;
  isActive: boolean;
  currentDialogue: string;
  heatLevel: number;
}

/**
 * BossBattleUI dengan Game Juice Integration
 * 
 * Efek yang ditambahkan:
 * - Screen shake saat boss muncul
 * - Flash merah saat boss muncul
 * - Hit stop untuk dramatisasi
 */
export const BossBattleUI: React.FC<BossBattleUIProps> = ({
  boss,
  isActive,
  currentDialogue,
  heatLevel,
}) => {
  const juice = useGameJuice();
  const hasTriggeredRef = React.useRef(false);

  // Trigger boss appear effect
  useEffect(() => {
    if (isActive && boss && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      
      // Delay sedikit untuk dramatisasi
      const timer = setTimeout(() => {
        juice.bossAppear();
      }, 100);

      return () => clearTimeout(timer);
    }

    // Reset when boss is defeated
    if (!isActive) {
      hasTriggeredRef.current = false;
    }
  }, [isActive, boss, juice]);

  // Trigger effect saat heat level naik drastis
  const prevHeatRef = React.useRef(heatLevel);
  useEffect(() => {
    const heatDiff = heatLevel - prevHeatRef.current;
    if (heatDiff > 20) {
      juice.screenShake('medium');
    }
    prevHeatRef.current = heatLevel;
  }, [heatLevel, juice]);

  if (!boss || !isActive) return null;

  const getTraitIcon = (trait: BossTrait): string => {
    const icons: Record<BossTrait, string> = {
      [BossTrait.DealerWinsPush]: '⚖️',
      [BossTrait.HiddenCardBuff]: '🎴',
      [BossTrait.GreedyDealer]: '🤑',
      [BossTrait.TaxCollector]: '💸',
      [BossTrait.Perfectionist]: '🎯',
      [BossTrait.WildSwings]: '🎲',
      [BossTrait.CardCounter]: '👁️',
      [BossTrait.CursedTouch]: '💀',
      [BossTrait.DoubleStakes]: '💰',
      [BossTrait.ChipThief]: '🃏',
      [BossTrait.PhantomCards]: '👻',
      [BossTrait.MirrorPlay]: '🪞',
      [BossTrait.CardSwapper]: '🎭',
      [BossTrait.TheHouse]: '🏛️',
    };
    return icons[trait] || '❓';
  };

  const getTraitDescription = (trait: BossTrait): string => {
    const descriptions: Record<BossTrait, string> = {
      [BossTrait.DealerWinsPush]: 'Push = Dealer Wins',
      [BossTrait.HiddenCardBuff]: 'Hidden card always 10+',
      [BossTrait.GreedyDealer]: 'Hits on soft 17-18',
      [BossTrait.TaxCollector]: 'Hit costs $10 extra',
      [BossTrait.Perfectionist]: 'Always hits to 19+',
      [BossTrait.WildSwings]: 'Random 0.5x-3x multiplier',
      [BossTrait.CardCounter]: 'Sees 1 of your cards',
      [BossTrait.CursedTouch]: 'Push = Lose deck card',
      [BossTrait.DoubleStakes]: 'Stakes double each round',
      [BossTrait.ChipThief]: 'Steals 10% on your bust',
      [BossTrait.PhantomCards]: 'Hides 1 of your cards',
      [BossTrait.MirrorPlay]: 'Copies your actions',
      [BossTrait.CardSwapper]: 'Swaps random cards',
      [BossTrait.TheHouse]: 'ALL RULES ACTIVE',
    };
    return descriptions[trait] || 'Unknown effect';
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-20 left-1/2 -translate-x-1/2 z-30 w-full max-w-md"
      >
        {/* Boss Card */}
        <div 
          className="parchment-bg border-4 p-4 shadow-2xl relative overflow-hidden"
          style={{ 
            borderColor: boss.visualTheme.secondaryColor,
            clipPath: 'polygon(2% 0%, 98% 2%, 100% 98%, 95% 100%, 5% 98%, 0% 2%)'
          }}
        >
          {/* Gritty overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')" />
          
          {/* Boss Header */}
          <div className="flex items-center gap-3 mb-3">
            <motion.span 
              className="text-4xl"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            >
              {boss.visualTheme.icon}
            </motion.span>
            <div>
              <h2 
                className="font-['Special_Elite'] text-2xl font-black uppercase tracking-wider"
                style={{ color: boss.visualTheme.secondaryColor }}
              >
                {boss.name}
              </h2>
              <p className="text-sm text-[#1a1a1a]/60 font-['Special_Elite'] tracking-widest">
                {boss.title}
              </p>
            </div>
            
            {/* Heat Meter */}
            <div className="ml-auto flex flex-col items-end">
              <span className="text-[10px] text-[#8b0000]/60 font-bold uppercase tracking-widest">Heat</span>
              <div className="w-16 h-2 bg-black/20 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full rounded-full"
                  style={{ 
                    background: `linear-gradient(to right, #ff6b6b, #8b0000)`,
                    width: `${heatLevel}%`
                  }}
                  animate={{ width: `${heatLevel}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
          
          {/* Traits */}
          <div className="flex flex-wrap gap-2 mb-3">
            {boss.traits.map((trait, idx) => (
              <motion.div
                key={trait}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 + 0.3 }} // Delay untuk sync dengan shake
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1 px-2 py-1 bg-black/10 border border-[#1a1a1a]/20 text-xs cursor-help"
                title={getTraitDescription(trait)}
                style={{ clipPath: 'polygon(5% 0%, 95% 5%, 100% 95%, 90% 100%, 10% 95%, 0% 5%)' }}
              >
                <span>{getTraitIcon(trait)}</span>
                <span className="font-['Special_Elite'] text-[#1a1a1a]/80">{trait.replace(/_/g, ' ')}</span>
              </motion.div>
            ))}
          </div>
          
          {/* Dialogue */}
          <AnimatePresence mode="wait">
            {currentDialogue && (
              <motion.div
                key={currentDialogue}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="border-l-4 pl-3 py-2 italic text-sm text-[#1a1a1a]/80 font-serif"
                style={{ borderColor: boss.visualTheme.secondaryColor }}
              >
                "{currentDialogue}"
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Special Ability Warning */}
          <AnimatePresence>
            {boss.specialAbility && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 flex items-center gap-2 text-xs text-[#8b0000] font-['Special_Elite']"
              >
                <motion.span 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  ⚠️
                </motion.span>
                <span className="uppercase tracking-wider">
                  {boss.specialAbility.name}: {boss.specialAbility.description}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BossBattleUI;
