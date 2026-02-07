import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HolographicCard, GlitchEffect } from './HolographicEffects';

/**
 * ============================================
 * PHASE 2: Enhanced Shop UI
 * ============================================
 * 
 * Medium Effort Upgrade
 * - 3D item showcase
 * - Animated price tags
 * - Reroll animation
 * - Sold out effects
 */

interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'joker' | 'consumable' | 'voucher' | 'booster';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'cursed';
  icon: string;
  stock?: number;
  isOnSale?: boolean;
  discount?: number;
}

interface EnhancedShopUIProps {
  items: ShopItem[];
  bankroll: number;
  rerollCost: number;
  onBuyItem: (item: ShopItem) => void;
  onReroll: () => void;
}

// Rarity configurations
const RARITY_CONFIG = {
  common: { color: '#94a3b8', glow: 'shadow-slate-500/30' },
  uncommon: { color: '#22c55e', glow: 'shadow-green-500/40' },
  rare: { color: '#3b82f6', glow: 'shadow-blue-500/40' },
  epic: { color: '#a855f7', glow: 'shadow-purple-500/40' },
  legendary: { color: '#eab308', glow: 'shadow-yellow-500/50' },
  cursed: { color: '#dc2626', glow: 'shadow-red-500/50' }
};

/**
 * ShopItemCard - Individual shop item dengan 3D showcase
 */
