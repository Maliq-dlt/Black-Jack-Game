import { SkillNode, SpecializationPath } from './types';

/**
 * Skill Tree Data for 3 Specialization Paths
 * Each path has 5 tiers of skills
 */

export const SKILL_NODES: SkillNode[] = [
  // ================================================
  // DEALER KILLER PATH - Boss damage & rewards
  // ================================================
  {
    id: 'dk_t1_1', name: 'Boss Hunter', path: SpecializationPath.DealerKiller, tier: 1, cost: 1,
    description: '+10% Gold from bosses', isUnlocked: false, icon: '🎯',
    effect: { type: 'BONUS', value: 0.1, target: 'bossReward' }
  },
  {
    id: 'dk_t1_2', name: 'Intimidation', path: SpecializationPath.DealerKiller, tier: 1, cost: 1,
    description: 'Boss traits trigger 10% less often', isUnlocked: false, icon: '😤',
    effect: { type: 'PASSIVE', value: 0.1, target: 'traitReduction' }
  },
  {
    id: 'dk_t2_1', name: 'Ruthless', path: SpecializationPath.DealerKiller, tier: 2, cost: 2,
    description: '+25% Gold from bosses', isUnlocked: false, icon: '💀', prerequisite: 'dk_t1_1',
    effect: { type: 'BONUS', value: 0.25, target: 'bossReward' }
  },
  {
    id: 'dk_t2_2', name: 'Mind Games', path: SpecializationPath.DealerKiller, tier: 2, cost: 2,
    description: 'See one boss card at round start', isUnlocked: false, icon: '🧠', prerequisite: 'dk_t1_2',
    effect: { type: 'ABILITY', value: 1, target: 'peekBossCard' }
  },
  {
    id: 'dk_t3_1', name: 'Executioner', path: SpecializationPath.DealerKiller, tier: 3, cost: 3,
    description: 'Critical hit on 21 vs boss = 3x payout', isUnlocked: false, icon: '⚔️', prerequisite: 'dk_t2_1',
    effect: { type: 'BONUS', value: 3, target: 'bossCritMultiplier' }
  },
  {
    id: 'dk_t4_1', name: 'Nemesis', path: SpecializationPath.DealerKiller, tier: 4, cost: 4,
    description: 'Nullify one boss trait per fight', isUnlocked: false, icon: '🚫', prerequisite: 'dk_t3_1',
    effect: { type: 'ABILITY', value: 1, target: 'nullifyTrait' }
  },
  {
    id: 'dk_t5_1', name: 'House Breaker', path: SpecializationPath.DealerKiller, tier: 5, cost: 5,
    description: 'Final boss rewards doubled', isUnlocked: false, icon: '🏛️', prerequisite: 'dk_t4_1',
    effect: { type: 'BONUS', value: 2, target: 'finalBossReward' }
  },

  // ================================================
  // HIGH ROLLER PATH - Betting & money
  // ================================================
  {
    id: 'hr_t1_1', name: 'Silver Tongue', path: SpecializationPath.HighRoller, tier: 1, cost: 1,
    description: '+5% on all wins', isUnlocked: false, icon: '💰',
    effect: { type: 'BONUS', value: 0.05, target: 'winBonus' }
  },
  {
    id: 'hr_t1_2', name: 'Lucky Start', path: SpecializationPath.HighRoller, tier: 1, cost: 1,
    description: '+$100 starting gold', isUnlocked: false, icon: '🍀',
    effect: { type: 'BONUS', value: 100, target: 'startingGold' }
  },
  {
    id: 'hr_t2_1', name: 'Big Spender', path: SpecializationPath.HighRoller, tier: 2, cost: 2,
    description: 'Bets over $100 = +15% payout', isUnlocked: false, icon: '💎', prerequisite: 'hr_t1_1',
    effect: { type: 'BONUS', value: 0.15, target: 'highBetBonus' }
  },
  {
    id: 'hr_t2_2', name: 'Fortune Favors', path: SpecializationPath.HighRoller, tier: 2, cost: 2,
    description: '+10% wild card chance', isUnlocked: false, icon: '✨', prerequisite: 'hr_t1_2',
    effect: { type: 'BONUS', value: 0.1, target: 'wildChance' }
  },
  {
    id: 'hr_t3_1', name: 'Double or Nothing', path: SpecializationPath.HighRoller, tier: 3, cost: 3,
    description: '15% chance for 2x payout on win', isUnlocked: false, icon: '🎰', prerequisite: 'hr_t2_1',
    effect: { type: 'PASSIVE', value: 0.15, target: 'critWinChance' }
  },
  {
    id: 'hr_t4_1', name: 'Golden Touch', path: SpecializationPath.HighRoller, tier: 4, cost: 4,
    description: '+$50 on every win', isUnlocked: false, icon: '👆', prerequisite: 'hr_t3_1',
    effect: { type: 'BONUS', value: 50, target: 'flatWinBonus' }
  },
  {
    id: 'hr_t5_1', name: 'Midas Blessing', path: SpecializationPath.HighRoller, tier: 5, cost: 5,
    description: 'All gold gains +25%', isUnlocked: false, icon: '👑', prerequisite: 'hr_t4_1',
    effect: { type: 'BONUS', value: 0.25, target: 'allGoldBonus' }
  },

  // ================================================
  // SURVIVOR PATH - Defense & safety
  // ================================================
  {
    id: 'sv_t1_1', name: 'Thick Skin', path: SpecializationPath.Survivor, tier: 1, cost: 1,
    description: 'Reduce losses by 10%', isUnlocked: false, icon: '🛡️',
    effect: { type: 'BONUS', value: 0.1, target: 'lossReduction' }
  },
  {
    id: 'sv_t1_2', name: 'Second Wind', path: SpecializationPath.Survivor, tier: 1, cost: 1,
    description: 'Start with 1 Bust Shield', isUnlocked: false, icon: '💨',
    effect: { type: 'BONUS', value: 1, target: 'startingShields' }
  },
  {
    id: 'sv_t2_1', name: 'Iron Will', path: SpecializationPath.Survivor, tier: 2, cost: 2,
    description: '10% chance bust = push instead', isUnlocked: false, icon: '🔩', prerequisite: 'sv_t1_1',
    effect: { type: 'PASSIVE', value: 0.1, target: 'bustSaveChance' }
  },
  {
    id: 'sv_t2_2', name: 'Emergency Funds', path: SpecializationPath.Survivor, tier: 2, cost: 2,
    description: 'If bankroll hits $0, get $100', isUnlocked: false, icon: '🏦', prerequisite: 'sv_t1_2',
    effect: { type: 'ABILITY', value: 100, target: 'bankruptcySave' }
  },
  {
    id: 'sv_t3_1', name: 'Undying', path: SpecializationPath.Survivor, tier: 3, cost: 3,
    description: '20% bust protection chance', isUnlocked: false, icon: '☠️', prerequisite: 'sv_t2_1',
    effect: { type: 'PASSIVE', value: 0.2, target: 'bustSaveChance' }
  },
  {
    id: 'sv_t4_1', name: 'Comeback King', path: SpecializationPath.Survivor, tier: 4, cost: 4,
    description: 'After losing 3 hands, next win = 2x', isUnlocked: false, icon: '🔄', prerequisite: 'sv_t3_1',
    effect: { type: 'PASSIVE', value: 2, target: 'comebackMultiplier' }
  },
  {
    id: 'sv_t5_1', name: 'Phoenix Soul', path: SpecializationPath.Survivor, tier: 5, cost: 5,
    description: 'Revive at 50% bankroll when hitting $0', isUnlocked: false, icon: '🔥', prerequisite: 'sv_t4_1',
    effect: { type: 'ABILITY', value: 0.5, target: 'phoenixRevive' }
  },
];

