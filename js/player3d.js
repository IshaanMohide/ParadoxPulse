/**
 * POLARITY // 3D Articulated Cyber-Runner (Enhanced with Realism & Head Tracking)
 * Features:
 *   - Proportional Variable Jump Physics
 *   - Autonomous 3D Head Tracking (looks at nearby shards, hazards, and trajectory)
 *   - Reactive Visor HUD (scans, alerts, and dynamic eye sensor)
 *   - 3D Verlet Physics Ribbon Cape / Scarf with Perlin Wind Turbulence
 *   - 3D Landing Dust & Thruster Flare Particle Spawns
 */
class Player3D {
    constructor(scene) {
        this.scene = scene;

        // Kinematic State
        this.x = 2.0;
        this.y = 4.0;
        this.z = 0.0;
        this.w = 0.9;
        this.h = 1.8;
        this.d = 0.6;

        this.vx = 0.0;
        this.vy = 0.0;
        this.speed = 10.5;
        this.accel = 1.8;
        this.friction = 0.86;
        this.baseGravity = -0.56;
        this.gravity = -0.56;
        this.jumpPower = 13.8;
        this.grounded = false;
        this.coyoteTimer = 0;
        this.facing = 1;
        this.isBraking = false;

        // Animation cycles
        this.runCycle = 0.0;
        this.idleCycle = 0.0;
        this.squashX = 1.0;
        this.squashY = 1.0;
        this.squashZ = 1.0;
        this.tiltAngle = 0.0;

        // Head tracking target angles
        this.headTargetRotY = 0;
        this.headTargetRotX = 0;

        // 3D Verlet Scarf / Cape (7 nodes)
        this.scarfNodes = [];
        for (let i = 0; i < 7; i++) {
            this.scarfNodes.push({
                x: this.x - i * 0.2,
                y: this.y + 0.8,
                z: 0.0,
                ox: this.x - i * 0.2,
                oy: this.y + 0.8,
                oz: 0.0
            });
        }

        // Particle Emitter for Dust & Thrusters
        this.dustParticles = [];
        this.dustGroup = new THREE.Group();
        this.scene.add(this.dustGroup);

        this.initMesh();
    }

