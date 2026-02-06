import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BossData, BossTrait } from '../types';

interface BossBattleUIProps {
  boss: BossData | null;
  isActive: boolean;
  currentDialogue: string;
  heatLevel: number;
}

/**
 * BossBattleUI Component
 * Displays boss information, traits, and dynamic dialogue during boss encounters
 */
export const BossBattleUI: React.FC<BossBattleUIProps> = ({
  boss,
  isActive,
  currentDialogue,
  heatLevel,
}) => {
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
          <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
          
          {/* Boss Header */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{boss.visualTheme.icon}</span>
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
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-1 px-2 py-1 bg-black/10 border border-[#1a1a1a]/20 text-xs"
                title={getTraitDescription(trait)}
                style={{ clipPath: 'polygon(5% 0%, 95% 5%, 100% 95%, 90% 100%, 10% 95%, 0% 5%)' }}
              >
                <span>{getTraitIcon(trait)}</span>
                <span className="font-['Special_Elite'] text-[#1a1a1a]/80">{trait.replace(/_/g, ' ')}</span>
              </motion.div>
            ))}
          </div>
          
          {/* Dialogue */}
          {currentDialogue && (
            <motion.div
              key={currentDialogue}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="border-l-4 pl-3 py-2 italic text-sm text-[#1a1a1a]/80 font-serif"
              style={{ borderColor: boss.visualTheme.secondaryColor }}
            >
              "{currentDialogue}"
            </motion.div>
          )}
          
          {/* Special Ability Warning */}
          {boss.specialAbility && (
            <div className="mt-3 flex items-center gap-2 text-xs text-[#8b0000] font-['Special_Elite']">
              <span className="animate-pulse">⚠️</span>
              <span className="uppercase tracking-wider">
                {boss.specialAbility.name}: {boss.specialAbility.description}
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BossBattleUI;
