/**
 * AquaGuardian: Deep Clean - WebAudio Procedural Audio Engine
 * 100% synthesized procedural sound effects, engine simulation, dopamine combo chimes,
 * level-up fanfares, powerups, crate breaks, and dynamic WQI-responsive soundtrack.
 * Built for C://hacks 2026
 */

(function(window) {
  'use strict';

  class AudioEngine {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.sfxGain = null;
      this.musicGain = null;
      this.ambientGain = null;
      this.engineGain = null;

      this.isInitialized = false;
      this.isMuted = false;

      // Engine drone sound state
      this.engineOsc = null;
      this.engineSubOsc = null;
      this.engineFilter = null;

      // Drift screech state
      this.driftOsc = null;
      this.driftGain = null;

      // Ambient water sound state
      this.ambientNoiseNode = null;
      this.ambientFilter = null;

      // Background music file (game_music.mp3)
      this.bgMusic = new Audio('audio/game_music.mp3');
      this.bgMusic.loop = true;
      this.bgMusic.preload = 'auto';

      // Generative music state (disabled when MP3 BGM is active to prevent sound collisions)
      this.musicInterval = null;
      this.musicStep = 0;
      this.currentWQI = 50;
      this.isBossMusic = false;

      this.scales = {
        polluted: [130.81, 155.56, 174.61, 196.00, 233.08, 261.63],
        transition: [130.81, 146.83, 164.81, 196.00, 220.00, 261.63],
        pristine: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 659.25],
        boss: [110.00, 116.54, 130.81, 146.83, 164.81, 220.00]
      };
    }

    init() {
      if (this.isInitialized) return;

      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContextClass();

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.connect(this.masterGain);

        this.musicGain = this.ctx.createGain();
        this.musicGain.connect(this.masterGain);

        this.ambientGain = this.ctx.createGain();
        this.ambientGain.connect(this.masterGain);

        this.applySettings();
        this._setupEngineSound();
        this._setupDriftSound();
        this._setupWaterAmbiance();
        this.startMusic();

        this.isInitialized = true;
      } catch (err) {
        console.warn('WebAudio initialization error:', err);
      }
    }

    applySettings() {
      const settings = window.SaveSystem ? window.SaveSystem.data.settings : { sfxVolume: 0.8, musicVolume: 0.5, muted: false };
      this.isMuted = settings.muted;

      // Update MP3 background music volume (balanced so it never overpowers SFX)
      if (this.bgMusic) {
        if (this.isMuted) {
          this.bgMusic.volume = 0;
        } else {
          this.bgMusic.volume = Math.max(0, Math.min(1, settings.musicVolume * 0.35));
        }
      }

      if (!this.ctx) return;

      const masterVol = this.isMuted ? 0 : 1.0;
      this.masterGain.gain.setTargetAtTime(masterVol, this.ctx.currentTime, 0.05);
      this.sfxGain.gain.setTargetAtTime(settings.sfxVolume, this.ctx.currentTime, 0.05);
      this.musicGain.gain.setTargetAtTime(settings.musicVolume * 0.45, this.ctx.currentTime, 0.05);
      this.ambientGain.gain.setTargetAtTime(settings.sfxVolume * 0.20, this.ctx.currentTime, 0.05);
    }

    _resumeIfSuspended() {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    _setupEngineSound() {
      try {
        this.engineOsc = this.ctx.createOscillator();
        this.engineSubOsc = this.ctx.createOscillator();
        this.engineGain = this.ctx.createGain();
        this.engineFilter = this.ctx.createBiquadFilter();

        this.engineOsc.type = 'sawtooth';
        this.engineOsc.frequency.setValueAtTime(45, this.ctx.currentTime);

        this.engineSubOsc.type = 'sine';
        this.engineSubOsc.frequency.setValueAtTime(90, this.ctx.currentTime);

        this.engineFilter.type = 'lowpass';
        this.engineFilter.frequency.setValueAtTime(140, this.ctx.currentTime);

        this.engineGain.gain.setValueAtTime(0.001, this.ctx.currentTime);

        this.engineOsc.connect(this.engineFilter);
        this.engineSubOsc.connect(this.engineFilter);
        this.engineFilter.connect(this.engineGain);
        this.engineGain.connect(this.sfxGain);

        this.engineOsc.start();
        this.engineSubOsc.start();
      } catch (e) {
        console.warn('Engine sound init issue:', e);
      }
    }

    _setupDriftSound() {
      try {
        this.driftOsc = this.ctx.createOscillator();
        this.driftGain = this.ctx.createGain();
        this.driftFilter = this.ctx.createBiquadFilter();

        this.driftOsc.type = 'triangle';
        this.driftOsc.frequency.setValueAtTime(180, this.ctx.currentTime);

        this.driftFilter.type = 'bandpass';
        this.driftFilter.frequency.setValueAtTime(600, this.ctx.currentTime);
        this.driftFilter.Q.setValueAtTime(3.0, this.ctx.currentTime);

        this.driftGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);

        this.driftOsc.connect(this.driftFilter);
        this.driftFilter.connect(this.driftGain);
        this.driftGain.connect(this.sfxGain);

        this.driftOsc.start();
      } catch (e) {
        console.warn('Drift sound init issue:', e);
      }
    }

    updateDriftSound(isDrifting, driftLevel) {
      if (!this.driftGain || !this.driftOsc) return;
      this._resumeIfSuspended();
      const targetGain = isDrifting ? Math.min(0.18, 0.05 + driftLevel * 0.05) : 0.0001;
      const targetFreq = 180 + driftLevel * 70;
      this.driftGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
      this.driftOsc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.05);
    }

    updateEngineThrottle(throttle, isBoosting) {
      if (!this.engineOsc || !this.engineGain) return;
      this._resumeIfSuspended();

      const baseFreq = 45 + throttle * 45 + (isBoosting ? 50 : 0);
      const filterFreq = 130 + throttle * 320 + (isBoosting ? 550 : 0);
      const targetGain = 0.04 + throttle * 0.14 + (isBoosting ? 0.12 : 0);

      this.engineOsc.frequency.setTargetAtTime(baseFreq, this.ctx.currentTime, 0.08);
      this.engineSubOsc.frequency.setTargetAtTime(baseFreq * 2, this.ctx.currentTime, 0.08);
      this.engineFilter.frequency.setTargetAtTime(filterFreq, this.ctx.currentTime, 0.08);
      this.engineGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.08);
    }

    _setupWaterAmbiance() {
      try {
        const bufferSize = 2 * this.ctx.sampleRate;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99 * b0 + white * 0.05;
          b1 = 0.96 * b1 + white * 0.1;
          b2 = 0.86 * b2 + white * 0.2;
          output[i] = (b0 + b1 + b2) * 0.5;
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        this.ambientFilter = this.ctx.createBiquadFilter();
        this.ambientFilter.type = 'bandpass';
        this.ambientFilter.frequency.setValueAtTime(320, this.ctx.currentTime);
        this.ambientFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.18, this.ctx.currentTime);
        lfoGain.gain.setValueAtTime(180, this.ctx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(this.ambientFilter.frequency);
        lfo.start();

        whiteNoise.connect(this.ambientFilter);
        this.ambientFilter.connect(this.ambientGain);
        whiteNoise.start();
      } catch (e) {
        console.warn('Ambiance generator init issue:', e);
      }
    }

    startMusic() {
      if (this.bgMusic) {
        const settings = window.SaveSystem ? window.SaveSystem.data.settings : { musicVolume: 0.5 };
        this.bgMusic.volume = this.isMuted ? 0 : Math.max(0, Math.min(1, settings.musicVolume * 0.35));
        if (this.bgMusic.paused) {
          this.bgMusic.play().catch(() => {
            // Waiting for user gesture in browser
          });
        }
      }
    }

    stopMusic() {
      if (this.bgMusic) {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
      }
    }

    pauseMusic() {
      if (this.bgMusic && !this.bgMusic.paused) {
        this.bgMusic.pause();
      }
    }

    resumeMusic() {
      if (this.bgMusic && this.bgMusic.paused && !this.isMuted) {
        const settings = window.SaveSystem ? window.SaveSystem.data.settings : { musicVolume: 0.5 };
        this.bgMusic.volume = Math.max(0, Math.min(1, settings.musicVolume * 0.35));
        this.bgMusic.play().catch(() => {});
      }
    }

    setWQI(wqi, isBoss = false) {
      this.currentWQI = wqi;
      this.isBossMusic = isBoss;
    }

    _playProceduralBeat() {
      this._resumeIfSuspended();
      const step = this.musicStep % 16;
      this.musicStep++;

      let activeScale;
      if (this.isBossMusic) {
        activeScale = this.scales.boss;
      } else if (this.currentWQI >= 75) {
        activeScale = this.scales.pristine;
      } else if (this.currentWQI >= 40) {
        activeScale = this.scales.transition;
      } else {
        activeScale = this.scales.polluted;
      }

      const now = this.ctx.currentTime;

      // Bass punch
      if (step % 4 === 0) {
        const rootFreq = activeScale[0];
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = this.isBossMusic ? 'sawtooth' : 'triangle';
        bassOsc.frequency.setValueAtTime(rootFreq * 0.5, now);
        bassOsc.frequency.exponentialRampToValueAtTime(rootFreq * 0.45, now + 0.28);

        bassGain.gain.setValueAtTime(0.25, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        bassOsc.connect(bassGain);
        bassGain.connect(this.musicGain);
        bassOsc.start(now);
        bassOsc.stop(now + 0.3);
      }

      // Synth Arpeggio
      if (step % 2 === 0 || (this.currentWQI > 55 && Math.random() > 0.25)) {
        const noteIdx = Math.floor(Math.sin(this.musicStep * 0.5) * 2 + 3) % activeScale.length;
        const noteFreq = activeScale[noteIdx];

        const leadOsc = this.ctx.createOscillator();
        const leadGain = this.ctx.createGain();
        const leadFilter = this.ctx.createBiquadFilter();

        leadOsc.type = this.currentWQI > 70 ? 'sine' : 'sawtooth';
        leadOsc.frequency.setValueAtTime(noteFreq, now);

        leadFilter.type = 'lowpass';
        leadFilter.frequency.setValueAtTime(600 + this.currentWQI * 18, now);

        const decay = this.currentWQI > 70 ? 0.3 : 0.2;
        leadGain.gain.setValueAtTime(0.12, now);
        leadGain.gain.exponentialRampToValueAtTime(0.001, now + decay);

        leadOsc.connect(leadFilter);
        leadFilter.connect(leadGain);
        leadGain.connect(this.musicGain);

        leadOsc.start(now);
        leadOsc.stop(now + decay);
      }
    }

    play(soundType, options = {}) {
      if (!this.ctx || this.isMuted) return;
      this._resumeIfSuspended();
      const now = this.ctx.currentTime;

      switch (soundType) {
        case 'collect': {
          const combo = options.combo || 1;
          const baseFreq = 523.25;
          const pitchFactor = Math.pow(1.12, Math.min(combo, 14));
          const freq = baseFreq * pitchFactor;

          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = combo > 6 ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(freq, now);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.35, now + 0.12);

          gain.gain.setValueAtTime(0.24, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.16);
          break;
        }

        case 'crate_open': {
          // Loot crate smash jackpot
          [440, 659.25, 880, 1174.66, 1760].forEach((f, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, now + idx * 0.05);
            gain.gain.setValueAtTime(0.25, now + idx * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.4);

            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(now + idx * 0.05);
            osc.stop(now + idx * 0.05 + 0.4);
          });
          break;
        }

        case 'powerup': {
          // Sci-fi powerup ascension
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(260, now);
          osc.frequency.exponentialRampToValueAtTime(1200, now + 0.35);

          gain.gain.setValueAtTime(0.28, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.4);
          break;
        }

        case 'levelup': {
          // Fortnite-style triumphant level-up blast
          [392, 523.25, 659.25, 783.99, 1046.50].forEach((f, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(f, now + idx * 0.07);
            gain.gain.setValueAtTime(0.3, now + idx * 0.07);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.5);

            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(now + idx * 0.07);
            osc.stop(now + idx * 0.07 + 0.5);
          });
          break;
        }

        case 'sonar': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1350, now);
          osc.frequency.exponentialRampToValueAtTime(800, now + 0.8);

          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 1.2);
          break;
        }

        case 'deposit': {
          [523.25, 659.25, 783.99, 1046.50].forEach((f, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, now + idx * 0.05);
            gain.gain.setValueAtTime(0.2, now + idx * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.45);

            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(now + idx * 0.05);
            osc.stop(now + idx * 0.05 + 0.45);
          });
          break;
        }

        case 'filter_success': {
          [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((f, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now + idx * 0.07);
            gain.gain.setValueAtTime(0.25, now + idx * 0.07);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.5);

            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(now + idx * 0.07);
            osc.stop(now + idx * 0.07 + 0.5);
          });
          break;
        }

        case 'filter_fail': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(160, now);
          osc.frequency.linearRampToValueAtTime(95, now + 0.3);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.3);
          break;
        }

        case 'neutralize_hum': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(240, now);
          osc.frequency.linearRampToValueAtTime(360, now + 0.1);
          gain.gain.setValueAtTime(0.14, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.1);
          break;
        }

        case 'neutralize_done': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.exponentialRampToValueAtTime(920, now + 0.3);
          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.35);
          break;
        }

        case 'recycler_burst': {
          const bufferSize = this.ctx.sampleRate * 0.4;
          const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
          }
          const whiteNoise = this.ctx.createBufferSource();
          whiteNoise.buffer = noiseBuffer;

          const filter = this.ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(220, now);
          filter.frequency.exponentialRampToValueAtTime(1600, now + 0.2);
          filter.frequency.exponentialRampToValueAtTime(100, now + 0.4);

          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(0.38, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

          whiteNoise.connect(filter);
          filter.connect(gain);
          gain.connect(this.sfxGain);
          whiteNoise.start(now);
          whiteNoise.stop(now + 0.4);
          break;
        }

        case 'coral_bump': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(130, now);
          osc.frequency.exponentialRampToValueAtTime(50, now + 0.2);
          gain.gain.setValueAtTime(0.35, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.2);
          break;
        }

        case 'boss_roar': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(95, now);
          osc.frequency.linearRampToValueAtTime(40, now + 0.8);
          gain.gain.setValueAtTime(0.45, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.85);
          break;
        }

        case 'achievement': {
          [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98].forEach((f, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, now + idx * 0.08);
            gain.gain.setValueAtTime(0.24, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.45);

            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.45);
          });
          break;
        }

        case 'click': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(900, now);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.04);
          break;
        }

        default:
          break;
      }
    }
  }

  window.AudioEngine = new AudioEngine();
})(window);
