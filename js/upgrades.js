/**
 * AquaGuardian: Deep Clean - Upgrade System & Drone Customization
 * Upgrades modify boat physics, capacities, collection radius, and visual aesthetics.
 * Built for C://hacks 2026
 */

(function(window) {
  'use strict';

  const UPGRADES_CONFIG = {
    sonar: {
      name: "Deep Sonar Array",
      icon: "📡",
      desc: "Expands sonar ping radius and duration to pinpoint submerged waste, leaking pipes, and barrels.",
      tiers: [
        { level: 1, cost: 0, range: 450, duration: 2.5, desc: "Standard acoustic echo" },
        { level: 2, cost: 120, range: 700, duration: 3.5, desc: "High-frequency pulse" },
        { level: 3, cost: 250, range: 1050, duration: 4.5, desc: "Multibeam bathymetric sonar" },
        { level: 4, cost: 450, range: 1500, duration: 6.0, desc: "Satellite-linked eco-radar" }
      ]
    },
    hold: {
      name: "Recycling Cargo Hold",
      icon: "📦",
      desc: "Increases plastic waste payload capacity before requiring offloading at a recycling buoy.",
      tiers: [
        { level: 1, cost: 0, capacity: 12, desc: "Standard 12-item containment hopper" },
        { level: 2, cost: 100, capacity: 22, desc: "Compactor bay - 22 item capacity" },
        { level: 3, cost: 220, capacity: 36, desc: "Hydraulic eco-baler - 36 items" },
        { level: 4, cost: 400, capacity: 55, desc: "Industrial molecular shredder - 55 items" }
      ]
    },
    magnet: {
      name: "Magnetic Vacuum Collector",
      icon: "🧲",
      desc: "Generates an electrostatic vortex that pulls floating debris towards your collection scoop.",
      tiers: [
        { level: 1, cost: 0, radius: 45, pullSpeed: 100, desc: "Passive suction intake" },
        { level: 2, cost: 140, radius: 85, pullSpeed: 160, desc: "Electrodynamic micro-vortex" },
        { level: 3, cost: 280, radius: 140, pullSpeed: 230, desc: "High-power magnetic skimmer" },
        { level: 4, cost: 500, radius: 210, pullSpeed: 320, desc: "Singularity eco-vacuum" }
      ]
    },
    nets: {
      name: "Biodegradable Smart Nets",
      icon: "🕸️",
      desc: "Widens front debris scoop arc. Advanced tiers emit harmless acoustic cues so fish naturally evade without harm.",
      tiers: [
        { level: 1, cost: 0, width: 38, safeForFish: false, desc: "Standard nylon scoop" },
        { level: 2, cost: 110, width: 55, safeForFish: false, desc: "Wide bio-fiber net" },
        { level: 3, cost: 240, width: 75, safeForFish: true, desc: "Acoustic wildlife repelling net" },
        { level: 4, cost: 420, width: 100, safeForFish: true, desc: "Zero-harm holographic eco-funnel" }
      ]
    },
    solar: {
      name: "Photovoltaic Solar Wings",
      icon: "☀️",
      desc: "Increases solar energy recharge rate in daylight and adds battery backup storage during night cycles.",
      tiers: [
        { level: 1, cost: 0, chargeRate: 7, maxEnergy: 100, nightTrickle: 0, desc: "Monocrystalline rooftop cells" },
        { level: 2, cost: 130, chargeRate: 12, maxEnergy: 130, nightTrickle: 1.5, desc: "Dual tilt-tracking solar wings" },
        { level: 3, cost: 260, chargeRate: 18, maxEnergy: 170, nightTrickle: 3.5, desc: "Perovskite quantum-dot array" },
        { level: 4, cost: 480, chargeRate: 26, maxEnergy: 220, nightTrickle: 6.0, desc: "Full-hull bio-photonic coating" }
      ]
    },
    hull: {
      name: "Hydrofoil Engine & Hull",
      icon: "⚡",
      desc: "Enhances drone acceleration, top navigation speed, turning agility, and collision resistance.",
      tiers: [
        { level: 1, cost: 0, topSpeed: 215, turnRate: 3.5, accel: 360, armor: 1.0, desc: "Standard twin-propeller scout hull" },
        { level: 2, cost: 150, topSpeed: 255, turnRate: 3.9, accel: 440, armor: 0.8, desc: "Dual twin-hydrofoil stabilizers" },
        { level: 3, cost: 300, topSpeed: 300, turnRate: 4.3, accel: 530, armor: 0.6, desc: "Carbon-nanotube reinforced hull" },
        { level: 4, cost: 520, topSpeed: 350, turnRate: 4.8, accel: 630, armor: 0.4, desc: "Supercavitating plasma-hydro drives" }
      ]
    },
    drones: {
      name: "Autonomous Helper Swarm",
      icon: "🤖",
      desc: "Deploys autonomous mini-drones [G] that orbit your ship and laser-scoop nearby plastics automatically.",
      tiers: [
        { level: 1, cost: 0, count: 1, duration: 10, range: 130, desc: "1 Helper Mini-Drone (10s duration)" },
        { level: 2, cost: 160, count: 2, duration: 13, range: 165, desc: "2 Helper Mini-Drones (13s duration)" },
        { level: 3, cost: 320, count: 3, duration: 16, range: 200, desc: "3 Helper Mini-Drones (16s duration)" },
        { level: 4, cost: 550, count: 4, duration: 20, range: 250, desc: "4 Helper Swarm Fleet (20s duration)" }
      ]
    },
    purifier: {
      name: "Micro-Bio Water Purifier",
      icon: "🧪",
      desc: "Bio-catalyzer that slows down industrial pollution decay and steadily protects surrounding water.",
      tiers: [
        { level: 1, cost: 0, decayDampener: 1.0, desc: "Standard charcoal bio-filter" },
        { level: 2, cost: 130, decayDampener: 0.70, desc: "Enzymatic core (30% slower pollution decay)" },
        { level: 3, cost: 260, decayDampener: 0.45, desc: "Bacterial bio-reactor (55% slower pollution decay)" },
        { level: 4, cost: 480, decayDampener: 0.20, desc: "Photo-catalyst matrix (80% slower pollution decay)" }
      ]
    },
    karmaShield: {
      name: "Eco-Karma Wave Cushion",
      icon: "🐬",
      desc: "Ultrasonic cushion that softens coral bumps and protects marine life from boat collision trauma.",
      tiers: [
        { level: 1, cost: 0, karmaArmor: 1.0, desc: "Standard rubberized bumpers" },
        { level: 2, cost: 120, karmaArmor: 0.65, desc: "Hydro-gel dampers (35% less Eco-Karma loss)" },
        { level: 3, cost: 250, karmaArmor: 0.35, desc: "Acoustic bio-shield (65% less Eco-Karma loss)" },
        { level: 4, cost: 450, karmaArmor: 0.0, desc: "Zero-Harm Forcefield (100% collision Karma immunity)" }
      ]
    },
    bountyRadar: {
      name: "Eco-Bounty Multiplier",
      icon: "🪙",
      desc: "Recyclable analyzer that extracts extra value, boosting Eco-Credit payouts on all collected trash.",
      tiers: [
        { level: 1, cost: 0, coinMultiplier: 1.0, desc: "Standard 1.0x recycling value" },
        { level: 2, cost: 150, coinMultiplier: 1.25, desc: "Optical sorter (+25% bonus Coins)" },
        { level: 3, cost: 300, coinMultiplier: 1.5, desc: "Polymer processor (+50% bonus Coins)" },
        { level: 4, cost: 520, coinMultiplier: 2.0, desc: "Circular economy printer (+100% bonus Coins)" }
      ]
    }
  };

  class UpgradeManager {
    constructor() {
      this.config = UPGRADES_CONFIG;
    }

    getUpgradeLevel(key) {
      if (!window.SaveSystem) return 1;
      return window.SaveSystem.data.upgrades[key] || 1;
    }

    getTierData(key, level = null) {
      if (!this.config[key]) return null;
      const currentLevel = level !== null ? level : this.getUpgradeLevel(key);
      const tiers = this.config[key].tiers;
      return tiers[Math.min(currentLevel - 1, tiers.length - 1)];
    }

    getNextTierData(key) {
      if (!this.config[key]) return null;
      const currentLevel = this.getUpgradeLevel(key);
      const tiers = this.config[key].tiers;
      if (currentLevel >= tiers.length) return null; // already maxed
      return tiers[currentLevel];
    }

    canAfford(key) {
      const next = this.getNextTierData(key);
      if (!next) return false;
      return window.SaveSystem.data.ecoCredits >= next.cost;
    }

    buyUpgrade(key) {
      const next = this.getNextTierData(key);
      if (!next) return false;

      if (window.SaveSystem.spendCredits(next.cost)) {
        window.SaveSystem.data.upgrades[key] += 1;
        window.SaveSystem.save();
        window.SaveSystem.checkUpgradeMaxAchievement();

        if (window.AudioEngine) {
          window.AudioEngine.play('filter_success');
        }
        return true;
      }
      return false;
    }

    getOverallTier() {
      // Computes overall drone tier (1 to 4) for visual ship transformations
      const upgrades = window.SaveSystem ? window.SaveSystem.data.upgrades : { sonar: 1, hold: 1, magnet: 1, nets: 1, solar: 1, hull: 1 };
      const values = Object.values(upgrades);
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      if (avg >= 3.5) return 4;
      if (avg >= 2.5) return 3;
      if (avg >= 1.5) return 2;
      return 1;
    }
  }

  window.UpgradeSystem = new UpgradeManager();
})(window);
