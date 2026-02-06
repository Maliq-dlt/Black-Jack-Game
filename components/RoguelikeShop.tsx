import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PowerUp, Artifact, PowerUpType, ArtifactType, ArtifactTier, ArtifactSet } from '../types';

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

// Tier color mapping
const TIER_COLORS: Record<ArtifactTier, { bg: string; border: string; text: string }> = {
  [ArtifactTier.Common]: { bg: 'bg-gray-200/50', border: 'border-gray-400', text: 'text-gray-700' },
  [ArtifactTier.Rare]: { bg: 'bg-blue-200/50', border: 'border-blue-500', text: 'text-blue-700' },
  [ArtifactTier.Epic]: { bg: 'bg-purple-200/50', border: 'border-purple-500', text: 'text-purple-700' },
  [ArtifactTier.Legendary]: { bg: 'bg-yellow-200/50', border: 'border-yellow-500', text: 'text-yellow-700' },
  [ArtifactTier.Cursed]: { bg: 'bg-red-200/50', border: 'border-red-700', text: 'text-red-700' },
};

export const ARTIFACTS: Artifact[] = [
  // === COMMON ===
  {
    id: 'golden_touch', type: ArtifactType.GoldenTouch, tier: ArtifactTier.Common,
    name: 'Golden Touch', description: '+5% winnings on all hands.', cost: 500
  },
  {
    id: 'lucky_coin', type: ArtifactType.LuckyCoin, tier: ArtifactTier.Common,
    name: 'Lucky Coin', description: '+2% wild card chance.', cost: 400
  },
  {
    id: 'chip_magnet', type: ArtifactType.ChipMagnet, tier: ArtifactTier.Common,
    name: 'Chip Magnet', description: '+$10 per win.', cost: 350
  },
  // === RARE ===
  {
    id: 'lucky_seven', type: ArtifactType.LuckySeven, tier: ArtifactTier.Rare,
    name: 'Lucky Seven', description: '7 in hand = +$77 bonus.', cost: 800, set: ArtifactSet.GamblerCollection
  },
  {
    id: 'ace_in_hole', type: ArtifactType.AceInTheHole, tier: ArtifactTier.Rare,
    name: 'Ace in the Hole', description: 'First Ace = peek dealer card.', cost: 900, set: ArtifactSet.GamblerCollection
  },
  {
    id: 'combo_starter', type: ArtifactType.ComboStarter, tier: ArtifactTier.Rare,
    name: 'Combo Starter', description: 'Win streak bonus starts at 2.', cost: 750
  },
  // === EPIC ===
  {
    id: 'vampiric_gamble', type: ArtifactType.VampiricGamble, tier: ArtifactTier.Epic,
    name: 'Vampiric Gamble', description: 'Win = heal 10% of bet.', cost: 1200, set: ArtifactSet.BloodOath
  },
  {
    id: 'ghost_hand', type: ArtifactType.GhostHand, tier: ArtifactTier.Epic,
    name: 'Ghost Hand', description: '10% chance bust = push instead.', cost: 1500, set: ArtifactSet.ShadowPact
  },
  {
    id: 'high_roller_badge', type: ArtifactType.HighRollerBadge, tier: ArtifactTier.Epic,
    name: 'High Roller Badge', description: 'Bets $200+ = +25% payout.', cost: 1800, set: ArtifactSet.FortuneFavor
  },
  // === LEGENDARY ===
  {
    id: 'phoenix_feather', type: ArtifactType.PhoenixFeather, tier: ArtifactTier.Legendary,
    name: 'Phoenix Feather', description: 'Revive once at 50% bankroll.', cost: 3000
  },
  {
    id: 'shadow_cloak', type: ArtifactType.ShadowCloak, tier: ArtifactTier.Legendary,
    name: 'Shadow Cloak', description: 'Boss traits reduced 50%.', cost: 2500, set: ArtifactSet.ShadowPact
  },
  // === CURSED ===
  {
    id: 'blood_pact', type: ArtifactType.BloodPact, tier: ArtifactTier.Cursed, isCursed: true,
    name: 'Blood Pact', description: '+50% wins, but lose 10% on bust.', cost: 666, set: ArtifactSet.BloodOath,
    drawback: 'Bust penalty increased by 10%'
  },
  {
    id: 'demon_dice', type: ArtifactType.DemonDice, tier: ArtifactTier.Cursed, isCursed: true,
    name: 'Demon Dice', description: 'Random: 3x payout OR lose bet.', cost: 999,
    drawback: '50% chance to lose everything'
  },
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
            className="relative w-full max-w-4xl bg-[#d1c7a7] border-4 border-[#3a0a0a] rounded-sm p-8 shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-y-auto max-h-[90vh]"
            style={{ clipPath: 'polygon(0.5% 1%, 99% 0%, 100% 2%, 99.5% 98%, 98% 100%, 1% 99%, 0% 98%, 0.5% 2%)' }}
          >
            {/* Background Grain Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <h2 className="text-5xl font-black text-[#1a1a1a] tracking-widest font-['Special_Elite']">BLACK MARKET</h2>
                <p className="text-[#8b0000] text-sm font-bold tracking-[0.4em] font-serif uppercase mt-2">THE LEDGER OF SIN & POWER</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-[#1a1a1a]/60 text-[10px] font-bold block uppercase tracking-tighter">Gold Pieces</span>
                  <span className="text-5xl font-['Special_Elite'] font-bold text-[#1a1a1a] tracking-tighter">${bankroll.toFixed(0)}</span>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-full transition-colors text-[#1a1a1a] mt-[-10px]">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
              {/* Power-ups Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-blue-700 tracking-[.4em] uppercase border-b border-black/5 pb-2 font-serif italic opacity-60">Consumables</h3>
                <div className="space-y-4">
                  {POWER_UPS.map((item) => (
                      <button
                        key={item.id}
                        disabled={bankroll < item.cost}
                        onClick={() => onBuyPowerUp(item)}
                        className="w-full flex items-center justify-between p-5 bg-black/5 border-2 border-[#1a1a1a]/10 hover:border-[#8b0000]/40 transition-all group disabled:opacity-40 relative"
                        style={{ clipPath: 'polygon(1% 4%, 99% 1%, 100% 8%, 98% 99%, 96% 100%, 2% 97%, 0% 92%, 1% 5%)' }}
                      >
                        <div className="text-left pr-4">
                          <div className="font-bold text-[#1a1a1a] text-lg group-hover:text-[#8b0000] transition-colors uppercase tracking-tight font-['Special_Elite']">{item.name}</div>
                          <div className="text-[12px] text-[#1a1a1a]/60 italic font-serif leading-tight mt-0.5">{item.description}</div>
                        </div>
                        <div className="min-w-[70px] h-11 flex items-center justify-center font-['Special_Elite'] font-bold text-xl text-[#8b0000] bg-black/5 border-2 border-[#8b0000]/30 transition-transform">
                          ${item.cost}
                        </div>
                      </button>
                  ))}
                </div>
              </div>

              {/* Artifacts Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-blue-700 tracking-[.4em] uppercase border-b border-black/5 pb-2 font-serif italic opacity-60">Passive Artifacts</h3>
                <div className="space-y-4">
                  {ARTIFACTS.map((item) => {
                    const isOwned = ownedArtifacts.some(a => a.id === item.id);
                    const tierStyle = TIER_COLORS[item.tier];
                    return (
                      <button
                        key={item.id}
                        disabled={bankroll < item.cost || isOwned}
                        onClick={() => onBuyArtifact(item)}
                        className={`
                          w-full flex items-center justify-between p-5 transition-all border-2 group relative overflow-visible
                          ${isOwned 
                            ? 'bg-black/10 border-black/20 opacity-50 grayscale' 
                            : item.tier === ArtifactTier.Rare || item.tier === ArtifactTier.Epic ? 'bg-blue-50/20 border-blue-700/30 hover:border-blue-700 shadow-sm' : 'bg-black/5 border-[#1a1a1a]/10 hover:border-[#1a1a1a]/40'}
                        `}
                      >
                        {/* Rarity Tag */}
                        <div className={`absolute -top-3 -right-3 px-3 py-0.5 text-[9px] font-black uppercase tracking-widest border-2 z-20 shadow-sm
                          ${item.tier === ArtifactTier.Rare || item.tier === ArtifactTier.Epic ? 'bg-blue-50 text-blue-700 border-blue-700' : 'bg-[#d1c7a7] text-gray-700 border-gray-400'}`}>
                          {item.tier}
                        </div>
                        
                        {/* Cursed Glow Effect */}
                        {item.isCursed && (
                          <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-transparent animate-pulse pointer-events-none" />
                        )}
                        
                        <div className="text-left pr-4">
                          <div className="flex items-center gap-2 mb-0.5">
                            <div className="font-bold text-[#1a1a1a] text-lg group-hover:text-blue-700 transition-colors uppercase tracking-tight font-['Special_Elite']">{item.name}</div>
                            {item.set && (
                              <span className="px-2 py-0.5 bg-black/10 text-[8px] font-bold text-gray-600 uppercase tracking-tighter rounded-sm self-center">
                                {item.set.replace(/_/g, ' ')}
                              </span>
                            )}
                          </div>
                          <div className="text-[12px] text-[#1a1a1a]/60 italic font-serif leading-tight">{item.description}</div>
                        </div>
                        <div className={`min-w-[70px] h-11 flex items-center justify-center font-['Special_Elite'] font-bold text-xl transition-transform border-2
                          ${item.tier === ArtifactTier.Rare || item.tier === ArtifactTier.Epic ? 'text-blue-700 border-blue-700/40 bg-blue-50/50' : 'text-[#1a1a1a] border-[#1a1a1a]/30 bg-black/5'}
                        `}>
                          ${item.cost}
                        </div>
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
