import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from './Tooltip';
import { NumberCounter } from './NumberCounter';

// Types
export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'joker' | 'consumable' | 'voucher' | 'booster' | 'service';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'cursed';
  icon: string;
  stock?: number;
  maxStock?: number;
  discount?: number;
  isOnSale?: boolean;
  isLocked?: boolean;
  unlockRequirement?: string;
}

export interface ShopState {
  items: ShopItem[];
  rerollCost: number;
  rerollCount: number;
  interestRate: number;
  maxInterest: number;
  saleItemId?: string;
  lastRestock: number;
}

interface EnhancedShopProps {
  isOpen: boolean;
  onClose: () => void;
  bankroll: number;
  shopState: ShopState;
  onBuyItem: (item: ShopItem) => void;
  onReroll: () => void;
  onUpdateShopState: (state: Partial<ShopState>) => void;
}

// Rarity colors
const RARITY_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  common: { 
    bg: 'bg-gray-700', 
    border: 'border-gray-600', 
    text: 'text-gray-300',
    glow: 'shadow-gray-500/20'
  },
  uncommon: { 
    bg: 'bg-green-900/50', 
    border: 'border-green-600', 
    text: 'text-green-400',
    glow: 'shadow-green-500/30'
  },
  rare: { 
    bg: 'bg-blue-900/50', 
    border: 'border-blue-500', 
    text: 'text-blue-400',
    glow: 'shadow-blue-500/30'
  },
  epic: { 
    bg: 'bg-purple-900/50', 
    border: 'border-purple-500', 
    text: 'text-purple-400',
    glow: 'shadow-purple-500/30'
  },
  legendary: { 
    bg: 'bg-yellow-900/50', 
    border: 'border-yellow-500', 
    text: 'text-yellow-400',
    glow: 'shadow-yellow-500/40'
  },
  cursed: { 
    bg: 'bg-red-900/50', 
    border: 'border-red-600', 
    text: 'text-red-400',
    glow: 'shadow-red-500/40'
  }
};

/**
 * EnhancedShop - Shop dengan sistem reroll dan interest
 * 
 * Features:
 * - Reroll shop items
 * - Interest system (save money for bonus)
 * - Flash sales
 * - Stock management
 * - Item rarity visualization
 */
