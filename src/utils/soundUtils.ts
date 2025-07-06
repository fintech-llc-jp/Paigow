// Sound utility functions for game audio
export class SoundManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private isEnabled: boolean = true;

  constructor() {
    // Initialize AudioContext when user interacts with the page
    this.initializeAudioContext();
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  // Generate a simple beep sound programmatically
  private generateBeep(frequency: number, duration: number, type: OscillatorType = 'sine'): AudioBuffer | null {
    if (!this.audioContext) return null;

    const sampleRate = this.audioContext.sampleRate;
    const frameCount = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
    const channelData = buffer.getChannelData(0);

    for (let i = 0; i < frameCount; i++) {
      const t = i / sampleRate;
      let sample = 0;
      
      switch (type) {
        case 'sine':
          sample = Math.sin(2 * Math.PI * frequency * t);
          break;
        case 'square':
          sample = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1;
          break;
        case 'sawtooth':
          sample = 2 * (t * frequency - Math.floor(t * frequency + 0.5));
          break;
      }
      
      // Apply envelope to avoid clicks
      const envelope = Math.sin(Math.PI * t / duration);
      channelData[i] = sample * envelope * 0.3; // Reduce volume
    }

    return buffer;
  }

  // Generate a chord (multiple frequencies)
  private generateChord(frequencies: number[], duration: number, type: OscillatorType = 'sine'): AudioBuffer | null {
    if (!this.audioContext) return null;

    const sampleRate = this.audioContext.sampleRate;
    const frameCount = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
    const channelData = buffer.getChannelData(0);

    for (let i = 0; i < frameCount; i++) {
      const t = i / sampleRate;
      let sample = 0;
      
      // Sum all frequencies
      frequencies.forEach(frequency => {
        switch (type) {
          case 'sine':
            sample += Math.sin(2 * Math.PI * frequency * t);
            break;
          case 'square':
            sample += Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1;
            break;
        }
      });
      
      sample /= frequencies.length; // Normalize
      
      // Apply envelope
      const envelope = Math.sin(Math.PI * t / duration);
      channelData[i] = sample * envelope * 0.2; // Reduce volume for chord
    }

    return buffer;
  }

  public initializeSounds() {
    if (!this.audioContext) return;

    // Win sound - Major chord with ascending notes
    const winChord = this.generateChord([523.25, 659.25, 783.99], 0.8); // C5, E5, G5
    if (winChord) this.sounds.set('win', winChord);

    // Lose sound - Minor chord with descending notes
    const loseChord = this.generateChord([261.63, 311.13, 369.99], 0.6); // C4, Eb4, F#4
    if (loseChord) this.sounds.set('lose', loseChord);

    // Push (tie) sound - Neutral beep
    const pushSound = this.generateBeep(440, 0.4); // A4
    if (pushSound) this.sounds.set('push', pushSound);

    // Deal sound - Quick beep
    const dealSound = this.generateBeep(880, 0.1); // A5
    if (dealSound) this.sounds.set('deal', dealSound);
  }

  public playSound(soundName: string) {
    if (!this.isEnabled || !this.audioContext || !this.sounds.has(soundName)) {
      return;
    }

    try {
      // Resume audio context if suspended (browser policy)
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const buffer = this.sounds.get(soundName);
      if (!buffer) return;

      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(this.audioContext.destination);
      source.start();
    } catch (error) {
      console.warn('Error playing sound:', error);
    }
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  public isAudioEnabled(): boolean {
    return this.isEnabled && !!this.audioContext;
  }
}

// Create singleton instance
export const soundManager = new SoundManager();

// Initialize sounds when user first interacts with the page
let isInitialized = false;
export const initializeSounds = () => {
  if (!isInitialized) {
    soundManager.initializeSounds();
    isInitialized = true;
  }
};