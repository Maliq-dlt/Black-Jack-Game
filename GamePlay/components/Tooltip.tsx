import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right' | 'auto';
export type TooltipSize = 'sm' | 'md' | 'lg';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: TooltipPosition;
  size?: TooltipSize;
  delay?: number;
  maxWidth?: number;
  disabled?: boolean;
  className?: string;
  showArrow?: boolean;
}

/**
 * Tooltip - Rich tooltip component dengan positioning yang smart
 * 
 * Features:
 * - Auto positioning (adjusts if space is limited)
 * - Rich content support (HTML, components)
 * - Smooth animations
 * - Arrow indicator
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  size = 'md',
  delay = 300,
  maxWidth = 250,
  disabled = false,
  className = '',
  showArrow = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState<TooltipPosition>(position);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Size classes
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-3'
  };

  // Calculate position
  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let newPosition = position;
    let x = 0;
    let y = 0;

    // Auto positioning logic
    if (position === 'auto') {
      const spaceTop = triggerRect.top;
      const spaceBottom = viewportHeight - triggerRect.bottom;
      const spaceLeft = triggerRect.left;
      const spaceRight = viewportWidth - triggerRect.right;

      const maxSpace = Math.max(spaceTop, spaceBottom, spaceLeft, spaceRight);
      
      if (maxSpace === spaceTop) newPosition = 'top';
      else if (maxSpace === spaceBottom) newPosition = 'bottom';
      else if (maxSpace === spaceLeft) newPosition = 'left';
      else newPosition = 'right';
    }

    // Calculate coordinates based on position
    switch (newPosition) {
      case 'top':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.top - tooltipRect.height - 8;
        break;
      case 'bottom':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.bottom + 8;
        break;
      case 'left':
        x = triggerRect.left - tooltipRect.width - 8;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
      case 'right':
        x = triggerRect.right + 8;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
    }

    // Boundary checks
    x = Math.max(8, Math.min(x, viewportWidth - tooltipRect.width - 8));
    y = Math.max(8, Math.min(y, viewportHeight - tooltipRect.height - 8));

    setActualPosition(newPosition);
    setCoords({ x, y });
  };

  // Show tooltip
  const show = () => {
    if (disabled) return;
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      // Calculate position after tooltip is rendered
      requestAnimationFrame(calculatePosition);
    }, delay);
  };

  // Hide tooltip
  const hide = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  // Update position on scroll/resize
  useEffect(() => {
    if (isVisible) {
      window.addEventListener('scroll', calculatePosition, true);
      window.addEventListener('resize', calculatePosition);
      
      return () => {
        window.removeEventListener('scroll', calculatePosition, true);
        window.removeEventListener('resize', calculatePosition);
      };
    }
  }, [isVisible]);

  // Arrow rotation based on position
  const arrowRotation = {
    top: 'rotate-180',
    bottom: '',
    left: 'rotate-90',
    right: '-rotate-90'
  };

  // Arrow position
  const arrowPosition = {
    top: 'top-full left-1/2 -translate-x-1/2 -mt-1',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-1',
    left: 'left-full top-1/2 -translate-y-1/2 -ml-1',
    right: 'right-full top-1/2 -translate-y-1/2 -mr-1'
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        className={`inline-block ${className}`}
      >
        {children}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.9, y: actualPosition === 'top' ? 5 : actualPosition === 'bottom' ? -5 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed z-[9999] pointer-events-none"
            style={{ 
              left: coords.x, 
              top: coords.y,
              maxWidth: maxWidth 
            }}
          >
            <div 
              className={`
                relative bg-zinc-900 text-white rounded-lg shadow-2xl border border-zinc-700
                ${sizeClasses[size]}
              `}
            >
              {content}
              
              {/* Arrow */}
              {showArrow && (
                <div 
                  className={`absolute w-3 h-3 bg-zinc-900 border-zinc-700 ${arrowPosition[actualPosition]}`}
                  style={{
                    clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                    transform: actualPosition === 'top' ? 'rotate(180deg)' :
                               actualPosition === 'bottom' ? 'rotate(0deg)' :
                               actualPosition === 'left' ? 'rotate(90deg)' :
                               'rotate(-90deg)'
                  }}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/**
 * CardTooltip - Tooltip khusus untuk kartu dengan preview
 */
interface CardTooltipProps {
  card: {
    name: string;
    description: string;
    effect?: string;
    rarity?: string;
    icon?: string;
  };
  children: React.ReactNode;
}

export const CardTooltip: React.FC<CardTooltipProps> = ({
  card,
  children
}) => {
  const rarityColors: Record<string, string> = {
    common: '#94a3b8',
    rare: '#3b82f6',
    epic: '#a855f7',
    legendary: '#eab308',
    cursed: '#dc2626'
  };

  const color = card.rarity ? rarityColors[card.rarity] : '#94a3b8';

  return (
    <Tooltip
      content={
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {card.icon && <span className="text-xl">{card.icon}</span>}
            <span 
              className="font-bold"
              style={{ color }}
            >
              {card.name}
            </span>
            {card.rarity && (
              <span 
                className="text-xs uppercase px-1.5 py-0.5 rounded"
                style={{ backgroundColor: `${color}30`, color }}
              >
                {card.rarity}
              </span>
            )}
          </div>
          <p className="text-zinc-300 text-sm">{card.description}</p>
          {card.effect && (
            <div className="text-xs text-green-400 border-t border-zinc-700 pt-2 mt-2">
              Effect: {card.effect}
            </div>
          )}
        </div>
      }
      position="auto"
      size="md"
      maxWidth={280}
    >
      {children}
    </Tooltip>
  );
};

/**
 * JokerTooltip - Tooltip khusus untuk joker cards
 */
interface JokerTooltipProps {
  joker: {
    name: string;
    description: string;
    rarity: string;
    multiplier?: number;
    icon: string;
  };
  children: React.ReactNode;
}

export const JokerTooltip: React.FC<JokerTooltipProps> = ({
  joker,
  children
}) => {
  const rarityColors: Record<string, string> = {
    common: '#94a3b8',
    uncommon: '#22c55e',
    rare: '#3b82f6',
    epic: '#a855f7',
    legendary: '#eab308',
    cursed: '#dc2626'
  };

  const color = rarityColors[joker.rarity] || '#94a3b8';

  return (
    <Tooltip
      content={
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{joker.icon}</span>
            <div>
              <div 
                className="font-bold"
                style={{ color }}
              >
                {joker.name}
              </div>
              <div 
                className="text-xs uppercase"
                style={{ color: `${color}99` }}
              >
                {joker.rarity} Joker
              </div>
            </div>
          </div>
          <p className="text-zinc-300 text-sm">{joker.description}</p>
          {joker.multiplier && (
            <div className="flex items-center gap-2 text-yellow-400">
              <span>⚡</span>
              <span className="font-bold">×{joker.multiplier} Multiplier</span>
            </div>
          )}
        </div>
      }
      position="auto"
      size="lg"
      maxWidth={300}
    >
      {children}
    </Tooltip>
  );
};

/**
 * StatTooltip - Tooltip untuk statistik dengan detail
 */
interface StatTooltipProps {
  label: string;
  value: string | number;
  description: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  children: React.ReactNode;
}

export const StatTooltip: React.FC<StatTooltipProps> = ({
  label,
  value,
  description,
  trend,
  trendValue,
  children
}) => {
  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-gray-400'
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→'
  };

  return (
    <Tooltip
      content={
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 text-xs uppercase">{label}</span>
            {trend && (
              <span className={`text-xs ${trendColors[trend]}`}>
                {trendIcons[trend]} {trendValue}
              </span>
            )}
          </div>
          <div className="text-2xl font-bold text-white">{value}</div>
          <p className="text-zinc-400 text-xs">{description}</p>
        </div>
      }
      position="top"
      size="md"
    >
      {children}
    </Tooltip>
  );
};

export default Tooltip;
