import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Achievement, AchievementType, LifetimeStats } from '../types';

interface StatsScreenProps {
  isOpen: boolean;
  onClose: () => void;
  stats: LifetimeStats;
}

const ACHIEVEMENT_DATA: Record<AchievementType, { name: string; description: string; icon: string }> = {
  [AchievementType.FirstWin]: { name: 'First Victory', description: 'Win your first hand', icon: '🏆' },
  [AchievementType.TenWins]: { name: 'Getting Started', description: 'Win 10 hands', icon: '🎯' },
  [AchievementType.FiftyWins]: { name: 'Veteran Player', description: 'Win 50 hands', icon: '⭐' },
  [AchievementType.FirstBlackjack]: { name: 'Natural!', description: 'Get your first Blackjack', icon: '🃏' },
  [AchievementType.TenBlackjacks]: { name: 'Card Sharp', description: 'Get 10 Blackjacks', icon: '♠️' },
  [AchievementType.BeatBoss]: { name: 'Boss Slayer', description: 'Defeat a Boss Dealer', icon: '👑' },
  [AchievementType.BeatFiveBosses]: { name: 'Legendary', description: 'Defeat 5 Boss Dealers', icon: '🔥' },
  [AchievementType.ReachStage10]: { name: 'Climber', description: 'Reach Stage 10', icon: '📈' },
  [AchievementType.ReachStage20]: { name: 'Summit', description: 'Reach Stage 20', icon: '🏔️' },
  [AchievementType.Earn10k]: { name: 'Money Maker', description: 'Earn $10,000 lifetime', icon: '💰' },
  [AchievementType.Earn100k]: { name: 'Tycoon', description: 'Earn $100,000 lifetime', icon: '💎' },
  [AchievementType.PerfectRun]: { name: 'Untouchable', description: 'Win 10 hands in a row', icon: '✨' },
  [AchievementType.HighRoller]: { name: 'High Roller', description: 'Bet $500+ and win', icon: '🎰' },
  [AchievementType.Collector]: { name: 'Collector', description: 'Own 5+ artifacts', icon: '🎁' },
};

const StatsScreen: React.FC<StatsScreenProps> = ({ isOpen, onClose, stats }) => {
  const winRate = stats.totalWins + stats.totalLosses > 0 
    ? ((stats.totalWins / (stats.totalWins + stats.totalLosses)) * 100).toFixed(1) 
    : '0';

  const unlockedCount = stats.achievements.filter(a => a.unlockedAt).length;
  const totalAchievements = Object.keys(AchievementType).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-4xl parchment-bg border-4 border-[#1a1a1a] rounded-sm p-8 shadow-[0_0_60px_rgba(0,0,0,0.8)] my-8 max-h-[90vh] overflow-y-auto"
            style={{ clipPath: 'polygon(0.5% 1%, 99.5% 0.5%, 100% 3%, 99% 97%, 98.5% 100%, 1.5% 99.5%, 0% 98%, 1% 1.5%)' }}
          >
            {/* Background Grain Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />

            {/* Header */}
            <div className="flex justify-between items-center mb-8 relative z-10">
              <div>
                <h2 className="text-4xl font-['Special_Elite'] font-bold text-[#1a1a1a] tracking-wider uppercase">LIFETIME RECORD</h2>
                <p className="text-[#8b0000]/60 text-xs font-bold tracking-[0.3em] font-serif uppercase mt-1">THE ACCUMULATED SINS OF THE GAMBLER</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-black/10 rounded-full transition-colors text-[#1a1a1a]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 relative z-10">
              {[
                { label: 'Total Wins', value: stats.totalWins, color: 'text-[#0d1a0d]' },
                { label: 'Total Losses', value: stats.totalLosses, color: 'text-[#3a0a0a]' },
                { label: 'Win Rate', value: `${winRate}%`, color: 'text-[#1a1a1a]' },
                { label: 'Blackjacks', value: stats.totalBlackjacks, color: 'text-[#1a1a1a]' },
                { label: 'Total Earnings', value: `$${stats.totalEarnings.toLocaleString()}`, color: 'text-[#8b0000]' },
                { label: 'Peak Bankroll', value: `$${stats.highestBankroll.toLocaleString()}`, color: 'text-[#1a1a1a]' },
                { label: 'Best Streak', value: stats.highestStreak, color: 'text-[#1a1a1a]' },
                { label: 'Bosses Defeated', value: stats.bossesDefeated, color: 'text-[#3a0a0a]' },
              ].map((stat) => (
                <div key={stat.label} className="bg-black/5 border border-[#1a1a1a]/10 rounded-sm p-4 text-center font-['Special_Elite']">
                  <p className="text-[10px] font-bold text-[#1a1a1a]/50 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Achievements Section */}
            <div className="border-t border-[#1a1a1a]/10 pt-6 relative z-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[#1a1a1a] font-['Special_Elite'] uppercase tracking-widest">Mark of the Rogue</h3>
                <span className="text-sm text-[#1a1a1a]/60 font-serif italic">{unlockedCount}/{totalAchievements} SEALED</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Object.values(AchievementType).map((type) => {
                  const data = ACHIEVEMENT_DATA[type];
                  const unlocked = stats.achievements.find(a => a.type === type);
                  
                  return (
                    <div 
                      key={type}
                      className={`
                        p-3 rounded-sm border-2 transition-all font-['Special_Elite']
                        ${unlocked 
                          ? 'bg-[#8b0000]/5 border-[#8b0000]/30' 
                          : 'bg-black/5 border-[#1a1a1a]/10 opacity-30 grayscale'}
                      `}
                      style={{ clipPath: 'polygon(1% 2%, 99% 0%, 100% 5%, 98% 98%, 97% 100%, 3% 97%, 0% 95%, 2% 2%)' }}
                    >
                      <div className="text-2xl mb-1 mix-blend-darken filter grayscale">{data.icon}</div>
                      <div className={`font-bold text-[11px] leading-tight uppercase ${unlocked ? 'text-[#8b0000]' : 'text-gray-500'}`}>
                        {data.name}
                      </div>
                      <div className="text-[9px] text-[#1a1a1a]/60 font-serif italic leading-tight mt-0.5">{data.description}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full mt-8 py-4 bg-transparent border-2 border-[#1a1a1a] text-[#1a1a1a] font-['Special_Elite'] font-black rounded-sm tracking-[0.4em] transition-all uppercase text-xl"
            >
              SEAL THE BOOK
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StatsScreen;
