import React, { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { Card, Rank, Suit, WildCardType } from '../types';
import { SUIT_COLORS } from '../constants';

interface CardComponentProps {
  card: Card;
  isHidden?: boolean;
  className?: string;
  index: number;
  isWinning?: boolean;
  isLosing?: boolean;
}

const CardComponent: React.FC<CardComponentProps> = memo(({
  card, 
  isHidden, 
  className = '', 
  index,
  isWinning = false,
  isLosing = false
}) => {
  const colorClass = SUIT_COLORS[card.suit];
  
  // Logic to determine if this is an initial deal or a hit
  const dealDelay = index < 2 ? index * 0.15 : 0;

  // Randomize start position slightly for "human" feel
  const startX = useMemo(() => 100 + Math.random() * 40, []);
  const startY = useMemo(() => -400 + Math.random() * 40, []);
  const startRotate = useMemo(() => 45 + Math.random() * 10, []);

  // Glow effect based on win/lose state or WildCard type
  const wildGlow = useMemo(() => {
    switch (card.wildType) {
      case WildCardType.BonusCash: return '0 0 25px rgba(234, 179, 8, 0.6)'; // Gold
      case WildCardType.Shielded: return '0 0 25px rgba(59, 130, 246, 0.6)'; // Blue
      case WildCardType.FreeHit: return '0 0 25px rgba(168, 85, 247, 0.6)'; // Purple
      case WildCardType.Gilded: return '0 0 25px rgba(236, 72, 153, 0.6)'; // Pink/Gilded
      default: return 'none';
    }
  }, [card.wildType]);

  const glowEffect = isWinning 
    ? '0 0 30px rgba(34, 197, 94, 0.8), 0 0 60px rgba(34, 197, 94, 0.4)' 
    : isLosing 
    ? '0 0 30px rgba(239, 68, 68, 0.8), 0 0 60px rgba(239, 68, 68, 0.4)'
    : wildGlow !== 'none' ? wildGlow : 'none';

  return (
    <div className={`relative w-24 h-36 perspective-1000 cursor-pointer ${className}`}>
      <motion.div
        layoutId={card.id}
        initial={{ 
          opacity: 0, 
          y: startY, 
          x: startX, 
          scale: 0.6, 
          rotateZ: startRotate 
        }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          x: 0, 
          scale: 1, 
          rotateZ: 0,
          rotateY: isHidden ? 180 : 0,
          boxShadow: glowEffect
        }}
        whileHover={{
          scale: 1.2,
          y: -15,
          zIndex: 100,
          rotateZ: -2,
          boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.9), 0 0 15px rgba(255, 255, 255, 0.2)",
          transition: { duration: 0.2, ease: "easeOut" }
        }}
        transition={{ 
          type: "spring",
          stiffness: 180,
          damping: 25,
          mass: 1.2,
          delay: dealDelay,
          rotateY: { duration: 0.7, ease: "easeInOut" },
          boxShadow: { duration: 0.5 }
        }}
        className="w-full h-full transform-style-3d rounded-sm"
      >
        {/* Front Face - Parchment Style */}
        <div 
          className="absolute inset-0 backface-hidden parchment-bg rounded-sm flex flex-col justify-between p-2 select-none border-2 border-black/80 overflow-hidden"
          style={{ 
            clipPath: 'polygon(1% 1%, 98% 0%, 100% 2%, 99% 97%, 97% 100%, 2% 99%, 0% 98%, 1% 3%)',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)'
          }}
        >
          {/* Subtle Grain Overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />

          <div className={`text-xl font-bold leading-none ${colorClass} text-left font-serif`}>
            {card.rank}
            <div className="text-sm mt-0.5 opacity-80">{card.suit}</div>
          </div>

          <div className={`absolute inset-0 flex items-center justify-center text-6xl ${colorClass} opacity-70 blur-[0.2px] mix-blend-darken`}>
            {card.suit}
          </div>

          <div className={`text-xl font-bold leading-none ${colorClass} text-right transform rotate-180 font-serif`}>
            {card.rank}
            <div className="text-sm mt-0.5 opacity-80">{card.suit}</div>
          </div>
          
          {/* Wild Card Seal */}
          {card.wildType && card.wildType !== WildCardType.None && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-12 opacity-30 pointer-events-none">
                <div className="border-4 border-current p-2 rounded-full flex items-center justify-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#8b0000]">CURSED</span>
                </div>
            </div>
          )}
          
          {/* Bottom Label for effect cards */}
          {card.wildType && card.wildType !== WildCardType.None && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 scale-75 opacity-90">
              <span className="text-[8px] font-bold uppercase tracking-widest bg-black text-yellow-500 px-1 py-0.5 ink-border">
                {card.wildType === WildCardType.BonusCash ? 'JACKPOT' : 
                 card.wildType === WildCardType.Shielded ? 'SHIELD' :
                 card.wildType === WildCardType.FreeHit ? 'FREE' : 'GILDED'}
              </span>
            </div>
          )}
        </div>

        {/* Back Face - Dark Gritty Pattern */}
        <div 
          className="absolute inset-0 backface-hidden rotate-y-180 bg-[#1a1a1a] rounded-sm border-2 border-black/90 flex items-center justify-center overflow-hidden"
          style={{ 
            clipPath: 'polygon(1% 2%, 99% 1%, 100% 3%, 98% 98%, 97% 100%, 3% 99%, 0% 97%, 2% 2%)' 
          }}
        >
          <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <div className="w-16 h-24 border-2 border-white/10 rounded-lg flex items-center justify-center bg-zinc-900/80">
            <span className="text-white/20 text-4xl font-serif">?</span>
          </div>
          {/* Wear and tear effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-black/40 pointer-events-none" />
        </div>
      </motion.div>
    </div>
  );
});

export default CardComponent;