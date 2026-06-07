import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useTransform, MotionValue, AnimatePresence } from 'framer-motion';

export type NumberFormat = 'currency' | 'percentage' | 'compact' | 'decimal';

interface NumberCounterProps {
  value: number;
  format?: NumberFormat;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  colorChange?: boolean;
  showSign?: boolean;
  decimals?: number;
}

/**
 * NumberCounter - Animated number counter seperti Balatro
 * 
 * Features:
 * - Smooth spring animation
 * - Color change on value change
 * - Multiple formats (currency, percentage, etc.)
 * - Scale animation on change
 */
export const NumberCounter: React.FC<NumberCounterProps> = ({
  value,
  format = 'currency',
  prefix = '$',
  suffix = '',
  duration = 1,
  className = '',
  size = 'md',
  colorChange = true,
  showSign = false,
  decimals = 0
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const currentValueRef = useRef(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValueRef = useRef(value);
  const animationRef = useRef<number | null>(null);

  // Size classes
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-3xl',
    xl: 'text-5xl'
  };

  // Format number
  const formatNumber = (num: number): string => {
    let formatted: string;
    
    switch (format) {
      case 'currency':
        formatted = num.toLocaleString('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        });
        break;
      case 'percentage':
        formatted = num.toFixed(decimals);
        break;
      case 'compact':
        if (num >= 1000000) {
          formatted = (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
          formatted = (num / 1000).toFixed(1) + 'k';
        } else {
          formatted = num.toFixed(decimals);
        }
        break;
      case 'decimal':
      default:
        formatted = num.toFixed(decimals);
    }

    const sign = showSign && num > 0 ? '+' : '';
    return `${sign}${prefix}${formatted}${suffix}`;
  };

  // Animate value change
  useEffect(() => {
    if (value === prevValueRef.current) return;

    const startValue = prevValueRef.current;
    const endValue = value;
    const diff = endValue - startValue;
    const startTime = performance.now();

    setIsAnimating(true);

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);

      // Ease out expo
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentValue = startValue + diff * easeOutExpo;

      currentValueRef.current = currentValue;
      if (spanRef.current) {
        spanRef.current.textContent = formatNumber(currentValue);
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        currentValueRef.current = endValue;
        if (spanRef.current) {
          spanRef.current.textContent = formatNumber(endValue);
        }
        setIsAnimating(false);
        prevValueRef.current = endValue;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  // Determine color based on change
  const getColor = () => {
    if (!colorChange) return 'text-white';
    if (value > prevValueRef.current) return 'text-green-400';
    if (value < prevValueRef.current) return 'text-red-400';
    return 'text-white';
  };

  return (
    <motion.span
      ref={spanRef}
      className={`inline-block font-mono font-bold ${sizeClasses[size]} ${getColor()} ${className}`}
      animate={isAnimating ? {
        scale: [1, 1.1, 1],
        textShadow: value > prevValueRef.current 
          ? ['0 0 0px rgba(74, 222, 128, 0)', '0 0 20px rgba(74, 222, 128, 0.8)', '0 0 0px rgba(74, 222, 128, 0)']
          : value < prevValueRef.current
          ? ['0 0 0px rgba(248, 113, 113, 0)', '0 0 20px rgba(248, 113, 113, 0.8)', '0 0 0px rgba(248, 113, 113, 0)']
          : 'none'
      } : {}}
      transition={{ duration: 0.3 }}
    >
      {formatNumber(currentValueRef.current)}
    </motion.span>
  );
};

/**
 * RollingNumber - Number dengan efek rolling seperti slot machine
 */
interface RollingNumberProps {
  value: number;
  digits?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const RollingNumber: React.FC<RollingNumberProps> = ({
  value,
  digits = 3,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
    xl: 'text-8xl'
  };

  const valueStr = value.toString().padStart(digits, '0');

  return (
    <div className={`flex gap-1 ${className}`}>
      {valueStr.split('').map((digit, index) => (
        <motion.div
          key={index}
          className={`relative overflow-hidden bg-zinc-800 rounded-lg ${sizeClasses[size]} w-12 h-16 flex items-center justify-center`}
          style={{ perspective: '1000px' }}
        >
          <motion.div
            initial={{ y: -50, rotateX: -90 }}
            animate={{ y: 0, rotateX: 0 }}
            transition={{ 
              delay: index * 0.1,
              type: 'spring',
              stiffness: 300,
              damping: 20
            }}
            className="font-mono font-bold text-white"
          >
            {digit}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

/**
 * ScorePopup - Popup score yang muncul dan naik
 */
interface ScorePopupProps {
  amount: number;
  x: number;
  y: number;
  onComplete?: () => void;
}

export const ScorePopup: React.FC<ScorePopupProps> = ({
  amount,
  x,
  y,
  onComplete
}) => {
  const isPositive = amount >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 0, scale: 0.5 }}
      animate={{ 
        opacity: [0, 1, 1, 0],
        y: -80,
        scale: [0.5, 1.2, 1, 0.8]
      }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
      onAnimationComplete={onComplete}
      className="fixed pointer-events-none z-50"
      style={{ left: x, top: y }}
    >
      <div 
        className={`text-4xl font-black ${isPositive ? 'text-green-400' : 'text-red-400'}`}
        style={{
          textShadow: isPositive 
            ? '0 0 20px rgba(74, 222, 128, 0.8)'
            : '0 0 20px rgba(248, 113, 113, 0.8)'
        }}
      >
        {isPositive ? '+' : ''}{amount.toLocaleString()}
      </div>
    </motion.div>
  );
};

/**
 * AnimatedBankroll - Bankroll display dengan animasi lengkap
 */
interface AnimatedBankrollProps {
  amount: number;
  previousAmount?: number;
  label?: string;
  className?: string;
}

export const AnimatedBankroll: React.FC<AnimatedBankrollProps> = ({
  amount,
  previousAmount,
  label = 'BANKROLL',
  className = ''
}) => {
  const [showChange, setShowChange] = useState(false);
  const change = previousAmount !== undefined ? amount - previousAmount : 0;

  useEffect(() => {
    if (change !== 0) {
      setShowChange(true);
      const timer = setTimeout(() => setShowChange(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [change]);

  return (
    <div className={`relative ${className}`}>
      <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">
        {label}
      </div>
      <div className="flex items-baseline gap-2">
        <NumberCounter
          value={amount}
          format="currency"
          size="xl"
          colorChange={true}
        />
        <AnimatePresence>
          {showChange && change !== 0 && (
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`text-lg font-bold ${change > 0 ? 'text-green-400' : 'text-red-400'}`}
            >
              ({change > 0 ? '+' : ''}{change.toLocaleString()})
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NumberCounter;
