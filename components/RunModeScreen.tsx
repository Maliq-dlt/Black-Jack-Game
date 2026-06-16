import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RunMode } from '../types';
import { RUN_MODES, ASCENSION_LEVELS, ASCENSION_MODIFIER_INFO, RUN_MODES_MAP, ASCENSION_LEVELS_MAP } from '../ascensionData';

interface RunModeScreenProps {
  isOpen: boolean;
  onClose: () => void;
  currentAscension: number;
  highestAscension: number;
  onSelectMode: (mode: RunMode, ascension: number) => void;
  unlockedModes: RunMode[];
}

export const RunModeScreen: React.FC<RunModeScreenProps> = ({
  isOpen,
  onClose,
  currentAscension,
  highestAscension,
  onSelectMode,
  unlockedModes,
}) => {
  const [selectedMode, setSelectedMode] = React.useState<RunMode>(RunMode.Standard);
  const [selectedAscension, setSelectedAscension] = React.useState(currentAscension);
  
  const selectedModeConfig = RUN_MODES_MAP.get(selectedMode)!;
  const selectedAscensionData = ASCENSION_LEVELS_MAP.get(selectedAscension);

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
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-4xl parchment-bg border-4 border-[#3a0a0a] p-6 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          style={{ clipPath: 'polygon(0.5% 1%, 99% 0%, 100% 2%, 99.5% 98%, 98% 100%, 1% 99%, 0% 98%, 0.5% 2%)' }}
        >
          {/* Background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
          
          {/* Header */}
          <div className="flex justify-between items-center mb-6 relative z-10">
            <div>
              <h2 className="text-2xl font-black text-[#1a1a1a] tracking-widest font-['Special_Elite']">
                START A RUN
              </h2>
              <p className="text-[10px] text-[#8b0000]/60 font-bold tracking-[0.2em] font-serif uppercase">
                Choose Your Challenge
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors text-[#1a1a1a]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Run Modes */}
            <div>
              <h3 className="text-xs font-bold text-[#1a1a1a]/50 uppercase tracking-widest mb-3">Game Mode</h3>
              <div className="space-y-2">
                {RUN_MODES.map((mode) => {
                  const isUnlocked = unlockedModes.includes(mode.mode) || mode.mode === RunMode.Standard || mode.mode === RunMode.Practice;
                  const isSelected = selectedMode === mode.mode;
                  
                  return (
                    <button
                      key={mode.mode}
                      onClick={() => isUnlocked && setSelectedMode(mode.mode)}
                      disabled={!isUnlocked}
                      className={`
                        w-full p-3 border-2 text-left transition-all
                        ${isSelected 
                          ? 'border-[#8b0000] bg-black/10' 
                          : isUnlocked
                            ? 'border-[#1a1a1a]/20 hover:border-[#1a1a1a]/40'
                            : 'border-[#1a1a1a]/10 opacity-40 cursor-not-allowed'}
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{mode.icon}</span>
                        <span className="font-['Special_Elite'] font-bold uppercase" style={{ color: mode.color }}>
                          {mode.name}
                        </span>
                        {!isUnlocked && <span className="text-[9px] text-[#1a1a1a]/50">🔒</span>}
                      </div>
                      <p className="text-[10px] text-[#1a1a1a]/60 mt-1 italic">{mode.description}</p>
                      {!isUnlocked && mode.unlockRequirement && (
                        <p className="text-[9px] text-[#8b0000]/60 mt-1 font-bold">Unlock: {mode.unlockRequirement}</p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ascension Selection */}
            <div>
              <h3 className="text-xs font-bold text-[#1a1a1a]/50 uppercase tracking-widest mb-3">
                Ascension Level (Max: {highestAscension})
              </h3>
              <div className="grid grid-cols-5 gap-1 mb-4">
                {Array.from({ length: 20 }, (_, i) => i + 1).map((level) => {
                  const isUnlocked = level <= highestAscension + 1;
                  const isSelected = selectedAscension === level;
                  const ascData = ASCENSION_LEVELS_MAP.get(level);
                  
                  return (
                    <button
                      key={level}
                      onClick={() => isUnlocked && setSelectedAscension(level)}
                      disabled={!isUnlocked}
                      title={ascData?.name}
                      className={`
                        p-2 text-center border transition-all
                        ${isSelected 
                          ? 'border-[#8b0000] bg-[#8b0000]/10' 
                          : isUnlocked
                            ? 'border-[#1a1a1a]/20 hover:border-[#1a1a1a]/40'
                            : 'border-[#1a1a1a]/10 opacity-30 cursor-not-allowed'}
                      `}
                    >
                      <span className="font-['Special_Elite'] font-bold text-sm">{level}</span>
                    </button>
                  );
                })}
                {/* Level 0 option */}
                <button
                  onClick={() => setSelectedAscension(0)}
                  className={`
                    p-2 text-center border transition-all col-span-5
                    ${selectedAscension === 0 
                      ? 'border-[#22c55e] bg-[#22c55e]/10' 
                      : 'border-[#1a1a1a]/20 hover:border-[#1a1a1a]/40'}
                  `}
                >
                  <span className="font-['Special_Elite'] font-bold text-sm text-green-700">No Ascension (Normal)</span>
                </button>
              </div>

              {/* Selected Ascension Details */}
              {selectedAscensionData && (
                <div className="border-2 border-[#1a1a1a]/20 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{selectedAscensionData.icon}</span>
                    <span className="font-['Special_Elite'] font-bold uppercase text-[#1a1a1a]">
                      {selectedAscensionData.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-[#8b0000]/10 text-[#8b0000] font-bold">
                      {selectedAscensionData.rewardMultiplier}x Rewards
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedAscensionData.modifiers.map((mod) => {
                      const info = ASCENSION_MODIFIER_INFO[mod];
                      return (
                        <div 
                          key={mod}
                          className="flex items-center gap-1 px-2 py-1 bg-red-100 border border-red-200 text-[10px]"
                          title={info.description}
                        >
                          <span>{info.icon}</span>
                          <span className="font-bold text-red-700">{info.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={() => onSelectMode(selectedMode, selectedAscension)}
            className="w-full mt-6 py-4 bg-[#8b0000] text-white font-['Special_Elite'] font-bold text-xl uppercase tracking-widest hover:bg-[#6b0000] transition-all hover:scale-[1.02]"
            style={{ clipPath: 'polygon(2% 0%, 98% 5%, 100% 95%, 95% 100%, 5% 95%, 0% 5%)' }}
          >
            {selectedModeConfig.icon} Begin {selectedModeConfig.name}
            {selectedAscension > 0 && ` (A${selectedAscension})`}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RunModeScreen;
