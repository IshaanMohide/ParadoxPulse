/**
 * POLARITY // Multi-Layer Smoothed Pose Tracking Engine (Updated with Live Sensitivity)
 * Features:
 *   - Live Hand Sensitivity & Squat Depth Sensitivity from GameSettings
 *   - Proportional Variable Jump Physics (Deeper physical squat = Higher explosive jump!)
 *   - EMA Landmark Filtering & Hysteresis Schmitt Trigger
 *   - Continuous Analog Steering
 *   - Real-time Visual Guide Line updates with sensitivity changes
 */
class SmoothPoseTracker {
    constructor(gameEngine) {
        this.game = gameEngine;
        this.video = document.getElementById('webcamVideo');
        this.canvas = document.getElementById('cameraCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.stream = null;
        this.poseDetector = null;
        this.cameraHelper = null;
        this.isActive = false;
        this.isReady = false;

        // Landmark EMA Smoothing Memory
        this.smoothedLandmarks = {};
        this.alpha = (window.GameSettings && window.GameSettings.current) ? window.GameSettings.current.steeringSmoothness : 0.22;

        // Hysteresis States for Gestures
        this.leftHandRaised = false;
        this.rightHandRaised = false;
        this.bothHandsRaised = false;
        this.lastBothHandsTime = 0;

        // Smooth Analog Steering (-1.0 = Max Left, +1.0 = Max Right)
        this.smoothedSteer = 0.0;
        this.targetSteer = 0.0;

        // Squat / Sit-Down Detection
        this.baselineTorsoY = 0.42;
        this.currentTorsoY = 0.42;
        this.squatThreshold = (window.GameSettings && window.GameSettings.current) ? window.GameSettings.current.squatSensitivity : 0.085;
        this.handThreshold = (window.GameSettings && window.GameSettings.current) ? window.GameSettings.current.handSensitivity : 0.045;
        this.isSquatting = false;

        // Banner Alert Timer
        this.alertTimer = null;

        // Listen for live sensitivity setting changes
        window.addEventListener('polarity_settings_changed', (e) => {
            if (e.detail) {
                this.squatThreshold = e.detail.squatSensitivity;
                this.handThreshold = e.detail.handSensitivity;
                this.alpha = e.detail.steeringSmoothness;
            }
        });

        this.setupUI();
    }

    setupUI() {
        const btnMin = document.getElementById('btn-cam-minimize');
        if (btnMin) {
            btnMin.addEventListener('click', () => {
                document.getElementById('camera-hud').classList.toggle('minimized');
            });
        }

        const btnCal = document.getElementById('btn-calibrate');
        if (btnCal) {
            btnCal.addEventListener('click', () => {
                this.calibrateNeutralPosture();
            });
        }

        const btnPow = document.getElementById('btn-cam-power');
        if (btnPow) {
            btnPow.addEventListener('click', () => {
                if (this.isActive) this.stopCamera();
                else this.startCamera();
            });
        }

        const btnToggle = document.getElementById('btn-camera-toggle');
        if (btnToggle) {
            btnToggle.addEventListener('click', () => {
                if (this.isActive) this.stopCamera();
                else this.startCamera();
            });
        }

        // Live Sensitivity Sliders in Settings / HUD
        const squatSlider = document.getElementById('slider-squat-sens');
        const squatVal = document.getElementById('val-squat-sens');
        if (squatSlider) {
            squatSlider.value = this.squatThreshold;
            squatSlider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                this.squatThreshold = val;
                if (window.GameSettings) window.GameSettings.setSquatSensitivity(val);
                if (squatVal) squatVal.textContent = Math.round((0.18 - val) * 600) + "%";
            });
        }

