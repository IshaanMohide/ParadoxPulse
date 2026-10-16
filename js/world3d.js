/**
 * POLARITY // 3D World, Camera Follow & Procedural Cyber City (Three.js)
 * Features:
 *   - Smooth Dampened 3D Spring-Arm Follow Camera with Dynamic Look-Ahead
 *   - 3D Cyberpunk Metropolis with Animated Flying Hovercrafts & Skyscraper Beacons
 *   - Beveled 3D Platforms with Dynamic Real-Time Lighting & Holographic Inversion Phase
 *   - 3D Rotating Octahedron Quantum Shards & Swirling Vortex Portal
 *   - Undulating 3D Quantum Plasma Sea Floor Hazard
 */
class World3D {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // Three.js Core
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x02050b, 0.022);

        this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.1, 1000);
        this.camera.position.set(0, 5, 11);

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.15;

        // Camera Follow Dampener
        this.camTarget = new THREE.Vector3(0, 4, 11);
        this.camLookAt = new THREE.Vector3(0, 4, 0);

        // Lighting
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
        this.scene.add(this.ambientLight);

        this.dirLight = new THREE.DirectionalLight(0x00f0ff, 1.2);
        this.dirLight.position.set(10, 20, 15);
        this.scene.add(this.dirLight);

        // Groups
        this.platformsGroup = new THREE.Group();
        this.hazardsGroup = new THREE.Group();
        this.shardsGroup = new THREE.Group();
        this.padsGroup = new THREE.Group();
        this.cityGroup = new THREE.Group();
        this.hovercraftsGroup = new THREE.Group();
        this.particlesGroup = new THREE.Group();

        this.scene.add(this.platformsGroup);
        this.scene.add(this.hazardsGroup);
        this.scene.add(this.shardsGroup);
        this.scene.add(this.padsGroup);
        this.scene.add(this.cityGroup);
        this.scene.add(this.hovercraftsGroup);
        this.scene.add(this.particlesGroup);

        this.platformObjects = [];
        this.shardObjects = [];
        this.padObjects = [];
        this.laserObjects = [];
        this.hovercrafts = [];

        this.initCyberCity();
        this.initHovercrafts();
        this.initPlasmaSea();
        this.initExitPortal();
        this.initAmbientMotes();

        window.addEventListener('resize', this.onResize.bind(this));
    }

    onResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
    }

    initCyberCity() {
        // 3D Procedural Skyscrapers in Background (Z = -20 to -45)
        const towerGeo = new THREE.BoxGeometry(1, 1, 1);
        const cityMat = new THREE.MeshStandardMaterial({
            color: 0x060c18,
            roughness: 0.35,
            metalness: 0.8
        });

        for (let i = 0; i < 35; i++) {
            const tower = new THREE.Mesh(towerGeo, cityMat);
            const w = 3 + Math.random() * 5;
            const h = 18 + Math.random() * 30;
            const d = 3 + Math.random() * 5;
            const x = (i - 17) * 4.5 + (Math.random() - 0.5) * 3;
            const y = h / 2 - 8;
            const z = -18 - Math.random() * 25;

            tower.scale.set(w, h, d);
            tower.position.set(x, y, z);
            this.cityGroup.add(tower);

            // Red Aviation Beacon on Rooftops
            const beaconGeo = new THREE.SphereGeometry(0.18, 8, 8);
            const beaconMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
            const beacon = new THREE.Mesh(beaconGeo, beaconMat);
            beacon.position.set(x, y + h / 2 + 0.3, z);
            this.cityGroup.add(beacon);
        }
    }

    initHovercrafts() {
        // Flying 3D Cyber-Speeders zooming through the metropolis
        const craftGeo = new THREE.BoxGeometry(1.2, 0.35, 0.6);
        const craftMat = new THREE.MeshStandardMaterial({
            color: 0x111e38,
            metalness: 0.9,
            roughness: 0.2
        });

        for (let i = 0; i < 7; i++) {
            const craft = new THREE.Group();
            const body = new THREE.Mesh(craftGeo, craftMat);
            craft.add(body);

            // Headlight & Taillight
            const headGeo = new THREE.SphereGeometry(0.1, 8, 8);
            const headMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
            const headLight = new THREE.Mesh(headGeo, headMat);
            headLight.position.set(0.6, 0, 0);
            craft.add(headLight);

            const tailGeo = new THREE.SphereGeometry(0.1, 8, 8);
            const tailMat = new THREE.MeshBasicMaterial({ color: 0xff0055 });
            const tailLight = new THREE.Mesh(tailGeo, tailMat);
            tailLight.position.set(-0.6, 0, 0);
            craft.add(tailLight);

            craft.position.set((Math.random() - 0.5) * 70, 8 + Math.random() * 15, -12 - Math.random() * 18);
            const speed = (0.08 + Math.random() * 0.12) * (Math.random() > 0.5 ? 1 : -1);

            this.hovercraftsGroup.add(craft);
            this.hovercrafts.push({ group: craft, speed: speed });
        }
    }

    initPlasmaSea() {
        // Undulating 3D Quantum Plasma Grid Sea
        const seaGeo = new THREE.PlaneGeometry(160, 40, 60, 20);
        seaGeo.rotateX(-Math.PI / 2);

        this.plasmaMat = new THREE.MeshStandardMaterial({
            color: 0xef4444,
            emissive: 0x991b1b,
            emissiveIntensity: 0.8,
            wireframe: false,
            roughness: 0.2,
            metalness: 0.5
        });

        this.plasmaMesh = new THREE.Mesh(seaGeo, this.plasmaMat);
        this.plasmaMesh.position.set(25, -3.2, 0);
        this.hazardsGroup.add(this.plasmaMesh);

        this.plasmaVertices = seaGeo.attributes.position.array;
        this.plasmaOrigY = new Float32Array(this.plasmaVertices.length);
        for (let i = 1; i < this.plasmaVertices.length; i += 3) {
            this.plasmaOrigY[i] = this.plasmaVertices[i];
        }
    }

    initExitPortal() {
        // Swirling 3D Torus Accretion Vortex
        this.portalGroup = new THREE.Group();

        const torusGeo = new THREE.TorusGeometry(1.2, 0.16, 16, 48);
        this.portalMat = new THREE.MeshStandardMaterial({
            color: 0x00f0ff,
            emissive: 0x00f0ff,
            emissiveIntensity: 0.9,
            roughness: 0.1
        });
        this.portalTorus = new THREE.Mesh(torusGeo, this.portalMat);
        this.portalGroup.add(this.portalTorus);

        // Inner Singularity Disc
        const discGeo = new THREE.CircleGeometry(1.0, 32);
        this.discMat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.4
        });
        const disc = new THREE.Mesh(discGeo, this.discMat);
        this.portalGroup.add(disc);

        this.portalLight = new THREE.PointLight(0x00f0ff, 2.5, 8);
        this.portalGroup.add(this.portalLight);

        this.scene.add(this.portalGroup);
    }

    initAmbientMotes() {
        // 3D Floating Cyber Dust Particles
        const count = 120;
        const geom = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 80;
            positions[i + 1] = Math.random() * 25 - 4;
            positions[i + 2] = (Math.random() - 0.5) * 20;
        }

        geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.moteMat = new THREE.PointsMaterial({
            color: 0x00f0ff,
            size: 0.15,
            transparent: true,
            opacity: 0.65
        });

        this.moteParticles = new THREE.Points(geom, this.moteMat);
        this.particlesGroup.add(this.moteParticles);
    }

    setTheme(polarity) {
        const isCyan = (polarity === 'CYAN');
        const hex = isCyan ? 0x00f0ff : 0xff007f;
        const bgHex = isCyan ? 0x02050b : 0x09020d;

        this.scene.fog.color.setHex(bgHex);
        this.dirLight.color.setHex(hex);
        this.portalMat.color.setHex(hex);
        this.portalMat.emissive.setHex(hex);
        this.portalLight.color.setHex(hex);
        this.moteMat.color.setHex(hex);

        // Update Platform Phase Materials
        this.platformObjects.forEach(plat => {
            plat.updatePolarity(polarity);
        });

        // Update Laser Beams
        this.laserObjects.forEach(laser => {
            laser.updatePolarity(polarity);
        });
    }

    buildLevel(levelData, polarity) {
        // Clear old entities
        while (this.platformsGroup.children.length > 0) {
            this.platformsGroup.remove(this.platformsGroup.children[0]);
        }
        while (this.shardsGroup.children.length > 0) {
            this.shardsGroup.remove(this.shardsGroup.children[0]);
        }
        while (this.padsGroup.children.length > 0) {
            this.padsGroup.remove(this.padsGroup.children[0]);
        }
        this.platformObjects = [];
        this.shardObjects = [];
        this.padObjects = [];
        this.laserObjects = [];

        // 1. Build 3D Platforms
        levelData.platforms.forEach(p => {
            const plat = new Platform3D(p, this.platformsGroup);
            plat.updatePolarity(polarity);
            this.platformObjects.push(plat);
        });

        // 2. Build 3D Quantum Shards
        levelData.shards.forEach((s, idx) => {
            const shard = new Shard3D(s.x, s.y, idx, this.shardsGroup);
            this.shardObjects.push(shard);
        });

        // 3. Build 3D Jump Booster Pads
        levelData.pads.forEach(p => {
            const pad = new JumpPad3D(p.x, p.y, p.power, this.padsGroup);
            this.padObjects.push(pad);
        });

        // 4. Build 3D Laser Hazards
        levelData.hazards.forEach(h => {
            if (h.type === 'CYAN_LASER' || h.type === 'MAGENTA_LASER') {
                const laser = new Laser3D(h, this.hazardsGroup);
                laser.updatePolarity(polarity);
                this.laserObjects.push(laser);
            }
        });

        // Position Portal
        this.portalGroup.position.set(levelData.exit.x, levelData.exit.y, 0);
    }

    update(dt, player, polarity, anomalies) {
        // 1. Smooth Spring-Arm Camera Follow
        const lookAheadX = player.vx * 0.22;
        this.camTarget.x = player.x + lookAheadX;
        this.camTarget.y = player.y + 1.2;
        this.camTarget.z = 10.5 + Math.abs(player.vx) * 0.08;

        // Smooth Lerp Camera
        this.camera.position.x += (this.camTarget.x - this.camera.position.x) * 0.07;
        this.camera.position.y += (this.camTarget.y - this.camera.position.y) * 0.07;
        this.camera.position.z += (this.camTarget.z - this.camera.position.z) * 0.07;

        this.camLookAt.x = this.camera.position.x;
        this.camLookAt.y = this.camera.position.y - 0.4;
        this.camera.lookAt(this.camLookAt);

        // Subtle camera roll on turn + anomaly Dutch angle
        const anomRoll = (anomalies && anomalies.cameraRoll) ? anomalies.cameraRoll : 0.0;
        this.camera.rotation.z = (-player.vx * 0.003) + anomRoll;

        // 2. Animate Hovercrafts
        this.hovercrafts.forEach(h => {
            h.group.position.x += h.speed;
            if (h.group.position.x > 45) h.group.position.x = -45;
            if (h.group.position.x < -45) h.group.position.x = 45;
        });

        // 3. Animate Plasma Sea Wave Displacement
        const now = performance.now() * 0.003;
        const pos = this.plasmaMesh.geometry.attributes.position;
        const arr = pos.array;

        for (let i = 0; i < arr.length; i += 3) {
            const x = arr[i];
            const z = arr[i + 2];
            arr[i + 1] = Math.sin(now * 1.5 + x * 0.3) * 0.45 + Math.cos(now * 2.0 + z * 0.4) * 0.3;
        }
        pos.needsUpdate = true;

        // 4. Animate Moving Platforms
        this.platformObjects.forEach(p => p.update(dt));

        // 5. Animate Quantum Shards
        this.shardObjects.forEach(s => s.update(now));

        // 6. Animate Portal Vortex
        this.portalTorus.rotation.z -= dt * 1.8;
        this.portalLight.intensity = 2.0 + Math.sin(now * 3) * 0.6;

        // 7. Render 3D Scene
        this.renderer.render(this.scene, this.camera);
    }
}

