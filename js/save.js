/**
 * AquaGuardian: Deep Clean - Save System
 * Persistent progress, Level/XP progression, Fortnite/Roblox style Skins Locker,
 * Quests/Bounties, and LocalStorage wrapper.
 * Built for C://hacks 2026
 */

(function(window) {
  'use strict';

  const STORAGE_KEY = 'aquaguardian_save_v2';

  const DEFAULT_SAVE_DATA = {
    ecoCredits: 0,
    playerLevel: 1,
    playerXP: 0,
    xpToNext: 400,
    unlockedLevel: 1,
    consecutiveFails: 0,
    equippedSkin: 'default',
    unlockedSkins: ['default'],
    upgrades: {
      sonar: 1,
      hold: 1,
      magnet: 1,
      nets: 1,
      solar: 1,
      hull: 1,
      drones: 1,
      purifier: 1,
      karmaShield: 1,
      bountyRadar: 1
    },
    levelStats: {
      1: { bestScore: 0, stars: 0, bestWQI: 0, time: 0 },
      2: { bestScore: 0, stars: 0, bestWQI: 0, time: 0 },
      3: { bestScore: 0, stars: 0, bestWQI: 0, time: 0 },
      4: { bestScore: 0, stars: 0, bestWQI: 0, time: 0 }
    },
    achievements: {
      zero_casualties: { title: "Zero Casualties", desc: "Complete Level 3 without harming any marine wildlife", unlocked: false },
      speed_cleaner: { title: "Speed Cleaner", desc: "Clear Level 1 in under 50 seconds", unlocked: false },
      pipe_master: { title: "Pipe Master", desc: "Install drainage filters without a single alignment failure", unlocked: false },
      coral_protector: { title: "Coral Protector", desc: "Finish Level 3 with perfect 100 Eco-Karma", unlocked: false },
      sludge_purifier: { title: "Sludge Purifier", desc: "Defeat the Sludge Leviathan and clean the estuary", unlocked: false },
      quiz_whiz: { title: "Water Scholar", desc: "Answer 3 water conservation quiz questions correctly", unlocked: false, progress: 0 },
      master_guardian: { title: "Master Guardian", desc: "Max out all Aqua-Drone technology upgrades", unlocked: false },
      drift_king: { title: "Drift Champion", desc: "Perform a high-speed hydro drift for 3 seconds", unlocked: false },
      combo_god: { title: "Cleaning Frenzy", desc: "Reach a 10x Debris Combo Streak", unlocked: false },
      crate_hunter: { title: "Loot Raider", desc: "Open 3 Mystery Eco-Supply Drops", unlocked: false, progress: 0 },
      swarm_commander: { title: "Swarm Commander", desc: "Deploy Autonomous Helper Mini-Drones [G] 3 times", unlocked: false, progress: 0 },
      slipstream_rider: { title: "Slipstream Rider", desc: "Ride Hydro-Slipstream Boost Gates 5 times", unlocked: false, progress: 0 }
    },
    settings: {
      difficulty: 'normal',
      sfxVolume: 0.8,
      musicVolume: 0.5,
      muted: false,
      colorblind: 'none',
      reduceMotion: false,
      touchControls: 'auto',
      controlMode: 'cursor_lock',
      gameSpeed: 1.0
    }
  };

  class SaveManager {
    constructor() {
      this.data = JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA));
      this.hasLocalStorage = this._checkStorageSupport();
      this.load();
    }

    _checkStorageSupport() {
      try {
        const testKey = '__agy_test__';
        window.localStorage.setItem(testKey, testKey);
        window.localStorage.removeItem(testKey);
        return true;
      } catch (e) {
        console.warn('LocalStorage unavailable, running in memory-session mode:', e);
        return false;
      }
    }

    load() {
      if (!this.hasLocalStorage) return;
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          this.data = this._deepMerge(this.data, parsed);
        }
      } catch (e) {
        console.error('Failed to load save data from localStorage:', e);
      }
    }

    save() {
      if (!this.hasLocalStorage) return;
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      } catch (e) {
        console.error('Failed to write save data to localStorage:', e);
      }
    }

    reset() {
      this.data = JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA));
      if (this.hasLocalStorage) {
        try {
          window.localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
          console.error('Failed to clear storage:', e);
        }
      }
      this.save();
    }

    _deepMerge(target, source) {
      if (!source || typeof source !== 'object') return target;
      for (const key of Object.keys(source)) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          if (!target[key] || typeof target[key] !== 'object') {
            target[key] = {};
          }
          this._deepMerge(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
      return target;
    }

    addCredits(amount) {
      if (typeof amount !== 'number' || isNaN(amount)) return;
      this.data.ecoCredits = Math.max(0, Math.floor(this.data.ecoCredits + amount));
      this.save();
    }

    spendCredits(amount) {
      if (this.data.ecoCredits >= amount) {
        this.data.ecoCredits -= amount;
        this.save();
        return true;
      }
      return false;
    }

    addXP(amount) {
      if (typeof amount !== 'number' || isNaN(amount)) return;
      this.data.playerXP += Math.floor(amount);

      let leveledUp = false;
      let totalRewards = 0;
      while (this.data.playerXP >= this.data.xpToNext) {
        this.data.playerXP -= this.data.xpToNext;
        this.data.playerLevel++;
        this.data.xpToNext = Math.floor(this.data.xpToNext * 1.35);
        leveledUp = true;

        // Money reward on level advancement!
        const bonus = this.data.playerLevel * 100;
        this.data.ecoCredits += bonus;
        totalRewards += bonus;

        if (this.data.playerLevel >= 3 && !this.data.unlockedSkins.includes('neon_cyber')) {
          this.unlockSkin('neon_cyber');
        }
        if (this.data.playerLevel >= 5 && !this.data.unlockedSkins.includes('solar_gold')) {
          this.unlockSkin('solar_gold');
        }
        if (this.data.playerLevel >= 8 && !this.data.unlockedSkins.includes('cosmic_void')) {
          this.unlockSkin('cosmic_void');
        }
      }

      this.save();

      if (leveledUp) {
        if (window.AudioEngine) window.AudioEngine.play('levelup');
        if (window.UI) {
          window.UI.showLevelUpCelebration(this.data.playerLevel, totalRewards);
        }
      }
    }

    unlockSkin(skinId) {
      if (!this.data.unlockedSkins.includes(skinId)) {
        this.data.unlockedSkins.push(skinId);
        this.save();
        if (window.UI) {
          window.UI.showNotification(`🎨 New Drone Skin Unlocked: ${skinId.toUpperCase()}!`);
        }
        if (window.AudioEngine) window.AudioEngine.play('achievement');
      }
    }

    equipSkin(skinId) {
      if (this.data.unlockedSkins.includes(skinId)) {
        this.data.equippedSkin = skinId;
        this.save();
        return true;
      }
      return false;
    }

    unlockNextLevel(currentLevel) {
      if (currentLevel >= this.data.unlockedLevel && this.data.unlockedLevel < 4) {
        this.data.unlockedLevel = currentLevel + 1;
        this.save();
      }
    }

    recordLevelCompletion(levelId, score, stars, wqi, timeSec) {
      if (!this.data.levelStats[levelId]) {
        this.data.levelStats[levelId] = { bestScore: 0, stars: 0, bestWQI: 0, time: 0 };
      }
      const stat = this.data.levelStats[levelId];
      if (score > stat.bestScore) stat.bestScore = score;
      if (stars > stat.stars) stat.stars = stars;
      if (wqi > stat.bestWQI) stat.bestWQI = Math.round(wqi);
      if (stat.time === 0 || timeSec < stat.time) stat.time = Math.round(timeSec);
      this.save();
    }

    unlockAchievement(id) {
      if (this.data.achievements[id] && !this.data.achievements[id].unlocked) {
        this.data.achievements[id].unlocked = true;
        this.save();
        if (window.AudioEngine) {
          window.AudioEngine.play('achievement');
        }
        if (window.UI) {
          window.UI.showNotification(`🏆 Achievement Unlocked: ${this.data.achievements[id].title}`);
        }
        return true;
      }
      return false;
    }

    checkUpgradeMaxAchievement() {
      const up = this.data.upgrades;
      const allMax = Object.values(up).every(tier => tier >= 4);
      if (allMax) {
        this.unlockAchievement('master_guardian');
      }
    }
  }

  window.SaveSystem = new SaveManager();
})(window);
