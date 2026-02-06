import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PowerUp, Artifact, PowerUpType, ArtifactType } from '../types';

interface RoguelikeShopProps {
  isOpen: boolean;
  onClose: () => void;
  bankroll: number;
  onBuyPowerUp: (powerUp: PowerUp) => void;
  onBuyArtifact: (artifact: Artifact) => void;
  onRemoveCard: (rank: string) => void;
  ownedArtifacts: Artifact[];
  removedRanks: string[];
}

export const POWER_UPS: PowerUp[] = [
  {
    id: 'peek_1',
    type: PowerUpType.Peek,
    name: 'Oracle Eye',
    description: "Reveal the dealer's hidden card.",
    cost: 150
  },
  {
    id: 'transmute_1',
    type: PowerUpType.Transmute,
    name: 'Transmute',
    description: "Reroll your last card.",
    cost: 250
  },
  {
    id: 'shield_1',
    type: PowerUpType.Shield,
    name: 'Bust Shield',
    description: "Prevents loss on your next bust.",
    cost: 400
  }
];

export const ARTIFACTS: Artifact[] = [
  {
    id: 'golden_touch',
    type: ArtifactType.GoldenTouch,
    name: 'Golden Touch',
    description: "Permanent +10% winnings on all hands.",
    cost: 1500
  },
  {
    id: 'lucky_seven',
    type: ArtifactType.LuckySeven,
    name: 'Lucky Seven',
    description: "Start each round with a 7 card.",
    cost: 1200
  },
  {
    id: 'cursed_gamble',
    type: ArtifactType.VampiricGamble,
    name: 'Cursed Gamble',
    description: "+$200 on Pushes, but -10% bankroll on any Loss.",
    cost: 800
  }
];

