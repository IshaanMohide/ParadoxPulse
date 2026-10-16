# POLARITY 3D: Realm of Inversion
## Official Hackathon Concept Presentation & Technical Architecture Document

![POLARITY Cover Art](assets/banner.jpg)
![Camera Inversion Tracking](assets/camera_gesture_demo.jpg)

**Hackathon Theme:** **INVERSION**  
**Game Title:** *POLARITY 3D: Realm of Inversion*  
**Platform:** 3D WebGL (Three.js / Modern ES6+ JavaScript / Web Audio API / Google MediaPipe Pose AI)  
**Deliverables:** Playable 3D Web Game (`game.html`), Modular System (`js/`, `css/`), Python Standalone Edition (`camera_inversion_game.py`), Concept Presentation (`PRESENTATION.md`)  

---

## 1. Executive Summary

In traditional 2D platformers, three core axioms are taken for granted:
1. **Directional Intuition:** Pressing Right moves Right; pressing Up or Space jumps.
2. **Gravitational Constancy:** Gravity always pulls downward; the floor is security, and pits are death.
3. **World Constancy:** Solid objects stay solid; enemies are hazards to be avoided or stomped from above.

*Super Invertio: Realm of Inversion* flips each of these axioms on their head. Rather than treating **Inversion** as a superficial cosmetic theme or a single inverted button trick, we designed a **Triple Inversion System** woven deeply into controls, physics, and world rules:
- **Cognitive Inversion:** Flipped control axes demand active mental focus and synaptic plasticity.
- **Spatial / Gravitational Inversion:** Dynamic, reversible gravity vectors allow players to flip reality mid-flight, turning ceilings into floors and opening vertical pathways.
- **Dimensional / Rule Inversion:** Dual realities (**Sol Realm** vs **Umbra Realm**) where platforms phase between tangible matter and ethereal light, and enemies transform from deadly hazards into springboards.

---

## 2. Interpretation of the Hackathon Theme: "INVERSION"

> *"The challenge isn't just a gimmick: a simple game with a clever, well-executed inversion mechanic beats a bigger game where the theme is only decorative."* — Hackathon Brief

### Why Inversion is the Core Architecture:
Many games incorporate inversion as a momentary debuff (e.g., "confused" status effects). In *Super Invertio*, inversion is the **foundational medium of progression**:

```
                       ┌─────────────────────────────────────────┐
                       │            THE INVERSION TRIAD          │
                       └──────────────────┬──────────────────────┘
                                          │
         ┌────────────────────────────────┼────────────────────────────────┐
         ▼                                ▼                                ▼
┌──────────────────┐            ┌──────────────────┐            ┌──────────────────┐
│    COGNITIVE     │            │     SPATIAL      │            │   DIMENSIONAL    │
│    INVERSION     │            │    INVERSION     │            │    INVERSION     │
├──────────────────┤            ├──────────────────┤            ├──────────────────┤
│ • Right = Left   │            │ • Gravity Vector │            │ • Sol Realm (Day)│
│ • Left = Right   │            │   (g = +1 / -1)  │            │ • Umbra Realm    │
│ • Down = Jump    │            │ • Ceiling Walk   │            │   (Synthwave)    │
│ • Up = Flip Grav │            │ • Kinetic Camera │            │ • Enemy Role     │
│                  │            │   Roll           │            │   Reversal       │
└──────────────────┘            └──────────────────┘            └──────────────────┘
```

1. **Mind Rewiring (Cognitive):** Moving right requires pressing left; jumping requires pressing down. The player must actively fight muscle memory, creating an engaging cognitive flow state.
2. **Kinematic Rewiring (Spatial):** Players possess an **Inversion Battery** (3 rechargable energy cells). Tapping `[UP]` or `[W]` reverses gravity instantly. Ceilings become walkable surfaces; pits become ceiling barriers; coin paths split into high-altitude and low-altitude routes.
3. **Reality Rewiring (Dimensional):** Tapping `[SHIFT]` shifts the dimension between the golden **Sol Realm** and the cybernetic **Umbra Realm**. Solid brick bridges in Sol turn into intangible ghost blocks in Umbra, while neon cyan platforms materialize from void space. Enemies who hurt you in Sol turn into friendly trampolines in Umbra.

---

## 3. Core Gameplay Mechanics

### 3.1 Control Mapping
| Action | Primary Key | Alternate Key | Inversion Description |
| :--- | :--- | :--- | :--- |
| **Move Left** | `ArrowRight` | `D` | **Flipped:** Right input accelerates character to the left. |
| **Move Right** | `ArrowLeft` | `A` | **Flipped:** Left input accelerates character to the right. |
| **Jump** | `ArrowDown` | `S` | **Flipped:** Downward input impulses character away from current surface. |
| **Flip Gravity** | `ArrowUp` | `W` / Touch `[▲]` | **Active Inversion:** Flips gravity polarity between downward ($+g$) and ceiling ($-g$). |
| **Realm Shift** | `Shift` | `E` / `Q` / Touch `[★]` | **Rule Inversion:** Shifts between Sol (Light) and Umbra (Dark) dimensions. |
| **Restart** | `R` | `Space` (on death) | Quick instant-respawn loop. |

