import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParticleSystem } from './ParticleSystem';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  reward?: {
    type: 'gold' | 'prestige' | 'unlock';
    amount: number;
    item?: string;
  };
}

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onComplete?: () => void;
}

const RARITY_CONFIG: Record<string, { 
  color: string; 
  bgGradient: string;
  particleType: string;
  sound?: string;
}> = {
  common: {
    color: '#94a3b8',
    bgGradient: 'from-gray-700 to-gray-800',
    particleType: 'sparkle'
  },
  rare: {
    color: '#3b82f6',
    bgGradient: 'from-blue-600 to-blue-800',
    particleType: 'confetti'
  },
  epic: {
    color: '#a855f7',
    bgGradient: 'from-purple-600 to-purple-800',
    particleType: 'gold_shower'
  },
  legendary: {
    color: '#eab308',
    bgGradient: 'from-yellow-500 to-yellow-700',
    particleType: 'fireworks'
  }
};

/**
 * AchievementNotification - Notifikasi achievement yang menarik
 * 
 * Features:
 * - Particle effects berdasarkan rarity
 * - Animated entrance/exit
 * - Reward display
 * - Progress bar untuk multiple achievements
 */
export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onComplete
}) => {
  const [particles, setParticles] = useState(false);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    if (achievement) {
      // Trigger particles
      setParticles(true);
      
      // Show reward after delay
      const rewardTimer = setTimeout(() => {
        setShowReward(true);
      }, 1000);

      // Auto dismiss
      const dismissTimer = setTimeout(() => {
        setParticles(false);
        setShowReward(false);
        onComplete?.();
      }, 5000);

      return () => {
        clearTimeout(rewardTimer);
        clearTimeout(dismissTimer);
      };
    }
  }, [achievement, onComplete]);

  if (!achievement) return null;
  const config = RARITY_CONFIG[achievement.rarity] || RARITY_CONFIG.common;

  return (
    <>
      {/* Particle Effects */}
      <ParticleSystem
        type={config.particleType as any}
        trigger={particles}
        origin={{ x: 0.5, y: 0.2 }}
        intensity={achievement.rarity === 'legendary' ? 'extreme' : 'high'}
        duration={4000}
      />

      {/* Main Notification */}
      <AnimatePresence>
        {achievement && (
          <motion.div
            initial={{ opacity: 0, y: -100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-8 left-8 z-[9999]"
          >
            {/* Glow Effect */}
            <motion.div
              animate={{
                boxShadow: [
                  `0 0 20px ${config.color}40`,
                  `0 0 60px ${config.color}80`,
                  `0 0 20px ${config.color}40`
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`
                bg-gradient-to-r ${config.bgGradient} 
                rounded-2xl p-1 overflow-hidden
              `}
            >
              <div className="bg-zinc-900 rounded-xl px-8 py-6 flex items-center gap-6 min-w-[400px]">
                {/* Icon */}
                <motion.div
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="relative"
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, -10, 10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 0.5, repeat: 2 }}
                    className="text-6xl"
                  >
                    {achievement.icon}
                  </motion.div>
                  
                  {/* Rarity Badge */}
                  <div 
                    className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                    style={{ 
                      backgroundColor: config.color,
                      color: '#000'
                    }}
                  >
                    {achievement.rarity}
                  </div>
                </motion.div>

                {/* Content */}
                <div className="flex-1">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xs uppercase tracking-widest mb-1"
                    style={{ color: config.color }}
                  >
                    Achievement Unlocked!
                  </motion.div>
                  
                  <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl font-black text-white mb-1"
                  >
                    {achievement.name}
                  </motion.h3>
                  
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-zinc-400 text-sm"
                  >
                    {achievement.description}
                  </motion.p>

                  {/* Reward */}
                  <AnimatePresence>
                    {showReward && achievement.reward && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-3 flex items-center gap-2"
                      >
                        <span className="text-zinc-500 text-sm">Reward:</span>
                        <span className={`
                          font-bold px-3 py-1 rounded-full text-sm
                          ${achievement.reward.type === 'gold' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                          ${achievement.reward.type === 'prestige' ? 'bg-purple-500/20 text-purple-400' : ''}
                          ${achievement.reward.type === 'unlock' ? 'bg-blue-500/20 text-blue-400' : ''}
                        `}>
                          {achievement.reward.type === 'gold' && '💰'}
                          {achievement.reward.type === 'prestige' && '⭐'}
                          {achievement.reward.type === 'unlock' && '🔓'}
                          {' '}
                          {achievement.reward.amount > 0 && achievement.reward.amount.toLocaleString()}
                          {' '}
                          {achievement.reward.item || achievement.reward.type}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Progress Ring (decorative) */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="relative w-16 h-16"
                >
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="#374151"
                      strokeWidth="4"
                    />
                    <motion.circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke={config.color}
                      strokeWidth="4"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: '0 176' }}
                      animate={{ strokeDasharray: '176 176' }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl">✓</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Progress Bar (auto-dismiss) */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 5, ease: 'linear' }}
              className="h-1 rounded-full mt-2 origin-left"
              style={{ backgroundColor: config.color }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/**
 * AchievementQueue - Queue untuk multiple achievements
 */
interface AchievementQueueProps {
  achievements: Achievement[];
  onAllComplete?: () => void;
}

export const AchievementQueue: React.FC<AchievementQueueProps> = ({
  achievements,
  onAllComplete
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShowing, setIsShowing] = useState(true);

  const handleComplete = () => {
    if (currentIndex < achievements.length - 1) {
      setIsShowing(false);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setIsShowing(true);
      }, 500);
    } else {
      onAllComplete?.();
    }
  };

  if (achievements.length === 0) return null;

  return (
    <AnimatePresence>
      {isShowing && (
        <AchievementNotification
          achievement={achievements[currentIndex]}
          onComplete={handleComplete}
        />
      )}
    </AnimatePresence>
  );
};

/**
 * AchievementToast - Simple toast notification
 */
interface AchievementToastProps {
  achievement: Achievement;
  onClose: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({
  achievement,
  onClose
}) => {
  const config = RARITY_CONFIG[achievement.rarity] || RARITY_CONFIG.common;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="fixed bottom-4 right-4 z-[9999]"
    >
      <div 
        className={`
          bg-gradient-to-r ${config.bgGradient} p-0.5 rounded-xl
        `}
      >
        <div className="bg-zinc-900 rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="text-2xl">{achievement.icon}</span>
          <div>
            <div className="text-xs uppercase" style={{ color: config.color }}>
              Achievement
            </div>
            <div className="font-bold text-white">{achievement.name}</div>
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-zinc-500 hover:text-white"
          >
            ✕
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AchievementNotification;
