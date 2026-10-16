# POLARITY 3D: AI Camera Inversion Platformer

> **Hackathon Entry:** Open Forge Hackathon  
> **Theme:** **INVERSION** — Flipping or reversing something normally taken for granted.  
> **Tech Stack:** Three.js (3D WebGL), Modern ES6+ JavaScript, Web Audio API, Google MediaPipe Pose AI (Web), Pygame + OpenCV (Python Edition).

![Game Banner](assets/banner.jpg)
![Camera Gesture Demo](assets/camera_gesture_demo.jpg)

---

## 🎮 Play Immediately in Browser

Simply open [`game.html`](file:///e:/Open%20Forge%20Hackathon/game.html) in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Apple Safari).
*No build steps, no package managers, and zero installations required!*

Or view via local server: `http://localhost:8080/game.html`

Allow camera access when prompted to experience real-time gesture control with live 3D perspective and skeletal tracking!

---

## 📷 Smooth Camera Gesture Inversion Controls

Experience the hackathon **Inversion** theme through physical body gestures tracked live via your webcam:

| Physical Gesture | Camera Action | Inverted In-Game Result |
| :--- | :--- | :--- |
| **Raise Left Hand** | Left wrist elevated above shoulder | **Moves Character to the RIGHT ❯** |
| **Raise Right Hand** | Right wrist elevated above shoulder | **❮ Moves Character to the LEFT** |
| **Sit Down / Squat** | Torso / shoulder drops below baseline | **JUMP ⬆️ (Away from surface)** |
| **Raise Both Hands** | Both wrists raised high above head | **REALITY SHIFT (Cyan $\leftrightarrow$ Magenta)** |

*Keyboard Fallback:*
- `A` / `ArrowLeft`: Move Right (Inverted)
- `D` / `ArrowRight`: Move Left (Inverted)
- `W` / `Space`: Jump
- `Shift` / `E`: Reality Phase Shift
- `C` / `J`: Dash Burst
- `R`: Quick Respawn

---

## ⚙️ Camera Sensitivity Controls & Calibration (`js/settings.js`)

Click the **`[⚙️ SENSITIVITY]`** button in the HUD or Camera panel to fine-tune your tracking in real-time:

- **⬇️ Squat / Sit-Down Depth Slider (`0.04 - 0.16`)**:
  - Adjusts how far down you need to dip or squat to trigger a jump.
  - High sensitivity allows quick shallow desk dips to jump effortlessly.
  - *Live Visual Feedback:* The yellow/orange trigger line in the camera mirror moves up and down dynamically as you drag the slider!
- **🖐️ Hand Raise Height Slider (`0.02 - 0.10`)**:
  - Adjusts how high above your shoulder you must elevate your wrist to trigger inverted horizontal running.
- **🌊 Steering Smoothness Slider (`0.08 - 0.40`)**:
  - Tune between cinematic silky-smooth inertia and instant esports twitch responsiveness.
- **🎯 One-Click Neutral Calibrate**:
  - Calibrates your sitting or standing height in 1 second.
- **Persistent Memory**:
  - All sensitivities are automatically saved to browser `localStorage` and persist across sessions.

---

## 🌀 Matrix Unpredictability & Procedural Anomalies (`js/anomalies.js`)

Rather than predictable static patterns, the Reality Inversion Matrix introduces dynamic, unexpected procedural quantum events:

- **🌌 Gravitational Flux (Micro-Gravity Waves)**: Gravity drops to $28\%$, allowing celestial soaring leaps across massive chasms!
- **⏱️ Temporal Dilation (Matrix Bullet-Time)**: Reality matrix slows to $45\%$ speed for 4.5 seconds with pitch-shifted audio synthesis!
- **💨 Ion Crosswinds**: Energetic solar winds generate lateral kinetic forces, requiring you to physically lean or raise opposing hands to stabilize!
- **⚡ Reality Phase Instability**: Distant platforms momentarily flicker between polarities, testing your reflexes!
- **👾 Quantum Glitch Sentinels**: Autonomous 3D neon orbs patrol platforms, pulsing energy fields!
- **Mode Selector**: Choose your desired unpredictability: **`CHILL`** (calm & rare), **`NORMAL`** (balanced), or **`CHAOS`** (frequent high-intensity events)!

---

## 🏃 Proportional Variable Jump Realism (`js/player3d.js`)

- **Physical Depth = Kinetic Power**:
  - A quick, shallow dip produces a short, controlled hop.
  - A deep, explosive physical squat launches your cyber-runner with up to **$+35\%$ vertical boost**!
- **Autonomous 3D Head Tracking**:
  - The runner's head and glowing visor pupil autonomously track nearby Quantum Shards and glance along jump trajectories in real-time!
- **3D Ground Dust Particles**:
  - Hard landings and thruster boosts kick up 3D directional dust clouds with physical particle decay.

---

## 🌐 3D WebGL Graphics & Rich Animations (Three.js)

1. **3D Articulated Cybernetic Runner (`js/player3d.js`):**
   - 3D skeletal hierarchy with inverse kinematics running stride cycle (front leg swings, knee flexes, back leg drives).
   - Dynamic boot thrusters emitting particle flares on jump takeoff and jump booster pads.
   - 3D **Squash & Stretch** matrix elasticity upon takeoff ($0.72 \times 1.38$), mid-air apex, and ground landing impact ($1.35 \times 0.65$).
   - 3D **Verlet Physics Cape/Scarf**: Dynamic 3D ribbon with 7 physics nodes trailing behind the runner, twisting and fluttering in 3D air currents.
2. **Smooth 3D Spring-Arm Camera Follow (`js/world3d.js`):**
   - Smooth lerp camera tracking with dynamic look-ahead in the direction of movement.
   - Subtle camera roll/tilt during direction turns and dynamic FOV expansion during high-speed leaps.
3. **3D Cyberpunk Metropolis Environment:**
   - Over 35 procedural 3D skyscrapers in the background with glowing window grids and flashing red aviation beacons.
   - Autonomous 3D flying cyber-speeders traversing the skyline with trailing headlights and taillights.
   - Beveled 3D platforms that shift phases: solid glowing cyber-decks in active phase vs. shimmering holographic wireframe in inactive phase.
   - Rotating 3D octahedron Quantum Shards with dual counter-rotating particle rings.
   - Undulating 3D quantum plasma grid sea with dynamic wave vertex displacement.

---

## 🤖 Which APIs are Used & API Key Cost Analysis

You asked: **"which api u need for this and tell which api keys are free for this"**

### 1. Google MediaPipe Pose API (Recommended & Implemented)
- **What it does:** Detects 33 high-precision 3D skeletal landmarks (shoulders, elbows, wrists, hips, knees) in real-time.
- **API Key Required:** **NONE (0 keys needed)**.
- **Cost:** **100% FREE forever**. It is an open-source library created by Google Research (Apache 2.0 license).
- **Execution:** Runs **100% on-device** directly in your browser using WebAssembly (WASM) and WebGL GPU acceleration.
- **Why it is superior:** 0 millisecond cloud roundtrip latency, completely private (video never leaves your device), and never hits rate limits or monthly billing caps.

### 2. W3C MediaStream Camera API (`navigator.mediaDevices.getUserMedia`)
- **What it does:** Connects directly to your webcam and captures live video frames.
- **API Key Required:** **NONE**.
- **Cost:** **100% FREE** — Built directly into modern web browsers as a universal web standard.

### 3. Comparison with Cloud Vision APIs (Why NOT to use them for games):
| Feature | Google MediaPipe Pose (Used) | Cloud Vision APIs (AWS Rekognition / Google Cloud Vision) |
| :--- | :--- | :--- |
| **API Key Needed?** | **NO (None)** | YES (Requires API Key & Cloud Account) |
| **Free Tier Limit?** | **Unlimited (Forever Free)** | ~1,000 requests/month (Runs out in 20 seconds at 60 FPS!) |
| **Network Latency** | **0 ms (Instant 60 FPS)** | 200 ms – 500 ms (Unplayable lag for jumping) |
| **Cost at 60 FPS** | **$0.00 / month** | Over $100+ per hour of streaming frames! |

---

## 📁 Clean Modular Architecture

```
Open Forge Hackathon/
├── game.html                  # 3D Master Web Application
├── css/
│   └── cyberpunk.css          # Glassmorphism HUD, animated badges, and modal themes
├── js/
│   ├── audio.js               # Procedural Web Audio API synthesizer & arpeggiator
│   ├── pose_tracker.js        # Multi-layer EMA smoothed MediaPipe Pose AI engine
│   ├── player3d.js            # Articulated 3D cyber runner, Verlet cape & kinematics
│   ├── world3d.js             # Three.js 3D world, spring camera, city & platforms
│   └── game.js                # Core game loop & 5 handcrafted 3D sectors
├── camera_inversion_game.py   # Standalone Python Edition (Pygame + OpenCV + MediaPipe)
├── requirements.txt           # Python dependencies
├── PRESENTATION.md            # Comprehensive concept deck & technical presentation
├── README.md                  # Project overview & documentation
└── assets/
    ├── banner.jpg             # Artwork visual
    └── camera_gesture_demo.jpg # Camera AI tracking visual
```
