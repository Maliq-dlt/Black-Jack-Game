import React from 'react';
import { motion } from 'framer-motion';
import { Joker, JokerSlot, JokerRarity } from '../types';
import { JOKER_RARITY_COLORS } from '../jokerData';

interface JokerSlotsProps {
  slots: JokerSlot[];
  onJokerClick?: (joker: Joker, index: number) => void;
  onSlotClick?: (index: number) => void;
  compact?: boolean;
}

export const JokerSlots: React.FC<JokerSlotsProps> = ({
  slots,
  onJokerClick,
  onSlotClick,
  compact = false,
}) => {
  return (
    <div className="flex gap-2 justify-center">
      {slots.map((slot, index) => {
        const joker = slot.joker;
        const colors = joker ? JOKER_RARITY_COLORS[joker.rarity] : null;
        
        return (
          <motion.div
            key={index}
            whileHover={{ scale: joker ? 1.08 : 1, y: joker ? -5 : 0 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (slot.isLocked) return;
              if (joker && onJokerClick) onJokerClick(joker, index);
              else if (onSlotClick) onSlotClick(index);
            }}
            className={`
              relative cursor-pointer transition-all
              ${compact ? 'w-12 h-14' : 'w-16 h-20'}
              ${slot.isLocked 
                ? 'bg-black/20 border-2 border-dashed border-gray-500/30' 
                : joker 
                  ? `${colors?.bg} border-2 ${colors?.border} shadow-lg` 
                  : 'bg-black/10 border-2 border-dashed border-gray-400/40 hover:border-gray-400/60'}
            `}
            style={{ clipPath: 'polygon(8% 0%, 92% 0%, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0% 92%, 0% 8%)' }}
          >
            {/* Locked indicator */}
            {slot.isLocked && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg opacity-40">🔒</span>
              </div>
            )}
            
            {/* Joker icon */}
            {joker && (
              <>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={compact ? 'text-xl' : 'text-2xl'}>{joker.icon}</span>
                </div>
                
                {/* Rarity indicator */}
                <div 
                  className={`absolute bottom-0 left-0 right-0 text-[8px] font-bold text-center py-0.5 ${colors?.text}`}
                  style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
                >
                  {compact ? '' : joker.rarity.charAt(0)}
                </div>
                
                {/* Cursed indicator */}
                {joker.rarity === JokerRarity.Cursed && (
                  <div className="absolute top-0 right-0 w-2 h-2 bg-red-600 animate-pulse" />
                )}
              </>
            )}
            
            {/* Empty slot indicator */}
            {!joker && !slot.isLocked && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-400/40 text-lg">+</span>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

// Joker Card (for shop/details view)
interface JokerCardProps {
  joker: Joker;
  onClick?: () => void;
  showPrice?: boolean;
  owned?: boolean;
  disabled?: boolean;
}

export const JokerCard: React.FC<JokerCardProps> = ({
  joker,
  onClick,
  showPrice = true,
  owned = false,
  disabled = false,
}) => {
  const colors = JOKER_RARITY_COLORS[joker.rarity];
  
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02, y: -3 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled || owned}
      className={`
        relative w-full p-3 text-left transition-all overflow-hidden
        ${colors.bg} border-2 ${colors.border}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg cursor-pointer'}
        ${owned ? 'opacity-70' : ''}
      `}
      style={{ clipPath: 'polygon(3% 0%, 97% 0%, 100% 5%, 100% 95%, 97% 100%, 3% 100%, 0% 95%, 0% 5%)' }}
    >
      {/* Cursed effect */}
      {joker.rarity === JokerRarity.Cursed && (
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-transparent animate-pulse pointer-events-none" />
      )}
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl">{joker.icon}</span>
        <div className="flex-1">
          <div className={`font-['Special_Elite'] font-bold text-sm uppercase ${colors.text}`}>
            {joker.name}
          </div>
          <div className={`text-[9px] font-bold uppercase tracking-widest ${colors.text} opacity-60`}>
            {joker.rarity}
          </div>
        </div>
        {showPrice && !owned && (
          <div className="text-sm font-bold font-['Special_Elite'] text-yellow-700 bg-yellow-100/50 px-2 py-0.5 border border-yellow-500/30">
            ${joker.cost}
          </div>
        )}
        {owned && (
          <div className="text-[10px] font-bold text-green-700 bg-green-100/50 px-2 py-0.5 border border-green-500/30">
            OWNED
          </div>
        )}
      </div>
      
      {/* Description */}
      <div className="text-[11px] text-gray-700 italic">
        {joker.description}
      </div>
      
      {/* Drawback */}
      {joker.drawback && (
        <div className="text-[10px] text-red-700/80 font-bold mt-1 flex items-center gap-1">
          <span>⚠</span> {joker.drawback}
        </div>
      )}
    </motion.button>
  );
};

export default JokerSlots;
