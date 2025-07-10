// Sound utility functions for game audio
export class SoundManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private audioElements: Map<string, HTMLAudioElement> = new Map();
  private isEnabled: boolean = true;

  constructor() {
    // Initialize AudioContext when user interacts with the page
    this.initializeAudioContext();
    // Load MP3 files
    this.loadAudioFiles();
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  private loadAudioFiles() {
    // Load MP3 files from public directory
    const audioFiles = {
      'win': '/sounds/YouWon.mp3',
      'lose': '/sounds/YouLose.mp3'
    };

    Object.entries(audioFiles).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.preload = 'auto';
      audio.volume = 0.5; // Set volume to 50%
      this.audioElements.set(key, audio);
    });
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


  public initializeSounds() {
    if (!this.audioContext) return;

    // Push (tie) sound - Neutral beep (generated)
    const pushSound = this.generateBeep(440, 0.4); // A4
    if (pushSound) this.sounds.set('push', pushSound);

    // Deal sound - Quick beep (generated)
    const dealSound = this.generateBeep(880, 0.1); // A5
    if (dealSound) this.sounds.set('deal', dealSound);

    // Win and lose sounds are loaded from MP3 files in constructor
  }

  public playSound(soundName: string) {
    if (!this.isEnabled) {
      return;
    }

    try {
      // Check if it's an MP3 file (win/lose)
      if (this.audioElements.has(soundName)) {
        const audio = this.audioElements.get(soundName);
        if (audio) {
          audio.currentTime = 0; // Reset to beginning
          audio.play().catch(error => {
            console.warn('Error playing MP3 sound:', error);
          });
        }
        return;
      }

      // Handle generated sounds (push/deal)
      if (!this.audioContext || !this.sounds.has(soundName)) {
        return;
      }

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