export const EnhancedShop: React.FC<EnhancedShopProps> = ({
  isOpen,
  onClose,
  bankroll,
  shopState,
  onBuyItem,
  onReroll,
  onUpdateShopState
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { items, rerollCost, interestRate, maxInterest, saleItemId } = shopState;

  // Calculate interest
  const interestAmount = Math.min(
    Math.floor(bankroll * interestRate),
    maxInterest
  );

  // Filter items by category
  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.type === selectedCategory);

  // Categories
  const categories = [
    { id: 'all', label: 'All', icon: '🛒' },
    { id: 'joker', label: 'Jokers', icon: '🤡' },
    { id: 'consumable', label: 'Items', icon: '🧪' },
    { id: 'voucher', label: 'Vouchers', icon: '🎫' },
    { id: 'service', label: 'Services', icon: '🔧' }
  ];

  // Handle buy with animation
  const handleBuy = (item: ShopItem) => {
    if (bankroll >= item.cost && !item.isLocked) {
      onBuyItem(item);
    }
  };

  // Handle reroll
  const handleReroll = () => {
    if (bankroll >= rerollCost) {
      onReroll();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        />

        {/* Shop Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-5xl bg-zinc-900 rounded-2xl border border-zinc-700 shadow-2xl overflow-hidden max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 p-6 border-b border-zinc-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-white tracking-wider">
                  🏪 BLACK MARKET
                </h2>
                <p className="text-zinc-400 text-sm mt-1">
                  Spend wisely, gambler...
                </p>
              </div>

              {/* Bankroll Display */}
              <div className="flex items-center gap-6">
                {/* Interest Info */}
                {interestAmount > 0 && (
                  <Tooltip
                    content={
                      <div className="space-y-1">
                        <p className="text-green-400 font-bold">Interest Bonus</p>
                        <p className="text-sm text-zinc-300">
                          Save money to earn bonus at end of round
                        </p>
                        <p className="text-xs text-zinc-400">
                          Rate: {(interestRate * 100).toFixed(0)}% • Max: ${maxInterest}
                        </p>
                      </div>
                    }
                    position="bottom"
                  >
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-900/30 border border-green-600/50 rounded-lg">
                      <span className="text-green-400">💰</span>
                      <div>
                        <div className="text-xs text-green-400/70 uppercase">Interest</div>
                        <div className="text-green-400 font-bold">+${interestAmount}</div>
                      </div>
                    </div>
                  </Tooltip>
                )}

                {/* Bankroll */}
                <div className="text-right">
                  <div className="text-xs text-zinc-400 uppercase">Your Gold</div>
                  <NumberCounter
                    value={bankroll}
                    format="currency"
                    size="xl"
                    className="text-yellow-400"
                  />
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 mt-6">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
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
                </button>
              ))}
            </div>
          </div>

          {/* Shop Items Grid */}
          <div className="p-6 overflow-y-auto max-h-[50vh]">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredItems.map((item, index) => {
                const colors = RARITY_COLORS[item.rarity];
                const isAffordable = bankroll >= item.cost;
                const isSaleItem = item.id === saleItemId;
                const finalCost = isSaleItem ? Math.floor(item.cost * 0.7) : item.cost;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Tooltip
                      content={
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{item.icon}</span>
                            <div>
                              <div className={`font-bold ${colors.text}`}>{item.name}</div>
                              <div className="text-xs uppercase text-zinc-400">{item.rarity}</div>
                            </div>
                          </div>
                          <p className="text-sm text-zinc-300">{item.description}</p>
                          {item.stock !== undefined && (
                            <p className="text-xs text-zinc-400">Stock: {item.stock}/{item.maxStock}</p>
                          )}
                          {item.unlockRequirement && (
                            <p className="text-xs text-orange-400">🔒 Requires: {item.unlockRequirement}</p>
                          )}
                        </div>
                      }
                      position="auto"
                      size="md"
                    >
                      <motion.button
                        whileHover={!item.isLocked && isAffordable ? { scale: 1.02, y: -4 } : {}}
                        whileTap={!item.isLocked && isAffordable ? { scale: 0.98 } : {}}
                        onClick={() => handleBuy(item)}
                        disabled={!isAffordable || item.isLocked}
                        onMouseEnter={() => setHoveredItem(item.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className={`
                          relative w-full p-4 rounded-xl border-2 text-left transition-all
                          ${colors.bg} ${colors.border}
                          ${!isAffordable || item.isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                          ${hoveredItem === item.id && isAffordable && !item.isLocked ? `shadow-lg ${colors.glow}` : ''}
                        `}
                      >
                        {/* Sale Badge */}
                        {isSaleItem && (
                          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                            -30%
                          </div>
                        )}

                        {/* Locked Overlay */}
                        {item.isLocked && (
                          <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                            <span className="text-3xl">🔒</span>
                          </div>
                        )}

                        {/* Stock Indicator */}
                        {item.stock !== undefined && item.stock < (item.maxStock || 999) && (
                          <div className="absolute top-2 right-2 text-xs text-zinc-400">
                            {item.stock} left
                          </div>
                        )}

                        {/* Content */}
                        <div className="text-4xl mb-2">{item.icon}</div>
                        <div className={`font-bold text-sm mb-1 ${colors.text}`}>
                          {item.name}
                        </div>
                        <p className="text-xs text-zinc-400 line-clamp-2 mb-3">
                          {item.description}
                        </p>

                        {/* Cost */}
                        <div className={`
                          flex items-center justify-between px-3 py-2 rounded-lg
                          ${isAffordable ? 'bg-black/30' : 'bg-red-900/30'}
                        `}>
                          <span className={isAffordable ? 'text-yellow-400' : 'text-red-400'}>
                            {isSaleItem && (
                              <span className="text-zinc-500 line-through mr-2">
                                ${item.cost}
                              </span>
                            )}
                            ${finalCost}
                          </span>
                          {!isAffordable && (
                            <span className="text-xs text-red-400">Need ${finalCost - bankroll} more</span>
                          )}
                        </div>

                        {/* Rarity Glow on Hover */}
                        <AnimatePresence>
                          {hoveredItem === item.id && isAffordable && !item.isLocked && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 rounded-xl pointer-events-none"
                              style={{
                                boxShadow: `inset 0 0 30px ${colors.text.replace('text-', '').replace('-400', '-500')}40`
                              }}
                            />
                          )}
                        </AnimatePresence>
                      </motion.button>
                    </Tooltip>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Footer - Reroll & Actions */}
          <div className="bg-zinc-800 p-4 border-t border-zinc-700">
            <div className="flex items-center justify-between">
              {/* Reroll Button */}
              <Tooltip
                content={
                  <div className="space-y-1">
                    <p className="font-bold">Reroll Shop</p>
                    <p className="text-sm text-zinc-300">Get new items for sale</p>
                    <p className="text-xs text-zinc-400">Cost increases with each reroll</p>
                  </div>
                }
                position="top"
              >
                <motion.button
                  whileHover={bankroll >= rerollCost ? { scale: 1.05 } : {}}
                  whileTap={bankroll >= rerollCost ? { scale: 0.95 } : {}}
                  onClick={handleReroll}
                  disabled={bankroll < rerollCost}
                  className={`
                    flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all
                    ${bankroll >= rerollCost
                      ? 'bg-blue-600 hover:bg-blue-500 text-white'
                      : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                    }
                  `}
                >
                  <span className="text-xl">🎲</span>
                  <div className="text-left">
                    <div>Reroll Shop</div>
                    <div className="text-xs opacity-70">${rerollCost}</div>
                  </div>
                </motion.button>
              </Tooltip>

              {/* Sale Timer (if applicable) */}
              {saleItemId && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-900/30 border border-red-600/50 rounded-lg">
                  <span className="text-red-400 animate-pulse">⚡</span>
                  <span className="text-red-400 text-sm font-bold">Flash Sale Active!</span>
                </div>
              )}

              {/* Done Button */}
              <button
                onClick={onClose}
                className="px-8 py-3 bg-zinc-700 hover:bg-zinc-600 text-white font-bold rounded-xl transition-colors"
              >
                Done Shopping
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

/**
 * ShopItemCard - Individual shop item card (for simpler usage)
 */
interface ShopItemCardProps {
  item: ShopItem;
  onBuy: () => void;
  canAfford: boolean;
}

export const ShopItemCard: React.FC<ShopItemCardProps> = ({
  item,
  onBuy,
  canAfford
}) => {
  const colors = RARITY_COLORS[item.rarity];
  const finalCost = item.discount ? Math.floor(item.cost * (1 - item.discount)) : item.cost;

  return (
    <motion.button
      whileHover={canAfford && !item.isLocked ? { scale: 1.02 } : {}}
      whileTap={canAfford && !item.isLocked ? { scale: 0.98 } : {}}
      onClick={onBuy}
      disabled={!canAfford || item.isLocked}
      className={`
        relative p-4 rounded-xl border-2 text-left transition-all
        ${colors.bg} ${colors.border}
        ${!canAfford || item.isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'}
      `}
    >
      {item.isOnSale && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          SALE
        </div>
      )}

      <div className="text-3xl mb-2">{item.icon}</div>
      <div className={`font-bold ${colors.text}`}>{item.name}</div>
      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{item.description}</p>
      
      <div className="mt-3 flex items-center justify-between">
        <span className={canAfford ? 'text-yellow-400 font-bold' : 'text-red-400 font-bold'}>
          ${finalCost}
        </span>
        {item.stock !== undefined && (
          <span className="text-xs text-zinc-500">{item.stock} left</span>
        )}
      </div>
    </motion.button>
  );
};

export default EnhancedShop;