        const handSlider = document.getElementById('slider-hand-sens');
        const handVal = document.getElementById('val-hand-sens');
        if (handSlider) {
            handSlider.value = this.handThreshold;
            handSlider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                this.handThreshold = val;
                if (window.GameSettings) window.GameSettings.setHandSensitivity(val);
                if (handVal) handVal.textContent = Math.round((0.12 - val) * 800) + "%";
            });
        }

        const smoothSlider = document.getElementById('slider-smooth-sens');
        const smoothVal = document.getElementById('val-smooth-sens');
        if (smoothSlider) {
            smoothSlider.value = this.alpha;
            smoothSlider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                this.alpha = val;
                if (window.GameSettings) window.GameSettings.setSteeringSmoothness(val);
                if (smoothVal) smoothVal.textContent = Math.round(val * 250) + "%";
            });
        }
    }

    setStatus(state, text) {
        const ind = document.getElementById('cam-indicator');
        const label = document.getElementById('cam-status-label');
        if (ind) ind.className = `cam-status-indicator ${state}`;
        if (label) label.textContent = text;
    }

    async startCamera() {
        this.setStatus('loading', 'AI INITIALIZING...');
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 480 },
                    height: { ideal: 360 },
                    facingMode: 'user'
                },
                audio: false
            });
            this.video.srcObject = this.stream;
            await this.video.play();

            if (!this.poseDetector && window.Pose) {
                this.poseDetector = new window.Pose({
                    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
                });

                this.poseDetector.setOptions({
                    modelComplexity: 1,
                    smoothLandmarks: true,
                    enableSegmentation: false,
                    minDetectionConfidence: 0.5,
                    minTrackingConfidence: 0.5
                });

                this.poseDetector.onResults(this.onPoseResults.bind(this));
            }

            if (window.Camera && !this.cameraHelper) {
                this.cameraHelper = new window.Camera(this.video, {
                    onFrame: async () => {
                        if (this.isActive && this.poseDetector) {
                            await this.poseDetector.send({ image: this.video });
                        }
                    },
                    width: 320,
                    height: 240
                });
                await this.cameraHelper.start();
            } else {
                this.runFallbackLoop();
            }

            this.isActive = true;
            this.isReady = true;
            this.setStatus('', 'AI TRACKER 60FPS');
            const camToggle = document.getElementById('btn-camera-toggle');
            if (camToggle) camToggle.classList.add('active');
            this.showAlert('📷', 'AI TRACKING ACTIVE');

            setTimeout(() => { this.calibrateNeutralPosture(); }, 1200);

        } catch (err) {
            console.warn("Camera init note:", err);
            this.setStatus('off', 'CAMERA UNAVAILABLE');
            this.showAlert('⌨️', 'KEYBOARD ACTIVE');
            this.isActive = false;
        }
    }

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(t => t.stop());
            this.stream = null;
        }
        this.isActive = false;
        this.setStatus('off', 'AI CAM OFF');
        const camToggle = document.getElementById('btn-camera-toggle');
        if (camToggle) camToggle.classList.remove('active');

        this.targetSteer = 0.0;
        this.smoothedSteer = 0.0;
        this.updatePillStates(false, false, false, false);
        this.showAlert('⌨️', 'CAMERA OFF - KEYBOARD READY');
    }

    runFallbackLoop() {
        const step = async () => {
            if (this.isActive) {
                if (this.poseDetector && this.video.readyState >= 2) {
                    try {
                        await this.poseDetector.send({ image: this.video });
                    } catch (e) { }
                }
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    }

    calibrateNeutralPosture() {
        this.baselineTorsoY = this.currentTorsoY;
        this.showAlert('🎯', 'POSTURE CALIBRATED');
    }

    showAlert(icon, text) {
        const banner = document.getElementById('gesture-alert-banner');
        const iSpan = document.getElementById('gesture-alert-icon');
        const tSpan = document.getElementById('gesture-alert-text');
        if (!banner) return;

        iSpan.textContent = icon;
        tSpan.textContent = text;
        banner.classList.add('show');

        if (this.alertTimer) clearTimeout(this.alertTimer);
        this.alertTimer = setTimeout(() => {
            banner.classList.remove('show');
        }, 1300);
    }

    getSmoothedLandmark(idx, raw) {
        if (!raw) return null;
        if (!this.smoothedLandmarks[idx]) {
            this.smoothedLandmarks[idx] = { x: raw.x, y: raw.y, z: raw.z || 0, visibility: raw.visibility || 1 };
            return this.smoothedLandmarks[idx];
        }
        const s = this.smoothedLandmarks[idx];
        s.x += (raw.x - s.x) * this.alpha;
        s.y += (raw.y - s.y) * this.alpha;
        s.visibility = raw.visibility;
        return s;
    }

    onPoseResults(results) {
        if (!this.isActive) return;

        const cw = this.canvas.width;
        const ch = this.canvas.height;
        const ctx = this.ctx;

        ctx.save();
        ctx.clearRect(0, 0, cw, ch);

        // Mirrored Video
        ctx.translate(cw, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(results.image, 0, 0, cw, ch);

        const isCyan = (this.game && this.game.polarity === 'CYAN');
        ctx.fillStyle = isCyan ? 'rgba(0, 240, 255, 0.08)' : 'rgba(255, 0, 127, 0.08)';
        ctx.fillRect(0, 0, cw, ch);
        ctx.restore();

        if (results.poseLandmarks) {
            const raw = results.poseLandmarks;

            const lWrist = this.getSmoothedLandmark(15, raw[15]);
            const rWrist = this.getSmoothedLandmark(16, raw[16]);
            const lShoulder = this.getSmoothedLandmark(11, raw[11]);
            const rShoulder = this.getSmoothedLandmark(12, raw[12]);
            const nose = this.getSmoothedLandmark(0, raw[0]);

            // Draw glowing laser skeleton
            this.drawSmoothSkeleton(ctx, cw, ch);

            // Hand Raise with dynamic threshold
            const hThreshold = this.handThreshold;
            if (lWrist && lShoulder && lWrist.visibility > 0.4) {
                if (!this.leftHandRaised && lWrist.y < lShoulder.y - hThreshold) {
                    this.leftHandRaised = true;
                } else if (this.leftHandRaised && lWrist.y > lShoulder.y + 0.02) {
                    this.leftHandRaised = false;
                }
            } else {
                this.leftHandRaised = false;
            }

            if (rWrist && rShoulder && rWrist.visibility > 0.4) {
                if (!this.rightHandRaised && rWrist.y < rShoulder.y - hThreshold) {
                    this.rightHandRaised = true;
                } else if (this.rightHandRaised && rWrist.y > rShoulder.y + 0.02) {
                    this.rightHandRaised = false;
                }
            } else {
                this.rightHandRaised = false;
            }

            const bothHands = (this.leftHandRaised && this.rightHandRaised &&
                lWrist.y < lShoulder.y - 0.09 && rWrist.y < rShoulder.y - 0.09);

            // Torso height
            if (lShoulder && rShoulder) {
                this.currentTorsoY = (lShoulder.y + rShoulder.y) / 2;
            } else if (nose) {
                this.currentTorsoY = nose.y;
            }

            // Continuous neutral posture adaptation
            if (!this.isSquatting && !this.leftHandRaised && !this.rightHandRaised) {
                this.baselineTorsoY += (this.currentTorsoY - this.baselineTorsoY) * 0.005;
            }

            const dropAmount = Math.max(0, this.currentTorsoY - this.baselineTorsoY);
            const squatRatio = Math.min(1.0, dropAmount / this.squatThreshold);

            // Update Squat Depth Bar
            const squatFill = document.getElementById('squat-fill');
            const gaugePercent = document.getElementById('gauge-percent');
            if (squatFill) squatFill.style.width = `${Math.round(squatRatio * 100)}%`;
            if (gaugePercent) gaugePercent.textContent = `${Math.round(squatRatio * 100)}%`;

            // Proportional Variable Jump Execution:
            // Deeper squat = more explosive jump power!
            const isNowSquatting = (dropAmount >= this.squatThreshold);
            if (isNowSquatting && !this.isSquatting) {
                this.isSquatting = true;
                const jumpPowerMultiplier = Math.min(1.35, Math.max(0.9, (dropAmount / this.squatThreshold)));
                if (this.game) this.game.triggerJump(jumpPowerMultiplier);
                this.showAlert('⬇️', `SIT DOWN -> JUMP! (x${jumpPowerMultiplier.toFixed(1)})`);
            } else if (!isNowSquatting && dropAmount < this.squatThreshold * 0.4) {
                this.isSquatting = false;
            }

            // Both Hands Up Shift
            const now = performance.now();
            if (bothHands && now - this.lastBothHandsTime > 600) {
                this.lastBothHandsTime = now;
                if (this.game) this.game.triggerPolarityShift();
                this.showAlert('⚡', 'REALITY SHIFT TRIGGERED');
            }

            // Inversion Steering
            if (bothHands) {
                this.targetSteer = 0.0;
            } else if (this.leftHandRaised) {
                this.targetSteer = 1.0;  // LEFT HAND -> MOVE RIGHT!
            } else if (this.rightHandRaised) {
                this.targetSteer = -1.0; // RIGHT HAND -> MOVE LEFT!
            } else {
                this.targetSteer = 0.0;
            }

            // Analog Steering Smoothing
            this.smoothedSteer += (this.targetSteer - this.smoothedSteer) * this.alpha;

            this.bothHandsRaised = bothHands;
            this.updatePillStates(this.leftHandRaised && !bothHands, this.rightHandRaised && !bothHands, this.isSquatting, bothHands);
        }
    }

    drawSmoothSkeleton(ctx, cw, ch) {
        const pt = (idx) => {
            const lm = this.smoothedLandmarks[idx];
            if (!lm) return null;
            return {
                x: (1 - lm.x) * cw,
                y: lm.y * ch
            };
        };

        const connections = [
            [11, 12],
            [11, 13], [13, 15],
            [12, 14], [14, 16],
            [11, 23], [12, 24],
            [23, 24],
            [23, 25], [25, 27],
            [24, 26], [26, 28]
        ];

        const isCyan = (this.game && this.game.polarity === 'CYAN');
        const color = isCyan ? '#00f0ff' : '#ff007f';

        ctx.save();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 9;

        connections.forEach(([i, j]) => {
            const p1 = pt(i);
            const p2 = pt(j);
            if (p1 && p2) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        });

        [11, 12, 13, 14, 15, 16, 23, 24, 25, 26].forEach(idx => {
            const p = pt(idx);
            if (p) {
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = color;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
                ctx.stroke();
            }
        });

        const noseP = pt(0);
        if (noseP) {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(noseP.x, noseP.y, 10, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Live Squat Trigger Level Guide Line (dynamically reflects sensitivity!)
        const baselineYPx = (this.baselineTorsoY + this.squatThreshold) * ch;
        ctx.strokeStyle = 'rgba(255, 170, 0, 0.85)';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, baselineYPx);
        ctx.lineTo(cw, baselineYPx);
        ctx.stroke();

        ctx.restore();
    }

    updatePillStates(lHand, rHand, squat, both) {
        const pl = document.getElementById('pill-lhand');
        const pr = document.getElementById('pill-rhand');
        const ps = document.getElementById('pill-squat');
        const pb = document.getElementById('pill-both');

        if (pl) pl.className = `gesture-pill pill-lhand ${lHand ? 'active' : ''}`;
        if (pr) pr.className = `gesture-pill pill-rhand ${rHand ? 'active' : ''}`;
        if (ps) ps.className = `gesture-pill pill-squat ${squat ? 'active' : ''}`;
        if (pb) pb.className = `gesture-pill pill-both ${both ? 'active' : ''}`;
    }

    getSteering() {
        return this.smoothedSteer;
    }
}

window.SmoothPoseTracker = SmoothPoseTracker;
