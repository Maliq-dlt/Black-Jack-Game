import React from 'react';

/**
 * ============================================
 * PHASE 1: Enhanced Color Palette & Theme
 * ============================================
 * 
 * High Impact, Low Effort Upgrade
 * - Saturated colors seperti Balatro
 * - High contrast design
 * - Clear rarity color coding
 */

// Rarity Colors - Highly Saturated seperti Balatro
export const RARITY_COLORS = {
  common: {
    primary: '#94a3b8',      // Slate 400
    secondary: '#64748b',    // Slate 500
    glow: 'rgba(148, 163, 184, 0.4)',
    bg: 'rgba(148, 163, 184, 0.15)',
    border: '#94a3b8'
  },
  uncommon: {
    primary: '#22c55e',      // Green 500 - BRIGHT
    secondary: '#16a34a',    // Green 600
    glow: 'rgba(34, 197, 94, 0.5)',
    bg: 'rgba(34, 197, 94, 0.15)',
    border: '#22c55e'
  },
  rare: {
    primary: '#3b82f6',      // Blue 500 - BRIGHT
    secondary: '#2563eb',    // Blue 600
    glow: 'rgba(59, 130, 246, 0.5)',
    bg: 'rgba(59, 130, 246, 0.15)',
    border: '#3b82f6'
  },
  epic: {
    primary: '#a855f7',      // Purple 500 - BRIGHT
    secondary: '#9333ea',    // Purple 600
    glow: 'rgba(168, 85, 247, 0.5)',
    bg: 'rgba(168, 85, 247, 0.15)',
    border: '#a855f7'
  },
  legendary: {
    primary: '#eab308',      // Yellow 500 - GOLD
    secondary: '#ca8a04',    // Yellow 600
    glow: 'rgba(234, 179, 8, 0.6)',
    bg: 'rgba(234, 179, 8, 0.2)',
    border: '#eab308'
  },
  cursed: {
    primary: '#dc2626',      // Red 600 - BLOOD RED
    secondary: '#991b1b',    // Red 800
    glow: 'rgba(220, 38, 38, 0.6)',
    bg: 'rgba(220, 38, 38, 0.2)',
    border: '#dc2626'
  }
} as const;

// Game Theme Colors
export const THEME_COLORS = {
  // Backgrounds
  bgPrimary: '#0a0a0a',      // Almost black
  bgSecondary: '#171717',    // Neutral 900
  bgTertiary: '#262626',     // Neutral 800
  bgCard: '#1a1a1a',         // Card background
  
  // Accents
  gold: '#fbbf24',           // Amber 400
  goldDark: '#d97706',       // Amber 600
  goldGlow: 'rgba(251, 191, 36, 0.5)',
  
  // UI
  textPrimary: '#ffffff',
  textSecondary: '#a3a3a3',  // Neutral 400
  textMuted: '#737373',      // Neutral 500
  
  // Feedback
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  
  // Special
  neonGreen: '#39ff14',
  neonPink: '#ff10f0',
  neonCyan: '#00ffff'
} as const;

// Suit Colors - More Vibrant
export const SUIT_COLORS = {
  hearts: '#ef4444',    // Bright Red
  diamonds: '#ef4444',  // Bright Red
  clubs: '#22c55e',     // Bright Green (unconventional but pops!)
  spades: '#3b82f6'     // Bright Blue (unconventional but pops!)
} as const;

// Traditional suit colors (if preferred)
export const SUIT_COLORS_TRADITIONAL = {
  hearts: '#dc2626',    // Red
  diamonds: '#dc2626',  // Red
  clubs: '#171717',     // Black
  spades: '#171717'     // Black
} as const;

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * GlobalStyles - CSS variables untuk theme
 */
export const GlobalStyles: React.FC = () => (
  <style>{`
    :root {
      /* Backgrounds */
      --bg-primary: #0a0a0a;
      --bg-secondary: #171717;
      --bg-tertiary: #262626;
      --bg-card: #1a1a1a;
      
      /* Gold */
      --gold: #fbbf24;
      --gold-dark: #d97706;
      --gold-glow: rgba(251, 191, 36, 0.5);
      
      /* Text */
      --text-primary: #ffffff;
      --text-secondary: #a3a3a3;
      --text-muted: #737373;
      
      /* Rarity */
      --rarity-common: #94a3b8;
      --rarity-uncommon: #22c55e;
      --rarity-rare: #3b82f6;
      --rarity-epic: #a855f7;
      --rarity-legendary: #eab308;
      --rarity-cursed: #dc2626;
      
      /* Suits */
      --suit-red: #ef4444;
      --suit-black: #171717;
      
      /* Effects */
      --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.5);
      --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.5);
      --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
      --shadow-glow-gold: 0 0 20px rgba(251, 191, 36, 0.4);
      
      /* Transitions */
      --transition-fast: 150ms ease;
      --transition-normal: 300ms ease;
      --transition-slow: 500ms ease;
    }
    
    /* High contrast text shadows untuk readability */
    .text-glow-gold {
      text-shadow: 0 0 10px var(--gold-glow), 0 0 20px var(--gold-glow);
    }
    
    .text-glow-white {
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    }
    
    /* Rarity glow classes */
    .glow-common { box-shadow: 0 0 15px rgba(148, 163, 184, 0.4); }
    .glow-uncommon { box-shadow: 0 0 15px rgba(34, 197, 94, 0.5); }
    .glow-rare { box-shadow: 0 0 15px rgba(59, 130, 246, 0.5); }
    .glow-epic { box-shadow: 0 0 15px rgba(168, 85, 247, 0.5); }
    .glow-legendary { box-shadow: 0 0 20px rgba(234, 179, 8, 0.6); }
    .glow-cursed { box-shadow: 0 0 20px rgba(220, 38, 38, 0.6); }
  `}</style>
);

export default GlobalStyles;
