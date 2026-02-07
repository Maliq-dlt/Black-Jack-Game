import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../types';
import { getCardSkills, CardSkill } from '../cardSkillsCodex';

interface CardSkillPopupProps {
  card: Card | null;
  isOpen: boolean;
  onClose: () => void;
  position?: { x: number; y: number };
}

const CardSkillPopup: React.FC<CardSkillPopupProps> = ({
  card,
  isOpen,
  onClose,
  position
}) => {
  if (!card) return null;
  
  const skills = getCardSkills(card.wildType, card.eventType, card.rank);
  
  // If no special skills, show basic card info
  const hasSkills = skills.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          
          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed z-[101] w-80 max-w-[90vw] left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2"
          >
            <div 
              className="bg-gradient-to-br from-[#1a1510] via-[#0f0c08] to-[#1a1510] rounded-lg border-2 border-[#d4a24c]/40 shadow-2xl overflow-hidden"
              style={{
                boxShadow: '0 0 40px rgba(212, 162, 76, 0.2), 0 25px 50px -12px rgba(0, 0, 0, 0.9)'
              }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#d4a24c]/20 via-[#d4a24c]/10 to-[#d4a24c]/20 px-4 py-3 border-b border-[#d4a24c]/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{card.suit}</span>
                    <div>
                      <h3 className="text-[#d4a24c] font-bold text-lg font-['Cinzel']">
                        {card.rank} of {getSuitName(card.suit)}
                      </h3>
                      <p className="text-gray-400 text-xs">Value: {card.value}</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors text-xl"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              {/* Skills List */}
              <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
                {hasSkills ? (
                  skills.map((skill, index) => (
                    <SkillCard key={skill.id} skill={skill} delay={index * 0.1} />
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-400 text-sm">No special abilities</p>
                    <p className="text-gray-500 text-xs mt-1">Standard playing card</p>
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="px-4 py-2 bg-black/30 border-t border-[#d4a24c]/20">
                <p className="text-gray-500 text-xs text-center">
                  Tap outside to close
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Individual Skill Card
const SkillCard: React.FC<{ skill: CardSkill; delay: number }> = ({ skill, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="bg-black/40 rounded-lg p-3 border border-white/10"
      style={{ borderLeftColor: skill.color, borderLeftWidth: '3px' }}
    >
      {/* Skill Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{skill.icon}</span>
        <div>
          <h4 className="font-bold text-white text-sm" style={{ color: skill.color }}>
            {skill.name}
          </h4>
          <span className="text-xs text-gray-500 uppercase tracking-wider">
            {skill.category}
          </span>
        </div>
      </div>
      
      {/* Description */}
      <p className="text-gray-300 text-sm mb-2 italic">
        "{skill.description}"
      </p>
      
      {/* Effect */}
      <div className="bg-white/5 rounded px-2 py-1.5 mb-2">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Effect</p>
        <p className="text-white text-sm font-medium">{skill.effect}</p>
      </div>
      
      {/* Tip */}
      {skill.tip && (
        <div className="flex items-start gap-1.5 text-xs text-amber-400/80">
          <span>💡</span>
          <p>{skill.tip}</p>
        </div>
      )}
    </motion.div>
  );
};

// Helper to get suit name
const getSuitName = (suit: string): string => {
  switch (suit) {
    case '♥': return 'Hearts';
    case '♦': return 'Diamonds';
    case '♣': return 'Clubs';
    case '♠': return 'Spades';
    default: return suit;
  }
};

export default CardSkillPopup;
