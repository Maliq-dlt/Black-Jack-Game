import React from 'react';
import { motion } from 'framer-motion';

interface ChipProps {
  value: number;
  onClick: () => void;
  disabled?: boolean;
  color: 'red' | 'blue' | 'green' | 'black' | 'purple';
  isStacked?: boolean;
  stackIndex?: number;
}

const Chip: React.FC<ChipProps> = ({ value, onClick, disabled, color, isStacked = false, stackIndex = 0 }) => {
  const colors = {
    red: { // Blood Bone Token
      bg: 'bg-gradient-to-b from-[#3d2e24] to-[#2a1f18]',
      border: 'border-[#8b1a1a]',
      text: 'text-[#ff6b35]',
      shadow: 'shadow-[0_0_15px_rgba(139,26,26,0.4)]',
      glow: 'hover:shadow-[0_0_20px_rgba(255,107,53,0.5)]'
    },
    blue: { // Spirit Bone Token
      bg: 'bg-gradient-to-b from-[#2a2a3d] to-[#1a1a2e]',
      border: 'border-[#4a6fa5]',
      text: 'text-[#7cb9e8]',
      shadow: 'shadow-[0_0_15px_rgba(74,111,165,0.3)]',
      glow: 'hover:shadow-[0_0_20px_rgba(124,185,232,0.5)]'
    },
    green: { // Moss Stone Token
      bg: 'bg-gradient-to-b from-[#2a3d2a] to-[#1a2a1a]',
      border: 'border-[#3d5a3d]',
      text: 'text-[#8fbc8f]',
      shadow: 'shadow-[0_0_15px_rgba(61,90,61,0.3)]',
      glow: 'hover:shadow-[0_0_20px_rgba(143,188,143,0.5)]'
    },
    black: { // Obsidian Token
      bg: 'bg-gradient-to-b from-[#1a1410] to-[#0a0806]',
      border: 'border-[#3d2e24]',
      text: 'text-[#a89878]',
      shadow: 'shadow-[0_0_15px_rgba(0,0,0,0.6)]',
      glow: 'hover:shadow-[0_0_20px_rgba(168,152,120,0.4)]'
    },
    purple: { // Void Stone Token
      bg: 'bg-gradient-to-b from-[#2a1a2a] to-[#1a0a1a]',
      border: 'border-[#5a3d5a]',
      text: 'text-[#d4a24c]',
      shadow: 'shadow-[0_0_15px_rgba(90,61,90,0.3)]',
      glow: 'hover:shadow-[0_0_20px_rgba(212,162,76,0.5)]'
    },
  };

  const chipStyle = colors[color];

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      initial={isStacked ? { scale: 0, y: 50 } : false}
      animate={isStacked ? { scale: 1, y: -stackIndex * 4 } : {}}
      whileHover={disabled ? {} : { 
        scale: 1.15, 
        y: isStacked ? -stackIndex * 4 - 10 : -10,
        transition: { duration: 0.15 }
      }}
      whileTap={disabled ? {} : { 
        scale: 0.9,
        transition: { duration: 0.08 }
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
      className={`
        relative w-16 h-16 flex items-center justify-center rounded-full
        ${chipStyle.bg} ${chipStyle.shadow} ${chipStyle.glow}
        ${disabled ? 'opacity-40 cursor-not-allowed grayscale' : 'cursor-pointer'}
        transform-gpu border-3 ${chipStyle.border}
        transition-shadow duration-200
      `}
      style={{ 
        boxShadow: isStacked 
          ? `0 ${4 + stackIndex * 2}px ${8 + stackIndex * 4}px rgba(0,0,0,0.9)` 
          : '0 8px 24px rgba(0,0,0,0.9), inset 0 1px 0 rgba(212,162,76,0.1)'
      }}
    >
      {/* Stone/Bone Texture Overlay */}
      <div className="absolute inset-0 rounded-full opacity-30 pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stone-wall.png')]" />
      
      {/* Carved inner circle with rune-like border */}
      <div 
        className="w-11 h-11 border-2 border-[#0a0806]/60 flex items-center justify-center rounded-full relative"
        style={{ 
          background: 'radial-gradient(circle at 30% 30%, rgba(212,162,76,0.1), transparent 60%)',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5), inset 0 -1px 0 rgba(212,162,76,0.1)'
        }}
      >
        <span className={`font-['Cinzel'] font-bold text-xl ${chipStyle.text} drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]`}>
          {value}
        </span>
      </div>
      
      {/* Subtle amber highlight on top edge */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-transparent via-[#d4a24c]/20 to-transparent rounded-full pointer-events-none" />
    </motion.button>
  );
};

export default Chip;

