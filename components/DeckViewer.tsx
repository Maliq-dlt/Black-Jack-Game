import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Rank, Suit } from '../types';

interface DeckViewerProps {
  isOpen: boolean;
  onClose: () => void;
  deck: Card[];
  removedRanks: string[];
}

const SUIT_COLORS: Record<Suit, string> = {
  [Suit.Hearts]: 'text-red-500',
  [Suit.Diamonds]: 'text-red-500',
  [Suit.Clubs]: 'text-white',
  [Suit.Spades]: 'text-white'
};

const DeckViewer: React.FC<DeckViewerProps> = ({ isOpen, onClose, deck, removedRanks }) => {
  // Group cards by rank
  const cardCounts: Record<string, { count: number; suits: Suit[] }> = {};
  
  Object.values(Rank).forEach(rank => {
    cardCounts[rank] = { count: 0, suits: [] };
  });

  deck.forEach(card => {
    if (cardCounts[card.rank]) {
      cardCounts[card.rank].count++;
      if (!cardCounts[card.rank].suits.includes(card.suit)) {
        cardCounts[card.rank].suits.push(card.suit);
      }
    }
  });

  const totalCards = deck.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-2xl bg-zinc-900 border border-blue-500/30 rounded-3xl p-8 shadow-2xl"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-serif font-bold text-white tracking-wider">DECK ORACLE</h2>
                <p className="text-blue-400 text-xs font-mono uppercase tracking-widest">{totalCards} Cards Remaining</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Card Grid */}
            <div className="grid grid-cols-4 md:grid-cols-7 gap-3 mb-6">
              {Object.values(Rank).map(rank => {
                const isRemoved = removedRanks.includes(rank);
                const data = cardCounts[rank];
                
                return (
                  <div 
                    key={rank}
                    className={`
                      relative p-3 rounded-xl border-2 text-center transition-all
                      ${isRemoved 
                        ? 'bg-red-500/5 border-red-500/20 opacity-40' 
                        : data.count > 0 
                          ? 'bg-white/5 border-white/10 hover:border-blue-500/40' 
                          : 'bg-zinc-800/50 border-zinc-700/30 opacity-30'}
                    `}
                  >
                    <div className={`text-2xl font-black ${isRemoved ? 'text-red-500 line-through' : 'text-white'}`}>
                      {rank}
                    </div>
                    <div className="text-xs text-gray-400 font-mono mt-1">
                      {isRemoved ? 'PURGED' : `×${data.count}`}
                    </div>
                    {!isRemoved && data.count > 0 && (
                      <div className="flex justify-center gap-0.5 mt-2">
                        {data.suits.map(suit => (
                          <span key={suit} className={`text-[10px] ${SUIT_COLORS[suit]}`}>{suit}</span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center border-t border-white/5 pt-6">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">High Cards</p>
                <p className="text-xl font-black text-yellow-400">
                  {deck.filter(c => ['10', 'J', 'Q', 'K', 'A'].includes(c.rank)).length}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Aces</p>
                <p className="text-xl font-black text-purple-400">
                  {deck.filter(c => c.rank === Rank.Ace).length}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Low Cards</p>
                <p className="text-xl font-black text-gray-400">
                  {deck.filter(c => ['2', '3', '4', '5', '6'].includes(c.rank)).length}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full mt-6 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 font-bold rounded-xl border border-blue-500/30 transition-colors"
            >
              CLOSE ORACLE
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeckViewer;
