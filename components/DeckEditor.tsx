import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rank, Suit, CardEnhancement, DeckModification } from '../types';
import { ENHANCEMENT_EFFECTS } from '../comboDetector';

interface DeckEditorProps {
  isOpen: boolean;
  onClose: () => void;
  bankroll: number;
  deckCards: Array<{ rank: Rank; suit: Suit; enhancement: CardEnhancement; count: number }>;
  removedCards: string[];
  onModifyDeck: (mod: DeckModification) => void;
}

export const DeckEditor: React.FC<DeckEditorProps> = ({
  isOpen,
  onClose,
  bankroll,
  deckCards,
  removedCards,
  onModifyDeck,
}) => {
  const [selectedCard, setSelectedCard] = React.useState<{ rank: Rank; suit: Suit } | null>(null);
  const [activeTab, setActiveTab] = React.useState<'REMOVE' | 'ENHANCE' | 'DUPLICATE'>('REMOVE');

  if (!isOpen) return null;

  const RANKS: Rank[] = [Rank.Two, Rank.Three, Rank.Four, Rank.Five, Rank.Six, Rank.Seven, 
                         Rank.Eight, Rank.Nine, Rank.Ten, Rank.Jack, Rank.Queen, Rank.King, Rank.Ace];
  const SUITS: Suit[] = [Suit.Hearts, Suit.Diamonds, Suit.Clubs, Suit.Spades];

  const removeCost = 50;
  const duplicateCost = 200;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-3xl parchment-bg border-4 border-[#3a0a0a] p-6 shadow-2xl overflow-hidden max-h-[85vh] overflow-y-auto"
          style={{ clipPath: 'polygon(0.5% 1%, 99% 0%, 100% 2%, 99.5% 98%, 98% 100%, 1% 99%, 0% 98%, 0.5% 2%)' }}
        >
          {/* Background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
          
          {/* Header */}
          <div className="flex justify-between items-center mb-6 relative z-10">
            <div>
              <h2 className="text-2xl font-black text-[#1a1a1a] tracking-widest font-['Special_Elite']">
                DECK EDITOR
              </h2>
              <p className="text-[10px] text-[#8b0000]/60 font-bold tracking-[0.2em] font-serif uppercase">
                Modify Your Fate
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] text-[#1a1a1a]/60 font-bold block uppercase">Gold</span>
                <span className="text-xl font-['Special_Elite'] font-bold text-[#1a1a1a]">${bankroll}</span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors text-[#1a1a1a]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tab Buttons */}
          <div className="flex gap-2 mb-4">
            {(['REMOVE', 'ENHANCE', 'DUPLICATE'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  flex-1 py-2 font-['Special_Elite'] font-bold uppercase tracking-widest text-sm transition-all
                  ${activeTab === tab 
                    ? 'bg-[#8b0000] text-white' 
                    : 'bg-black/5 text-[#1a1a1a]/60 hover:bg-black/10'}
                `}
              >
                {tab === 'REMOVE' && '🗑️ Remove ($50)'}
                {tab === 'ENHANCE' && '✨ Enhance'}
                {tab === 'DUPLICATE' && '📋 Duplicate ($200)'}
              </button>
            ))}
          </div>

          {/* Card Grid */}
          <div className="grid grid-cols-13 gap-1 mb-4">
            {RANKS.map((rank) => (
              SUITS.map((suit) => {
                const isRemoved = removedCards.includes(`${rank}${suit}`);
                const isSelected = selectedCard?.rank === rank && selectedCard?.suit === suit;
                
                return (
                  <motion.button
                    key={`${rank}${suit}`}
                    whileHover={{ scale: isRemoved ? 1 : 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => !isRemoved && setSelectedCard({ rank, suit })}
                    disabled={isRemoved}
                    className={`
                      aspect-[3/4] flex flex-col items-center justify-center text-xs font-bold border transition-all
                      ${isRemoved 
                        ? 'bg-gray-200 border-gray-300 opacity-30 cursor-not-allowed' 
                        : isSelected 
                          ? 'bg-[#8b0000]/20 border-[#8b0000] scale-110' 
                          : 'bg-white border-gray-200 hover:border-[#8b0000]/50'}
                    `}
                  >
                    <span className={suit === Suit.Hearts || suit === Suit.Diamonds ? 'text-red-600' : 'text-black'}>
                      {rank}
                    </span>
                    <span className={suit === Suit.Hearts || suit === Suit.Diamonds ? 'text-red-600' : 'text-black'}>
                      {suit}
                    </span>
                  </motion.button>
                );
              })
            ))}
          </div>

          {/* Selected Card Action */}
          {selectedCard && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/5 border border-black/10 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-16 bg-white border-2 border-black/20 flex flex-col items-center justify-center">
                    <span className={selectedCard.suit === Suit.Hearts || selectedCard.suit === Suit.Diamonds ? 'text-red-600 text-lg font-bold' : 'text-black text-lg font-bold'}>
                      {selectedCard.rank}
                    </span>
                    <span className={selectedCard.suit === Suit.Hearts || selectedCard.suit === Suit.Diamonds ? 'text-red-600' : 'text-black'}>
                      {selectedCard.suit}
                    </span>
                  </div>
                  <div>
                    <div className="font-['Special_Elite'] font-bold text-[#1a1a1a]">
                      {selectedCard.rank} of {selectedCard.suit === Suit.Hearts ? 'Hearts' : selectedCard.suit === Suit.Diamonds ? 'Diamonds' : selectedCard.suit === Suit.Clubs ? 'Clubs' : 'Spades'}
                    </div>
                    <div className="text-[10px] text-[#1a1a1a]/60">Selected for {activeTab.toLowerCase()}</div>
                  </div>
                </div>
                
                {activeTab === 'REMOVE' && (
                  <button
                    disabled={bankroll < removeCost}
                    onClick={() => {
                      onModifyDeck({ 
                        type: 'REMOVE', 
                        targetRank: selectedCard.rank, 
                        targetSuit: selectedCard.suit,
                        cost: removeCost 
                      });
                      setSelectedCard(null);
                    }}
                    className="px-4 py-2 bg-red-600 text-white font-['Special_Elite'] font-bold uppercase hover:bg-red-700 transition-colors disabled:opacity-40"
                  >
                    Remove (${removeCost})
                  </button>
                )}
                
                {activeTab === 'DUPLICATE' && (
                  <button
                    disabled={bankroll < duplicateCost}
                    onClick={() => {
                      onModifyDeck({ 
                        type: 'DUPLICATE', 
                        targetRank: selectedCard.rank, 
                        targetSuit: selectedCard.suit,
                        cost: duplicateCost 
                      });
                      setSelectedCard(null);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white font-['Special_Elite'] font-bold uppercase hover:bg-blue-700 transition-colors disabled:opacity-40"
                  >
                    Duplicate (${duplicateCost})
                  </button>
                )}

                {activeTab === 'ENHANCE' && (
                  <div className="flex gap-2 flex-wrap max-w-xs">
                    {Object.entries(ENHANCEMENT_EFFECTS)
                      .filter(([key]) => key !== 'NONE')
                      .slice(0, 4)
                      .map(([key, info]) => (
                        <button
                          key={key}
                          disabled={bankroll < info.cost}
                          onClick={() => {
                            onModifyDeck({
                              type: 'ENHANCE',
                              targetRank: selectedCard.rank,
                              targetSuit: selectedCard.suit,
                              enhancement: key as CardEnhancement,
                              cost: info.cost
                            });
                            setSelectedCard(null);
                          }}
                          className="px-2 py-1 bg-purple-600 text-white text-[10px] font-bold uppercase hover:bg-purple-700 transition-colors disabled:opacity-40"
                          title={info.description}
                        >
                          {info.icon} ${info.cost}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Enhancement Key */}
          {activeTab === 'ENHANCE' && (
            <div className="mt-4 grid grid-cols-2 gap-2 text-[10px]">
              {Object.entries(ENHANCEMENT_EFFECTS)
                .filter(([key]) => key !== 'NONE')
                .map(([key, info]) => (
                  <div key={key} className="flex items-center gap-2 p-2 bg-black/5">
                    <span className="text-lg">{info.icon}</span>
                    <div>
                      <div className="font-bold text-[#1a1a1a]">{info.name}</div>
                      <div className="text-[#1a1a1a]/60">{info.description}</div>
                    </div>
                    <div className="ml-auto font-['Special_Elite'] font-bold text-green-700">${info.cost}</div>
                  </div>
                ))}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DeckEditor;
