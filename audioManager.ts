/**
 * 🔊 AUDIO MANAGER - Balatro-style sound effects
 * 
 * Uses Web Audio API for dynamic sounds with pitch shifting
 */

export type SoundType = 
  | 'card_deal'
  | 'card_flip'
  | 'card_hit'
  | 'click'
  | 'hover'
  | 'win'
  | 'lose'
  | 'blackjack'
  | 'bust'
  | 'gold'
  | 'combo'
  | 'joker_trigger'
  | 'mult_add'
  | 'streak';

interface SoundConfig {
  frequency: number;
  duration: number;
  type: OscillatorType;
  attack: number;
  decay: number;
  volume: number;
}

const SOUND_CONFIGS: Record<SoundType, SoundConfig> = {
  card_deal: { frequency: 800, duration: 0.08, type: 'sine', attack: 0.01, decay: 0.07, volume: 0.3 },
  card_flip: { frequency: 1200, duration: 0.1, type: 'sine', attack: 0.01, decay: 0.09, volume: 0.25 },
  card_hit: { frequency: 400, duration: 0.15, type: 'triangle', attack: 0.02, decay: 0.13, volume: 0.35 },
  click: { frequency: 600, duration: 0.05, type: 'sine', attack: 0.01, decay: 0.04, volume: 0.2 },
  hover: { frequency: 500, duration: 0.03, type: 'sine', attack: 0.01, decay: 0.02, volume: 0.1 },
  win: { frequency: 523, duration: 0.4, type: 'sine', attack: 0.02, decay: 0.38, volume: 0.4 },
  lose: { frequency: 200, duration: 0.5, type: 'sawtooth', attack: 0.05, decay: 0.45, volume: 0.3 },
  blackjack: { frequency: 784, duration: 0.6, type: 'sine', attack: 0.02, decay: 0.58, volume: 0.5 },
  bust: { frequency: 150, duration: 0.4, type: 'sawtooth', attack: 0.02, decay: 0.38, volume: 0.35 },
  gold: { frequency: 1047, duration: 0.15, type: 'sine', attack: 0.01, decay: 0.14, volume: 0.3 },
  combo: { frequency: 659, duration: 0.25, type: 'sine', attack: 0.02, decay: 0.23, volume: 0.4 },
  joker_trigger: { frequency: 440, duration: 0.3, type: 'square', attack: 0.02, decay: 0.28, volume: 0.35 },
  mult_add: { frequency: 880, duration: 0.1, type: 'sine', attack: 0.01, decay: 0.09, volume: 0.25 },
  streak: { frequency: 698, duration: 0.35, type: 'sine', attack: 0.02, decay: 0.33, volume: 0.4 },
};

class AudioManager {
  private audioContext: AudioContext | null = null;
  private masterVolume: number = 0.5;
  private isMuted: boolean = false;
  private comboCount: number = 0;
  
  /**
   * Initialize the audio context (must be called on user interaction)
   */
  init(): void {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }
  
  /**
   * Play a sound with optional pitch shift
   */
  play(sound: SoundType, pitchShift: number = 0): void {
    if (this.isMuted || !this.audioContext) return;
    
    const config = SOUND_CONFIGS[sound];
    if (!config) return;
    
    // Create oscillator
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    // Apply pitch shift (useful for combos)
    const frequency = config.frequency * Math.pow(2, pitchShift / 12);
    
    oscillator.type = config.type;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    
    // Envelope
    const now = this.audioContext.currentTime;
    const volume = config.volume * this.masterVolume;
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + config.attack);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + config.duration);
    
    // Connect
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    // Play
    oscillator.start(now);
    oscillator.stop(now + config.duration);
  }
  
  /**
   * Play a win sound with pitch based on combo count
   */
  playWin(): void {
    this.comboCount++;
    // Pitch up for each consecutive win (capped at +12 semitones)
    const pitchShift = Math.min(this.comboCount * 2, 12);
    this.play('win', pitchShift);
  }
  
  /**
   * Reset combo count (on loss)
   */
  resetCombo(): void {
    this.comboCount = 0;
  }
  
  /**
   * Play a multi-note win stinger
   */
  playBlackjackFanfare(): void {
    if (this.isMuted || !this.audioContext) return;
    
    // C-E-G-C chord progression
    const notes = [0, 4, 7, 12]; // semitones from base
    notes.forEach((note, i) => {
      setTimeout(() => {
        this.play('blackjack', note);
      }, i * 100);
    });
  }
  
  /**
   * Play combo reveal sound with ascending pitch
   */
  playComboReveal(comboIndex: number): void {
    this.play('combo', comboIndex * 3); // +3 semitones per combo
  }
  
  /**
   * Play gold gain sound
   */
  playGold(amount: number): void {
    // More gold = higher pitch
    const pitchShift = Math.min(Math.log2(amount / 10) * 4, 12);
    this.play('gold', pitchShift);
  }
  
  /**
   * Play multiplier increase
   */
  playMultAdd(mult: number): void {
    // Higher mult = higher pitch
    const pitchShift = Math.min(mult / 10, 12);
    this.play('mult_add', pitchShift);
  }
  
  /**
   * Set master volume (0-1)
   */
  setVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }
  
  /**
   * Get current volume
   */
  getVolume(): number {
    return this.masterVolume;
  }
  
  /**
   * Toggle mute
   */
  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
  
  /**
   * Set mute state
   */
  setMuted(muted: boolean): void {
    this.isMuted = muted;
  }
  
  /**
   * Check if muted
   */
  getMuted(): boolean {
    return this.isMuted;
  }
}

// Singleton export
export const audioManager = new AudioManager();

// Helper hooks for React
export function useAudio() {
  return {
    init: () => audioManager.init(),
    play: (sound: SoundType, pitch?: number) => audioManager.play(sound, pitch),
    playWin: () => audioManager.playWin(),
    playBlackjack: () => audioManager.playBlackjackFanfare(),
    playGold: (amount: number) => audioManager.playGold(amount),
    playCombo: (index: number) => audioManager.playComboReveal(index),
    resetCombo: () => audioManager.resetCombo(),
    setVolume: (v: number) => audioManager.setVolume(v),
    getVolume: () => audioManager.getVolume(),
    toggleMute: () => audioManager.toggleMute(),
    isMuted: () => audioManager.getMuted(),
  };
}
