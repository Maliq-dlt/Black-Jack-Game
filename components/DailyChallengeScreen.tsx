import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DailyChallenge, ChallengeDifficulty } from '../types';
import { generateDailyChallenge, MODIFIER_INFO, DIFFICULTY_COLORS } from '../challengeData';

interface DailyChallengeScreenProps {
  isOpen: boolean;
  onClose: () => void;
  onStartChallenge: (challenge: DailyChallenge) => void;
  completedChallenges: string[];
  challengeTokens: number;
}

export const DailyChallengeScreen: React.FC<DailyChallengeScreenProps> = ({
  isOpen,
  onClose,
  onStartChallenge,
  completedChallenges,
  challengeTokens,
}) => {
  const todayChallenge = generateDailyChallenge(new Date());
  const isCompleted = completedChallenges.includes(todayChallenge.id);
  const difficultyColor = DIFFICULTY_COLORS[todayChallenge.difficulty];

  if (!isOpen) return null;

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
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          className="relative w-full max-w-lg parchment-bg border-4 border-[#3a0a0a] p-6 shadow-2xl overflow-hidden"
          style={{ clipPath: 'polygon(0.5% 1%, 99% 0%, 100% 2%, 99.5% 98%, 98% 100%, 1% 99%, 0% 98%, 0.5% 2%)' }}
        >
          {/* Background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
          
          {/* Header */}
          <div className="flex justify-between items-center mb-6 relative z-10">
            <div>
              <h2 className="text-2xl font-black text-[#1a1a1a] tracking-widest font-['Special_Elite']">
                DAILY CHALLENGE
              </h2>
              <p className="text-[10px] text-[#8b0000]/60 font-bold tracking-[0.2em] font-serif uppercase">
                {todayChallenge.date}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] text-[#1a1a1a]/60 font-bold block uppercase">Tokens</span>
                <span className="text-xl font-['Special_Elite'] font-bold text-[#8b0000]">🪙 {challengeTokens}</span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors text-[#1a1a1a]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Challenge Card */}
          <div 
            className="relative border-2 p-5 mb-4"
            style={{ borderColor: difficultyColor }}
          >
            {/* Difficulty Badge */}
            <div 
              className="absolute -top-3 left-4 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white"
              style={{ backgroundColor: difficultyColor }}
            >
              {todayChallenge.difficulty}
            </div>
            
            {/* Completed Badge */}
            {isCompleted && (
              <div className="absolute -top-3 right-4 px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-green-600 text-white">
                ✓ COMPLETED
              </div>
            )}

            <h3 className="font-['Special_Elite'] text-xl font-bold text-[#1a1a1a] uppercase mt-2 mb-1">
              {todayChallenge.name}
            </h3>
            <p className="text-sm text-[#1a1a1a]/70 italic font-serif mb-4">
              {todayChallenge.description}
            </p>

            {/* Modifiers */}
            <div className="mb-4">
              <span className="text-[10px] text-[#1a1a1a]/50 font-bold uppercase tracking-widest">Active Modifiers</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {todayChallenge.modifiers.map((mod) => {
                  const info = MODIFIER_INFO[mod];
                  return (
                    <div 
                      key={mod}
                      className="flex items-center gap-1 px-2 py-1 bg-black/5 border border-black/10 text-xs"
                      title={info.description}
                    >
                      <span>{info.icon}</span>
                      <span className="font-['Special_Elite'] uppercase">{info.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Target */}
            <div className="flex items-center gap-2 text-sm mb-4">
              <span className="text-[#1a1a1a]/50 font-bold uppercase">Goal:</span>
              <span className="font-['Special_Elite'] text-[#1a1a1a]">Reach Stage {todayChallenge.targetStage}</span>
            </div>

            {/* Rewards */}
            <div className="bg-black/5 border border-black/10 p-3">
              <span className="text-[10px] text-[#1a1a1a]/50 font-bold uppercase tracking-widest">Rewards</span>
              <div className="flex gap-4 mt-1">
                <div className="flex items-center gap-1">
                  <span className="text-lg">⭐</span>
                  <span className="font-['Special_Elite'] font-bold">{todayChallenge.rewards.prestigePoints} PP</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-lg">🪙</span>
                  <span className="font-['Special_Elite'] font-bold">{todayChallenge.rewards.tokens} Tokens</span>
                </div>
              </div>
              {todayChallenge.rewards.specialReward && (
                <div className="mt-2 text-[10px] text-purple-700 font-bold uppercase">
                  🎁 {todayChallenge.rewards.specialReward}
                </div>
              )}
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={() => !isCompleted && onStartChallenge(todayChallenge)}
            disabled={isCompleted}
            className={`
              w-full py-3 font-['Special_Elite'] font-bold text-lg uppercase tracking-widest transition-all
              ${isCompleted 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-[#8b0000] text-white hover:bg-[#6b0000] hover:scale-[1.02]'}
            `}
            style={{ clipPath: 'polygon(2% 0%, 98% 5%, 100% 95%, 95% 100%, 5% 95%, 0% 5%)' }}
          >
            {isCompleted ? 'Challenge Completed' : 'Begin Challenge'}
          </button>

          {/* Info */}
          <p className="text-center text-[10px] text-[#1a1a1a]/40 mt-3 font-serif italic">
            Daily challenges reset at midnight. Good luck, gambler.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DailyChallengeScreen;
