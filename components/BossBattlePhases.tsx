import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParticleSystem } from './ParticleSystem';
import { NumberCounter } from './NumberCounter';

// Types
export type BossPhase = 'intro' | 'phase1' | 'phase2' | 'phase3' | 'enraged' | 'defeated';

export interface BossAbility {
  id: string;
  name: string;
  description: string;
  icon: string;
  cooldown: number;
  lastUsed: number;
  effect: () => void;
}

export interface BossData {
  id: string;
  name: string;
  title: string;
  icon: string;
  maxHealth: number;
  currentHealth: number;
  phase: BossPhase;
  abilities: BossAbility[];
  traits: string[];
  dialogue: Record<BossPhase, string[]>;
  color: string;
}

interface BossBattlePhasesProps {
  boss: BossData;
  onHealthChange: (health: number) => void;
  onPhaseChange: (phase: BossPhase) => void;
  onAbilityTrigger: (ability: BossAbility) => void;
  onBossDefeated: () => void;
}

/**
 * BossBattlePhases - Multi-phase boss battle dengan animasi
 * 
 * Features:
 * - Multiple phases dengan visual changes
 * - Ability cooldowns
 * - Dynamic dialogue
 * - Phase transitions dengan effects
 * - Health bar dengan segments
 */
export const BossBattlePhases: React.FC<BossBattlePhasesProps> = ({
  boss,
  onHealthChange,
  onPhaseChange,
  onAbilityTrigger,
  onBossDefeated
}) => {
  const [currentDialogue, setCurrentDialogue] = useState<string>('');
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [showAbility, setShowAbility] = useState<BossAbility | null>(null);
  const [phaseTransition, setPhaseTransition] = useState(false);
  const [particles, setParticles] = useState<{ type: string; trigger: boolean } | null>(null);

  const healthPercent = (boss.currentHealth / boss.maxHealth) * 100;

  // Determine phase based on health
  const determinePhase = useCallback((): BossPhase => {
    if (boss.currentHealth <= 0) return 'defeated';
    if (healthPercent <= 15) return 'enraged';
    if (healthPercent <= 40) return 'phase3';
    if (healthPercent <= 70) return 'phase2';
    if (healthPercent <= 100) return 'phase1';
    return 'intro';
  }, [boss.currentHealth, healthPercent]);

  // Handle phase change
  useEffect(() => {
    const newPhase = determinePhase();
    
    if (newPhase !== boss.phase && newPhase !== 'intro') {
      setPhaseTransition(true);
      
      // Trigger phase transition effect
      setParticles({ type: 'shockwave', trigger: true });
      
      // Change dialogue
      const phaseDialogues = boss.dialogue[newPhase] || ['...'];
      setCurrentDialogue(phaseDialogues[0]);
      setDialogueIndex(0);
      
      // Notify parent
      onPhaseChange(newPhase);
      
      // End transition
      setTimeout(() => {
        setPhaseTransition(false);
        setParticles(null);
      }, 1500);
    }
  }, [boss.currentHealth, boss.phase, determinePhase, boss.dialogue, onPhaseChange]);

  // Cycle through dialogue
  useEffect(() => {
    const interval = setInterval(() => {
      const phaseDialogues = boss.dialogue[boss.phase] || ['...'];
      const nextIndex = (dialogueIndex + 1) % phaseDialogues.length;
      setDialogueIndex(nextIndex);
      setCurrentDialogue(phaseDialogues[nextIndex]);
    }, 5000);

    return () => clearInterval(interval);
  }, [boss.phase, boss.dialogue, dialogueIndex]);

  // Check for boss defeat
  useEffect(() => {
    if (boss.currentHealth <= 0 && boss.phase !== 'defeated') {
      setParticles({ type: 'fireworks', trigger: true });
      onBossDefeated();
    }
  }, [boss.currentHealth, boss.phase, onBossDefeated]);

  // Get phase color
  const getPhaseColor = () => {
    switch (boss.phase) {
      case 'phase1': return boss.color;
      case 'phase2': return '#f97316'; // Orange
      case 'phase3': return '#dc2626'; // Red
      case 'enraged': return '#7f1d1d'; // Dark red
      default: return boss.color;
    }
  };

  const phaseColor = getPhaseColor();

  // Health bar segments
  const healthSegments = [
    { threshold: 100, color: phaseColor },
    { threshold: 70, color: '#f97316' },
    { threshold: 40, color: '#dc2626' },
    { threshold: 15, color: '#7f1d1d' }
  ];

  const currentSegment = healthSegments.find(s => healthPercent <= s.threshold) || healthSegments[0];

  return (
    <div className="relative">
      {/* Particle Effects */}
      {particles && (
        <ParticleSystem
          type={particles.type as any}
          trigger={particles.trigger}
          origin={{ x: 0.5, y: 0.3 }}
          intensity="high"
        />
      )}

      {/* Phase Transition Overlay */}
      <AnimatePresence>
        {phaseTransition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-center"
            >
              <motion.div
                animate={{ 
                  textShadow: [
                    '0 0 20px ' + phaseColor,
                    '0 0 60px ' + phaseColor,
                    '0 0 20px ' + phaseColor
                  ]
                }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-6xl font-black mb-4"
                style={{ color: phaseColor }}
              >
                {boss.phase === 'enraged' ? 'ENRAGED!' : `PHASE ${boss.phase.replace('phase', '')}`}
              </motion.div>
              <div className="text-2xl text-white">{boss.name} is getting serious!</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Boss Card */}
      <motion.div
        animate={phaseTransition ? { 
          scale: [1, 1.05, 1],
          boxShadow: [
            `0 0 20px ${phaseColor}40`,
            `0 0 60px ${phaseColor}80`,
            `0 0 20px ${phaseColor}40`
          ]
        } : {}}
        transition={{ duration: 0.5 }}
        className="relative bg-zinc-900 rounded-2xl border-2 p-6 overflow-hidden"
        style={{ borderColor: phaseColor }}
      >
        {/* Background glow */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${phaseColor}, transparent 70%)`
          }}
        />

        {/* Boss Header */}
        <div className="relative z-10 flex items-center gap-4 mb-6">
          {/* Boss Icon */}
          <motion.div
            animate={boss.phase === 'enraged' ? {
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl"
          >
            {boss.icon}
          </motion.div>

          {/* Boss Info */}
          <div className="flex-1">
            <motion.h2 
              className="text-3xl font-black uppercase tracking-wider"
              style={{ color: phaseColor }}
            >
              {boss.name}
            </motion.h2>
            <p className="text-zinc-400 text-sm">{boss.title}</p>
            
            {/* Phase Indicator */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-zinc-500 uppercase">Phase:</span>
              <span 
                className="text-xs font-bold uppercase px-2 py-0.5 rounded"
                style={{ backgroundColor: `${phaseColor}30`, color: phaseColor }}
              >
                {boss.phase === 'enraged' ? '🔥 ENRAGED' : boss.phase.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Health Display */}
          <div className="text-right">
            <div className="text-xs text-zinc-500 uppercase mb-1">Health</div>
            <NumberCounter
              value={boss.currentHealth}
              format="compact"
              size="lg"
              className="text-white"
            />
            <span className="text-zinc-500"> / {boss.maxHealth.toLocaleString()}</span>
          </div>
        </div>

        {/* Health Bar */}
        <div className="relative z-10 mb-6">
          {/* Segments */}
          <div className="flex gap-1 mb-2">
            {[100, 70, 40, 15].map((threshold, i) => (
              <div
                key={threshold}
                className="flex-1 h-1 rounded-full"
                style={{
                  backgroundColor: healthPercent <= threshold ? currentSegment.color : '#374151'
                }}
              />
            ))}
          </div>

          {/* Main Bar */}
          <div className="h-6 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${healthPercent}%` }}
              transition={{ type: 'spring', stiffness: 100 }}
              className="h-full relative"
              style={{ 
                background: `linear-gradient(90deg, ${phaseColor}, ${phaseColor}dd)`
              }}
            >
              {/* Shimmer effect */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
                }}
              />
            </motion.div>
          </div>

          {/* Health Percentage */}
          <div className="flex justify-between text-xs text-zinc-500 mt-1">
            <span>{healthPercent.toFixed(1)}%</span>
            <span>Break at: 70% | 40% | 15%</span>
          </div>
        </div>

        {/* Traits */}
        <div className="relative z-10 flex flex-wrap gap-2 mb-4">
          {boss.traits.map((trait, index) => (
            <motion.div
              key={trait}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-1 px-3 py-1 bg-zinc-800 rounded-full text-xs"
              style={{ border: `1px solid ${phaseColor}40` }}
            >
              <span style={{ color: phaseColor }}>⚠</span>
              <span className="text-zinc-300">{trait}</span>
            </motion.div>
          ))}
        </div>

        {/* Dialogue */}
        <AnimatePresence mode="wait">
          {currentDialogue && (
            <motion.div
              key={currentDialogue}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="relative z-10 p-4 bg-zinc-800/50 rounded-lg border-l-4"
              style={{ borderColor: phaseColor }}
            >
              <p className="text-zinc-300 italic">"{currentDialogue}"</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Abilities */}
        <div className="relative z-10 mt-4 grid grid-cols-3 gap-3">
          {boss.abilities.map((ability) => {
            const isOnCooldown = Date.now() - ability.lastUsed < ability.cooldown;
            const cooldownRemaining = Math.max(0, ability.cooldown - (Date.now() - ability.lastUsed));
            const cooldownPercent = (cooldownRemaining / ability.cooldown) * 100;

            return (
              <motion.button
                key={ability.id}
                whileHover={!isOnCooldown ? { scale: 1.05 } : {}}
                whileTap={!isOnCooldown ? { scale: 0.95 } : {}}
                disabled={isOnCooldown}
                onClick={() => {
                  if (!isOnCooldown) {
                    onAbilityTrigger(ability);
                    setShowAbility(ability);
                    setTimeout(() => setShowAbility(null), 2000);
                  }
                }}
                className={`
                  relative p-3 rounded-lg border text-left transition-all
                  ${isOnCooldown 
                    ? 'bg-zinc-800 border-zinc-700 opacity-50 cursor-not-allowed' 
                    : 'bg-zinc-800 border-zinc-600 hover:border-zinc-500 cursor-pointer'}
                `}
              >
                {/* Cooldown Overlay */}
                {isOnCooldown && (
                  <div 
                    className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center"
                  >
                    <span className="text-zinc-400 font-bold">
                      {(cooldownRemaining / 1000).toFixed(1)}s
                    </span>
                  </div>
                )}

                <div className="text-2xl mb-1">{ability.icon}</div>
                <div className="font-bold text-sm text-white">{ability.name}</div>
                <div className="text-xs text-zinc-400 line-clamp-1">{ability.description}</div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Ability Trigger Popup */}
      <AnimatePresence>
        {showAbility && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div 
              className="px-8 py-4 rounded-2xl text-center"
              style={{
                background: `linear-gradient(135deg, ${phaseColor}40, ${phaseColor}20)`,
                border: `2px solid ${phaseColor}`,
                boxShadow: `0 0 40px ${phaseColor}50`
              }}
            >
              <div className="text-4xl mb-2">{showAbility.icon}</div>
              <div className="text-xl font-bold text-white">{showAbility.name}</div>
              <div className="text-sm text-zinc-300">{showAbility.description}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BossBattlePhases;