const ShopItemCard: React.FC<{
  item: ShopItem;
  canAfford: boolean;
  onBuy: () => void;
}> = ({ item, canAfford, onBuy }) => {
  const [isHovered, setIsHovered] = useState(false);
  const config = RARITY_CONFIG[item.rarity];
  const finalCost = item.discount ? Math.floor(item.cost * (1 - item.discount)) : item.cost;
  const isOutOfStock = item.stock !== undefined && item.stock <= 0;

  const CardWrapper = item.rarity === 'legendary' || item.rarity === 'epic' 
    ? HolographicCard 
    : motion.div;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <CardWrapper
        rarity={item.rarity as any}
        onClick={canAfford && !isOutOfStock ? onBuy : undefined}
        className={`
          relative p-4 rounded-xl cursor-pointer transition-all
          ${!canAfford || isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <motion.div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={canAfford && !isOutOfStock ? { y: -5 } : {}}
          className={`
            relative bg-zinc-900 rounded-xl overflow-hidden
            border-2 transition-all duration-300
            ${isHovered && canAfford && !isOutOfStock ? `shadow-lg ${config.glow}` : 'border-zinc-700'}
          `}
          style={{ borderColor: isHovered ? config.color : undefined }}
        >
          {/* Sale badge */}
          {item.isOnSale && (
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: -10 }}
              className="absolute -top-2 -right-2 z-20"
            >
              <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                -{Math.round((item.discount || 0) * 100)}%
              </div>
            </motion.div>
          )}

          {/* Out of stamp */}
          {isOutOfStock && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70">
              <div className="border-4 border-red-500 text-red-500 font-black text-xl px-4 py-2 rotate-[-15deg]">
                SOLD OUT
              </div>
            </div>
          )}

          {/* Item icon dengan 3D effect */}
          <div className="relative h-24 flex items-center justify-center mb-3">
            <motion.div
              animate={isHovered ? {
                rotateY: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              } : {}}
              transition={{ duration: 0.5 }}
              className="text-5xl"
              style={{ filter: `drop-shadow(0 0 10px ${config.color})` }}
            >
              {item.rarity === 'cursed' ? (
                <GlitchEffect intensity="low" trigger={isHovered}>
                  {item.icon}
                </GlitchEffect>
              ) : (
                item.icon
              )}
            </motion.div>

            {/* Rarity glow */}
            <motion.div
              className="absolute inset-0 rounded-full blur-2xl"
              animate={{ opacity: isHovered ? 0.5 : 0.2 }}
              style={{ backgroundColor: config.color }}
            />
          </div>

          {/* Item info */}
          <div className="text-center">
            <h3 
              className="font-bold text-sm mb-1"
              style={{ color: config.color }}
            >
              {item.name}
            </h3>
            <p className="text-xs text-zinc-400 line-clamp-2 mb-3">
              {item.description}
            </p>

            {/* Price */}
            <div className={`
              inline-flex items-center gap-2 px-3 py-1.5 rounded-lg
              ${canAfford ? 'bg-zinc-800' : 'bg-red-900/30'}
            `}>
              {item.isOnSale && (
                <span className="text-zinc-500 line-through text-xs">
                  ${item.cost}
                </span>
              )}
              <span className={`font-bold ${canAfford ? 'text-yellow-400' : 'text-red-400'}`}>
                ${finalCost}
              </span>
            </div>

            {/* Stock indicator */}
            {item.stock !== undefined && item.stock > 0 && item.stock < 5 && (
              <div className="mt-2 text-xs text-orange-400">
                Only {item.stock} left!
              </div>
            )}
          </div>

          {/* Hover shine effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ x: '-100%' }}
            animate={{ x: isHovered ? '100%' : '-100%' }}
            transition={{ duration: 0.5 }}
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)'
            }}
          />
        </motion.div>
      </CardWrapper>
    </motion.div>
  );
};

/**
 * RerollButton - Animated reroll button
 */
const RerollButton: React.FC<{
  cost: number;
  canAfford: boolean;
  onReroll: () => void;
}> = ({ cost, canAfford, onReroll }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (!canAfford || isAnimating) return;
    
    setIsAnimating(true);
    onReroll();
    
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={!canAfford || isAnimating}
      whileHover={canAfford && !isAnimating ? { scale: 1.05 } : {}}
      whileTap={canAfford && !isAnimating ? { scale: 0.95 } : {}}
      className={`
        relative px-6 py-3 rounded-xl font-bold flex items-center gap-3
        transition-all duration-300 overflow-hidden
        ${canAfford 
          ? 'bg-blue-600 hover:bg-blue-500 text-white' 
          : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
        }
      `}
    >
      {/* Dice animation */}
      <motion.span
        animate={isAnimating ? {
          rotate: [0, 360, 720],
          scale: [1, 1.2, 1]
        } : {}}
        transition={{ duration: 0.8 }}
        className="text-2xl"
      >
        🎲
      </motion.span>

      <div className="text-left">
        <div className="text-sm">Reroll Shop</div>
        <div className={`text-xs ${canAfford ? 'text-blue-200' : 'text-zinc-400'}`}>
          ${cost}
        </div>
      </div>

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={isAnimating ? {
          x: ['-100%', '100%']
        } : {}}
        transition={{ duration: 0.5 }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
        }}
      />
    </motion.button>
  );
};

/**
 * InterestDisplay - Interest bonus display
 */
const InterestDisplay: React.FC<{
  bankroll: number;
  interestRate: number;
  maxInterest: number;
}> = ({ bankroll, interestRate, maxInterest }) => {
  const interestAmount = Math.min(Math.floor(bankroll * interestRate), maxInterest);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3 px-4 py-2 bg-green-900/30 border border-green-600/50 rounded-xl"
    >
      <motion.span
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-2xl"
      >
        💰
      </motion.span>
      <div>
        <div className="text-xs text-green-400/70 uppercase">Interest Bonus</div>
        <div className="text-green-400 font-bold">+${interestAmount}</div>
      </div>
    </motion.div>
  );
};

/**
 * Main EnhancedShop Component
 */
export const EnhancedShopUI: React.FC<EnhancedShopUIProps> = ({
  items,
  bankroll,
  rerollCost,
  onBuyItem,
  onReroll
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All', icon: '🛒' },
    { id: 'joker', label: 'Jokers', icon: '🤡' },
    { id: 'consumable', label: 'Items', icon: '🧪' },
    { id: 'voucher', label: 'Vouchers', icon: '🎫' }
  ];

  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter(item => item.type === selectedCategory);

  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-700 overflow-hidden max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 p-6 border-b border-zinc-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-black text-white tracking-wider">
              🏪 BLACK MARKET
            </h2>
            <p className="text-zinc-400 text-sm">Spend wisely, gambler...</p>
          </div>

          <div className="flex items-center gap-4">
            <InterestDisplay 
              bankroll={bankroll} 
              interestRate={0.1} 
              maxInterest={50} 
            />
            <div className="text-right">
              <div className="text-xs text-zinc-400 uppercase">Your Gold</div>
              <div className="text-2xl font-bold text-yellow-400">
                ${bankroll.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2">
          {categories.map(cat => (
            <motion.button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all
                ${selectedCategory === cat.id
                  ? 'bg-yellow-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }
              `}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Items grid */}
      <div className="p-6">
        <AnimatePresence mode="popLayout">
          <motion.div 
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {filteredItems.map((item) => (
              <ShopItemCard
                key={item.id}
                item={item}
                canAfford={bankroll >= (item.discount ? item.cost * (1 - item.discount) : item.cost)}
                onBuy={() => onBuyItem(item)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="bg-zinc-800 p-4 border-t border-zinc-700">
        <div className="flex items-center justify-between">
          <RerollButton
            cost={rerollCost}
            canAfford={bankroll >= rerollCost}
            onReroll={onReroll}
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white font-bold rounded-xl transition-colors"
          >
            Done Shopping
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedShopUI;
