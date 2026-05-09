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
  [Suit.Hearts]: 'text-[#8b0000]',
  [Suit.Diamonds]: 'text-[#8b0000]',
  [Suit.Clubs]: 'text-[#1a1a1a]',
  [Suit.Spades]: 'text-[#1a1a1a]'
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
            initial={{ scale: 0.9, opacity: 0, rotate: -1 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.9, opacity: 0, rotate: 1 }}
            className="relative w-full max-w-2xl bg-[#d1c7a7] border-2 border-[#1a1a1a] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
            style={{ clipPath: 'polygon(0% 1%, 100% 0%, 99% 98%, 1% 100%, 0% 50%)' }}
          >
            {/* Ink Grain Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]" />

            {/* Header */}
            <div className="flex justify-between items-center mb-10 border-b-2 border-[#1a1a1a]/20 pb-6 relative z-10">
              <div>
                <h2 className="text-4xl font-['Special_Elite'] font-black text-[#1a1a1a] tracking-widest">DECK ORACLE</h2>
                <p className="text-[#8b0000] text-sm font-bold tracking-[0.4em] font-serif uppercase mt-2">{totalCards} Cards Remaining</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-black/5 rounded-full transition-colors group"
              >
                <svg className="w-8 h-8 text-[#1a1a1a]/40 group-hover:text-[#8b0000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Card Grid */}
            <div className="grid grid-cols-4 md:grid-cols-7 gap-3 mb-8 relative z-10">
              {Object.values(Rank).map(rank => {
                const isRemoved = removedRanks.includes(rank);
                const data = cardCounts[rank];
                
                return (
                  <div 
                    key={rank}
                    className={`
                      relative p-3 border-2 transition-all flex flex-col items-center justify-center font-['Special_Elite']
                      ${isRemoved 
                        ? 'bg-red-500/10 border-[#8b0000]/20 opacity-40' 
                        : data.count > 0 
                          ? 'bg-black/5 border-[#1a1a1a]/20 hover:border-[#8b0000] hover:bg-white/40' 
                          : 'bg-black/5 border-[#1a1a1a]/10 opacity-30'}
                    `}
                    style={{ clipPath: 'polygon(2% 5%, 98% 1%, 95% 95%, 5% 98%)' }}
                  >
                    <div className={`text-2xl font-black ${isRemoved ? 'text-[#8b0000] line-through' : 'text-[#1a1a1a]'}`}>
                      {rank}
                    </div>
                    <div className={`text-sm font-bold ${data.count > 0 ? 'text-[#8b0000]' : 'text-[#1a1a1a]/40'}`}>
                      {isRemoved ? 'VOID' : `×${data.count}`}
                    </div>
                    {!isRemoved && data.count > 0 && (
                      <div className="flex justify-center gap-0.5 mt-2 opacity-60">
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
            <div className="grid grid-cols-3 gap-6 text-center border-t-2 border-[#1a1a1a]/20 pt-8 relative z-10 font-['Special_Elite']">
              <div className="bg-black/5 p-4" style={{ clipPath: 'polygon(1% 10%, 99% 2%, 95% 95%, 5% 90%)' }}>
                <p className="text-[10px] text-[#1a1a1a]/50 font-black uppercase tracking-widest mb-1">High Cards</p>
                <p className="text-3xl font-black text-[#1a1a1a]">
                  {/* ⚡ Bolt: O(1) lookups from precomputed cardCounts instead of O(N) deck.filter */}
                  {(cardCounts['10']?.count || 0) +
                   (cardCounts['J']?.count || 0) +
                   (cardCounts['Q']?.count || 0) +
                   (cardCounts['K']?.count || 0) +
                   (cardCounts['A']?.count || 0)}
                </p>
              </div>
              <div className="bg-[#8b0000]/5 p-4 border border-[#8b0000]/20" style={{ clipPath: 'polygon(5% 2%, 95% 5%, 99% 98%, 2% 95%)' }}>
                <p className="text-[10px] text-[#8b0000]/60 font-black uppercase tracking-widest mb-1">Aces</p>
                <p className="text-3xl font-black text-[#8b0000]">
                  {/* ⚡ Bolt: O(1) lookup instead of O(N) deck.filter */}
                  {cardCounts[Rank.Ace]?.count || 0}
                </p>
              </div>
              <div className="bg-black/5 p-4" style={{ clipPath: 'polygon(2% 5%, 98% 10%, 90% 95%, 10% 98%)' }}>
                <p className="text-[10px] text-[#1a1a1a]/50 font-black uppercase tracking-widest mb-1">Low Cards</p>
                <p className="text-3xl font-black text-gray-500">
                  {/* ⚡ Bolt: O(1) lookups instead of O(N) deck.filter */}
                  {(cardCounts['2']?.count || 0) +
                   (cardCounts['3']?.count || 0) +
                   (cardCounts['4']?.count || 0) +
                   (cardCounts['5']?.count || 0) +
                   (cardCounts['6']?.count || 0)}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full mt-10 py-5 bg-[#1a1a1a] text-[#d1c7a7] font-['Special_Elite'] font-black text-xl tracking-[0.4em] hover:bg-black transition-colors shadow-2xl"
              style={{ clipPath: 'polygon(0.5% 10%, 99% 2%, 98% 90%, 2% 95%)' }}
            >
              RESUME TRIAL
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeckViewer;
