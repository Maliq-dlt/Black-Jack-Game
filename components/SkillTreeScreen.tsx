import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SkillNode, SpecializationPath, SkillTree } from '../types';
import { SKILL_NODES, getSkillsByPath, canUnlockSkill, PATH_INFO } from '../skillData';

interface SkillTreeScreenProps {
  isOpen: boolean;
  onClose: () => void;
  prestigePoints: number;
  skillTree: SkillTree;
  onUnlockSkill: (skillId: string, cost: number) => void;
}

export const SkillTreeScreen: React.FC<SkillTreeScreenProps> = ({
  isOpen,
  onClose,
  prestigePoints,
  skillTree,
  onUnlockSkill,
}) => {
  const [selectedPath, setSelectedPath] = React.useState<SpecializationPath>(
    skillTree.currentPath !== SpecializationPath.None ? skillTree.currentPath : SpecializationPath.DealerKiller
  );

  const pathSkills = getSkillsByPath(selectedPath);
  const pathInfo = PATH_INFO[selectedPath];

  // Group skills by tier
  const skillsByTier = pathSkills.reduce((acc, skill) => {
    if (!acc[skill.tier]) acc[skill.tier] = [];
    acc[skill.tier].push(skill);
    return acc;
  }, {} as Record<number, SkillNode[]>);

  const handleUnlock = (skill: SkillNode) => {
    if (prestigePoints >= skill.cost && canUnlockSkill(skill.id, skillTree.unlockedSkills)) {
      onUnlockSkill(skill.id, skill.cost);
    }
  };

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
          className="relative w-full max-w-5xl parchment-bg border-4 border-[#3a0a0a] p-6 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          style={{ clipPath: 'polygon(0.5% 1%, 99% 0%, 100% 2%, 99.5% 98%, 98% 100%, 1% 99%, 0% 98%, 0.5% 2%)' }}
        >
          {/* Background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
          
          {/* Header */}
          <div className="flex justify-between items-center mb-6 relative z-10">
            <div>
              <h2 className="text-3xl font-black text-[#1a1a1a] tracking-widest font-['Special_Elite']">ASCENSION TREE</h2>
              <p className="text-[#8b0000]/60 text-xs font-bold tracking-[0.3em] font-serif uppercase mt-1">
                THE PATH OF POWER
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="text-[#1a1a1a]/60 text-[10px] font-bold block uppercase tracking-tighter">Prestige Points</span>
                <span className="text-3xl font-['Special_Elite'] font-bold text-[#8b0000]">{prestigePoints}</span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors text-[#1a1a1a]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Path Selection */}
          <div className="flex gap-3 mb-6">
            {[SpecializationPath.DealerKiller, SpecializationPath.HighRoller, SpecializationPath.Survivor].map((path) => {
              const info = PATH_INFO[path];
              const isActive = selectedPath === path;
              const progress = skillTree.pathProgress[path] || 0;
              
              return (
                <button
                  key={path}
                  onClick={() => setSelectedPath(path)}
                  className={`flex-1 p-4 border-2 transition-all ${
                    isActive 
                      ? 'border-[#8b0000] bg-black/10' 
                      : 'border-[#1a1a1a]/20 hover:border-[#1a1a1a]/40'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{info.icon}</span>
                    <span className="font-['Special_Elite'] font-bold text-[#1a1a1a] uppercase tracking-wider">
                      {info.name}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#1a1a1a]/60 italic">{info.description}</p>
                  <div className="mt-2 h-1 bg-black/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all" 
                      style={{ width: `${(progress / 15) * 100}%`, backgroundColor: info.color }}
                    />
                  </div>
                  <span className="text-[9px] text-[#1a1a1a]/40 font-bold">{progress}/15 pts</span>
                </button>
              );
            })}
          </div>

          {/* Skill Tree Grid */}
          <div className="relative z-10">
            {[1, 2, 3, 4, 5].map((tier) => (
              <div key={tier} className="mb-4">
                <div className="text-[10px] text-[#1a1a1a]/40 font-bold uppercase tracking-widest mb-2">
                  Tier {tier}
                </div>
                <div className="flex gap-3">
                  {(skillsByTier[tier] || []).map((skill) => {
                    const isUnlocked = skillTree.unlockedSkills.includes(skill.id);
                    const canUnlock = canUnlockSkill(skill.id, skillTree.unlockedSkills);
                    const canAfford = prestigePoints >= skill.cost;
                    
                    return (
                      <motion.button
                        key={skill.id}
                        onClick={() => handleUnlock(skill)}
                        disabled={isUnlocked || !canUnlock || !canAfford}
                        whileHover={{ scale: canUnlock && canAfford && !isUnlocked ? 1.05 : 1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
                          flex-1 p-3 border-2 transition-all relative overflow-hidden
                          ${isUnlocked 
                            ? 'bg-[#8b0000]/20 border-[#8b0000]' 
                            : canUnlock && canAfford
                              ? 'bg-black/5 border-[#1a1a1a]/30 hover:border-[#8b0000] cursor-pointer'
                              : 'bg-black/5 border-[#1a1a1a]/10 opacity-50 cursor-not-allowed'}
                        `}
                      >
                        {isUnlocked && (
                          <div className="absolute top-1 right-1 text-[#8b0000] text-xs">✓</div>
                        )}
                        <div className="text-2xl mb-1">{skill.icon}</div>
                        <div className="font-['Special_Elite'] font-bold text-sm text-[#1a1a1a] uppercase">
                          {skill.name}
                        </div>
                        <p className="text-[9px] text-[#1a1a1a]/60 italic mt-1">{skill.description}</p>
                        {!isUnlocked && (
                          <div className="mt-2 text-[10px] font-bold" style={{ color: pathInfo.color }}>
                            {skill.cost} pts
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SkillTreeScreen;