/**
 * Get skills by specialization path
 */
export function getSkillsByPath(path: SpecializationPath): SkillNode[] {
  return SKILL_NODES.filter(s => s.path === path);
}

/**
 * Get skill by ID
 */
export function getSkillById(id: string): SkillNode | undefined {
  return SKILL_NODES_MAP.get(id);
}

/**
 * Check if a skill can be unlocked
 */
export function canUnlockSkill(skillId: string, unlockedSkills: string[]): boolean {
  const skill = getSkillById(skillId);
  if (!skill) return false;
  if (skill.isUnlocked) return false;
  if (!skill.prerequisite) return true;
  return unlockedSkills.includes(skill.prerequisite);
}

/**
 * Get path display info
 */
export const PATH_INFO: Record<SpecializationPath, { name: string; icon: string; color: string; description: string }> = {
  [SpecializationPath.DealerKiller]: { 
    name: 'Dealer Killer', icon: '⚔️', color: '#dc2626',
    description: 'Dominate bosses with enhanced rewards and trait counters'
  },
  [SpecializationPath.HighRoller]: { 
    name: 'High Roller', icon: '💰', color: '#eab308',
    description: 'Maximize gold gains with betting bonuses and multipliers'
  },
  [SpecializationPath.Survivor]: { 
    name: 'Survivor', icon: '🛡️', color: '#22c55e',
    description: 'Stay alive longer with bust protection and loss reduction'
  },
  [SpecializationPath.None]: { 
    name: 'None', icon: '❓', color: '#6b7280',
    description: 'Choose a path to begin'
  },
};

export const SKILL_NODES_MAP = new Map<string, SkillNode>(
  SKILL_NODES.map(node => [node.id, node])
);
