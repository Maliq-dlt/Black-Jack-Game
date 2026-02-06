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
    red: { // Blood Token
      bg: 'bg-[#3a0a0a]',
      border: 'border-[#8b0000]/40',
      text: 'text-[#8b0000]',
      shadow: 'shadow-black/80'
    },
    blue: { // Spirit Token
      bg: 'bg-[#0a1a1a]',
      border: 'border-[#008b8b]/40',
      text: 'text-[#008b8b]',
      shadow: 'shadow-black/80'
    },
    green: { // Moss Token
      bg: 'bg-[#1a231a]',
      border: 'border-[#1a3a1a]/40',
      text: 'text-[#2f3526]',
      shadow: 'shadow-black/80'
    },
    black: { // Iron Token
      bg: 'bg-[#1a1a1a]',
      border: 'border-white/10',
      text: 'text-gray-400',
      shadow: 'shadow-black/80'
    },
    purple: { // Void Token
      bg: 'bg-[#1a0a1a]',
      border: 'border-[#4b0082]/40',
      text: 'text-[#4b0082]',
      shadow: 'shadow-black/80'
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
        y: isStacked ? -stackIndex * 4 - 8 : -8,
        rotate: [0, -5, 5, 0],
        transition: { duration: 0.2 }
      }}
      whileTap={disabled ? {} : { 
        scale: 0.95,
        transition: { duration: 0.1 }
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`
        relative w-16 h-16 shadow-2xl flex items-center justify-center
        ${chipStyle.bg} ${chipStyle.shadow}
        ${disabled ? 'opacity-40 cursor-not-allowed grayscale' : 'cursor-pointer'}
        transform-gpu border-2 ${chipStyle.border}
      `}
      style={{ 
        clipPath: 'polygon(5% 0%, 95% 5%, 100% 50%, 90% 95%, 10% 100%, 0% 55%)',
        boxShadow: isStacked 
          ? `0 ${4 + stackIndex * 2}px ${8 + stackIndex * 4}px rgba(0,0,0,0.8)` 
          : '0 10px 20px rgba(0,0,0,0.8)'
      }}
    >
      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
      
      {/* Inner carved circle */}
      <div className="w-11 h-11 border border-black/40 flex items-center justify-center bg-black/5 opacity-80"
           style={{ clipPath: 'polygon(10% 10%, 90% 5%, 95% 90%, 5% 95%)' }}>
        <span className={`font-['Special_Elite'] font-bold text-lg ${chipStyle.text} drop-shadow-sm`}>
          {value}
        </span>
      </div>
      
      {/* Weathering effect */}
      <div className="absolute inset-0 border border-white/5 pointer-events-none" />
    </motion.button>
  );
};

export default Chip;