### 3.2 Dynamic Gravity Physics
- **Reversible Vector Physics:**
  $$\vec{g}(t) = \text{gravDir} \cdot 1500 \text{ px/s}^2 \quad (\text{gravDir} \in \{+1, -1\})$$
- When $\text{gravDir} = -1$:
  - Ceilings act as solid ground floors.
  - Downward jump input fires Mario toward the floor.
  - Running kicks dust **upward** toward the ceiling.
  - Player sprite smoothly interpolates across $180^\circ$ of rotation ($\theta \to \pi$).
  - Camera applies a subtle kinetic roll ($\pm 4^\circ$) and vertical re-centering.

### 3.3 The Inversion Multiplier & Scoring
- **Normal Coin:** $+50$ points.
- **Inverted Coin:** $+100$ points (collected while walking on the ceiling or in mid-air antigravity).
- **Invert Stomp Combo:** Stomping an enemy while upside-down builds an **INVERSION MULTIPLIER** ($x2, x3, x4$), yielding up to $+800$ points per chain!
- **Gravity Rifts ($R$):** Swirling vortex portals scattered across levels that automatically recharge the player's battery, flip gravitational polarity, and slingshot the character across deep chasms.

---

## 4. Hand-Crafted Level Progression

The game features three distinct stages designed to teach, test, and master the inversion systems:

1. **Stage 1-1: *Mind Flip (The Genesis)***
   - Introduces inverted control navigation and the Down-Key jump.
   - Paces introductory ceiling runs over spike pits.
   - Features the first mid-air Gravity Rift ($R$) and celebratory victory flagpole.
2. **Stage 1-2: *Antigravity Cavern***
   - A deep subterranean biome with alternating ceiling stalactites and bottomless chasms.
   - Requires continuous ceiling/floor gravity hopping to navigate narrow laser corridors.
   - High-altitude secret coin vaults rewarding brave gravity flips.
3. **Stage 1-3: *The Mirror Realm (Umbra Shifting)***
   - The ultimate synthesis: Gravity Inversion combined with Dimension Shifting (`Sol` $\leftrightarrow$ `Umbra`).
   - Features alternating phantom bridges where players must shift reality mid-air to land on tangible platforms.
   - Finish at the majestic Inversion Castle with triumphant procedural fanfare.

---

## 5. Visual Art, Aesthetics & Kinetic Animation

Designed strictly according to the modern web aesthetics guidelines:
- **Typography:** Google Fonts `'Press Start 2P'` (arcade titles & numbers) and `'Outfit'` (modern glassmorphism HUD).
- **2.5D Isometric Extrusion:** All ground, brick, and mystery blocks are procedurally rendered with 3D depth geometry ($8\text{px}$ extrusion depth) and dynamic lighting bevels.
- **Kinetic Squash & Stretch:** Elastic procedural deformation applied dynamically to the player and enemies upon jump takeoff ($\text{scale}_x=0.7, \text{scale}_y=1.35$), ceiling impact, landing, and stomps.
- **Chromatic Aberration & Screen Juice:**
  - Dynamic RGB split distortion shader effect during gravity flips and realm shifts.
  - Directional screen shake with exponential decay ($shk \cdot 22\text{px}$).
  - Ghost afterimage trails matching realm polarity (Golden Pink in Sol, Electric Cyan in Umbra).
  - Volumetric particles: expanding shockwave rings, dust puffs, coin sparkles, and floating combat text (`"GRAVITY INVERTED!"`, `"WARP RIFT!"`, `"INVERT COMBO x3!"`).
- **Parallax Dual-Realm Background:**
  - 4-layer parallax with animated sun, corona flares, and lush hills in the Sol Realm.
  - Transforms into a neon cyberpunk synthwave grid with glowing cyber-stars and nebulae in the Umbra Realm.

---

## 6. Procedural Web Audio Engine (Zero External Dependencies)

To guarantee 100% universal compatibility and zero external loading latency, the entire soundscape is generated algorithmically via the **Web Audio API**:

```
[Web Audio Engine]
  ├── Procedural BGM Sequencer
  │     ├── 16-Step Melodic Lead (Square/Sawtooth Wave)
  │     ├── 16-Step Bassline (Triangle Wave)
  │     └── Noise Drum Engine (Highpass-filtered white noise buffer)
  │     └── [Adaptive Realm Shifting: C-Major (Sol) ⇄ Eb-Minor Synthwave (Umbra)]
  │
  └── Algorithmic SFX Synthesizer
        ├── Jump SFX (Exponential pitch slide 160Hz → 460Hz)
        ├── Gravity Flip SFX (Sub-bass drop 600Hz → 60Hz + noise whoosh)
        ├── Realm Shift SFX (Dual counter-sliding sine oscillators)
        ├── Coin Collect SFX (Crystal dual-tone arpeggio: 987Hz & 1318Hz)
        ├── Stomp SFX (Transient punch with low-end impact)
        └── Victory Fanfare (7-note polyphonic triumphal arpeggio)
```

