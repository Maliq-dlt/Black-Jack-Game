export class SoundEngine {
  private static instance: SoundEngine;
  private audioCtx: AudioContext | null = null;
  private volume: number = 0.5;

  private constructor() {}

  public static getInstance(): SoundEngine {
    if (!SoundEngine.instance) {
      SoundEngine.instance = new SoundEngine();
    }
    return SoundEngine.instance;
  }

  private initCtx() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public setVolume(volume: number) {
    this.volume = volume;
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volumeScale: number = 1) {
    this.initCtx();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
    
    gain.gain.setValueAtTime(this.volume * volumeScale, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + duration);
  }

  // --- Game Sounds ---

  public playChipClick() {
    this.playTone(800, 'sine', 0.1, 0.5);
    setTimeout(() => this.playTone(1200, 'sine', 0.05, 0.3), 20);
  }

  public playCardDeal() {
    this.playTone(200, 'triangle', 0.15, 0.4);
    this.playTone(300, 'sine', 0.1, 0.2);
  }

  public playCardFlip() {
    this.playTone(400, 'sine', 0.1, 0.3);
  }

  public playWin() {
    const now = this.audioCtx?.currentTime || 0;
    this.playTone(523.25, 'sine', 0.3, 0.5); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.3, 0.5), 150); // E5
    setTimeout(() => this.playTone(783.99, 'sine', 0.5, 0.6), 300); // G5
  }

  public playLose() {
    this.playTone(300, 'sawtooth', 0.4, 0.3);
    setTimeout(() => this.playTone(200, 'sawtooth', 0.5, 0.3), 200);
  }

  public playBlackjack() {
    this.playWin();
    setTimeout(() => this.playTone(1046.5, 'sine', 0.8, 0.8), 450); // C6
  }
}