export const RoguelikeShop: React.FC<RoguelikeShopProps> = ({ 
  isOpen, 
  onClose, 
  bankroll, 
  onBuyPowerUp, 
  onBuyArtifact,
  onRemoveCard,
  ownedArtifacts,
  removedRanks
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, rotateY: -10 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.9, opacity: 0, rotateY: 10 }}
            className="relative w-full max-w-4xl parchment-bg border-4 border-[#3a0a0a] rounded-sm p-8 shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden"
            style={{ clipPath: 'polygon(0.5% 1%, 99% 0%, 100% 2%, 99.5% 98%, 98% 100%, 1% 99%, 0% 98%, 0.5% 2%)' }}
          >
            {/* Background Grain Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
            
            <div className="flex justify-between items-center mb-8 relative z-10">
              <div>
                <h2 className="text-4xl font-black text-[#1a1a1a] tracking-widest font-['Special_Elite']">BLACK MARKET</h2>
                <p className="text-[#8b0000]/60 text-xs font-bold tracking-[0.3em] font-serif uppercase mt-1">THE LEDGER OF SIN & POWER</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-[#1a1a1a]/60 text-[10px] font-bold block uppercase tracking-tighter">Gold Pieces</span>
                  <span className="text-3xl font-['Special_Elite'] font-bold text-[#1a1a1a]">${bankroll.toFixed(0)}</span>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors text-[#1a1a1a]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Power-ups Section */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-gray-500 tracking-[.4em] uppercase border-b border-white/5 pb-2">Consumables</h3>
                <div className="space-y-3">
                  {POWER_UPS.map((item) => (
                      <button
                        key={item.id}
                        disabled={bankroll < item.cost}
                        onClick={() => onBuyPowerUp(item)}
                        className="w-full flex items-center justify-between p-4 bg-black/5 border-2 border-[#1a1a1a]/10 hover:border-[#8b0000]/40 transition-all group disabled:opacity-40"
                        style={{ clipPath: 'polygon(0.5% 2%, 99% 1%, 100% 4%, 99% 97%, 98% 100%, 2% 99%, 0% 98%, 1% 2%)' }}
                      >
                        <div className="text-left">
                          <div className="font-bold text-[#1a1a1a] text-sm group-hover:text-[#8b0000] transition-colors uppercase tracking-wide font-['Special_Elite']">{item.name}</div>
                          <div className="text-[11px] text-[#1a1a1a]/60 line-clamp-1 italic font-serif">{item.description}</div>
                        </div>
                        <div className="font-['Special_Elite'] font-bold text-[#8b0000] bg-[#8b0000]/5 px-3 py-1 border border-[#8b0000]/20 group-hover:scale-110 transition-transform">
                          ${item.cost}
                        </div>
                      </button>
                  ))}
                </div>
              </div>

              {/* Artifacts Section */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-gray-500 tracking-[.4em] uppercase border-b border-white/5 pb-2">Passive Artifacts</h3>
                <div className="space-y-3">
                  {ARTIFACTS.map((item) => {
                    const isOwned = ownedArtifacts.some(a => a.id === item.id);
                    return (
                      <button
                        key={item.id}
                        disabled={bankroll < item.cost || isOwned}
                        onClick={() => onBuyArtifact(item)}
                        className={`
                          w-full flex items-center justify-between p-4 transition-all border-2 group
                          ${isOwned 
                            ? 'bg-[#8b0000]/10 border-[#8b0000]/20 opacity-80' 
                            : 'bg-black/5 border-[#1a1a1a]/10 hover:border-[#8b0000]/40 disabled:opacity-40'}
                        `}
                        style={{ clipPath: 'polygon(1% 1%, 98% 2%, 100% 1%, 99% 98%, 97% 100%, 2% 98%, 0% 99%, 1% 3%)' }}
                      >
                        <div className="text-left">
                          <div className={`font-bold text-sm transition-colors uppercase tracking-wide font-['Special_Elite'] ${isOwned ? 'text-[#8b0000]' : 'text-[#1a1a1a] group-hover:text-[#8b0000]'}`}>
                            {item.name} {isOwned && '✓'}
                          </div>
                          <div className="text-[11px] text-[#1a1a1a]/60 line-clamp-1 italic font-serif">{item.description}</div>
                        </div>
                        {!isOwned && (
                          <div className="font-['Special_Elite'] font-bold text-[#8b0000] bg-[#8b0000]/5 px-3 py-1 border border-[#8b0000]/20 group-hover:scale-110 transition-transform">
                            ${item.cost}
                          </div>
                        )}
                        {isOwned && (
                          <div className="text-[10px] font-bold text-[#8b0000] bg-[#8b0000]/10 px-3 py-1 border border-[#8b0000]/20 font-['Special_Elite']">
                            ACQUIRED
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Special Services Section (Deck Customization) */}
            <div className="mt-8 pt-6 border-t border-[#1a1a1a]/10">
                <h3 className="text-xs font-bold text-[#8b0000]/60 tracking-[.4em] uppercase mb-4 font-serif">Deck Alteration Rites</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['2', '3', '4', '5'].map((rank) => {
                        const isRemoved = removedRanks.includes(rank);
                        return (
                            <button
                                key={rank}
                                disabled={bankroll < 500 || isRemoved}
                                onClick={() => onRemoveCard(rank)}
                                className={`
                                    py-3 border-2 text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 font-['Special_Elite']
                                    ${isRemoved 
                                        ? 'border-transparent bg-[#8b0000]/5 text-[#8b0000]/30 cursor-not-allowed' 
                                        : 'border-[#1a1a1a]/10 bg-black/5 text-[#1a1a1a] hover:border-[#8b0000]/40 hover:text-[#8b0000]'}
                                `}
                                style={{ clipPath: 'polygon(2% 4%, 98% 1%, 100% 10%, 97% 95%, 95% 100%, 5% 97%, 1% 90%, 3% 5%)' }}
                            >
                                <span className={`${isRemoved ? 'line-through' : ''}`}>PURGE {rank}</span>
                                {!isRemoved && <span className="text-[10px] text-[#8b0000]">$500</span>}
                            </button>
                        );
                    })}
                </div>
            </div>

            <button 
              onClick={onClose}
              className="w-full mt-10 py-5 font-bold text-[#1a1a1a] tracking-[0.4em] border-2 border-[#1a1a1a] hover:bg-black/5 transition-colors font-['Special_Elite'] uppercase text-xl"
              style={{ clipPath: 'polygon(0% 0.5%, 100% 0.1%, 99.5% 99%, 0.5% 100%)' }}
            >
              RESUME TRIAL
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
