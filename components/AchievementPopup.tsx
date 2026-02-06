import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Achievement, AchievementType } from '../types';

interface AchievementPopupProps {
  achievement: Achievement | null;
  onDismiss: () => void;
}

const AchievementPopup: React.FC<AchievementPopupProps> = ({ achievement, onDismiss }) => {
  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(onDismiss, 4000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onDismiss]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ y: -100, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -100, opacity: 0, scale: 0.8 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] pointer-events-none"
        >
          <div className="bg-gradient-to-r from-yellow-600 to-amber-500 rounded-2xl p-1 shadow-2xl">
            <div className="bg-zinc-900 rounded-xl px-6 py-4 flex items-center gap-4">
              <div className="text-4xl">{achievement.icon}</div>
              <div>
                <p className="text-yellow-500 text-xs font-bold tracking-widest uppercase">Achievement Unlocked!</p>
                <p className="text-white font-bold text-lg">{achievement.name}</p>
                <p className="text-gray-400 text-xs">{achievement.description}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Achievement Definitions
export const ACHIEVEMENTS: Record<AchievementType, Omit<Achievement, 'id' | 'unlockedAt'>> = {
  [AchievementType.FirstWin]: { type: AchievementType.FirstWin, name: 'First Victory', description: 'Win your first hand', icon: '🏆' },
  [AchievementType.TenWins]: { type: AchievementType.TenWins, name: 'Getting Started', description: 'Win 10 hands', icon: '🎯' },
  [AchievementType.FiftyWins]: { type: AchievementType.FiftyWins, name: 'Veteran Player', description: 'Win 50 hands', icon: '⭐' },
  [AchievementType.FirstBlackjack]: { type: AchievementType.FirstBlackjack, name: 'Natural!', description: 'Get your first Blackjack', icon: '🃏' },
  [AchievementType.TenBlackjacks]: { type: AchievementType.TenBlackjacks, name: 'Card Sharp', description: 'Get 10 Blackjacks', icon: '♠️' },
  [AchievementType.BeatBoss]: { type: AchievementType.BeatBoss, name: 'Boss Slayer', description: 'Defeat a Boss Dealer', icon: '👑' },
  [AchievementType.BeatFiveBosses]: { type: AchievementType.BeatFiveBosses, name: 'Legendary', description: 'Defeat 5 Boss Dealers', icon: '🔥' },
  [AchievementType.ReachStage10]: { type: AchievementType.ReachStage10, name: 'Climber', description: 'Reach Stage 10', icon: '📈' },
  [AchievementType.ReachStage20]: { type: AchievementType.ReachStage20, name: 'Summit', description: 'Reach Stage 20', icon: '🏔️' },
  [AchievementType.Earn10k]: { type: AchievementType.Earn10k, name: 'Money Maker', description: 'Earn $10,000 lifetime', icon: '💰' },
  [AchievementType.Earn100k]: { type: AchievementType.Earn100k, name: 'Tycoon', description: 'Earn $100,000 lifetime', icon: '💎' },
  [AchievementType.PerfectRun]: { type: AchievementType.PerfectRun, name: 'Untouchable', description: 'Win 10 hands in a row', icon: '✨' },
  [AchievementType.HighRoller]: { type: AchievementType.HighRoller, name: 'High Roller', description: 'Bet $500+ and win', icon: '🎰' },
  [AchievementType.Collector]: { type: AchievementType.Collector, name: 'Collector', description: 'Own 5+ artifacts', icon: '🎁' },
};

export const createAchievement = (type: AchievementType): Achievement => ({
  id: `ach-${type}-${Date.now()}`,
  ...ACHIEVEMENTS[type],
  unlockedAt: Date.now()
});

export default AchievementPopup;