/**
 * 3D Platform Entity (Extruded Deck with Holographic Lattice)
 */
class Platform3D {
    constructor(data, parentGroup) {
        this.x = data.x;
        this.y = data.y;
        this.z = 0;
        this.w = data.w;
        this.h = data.h;
        this.d = 1.4;
        this.type = data.type; // NEUTRAL, CYAN, MAGENTA
        this.moveX = data.moveX || 0;
        this.moveY = data.moveY || 0;
        this.speed = data.speed || 1;
        this.origX = data.x;
        this.origY = data.y;
        this.moveTime = Math.random() * Math.PI;

        this.group = new THREE.Group();
        this.group.position.set(this.x, this.y, 0);

        const geo = new THREE.BoxGeometry(this.w, this.h, this.d);

        // Core Solid Deck Material
        this.deckMat = new THREE.MeshStandardMaterial({
            color: 0x0f172a,
            roughness: 0.35,
            metalness: 0.8
        });

        // Neon Glow Trim Material
        this.trimMat = new THREE.MeshStandardMaterial({
            color: 0x00f0ff,
            emissive: 0x00f0ff,
            emissiveIntensity: 0.85,
            roughness: 0.2
        });

        // Holographic Wireframe Material (Inactive Phase)
        this.hologramMat = new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            wireframe: true,
            transparent: true,
            opacity: 0.2
        });

        this.mesh = new THREE.Mesh(geo, this.deckMat);
        this.group.add(this.mesh);

        // Neon Top Edge Highlight
        const topGeo = new THREE.BoxGeometry(this.w * 0.99, 0.08, this.d * 1.01);
        this.topTrim = new THREE.Mesh(topGeo, this.trimMat);
        this.topTrim.position.y = this.h / 2;
        this.group.add(this.topTrim);

        parentGroup.add(this.group);
    }

    isSolid(polarity) {
        if (this.type === 'NEUTRAL') return true;
        if (this.type === 'CYAN' && polarity === 'CYAN') return true;
        if (this.type === 'MAGENTA' && polarity === 'MAGENTA') return true;
        return false;
    }

    updatePolarity(polarity) {
        const isCyan = (polarity === 'CYAN');
        const active = this.isSolid(polarity);
        const hex = (this.type === 'MAGENTA') ? 0xff007f : 0x00f0ff;

        if (this.type === 'NEUTRAL') {
            this.mesh.material = this.deckMat;
            this.topTrim.material.color.setHex(0xffffff);
            this.topTrim.material.emissive.setHex(0xffffff);
            this.topTrim.material.emissiveIntensity = 0.5;
            this.topTrim.visible = true;
        } else {
            if (active) {
                // Fully solid neon deck
                this.mesh.material = this.deckMat;
                this.topTrim.visible = true;
                this.topTrim.material.color.setHex(hex);
                this.topTrim.material.emissive.setHex(hex);
                this.topTrim.material.emissiveIntensity = 0.9;
            } else {
                // Inactive holographic wireframe
                this.hologramMat.color.setHex(hex);
                this.mesh.material = this.hologramMat;
                this.topTrim.visible = false;
            }
        }
    }

    update(dt) {
        if (this.moveX || this.moveY) {
            this.moveTime += dt * 1.8 * this.speed;
            if (this.moveX) {
                this.x = this.origX + Math.sin(this.moveTime) * this.moveX;
            }
            if (this.moveY) {
                this.y = this.origY + Math.sin(this.moveTime) * this.moveY;
            }
            this.group.position.set(this.x, this.y, 0);
        }
    }
}

