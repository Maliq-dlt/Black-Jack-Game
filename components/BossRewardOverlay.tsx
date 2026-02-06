import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Artifact } from '../types';

interface BossRewardOverlayProps {
  isOpen: boolean;
  choices: Artifact[] | null;
  onSelect: (artifact: Artifact) => void;
}

const BossRewardOverlay: React.FC<BossRewardOverlayProps> = ({ isOpen, choices, onSelect }) => {
  if (!choices) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
        >
          <div className="max-w-4xl w-full text-center">
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl md:text-6xl font-serif font-bold text-yellow-500 mb-2 drop-shadow-2xl"
            >
              BOSS DEFEATED
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-400 mb-12 tracking-widest uppercase text-sm"
            >
              Choose your divine blessing
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {choices.map((artifact, index) => (
                <motion.button
                  key={artifact.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSelect(artifact)}
                  className="relative group bg-gradient-to-b from-gray-800 to-gray-900 border-2 border-yellow-500/30 rounded-2xl p-6 text-center shadow-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-yellow-500/5 group-hover:bg-yellow-500/10 transition-colors" />
                  
                  {/* Decorative Glow */}
                  <div className="absolute -top-12 -left-12 w-24 h-24 bg-yellow-500/20 blur-3xl group-hover:bg-yellow-500/40 transition-all" />
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto mb-4 bg-yellow-500/20 rounded-full flex items-center justify-center border border-yellow-500/40 shadow-inner">
                        <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2 tracking-wide font-serif">
                      {artifact.name}
                    </h3>
                    
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {artifact.description}
                    </p>
                    
                    <div className="mt-6 pt-4 border-t border-white/5 uppercase text-[10px] font-bold text-yellow-500/60 tracking-[0.2em]">
                      Rare Artifact
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BossRewardOverlay;
