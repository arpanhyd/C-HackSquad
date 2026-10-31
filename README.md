# 🌊 AquaGuardian: Deep Clean (Cursor-Pilot Edition)

> An educational arcade marine cleanup game built for **C://hacks 2026 (CHIREC International School)** around **UN SDG 6: Clean Water and Sanitation**.  
> Pilot an autonomous solar-powered vessel, clean plastic waste, neutralize chemical leaks, install wastewater bio-filters, and restore dying aquatic biomes.

---

## 🎮 Play Locally

No build tools, npm packages, or server setups required. The game runs on 100% vanilla Web standards (HTML5 Canvas, WebAudio API, LocalStorage).

1. Clone or download this repository.
2. Open `index.html` directly in any modern web browser (Chrome, Edge, Firefox, Brave, Safari).
3. Alternatively, if you prefer running a local dev server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Or using npx
   npx serve
   ```
4. Click anywhere on the title screen to start and hear the soundtrack!

---

## 🌍 UN Sustainable Development Goal 6 (Clean Water & Sanitation)

Billions of people worldwide lack access to safely managed drinking water. Over 80% of human wastewater is discharged into rivers, lakes, and oceans without any treatment.

**AquaGuardian** turns real environmental telemetry into interactive gameplay mechanics:
- **Target 6.3 (Reduce Pollution & Treat Wastewater):** Locate storm runoff sewer pipes and clamp industrial bio-filters to stop untreated effluent. Neutralize corroded chemical barrels before they poison groundwater.
- **Target 6.6 (Protect Water Ecosystems):** Collect floating marine plastics (bottles, bags, six-pack rings, ghost fishing nets) and return them to automated Recycling Buoys.
- **Wildlife Protection (Eco-Karma):** Clean without causing collateral damage. Speeding through schools of fish or crashing into coral reefs damages living habitats and lowers your Eco-Karma score.

---

## 🕹️ Controls & Navigation

AquaGuardian supports **Mouse / Cursor Flight**, **Keyboard**, **Gamepad**, and **Mobile Touchscreens**.

### 🖱️ Cursor Flight Mode (Default on PC)
- **Mouse Movement**: Move your mouse pointer to guide your boat. The drone turns and flies toward your cursor smoothly.
- **Left Click**: Hold for Hydro-Boost (drains battery).
- **Auto-Interact**: Simply hover over yellow toxic barrels to start tractor neutralization, or press `E` near sewer pipes to start the Bio-Filter alignment minigame.
- **Scroll Wheel**: Switch / activate special skills.

### ⌨️ Classic Keyboard Controls
| Key | Action | What It Does |
| :--- | :--- | :--- |
| **`W` / `↑`** | Throttle Forward | Moves drone forward |
| **`S` / `↓`** | Reverse / Brake | Slows down or backs up |
| **`A` / `←`** | Steer Left | Turns left; sharp turn at high speed triggers Hydro-Drift |
| **`D` / `→`** | Steer Right | Turns right; sharp turn at high speed triggers Hydro-Drift |
| **`Space`** | Hydro-Boost | High-speed engine boost (uses solar battery) |
| **`E`** | Interact | Hold near barrels to neutralize; press near pipes to clamp bio-filters |
| **`Q`** | Sonar Ping | Radial acoustic pulse that highlights hidden trash and crates on radar |
| **`F` / `Shift`** | Hydro-Dash | Quick forward warp dash |
| **`G`** | Helper Swarm | Deploys autonomous companion mini-drones that laser-collect plastic |
| **`P` / `Esc`** | Pause | Opens pause menu and settings |

---

## 🧪 Scientific Telemetry Explained (For Judges & Presenters)

Under the central Water Quality Index meter, the game displays three real-time telemetry parameters dynamically tied to the ecosystem's health:

### 1. NSF-WQI Score (National Sanitation Foundation Water Quality Index)
- **What it is:** A composite index (0 to 100) developed by water scientists that summarizes multiple water quality tests into a single readable score.
- **In the Game:** 
  - `91 - 100`: **Excellent** (crystal-clear blue water).
  - `71 - 90`: **Good (UN SDG 6 Benchmark)** (healthy target threshold).
  - `51 - 70`: **Medium** (moderate contamination).
  - `26 - 50`: **Poor** (coral reefs begin bleaching).
  - `0 - 25`: **Toxic Sludge** (brown murky water; ecosystem collapse hazard).

### 2. Dissolved Oxygen (DO)
- **What it is:** The concentration of free oxygen molecules ($O_2$) dissolved in water, measured in milligrams per liter (`mg/L`).
- **Why it matters:** Fish and marine organisms need dissolved oxygen to breathe through their gills.
- **In the Game:** Healthy water maintains DO levels above **`5.0 - 9.0 mg/L`**. When pollutants and decaying sludge consume oxygen, DO plummets below **`2.0 mg/L`**, creating a "hypoxic dead zone" where aquatic life suffocates.

### 3. Turbidity
- **What it is:** The measure of water cloudiness, haziness, or clarity caused by suspended particles, measured in Nephelometric Turbidity Units (`NTU`).
- **Why it matters:** High turbidity blocks sunlight from reaching underwater plants and coral reefs (stopping photosynthesis), clogs fish gills, and carries toxic contaminants.
- **In the Game:** Clear, clean water sits below **`5 - 10 NTU`**. Heavily polluted sewage runoff pushes turbidity past **`60 - 85 NTU`**, turning the water murky and opaque.

### 4. pH Level
- **What it is:** A measure of how acidic or basic the water is on a scale from 0 to 14 (with 7.0 being neutral).
- **Why it matters:** Freshwater and marine life thrive in a narrow neutral-alkaline window between **6.5 and 8.5**.
- **In the Game:** Industrial runoff and chemical barrels drive the pH down into acidic ranges (**6.0**), damaging fish gills and dissolving calcium carbonate in coral reefs. Purifying the water restores it to a healthy **7.4**.

---

## 💡 Gameplay Systems & Features

- **1:15 Min Mission Timer**: Each level gives you 75 seconds (1:15 min) to reach the required WQI benchmark. If the clock runs out, the mission fails, player level is decremented, and an escalating coin penalty is applied on repeated failures!
- **Level Progression Rewards**: Reaching higher player levels and clearing mission zones rewards bonus Eco-Credits to spend in the Tech Shop.
- **SDG 6 Fact Ticker**: Clean, non-intrusive banners pop up during gameplay sharing real United Nations water facts and tips.
- **Eco-Karma Metric**: Clean responsibly! Crashing into fragile coral reefs or speeding through fish schools lowers your Eco-Karma rating.
- **Full Tech Shop**:
  - `Deep Sonar Array`: Expands radar ping range.
  - `Recycling Cargo Hold`: Expands item storage before needing buoy drop-offs.
  - `Magnetic Vacuum Collector`: Draws nearby debris straight into your hold.
  - `Smart Bio-Nets`: Widens collection scoop and emits wildlife-safe acoustic cues.
  - `Photovoltaic Solar Wings`: Recharges battery in daylight and adds night-time trickle storage.
  - `Hydrofoil Engine & Hull`: Increases top speed, acceleration, and hull armor.
  - `Autonomous Helper Swarm`: Companion mini-drones that automatically collect trash.
  - `Micro-Bio Water Purifier`: Slows down ambient pollution decay.
  - `Eco-Karma Wave Cushion`: Dampens collisions to protect coral reefs and marine life.
  - `Eco-Bounty Multiplier`: Increases credit earnings on every piece of plastic recycled.
- **Skins Locker**: Unlock and equip custom boat wraps (Eco-Cyan, Cyberpunk Neon, 24K Solar Gold, Toxic Hazard Slayer, Cosmic Void).
- **Balanced Soundtrack**: In-game background music plays smoothly alongside procedural sound effects with dedicated volume sliders and mute controls in Settings.

---

## 📂 Project Structure

```text
AquaGuardian_CursorPilot_v4/
├── index.html            # Main HTML structure, HUD overlays, modals
├── audio/
│   └── game_music.mp3    # Background soundtrack
├── css/
│   └── style.css         # Cyber-eco visual styling and responsive UI
├── js/
│   ├── audio.js          # Audio engine (BGM playback + WebAudio procedural SFX)
│   ├── engine.js         # 2D canvas engine, camera follow, particles, text
│   ├── entities.js       # Player drone, debris, fish, corals, barrels, pipes, boss
│   ├── input.js          # Unified input (cursor flight, keyboard, gamepad, touch)
│   ├── levels.js         # Level missions, WQI calculations, 1:15 timer, SDG tips
│   ├── main.js           # State machine, game loop, pause/resume coordination
│   ├── save.js           # LocalStorage save manager, XP progression, achievements
│   ├── ui.js             # HUD management, telemetry calculations, modals, quiz
│   └── upgrades.js       # Tech upgrade configs, pips, and stat formulas
├── .gitignore            # Git exclusion rules
├── LICENSE               # MIT License
└── README.md             # Project documentation & pitch guide
```

---

## 📜 License

This project is licensed under the MIT License - feel free to build upon and share it for educational and non-commercial purposes.