---

## 7. Technical Implementation & Architecture

- **Technology Stack:** Pure Vanilla HTML5, CSS3, JavaScript (ES6+), Canvas 2D API, Web Audio API.
- **Zero Third-Party Bundlers:** Zero npm build steps, zero node dependencies, zero external image or sound assets required to play. Double-click `game.html` and it runs at a solid 60FPS in any modern browser.
- **Subpixel Collision Detection:** Deterministic Axis-Aligned Bounding Box (AABB) collision with subpixel velocity integration and delta-time capping ($\Delta t \le 0.033\text{s}$).
- **Platform Inclusivity:** Responsive layout that preserves a crisp 2:1 aspect ratio across desktop monitors, laptops, and mobile screens. Includes a built-in virtual gamepad for mobile/touchscreen players.
- **Interactive In-Game Presentation Modal:** Includes a 5-slide interactive presentation deck embedded directly inside the game executable, accessible via the `[📑 PRESENTATION]` button in the HUD and main menu.

---

## 8. Presentation Slide Deck Script (For Judges)

### Slide 1: Concept & The Inversion Triad
> *"Judges, Super Invertio isn't just about turning one control around. It explores what happens when you flip the fundamental physics and expectations of video games: your mind must invert its reflexes, your character must invert gravity, and your world must invert its physical reality."*

### Slide 2: Mechanics & Game Feel
> *"We built responsive mechanics: coyote time, input buffering, and 3 rechargeable gravity cells. Flipping gravity lets you walk on the ceiling, collect inverted bonus coins, and bypass deadly ground obstacles. By pressing Shift, the Sol realm turns into the Umbra realm, turning deadly enemies into springboards and solid blocks into ethereal passages."*

### Slide 3: Visual & Audio Craftsmanship
> *"Every visual element is rendered procedurally with 2.5D block extrusions, chromatic aberration shaders, squash-and-stretch body kinematics, and dual-realm parallax skies. The audio engine is 100% synthesized in Web Audio with adaptive music that modulates key when you shift dimensions."*

### Slide 4: Delivery & Completeness
> *"We deliver a complete, 3-stage game with touch controls, high scores, procedural sound, and an embedded interactive presentation deck. It requires zero setup: double-click `game.html` and play immediately."*

---

## 9. AI Camera Vision Architecture & Inversion Gestures

```
                    ┌──────────────────────────────────────────────┐
                    │          LIVE WEBCAM INPUT STREAM            │
                    │   (Standard W3C getUserMedia - 100% Free)    │
                    └──────────────────────┬───────────────────────┘
                                           │ (Video Frames)
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │       GOOGLE MEDIAPIPE POSE ESTIMATION       │
                    │    (33 3D Keypoints • On-Device WASM/GPU)    │
                    │    (100% Free • Open-Source • Zero Keys)     │
                    └──────────────────────┬───────────────────────┘
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         ▼                                 ▼                                 ▼
┌──────────────────┐             ┌──────────────────┐              ┌──────────────────┐
│  LEFT WRIST UP   │             │  RIGHT WRIST UP  │              │ TORSO DROPS DOWN │
│  (lm[15] < y_sh) │             │  (lm[16] < y_sh) │              │ (Squat / Sit)    │
├──────────────────┤             ├──────────────────┤              ├──────────────────┤
│ INVERTED ACTION: │             │ INVERTED ACTION: │              │ INVERTED ACTION: │
│ MOVE RIGHT ❯❯    │             │ ❮❮ MOVE LEFT     │              │ JUMP UPWARD ⬆️   │
└──────────────────┘             └──────────────────┘              └──────────────────┘
```

### 9.1 Technical API & Key Breakdown
- **Question:** *Which APIs are needed and which API keys are free?*
- **Answer:**
  1. **Google MediaPipe Pose API:** Zero API keys required. 100% free and open-source under Apache 2.0. Runs entirely on-device via WebAssembly (WASM) and WebGL GPU acceleration.
  2. **W3C MediaStream Camera API:** Built directly into web browsers. Zero API keys, zero external network traffic, zero cost.
  3. **Why Cloud APIs (AWS Rekognition / Google Cloud Vision) are NOT used:** Cloud APIs incur per-frame costs and introduce 200–500ms network roundtrip lag. Streaming 60 FPS would cost hundreds of dollars per hour and exceed free quotas in seconds. On-device MediaPipe has **0 ms network latency** and is **100% free forever with unlimited usage**.

---

## 10. Multi-Language Code Architecture

To offer complete technical flexibility, the project delivers two complete codebases:
1. **Web Platform (`game.html`):** Native HTML5 Canvas + ES6+ JavaScript + MediaPipe Pose + Web Audio API. Runs immediately in any browser with zero installation.
2. **Python Platform (`camera_inversion_game.py`):** Standalone Python edition utilizing Pygame, OpenCV (`cv2`), and MediaPipe Pose, complete with `requirements.txt`.

---

*Developed with passion for the Open Forge Hackathon.*