/**
 * 3D Quantum Shard (Rotating Octahedron Crystal)
 */
class Shard3D {
    constructor(x, y, id, parentGroup) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.collected = false;

        this.group = new THREE.Group();
        this.group.position.set(x, y, 0);

        // 3D Octahedron Crystal
        const geo = new THREE.OctahedronGeometry(0.38);
        this.mat = new THREE.MeshStandardMaterial({
            color: 0x00f0ff,
            emissive: 0x00f0ff,
            emissiveIntensity: 0.95,
            roughness: 0.1,
            metalness: 0.3
        });
        this.mesh = new THREE.Mesh(geo, this.mat);
        this.group.add(this.mesh);

        // Orbiting Particle Ring
        const ringGeo = new THREE.TorusGeometry(0.55, 0.025, 8, 32);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.ring = new THREE.Mesh(ringGeo, ringMat);
        this.group.add(this.ring);

        // Glow Light
        this.light = new THREE.PointLight(0x00f0ff, 1.4, 3.5);
        this.group.add(this.light);

        parentGroup.add(this.group);
    }

    update(time) {
        if (this.collected) {
            this.group.visible = false;
            return;
        }
        this.group.position.y = this.y + Math.sin(time * 2.2 + this.id) * 0.25;
        this.mesh.rotation.y = time * 1.6;
        this.mesh.rotation.x = time * 0.8;
        this.ring.rotation.x = Math.PI / 3 + time * 1.2;
        this.ring.rotation.y = time * 1.5;
    }
}