    initMesh() {
        this.rootGroup = new THREE.Group();
        this.bodyGroup = new THREE.Group();
        this.rootGroup.add(this.bodyGroup);

        const cyanColor = 0x00f0ff;
        this.themeColor = cyanColor;

        this.armorMat = new THREE.MeshStandardMaterial({
            color: 0x0f172a,
            roughness: 0.3,
            metalness: 0.85
        });

        this.darkMat = new THREE.MeshStandardMaterial({
            color: 0x090e17,
            roughness: 0.5,
            metalness: 0.7
        });

        this.neonMat = new THREE.MeshBasicMaterial({ color: cyanColor });
        this.glowMat = new THREE.MeshStandardMaterial({
            color: cyanColor,
            emissive: cyanColor,
            emissiveIntensity: 0.85,
            roughness: 0.2
        });

        // 1. TORSO
        const torsoGeo = new THREE.BoxGeometry(0.7, 0.75, 0.4);
        this.torsoMesh = new THREE.Mesh(torsoGeo, this.armorMat);
        this.torsoMesh.position.y = 0.85;
        this.bodyGroup.add(this.torsoMesh);

        // Neon Belt
        const trimGeo = new THREE.BoxGeometry(0.72, 0.1, 0.42);
        const trimMesh = new THREE.Mesh(trimGeo, this.glowMat);
        trimMesh.position.y = 0.75;
        this.bodyGroup.add(trimMesh);

        // 2. QUANTUM REACTOR CORE
        const coreGeo = new THREE.SphereGeometry(0.14, 16, 16);
        this.coreMesh = new THREE.Mesh(coreGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }));
        this.coreMesh.position.set(0, 0.9, 0.21);
        this.bodyGroup.add(this.coreMesh);

        this.coreLight = new THREE.PointLight(cyanColor, 1.8, 4.5);
        this.coreLight.position.set(0, 0.9, 0.35);
        this.bodyGroup.add(this.coreLight);

        // 3. HEAD & CYBER VISOR
        this.headGroup = new THREE.Group();
        this.headGroup.position.y = 1.45;

        const helmetGeo = new THREE.BoxGeometry(0.42, 0.42, 0.42);
        const helmetMesh = new THREE.Mesh(helmetGeo, this.armorMat);
        this.headGroup.add(helmetMesh);

        // Visor Bar
        const visorGeo = new THREE.BoxGeometry(0.44, 0.12, 0.25);
        this.visorMesh = new THREE.Mesh(visorGeo, this.glowMat);
        this.visorMesh.position.set(0, 0.02, 0.14);
        this.headGroup.add(this.visorMesh);

        // Scanning Pupil Indicator
        const pupilGeo = new THREE.BoxGeometry(0.08, 0.08, 0.02);
        this.pupilMesh = new THREE.Mesh(pupilGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }));
        this.pupilMesh.position.set(0, 0.02, 0.26);
        this.headGroup.add(this.pupilMesh);

        // Antenna Crest
        const crestGeo = new THREE.BoxGeometry(0.06, 0.15, 0.35);
        const crestMesh = new THREE.Mesh(crestGeo, this.glowMat);
        crestMesh.position.set(0, 0.24, -0.05);
        this.headGroup.add(crestMesh);

        this.bodyGroup.add(this.headGroup);

        // 4. ARTICULATED ARMS
        this.leftArmGroup = this.createArm(true);
        this.rightArmGroup = this.createArm(false);
        this.bodyGroup.add(this.leftArmGroup);
        this.bodyGroup.add(this.rightArmGroup);

        // 5. ARTICULATED LEGS & BOOTS
        this.leftLegGroup = this.createLeg(true);
        this.rightLegGroup = this.createLeg(false);
        this.bodyGroup.add(this.leftLegGroup);
        this.bodyGroup.add(this.rightLegGroup);

        // 6. 3D VERLET CAPE / SCARF MESH
        this.initCapeMesh();

        this.scene.add(this.rootGroup);
    }

    createArm(isLeft) {
        const arm = new THREE.Group();
        arm.position.set(isLeft ? -0.45 : 0.45, 1.15, 0);

        const shoulderGeo = new THREE.SphereGeometry(0.1, 12, 12);
        const shoulder = new THREE.Mesh(shoulderGeo, this.glowMat);
        arm.add(shoulder);

        const upperGeo = new THREE.CylinderGeometry(0.07, 0.06, 0.38, 8);
        const upper = new THREE.Mesh(upperGeo, this.armorMat);
        upper.position.y = -0.19;
        arm.add(upper);

        const foreGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.36, 8);
        const fore = new THREE.Mesh(foreGeo, this.darkMat);
        fore.position.y = -0.52;
        arm.add(fore);

        return arm;
    }

    createLeg(isLeft) {
        const leg = new THREE.Group();
        leg.position.set(isLeft ? -0.22 : 0.22, 0.5, 0);

        const thighGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.42, 8);
        const thigh = new THREE.Mesh(thighGeo, this.armorMat);
        thigh.position.y = -0.21;
        leg.add(thigh);

        const shinGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.42, 8);
        const shin = new THREE.Mesh(shinGeo, this.darkMat);
        shin.position.y = -0.55;
        leg.add(shin);

        const bootGeo = new THREE.BoxGeometry(0.18, 0.12, 0.34);
        const boot = new THREE.Mesh(bootGeo, this.armorMat);
        boot.position.set(0, -0.78, 0.06);
        leg.add(boot);

        const soleGeo = new THREE.BoxGeometry(0.19, 0.03, 0.35);
        const sole = new THREE.Mesh(soleGeo, this.glowMat);
        sole.position.set(0, -0.84, 0.06);
        leg.add(sole);

        return leg;
    }

    initCapeMesh() {
        const numSegments = this.scarfNodes.length - 1;
        const geom = new THREE.BufferGeometry();
        const positions = new Float32Array((numSegments + 1) * 2 * 3);
        geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const indices = [];
        for (let i = 0; i < numSegments; i++) {
            const a = i * 2;
            const b = i * 2 + 1;
            const c = (i + 1) * 2;
            const d = (i + 1) * 2 + 1;
            indices.push(a, b, c);
            indices.push(b, d, c);
        }
        geom.setIndex(indices);
        geom.computeVertexNormals();

        this.capeMat = new THREE.MeshStandardMaterial({
            color: this.themeColor,
            emissive: this.themeColor,
            emissiveIntensity: 0.65,
            side: THREE.DoubleSide,
            roughness: 0.35
        });

        this.capeMesh = new THREE.Mesh(geom, this.capeMat);
        this.scene.add(this.capeMesh);
    }

    setTheme(polarity) {
        const isCyan = (polarity === 'CYAN');
        const hex = isCyan ? 0x00f0ff : 0xff007f;
        this.themeColor = hex;

        this.glowMat.color.setHex(hex);
        this.glowMat.emissive.setHex(hex);
        this.neonMat.color.setHex(hex);
        this.coreLight.color.setHex(hex);
        this.capeMat.color.setHex(hex);
        this.capeMat.emissive.setHex(hex);

        // Spawn 3D Shockwave pulse
        this.spawnDust(this.x, this.y + 0.9, 16, hex);
    }

    jump(powerMultiplier = 1.0) {
        if (this.grounded || this.coyoteTimer > 0) {
            this.vy = this.jumpPower * powerMultiplier;
            this.grounded = false;
            this.coyoteTimer = 0;
            this.squashX = 0.72;
            this.squashY = 1.38;
            this.squashZ = 0.72;

            // Spawn 3D thruster smoke & sparks
            this.spawnDust(this.x, this.y, 10, this.themeColor);
            return true;
        }
        return false;
    }

    spawnDust(x, y, count, colorHex) {
        const geo = new THREE.SphereGeometry(0.08, 6, 6);
        const mat = new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 0.8 });

        for (let i = 0; i < count; i++) {
            const p = new THREE.Mesh(geo, mat);
            p.position.set(x + (Math.random() - 0.5) * 0.4, y, (Math.random() - 0.5) * 0.4);
            const vx = (Math.random() - 0.5) * 3.0;
            const vy = 0.5 + Math.random() * 2.0;
            this.dustGroup.add(p);
            this.dustParticles.push({ mesh: p, vx, vy, life: 0.45, maxLife: 0.45 });
        }
    }

    update(dt, steerInput, platforms, polarity, anomalyModifiers, nearbyShards = []) {
        const gravMod = anomalyModifiers ? anomalyModifiers.gravityMultiplier : 1.0;
        const wind = anomalyModifiers ? anomalyModifiers.windForce : 0.0;
        this.gravity = this.baseGravity * gravMod;

        // Anomaly modifiers: speed, gravity, wind, and perception inversion
        if (anomalyModifiers && anomalyModifiers.steerInvert) {
            steerInput = -steerInput;
        }
        const speedMod = (anomalyModifiers && anomalyModifiers.speedMultiplier) ? anomalyModifiers.speedMultiplier : 1.0;
        const maxV = this.speed * speedMod;
        const currentAccel = this.accel * (speedMod > 1.0 ? 1.3 : 1.0);

        // Horizontal Steering: Active Run vs Instant Stop when Hand is Down
        if (Math.abs(steerInput) > 0.05) {
            this.vx += steerInput * currentAccel;
            this.facing = steerInput > 0 ? 1 : -1;
            this.isBraking = false;
        } else {
            // When hand is taken down: STOP FIRMLY AT THE EXACT PLACE, DO NOT GLIDE FORWARD!
            if (this.grounded) {
                if (Math.abs(this.vx) > 1.2) {
                    this.isBraking = true;
                    if (Math.random() < 0.4) {
                        this.spawnDust(this.x, this.y, 2, 0xffffff);
                    }
                } else {
                    this.isBraking = false;
                }
                this.vx *= 0.15; // Aggressive instant brake
                if (Math.abs(this.vx) < 0.1) {
                    this.vx = 0.0;
                    this.isBraking = false;
                }
            } else {
                this.vx *= 0.65;
                if (Math.abs(this.vx) < 0.1) this.vx = 0.0;
                this.isBraking = false;
            }
        }

        // Apply wind force
        this.vx += wind * dt;

        this.vx = Math.max(-maxV, Math.min(maxV, this.vx));

        // Gravity
        this.vy += this.gravity;
        this.vy = Math.max(-22, Math.min(22, this.vy));

        // Coyote Timer
        if (this.grounded) {
            this.coyoteTimer = 8;
        } else {
            this.coyoteTimer = Math.max(0, this.coyoteTimer - 1);
        }

        // Horizontal Collisions
        this.x += this.vx * dt;
        platforms.forEach(plat => {
            if (!plat.isSolid(polarity)) return;
            if (this.checkOverlap(this.x, this.y, plat)) {
                if (this.vx > 0) {
                    this.x = plat.x - this.w / 2 - plat.w / 2;
                    this.vx = 0;
                } else if (this.vx < 0) {
                    this.x = plat.x + this.w / 2 + plat.w / 2;
                    this.vx = 0;
                }
            }
        });

        // Vertical Collisions
        this.y += this.vy * dt;
        const wasGrounded = this.grounded;
        this.grounded = false;

        platforms.forEach(plat => {
            if (!plat.isSolid(polarity)) return;
            if (this.checkOverlap(this.x, this.y, plat)) {
                if (this.vy > 0) {
                    this.y = plat.y - plat.h / 2 - this.h;
                    this.vy = 0;
                } else if (this.vy < 0) {
                    this.y = plat.y + plat.h / 2;
                    this.vy = 0;
                    this.grounded = true;

                    if (!wasGrounded) {
                        this.squashX = 1.35;
                        this.squashY = 0.65;
                        this.squashZ = 1.35;
                        // Landing impact dust
                        this.spawnDust(this.x, this.y, 6, 0xffffff);
                    }
                }
            }
        });

        // Elastic recovery
        this.squashX += (1.0 - this.squashX) * 0.16;
        this.squashY += (1.0 - this.squashY) * 0.16;
        this.squashZ += (1.0 - this.squashZ) * 0.16;
        this.tiltAngle += ((-this.vx * 0.045) - this.tiltAngle) * 0.15;

        // Kinematics
        if (this.grounded && Math.abs(this.vx) > 0.4) {
            this.runCycle += Math.abs(this.vx) * dt * 7.5;
        } else {
            this.idleCycle += dt * 3.0;
        }

        // Dynamic Autonomous Head Tracking
        this.updateHeadTracking(nearbyShards);

        // Update Meshes
        this.updateAnimationPoses();
        this.updateVerletCape(dt, wind);
        this.updateDustParticles(dt);

        this.rootGroup.position.set(this.x, this.y, this.z);
    }

    updateHeadTracking(nearbyShards) {
        // Find closest shard within 4.5 units
        let closest = null;
        let minDist = 4.5;
        nearbyShards.forEach(s => {
            if (s.collected) return;
            const d = Math.hypot(s.x - this.x, s.y - this.y);
            if (d < minDist) {
                minDist = d;
                closest = s;
            }
        });

        if (closest) {
            // Look toward shard
            const dx = (closest.x - this.x) * this.facing;
            const dy = (closest.y - (this.y + 1.45));
            this.headTargetRotY = Math.atan2(dx, 3.0) * 0.6;
            this.headTargetRotX = -Math.atan2(dy, 3.0) * 0.6;
        } else if (!this.grounded) {
            // Glance in velocity trajectory
            this.headTargetRotX = this.vy > 0 ? -0.3 : 0.2;
            this.headTargetRotY = 0;
        } else {
            this.headTargetRotY = 0;
            this.headTargetRotX = 0;
        }

        // Smoothly interpolate head rotations
        this.headGroup.rotation.y += (this.headTargetRotY - this.headGroup.rotation.y) * 0.15;
        this.headGroup.rotation.x += (this.headTargetRotX - this.headGroup.rotation.x) * 0.15;

        // Scanning Visor Pupil Motion
        const pupilScan = Math.sin(performance.now() * 0.005) * 0.12;
        this.pupilMesh.position.x = pupilScan;
    }

    updateAnimationPoses() {
        const targetRotY = (this.facing === 1) ? 0 : Math.PI;
        this.bodyGroup.rotation.y += (targetRotY - this.bodyGroup.rotation.y) * 0.25;

        this.bodyGroup.scale.set(this.squashX, this.squashY, this.squashZ);
        this.bodyGroup.rotation.z = this.tiltAngle;

        if (this.isBraking) {
            // 1. Skidding / Braking Animation Pose:
            // Digs heels in, tilts torso back against momentum, arms flare outward for balance!
            this.tiltAngle = -this.facing * 0.24;
            this.leftLegGroup.rotation.x = -0.45;
            this.rightLegGroup.rotation.x = 0.35;
            this.leftArmGroup.rotation.x = 0.65;
            this.rightArmGroup.rotation.x = 0.65;
            this.torsoMesh.position.y = 0.80; // slightly lower center of gravity
            this.torsoMesh.rotation.y = 0;
        } else if (this.grounded && Math.abs(this.vx) > 0.4) {
            // 2. Athletic Kinetic Running Cycle:
            const swing = Math.sin(this.runCycle);
            const cosSwing = Math.cos(this.runCycle);
            
            // Dynamic leg swings:
            this.leftLegGroup.rotation.x = swing * 0.85;
            this.rightLegGroup.rotation.x = -swing * 0.85;
            
            // Dynamic arm pumping:
            this.leftArmGroup.rotation.x = -swing * 0.78;
            this.rightArmGroup.rotation.x = swing * 0.78;
            this.leftArmGroup.rotation.z = -0.15 + cosSwing * 0.08;
            this.rightArmGroup.rotation.z = 0.15 - cosSwing * 0.08;

            // Torso bounce & spine twist:
            this.torsoMesh.position.y = 0.85 + Math.abs(Math.sin(this.runCycle * 2)) * 0.08;
            this.torsoMesh.rotation.y = swing * 0.14; // spine yaw twist
            
            // Periodic footfall sparks:
            if (Math.abs(swing) > 0.85 && Math.random() < 0.25) {
                this.spawnDust(this.x, this.y, 1, this.themeColor);
            }
        } else if (!this.grounded) {
            // 3. Heroic Mid-Air Jump & Flare:
            const inAirBend = this.vy > 0 ? 0.55 : -0.35;
            this.leftLegGroup.rotation.x = inAirBend;
            this.rightLegGroup.rotation.x = -inAirBend * 0.6;
            this.leftArmGroup.rotation.x = -0.95;
            this.rightArmGroup.rotation.x = -0.95;
            this.leftArmGroup.rotation.z = -0.3;
            this.rightArmGroup.rotation.z = 0.3;
            this.torsoMesh.position.y = 0.85;
            this.torsoMesh.rotation.y = 0;

            // Jet flare sparks under boots during ascents:
            if (this.vy > 0 && Math.random() < 0.35) {
                this.spawnDust(this.x + (Math.random() - 0.5) * 0.2, this.y - 0.2, 1, 0x00f0ff);
            }
        } else {
            // 4. Rich Idle Combat Stance & Procedural Breathing:
            const breath = Math.sin(this.idleCycle);
            const breathCos = Math.cos(this.idleCycle * 0.5);
            this.torsoMesh.position.y = 0.85 + breath * 0.035;
            this.torsoMesh.scale.x = 1.0 + breath * 0.03;
            this.torsoMesh.scale.z = 1.0 + breath * 0.02;
            this.torsoMesh.rotation.y = breathCos * 0.06;

            // Arms resting with organic micro-sway:
            this.leftArmGroup.rotation.x = breath * 0.12;
            this.rightArmGroup.rotation.x = -breath * 0.12;
            this.leftArmGroup.rotation.z = -0.08 + breath * 0.04;
            this.rightArmGroup.rotation.z = 0.08 - breath * 0.04;

            this.leftLegGroup.rotation.x = 0.08;
            this.rightLegGroup.rotation.x = -0.08;
        }

        const pulse = 1.0 + Math.sin(performance.now() * 0.009) * 0.35;
        this.coreMesh.scale.set(pulse, pulse, pulse);
        this.coreLight.intensity = 1.8 * pulse;
    }

    updateVerletCape(dt, wind = 0) {
        const collarX = this.x + (this.facing === 1 ? -0.2 : 0.2);
        const collarY = this.y + 1.25;
        const collarZ = 0.0;

        this.scarfNodes[0].x = collarX;
        this.scarfNodes[0].y = collarY;
        this.scarfNodes[0].z = collarZ;

        const segDist = 0.26;
        for (let i = 1; i < this.scarfNodes.length; i++) {
            const n = this.scarfNodes[i];
            const vx = (n.x - n.ox) * 0.88;
            const vy = (n.y - n.oy) * 0.88;
            const vz = (n.z - n.oz) * 0.88;

            n.ox = n.x;
            n.oy = n.y;
            n.oz = n.z;

            // Apply drag, gravity, and lateral crosswind
            n.x += vx - (this.vx * dt * 0.5) + (wind * dt * 0.2);
            n.y += vy - 0.015 + Math.sin(performance.now() * 0.01 + i) * 0.008;
            n.z += vz + Math.cos(performance.now() * 0.008 + i) * 0.012;

            const prev = this.scarfNodes[i - 1];
            const dx = n.x - prev.x;
            const dy = n.y - prev.y;
            const dz = n.z - prev.z;
            const d = Math.hypot(dx, dy, dz);
            if (d > segDist) {
                const f = (d - segDist) / d;
                n.x -= dx * f;
                n.y -= dy * f;
                n.z -= dz * f;
            }
        }

        const posAttr = this.capeMesh.geometry.attributes.position;
        const arr = posAttr.array;

        for (let i = 0; i < this.scarfNodes.length; i++) {
            const n = this.scarfNodes[i];
            const halfW = (0.22 - i * 0.025);

            arr[i * 6] = n.x;
            arr[i * 6 + 1] = n.y;
            arr[i * 6 + 2] = n.z - halfW;

            arr[i * 6 + 3] = n.x;
            arr[i * 6 + 4] = n.y;
            arr[i * 6 + 5] = n.z + halfW;
        }

        posAttr.needsUpdate = true;
        this.capeMesh.geometry.computeVertexNormals();
    }

    updateDustParticles(dt) {
        for (let i = this.dustParticles.length - 1; i >= 0; i--) {
            const p = this.dustParticles[i];
            p.life -= dt;
            p.mesh.position.x += p.vx * dt;
            p.mesh.position.y += p.vy * dt;
            p.mesh.material.opacity = p.life / p.maxLife;

            if (p.life <= 0) {
                this.dustGroup.remove(p.mesh);
                this.dustParticles.splice(i, 1);
            }
        }
    }

    checkOverlap(px, py, plat) {
        return (
            px + this.w / 2 > plat.x - plat.w / 2 &&
            px - this.w / 2 < plat.x + plat.w / 2 &&
            py + this.h > plat.y - plat.h / 2 &&
            py < plat.y + plat.h / 2
        );
    }
}

window.Player3D = Player3D;