/**
 * 3D Jump Booster Pad
 */
class JumpPad3D {
    constructor(x, y, power, parentGroup) {
        this.x = x;
        this.y = y;
        this.power = power;

        this.group = new THREE.Group();
        this.group.position.set(x, y, 0);

        const geo = new THREE.BoxGeometry(1.2, 0.22, 1.2);
        const mat = new THREE.MeshStandardMaterial({
            color: 0xffaa00,
            emissive: 0xffaa00,
            emissiveIntensity: 0.85
        });
        const mesh = new THREE.Mesh(geo, mat);
        this.group.add(mesh);

        const light = new THREE.PointLight(0xffaa00, 1.5, 3.5);
        light.position.y = 0.5;
        this.group.add(light);

        parentGroup.add(this.group);
    }
}

/**
 * 3D Laser Beam Hazard
 */
class Laser3D {
    constructor(data, parentGroup) {
        this.x = data.x;
        this.y = data.y;
        this.w = data.w;
        this.h = data.h;
        this.type = data.type; // CYAN_LASER, MAGENTA_LASER

        this.group = new THREE.Group();
        this.group.position.set(this.x, this.y, 0);

        const geo = new THREE.CylinderGeometry(0.12, 0.12, this.h, 16);
        const isCyan = (this.type === 'CYAN_LASER');
        this.hex = isCyan ? 0x00f0ff : 0xff007f;

        this.mat = new THREE.MeshStandardMaterial({
            color: this.hex,
            emissive: this.hex,
            emissiveIntensity: 1.0,
            transparent: true,
            opacity: 0.85
        });

        this.mesh = new THREE.Mesh(geo, this.mat);
        this.mesh.position.y = this.h / 2;
        this.group.add(this.mesh);

        parentGroup.add(this.group);
    }

    updatePolarity(polarity) {
        const isCyan = (polarity === 'CYAN');
        const isSafe = (this.type === 'CYAN_LASER' && isCyan) || (this.type === 'MAGENTA_LASER' && !isCyan);
        this.mat.opacity = isSafe ? 0.2 : 0.9;
        this.mat.emissiveIntensity = isSafe ? 0.25 : 1.2;
    }
}

window.World3D = World3D;
