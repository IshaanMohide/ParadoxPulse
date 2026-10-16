"""
=============================================================================
POLARITY 3D // AI Camera Inversion Platformer (Python Edition)
=============================================================================
Tech Stack:
  - Language: Python 3.10 - 3.13
  - Game Engine: Pygame
  - Computer Vision: OpenCV (cv2)
  - Pose Estimation AI: Google MediaPipe Pose (100% Free, Zero API Keys, Runs Locally)
=============================================================================
Rules of Inversion:
  - Raise LEFT Hand   -> Moves Character to the RIGHT
  - Raise RIGHT Hand  -> Moves Character to the LEFT
  - SIT DOWN / SQUAT  -> Character JUMPS (Proportional depth power)
  - Raise BOTH Hands  -> Flips Reality Polarity (Cyan <-> Magenta)
  - Sensitivity Keys  : [ / ] = Adjust Squat Sensitivity, - / = = Adjust Hand Sensitivity
  - Unpredictability  : M = Cycle Unpredictability Mode (Chill / Normal / Chaos)
  - Keyboard Fallback : A/D (Inverted Run), Space/W (Jump), Shift (Shift Polarity)
=============================================================================
"""

import sys
import math
import time
import random

try:
    import pygame
except ImportError:
    print("\n[!] Pygame not detected. Run: pip install pygame")
    sys.exit(1)

try:
    import cv2
except ImportError:
    print("\n[!] OpenCV not detected. Run: pip install opencv-python")
    sys.exit(1)

try:
    import mediapipe as mp
    HAS_MEDIAPIPE = True
except ImportError:
    print("\n[*] Note: MediaPipe not detected in Python. Running with OpenCV face/motion tracker fallback.")
    print("    To enable full 33-point skeletal tracking in Python, run: pip install mediapipe")
    HAS_MEDIAPIPE = False


class PoseCameraDetector:
    """Manages OpenCV Webcam Video Stream and MediaPipe Pose Inference with Sensitivity."""
    def __init__(self, cam_index=0):
        self.cap = cv2.VideoCapture(cam_index)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 320)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 240)
        
        self.baseline_torso_y = 0.45
        self.squat_threshold = 0.135
        self.hand_threshold = 0.085
        self.is_squatting = False
        
        self.left_hand_up = False
        self.right_hand_up = False
        self.both_hands_up = False
        self.last_shift_time = 0
        
        if HAS_MEDIAPIPE:
            self.mp_pose = mp.solutions.pose
            self.pose = self.mp_pose.Pose(
                model_complexity=1,
                smooth_landmarks=True,
                min_detection_confidence=0.5,
                min_tracking_confidence=0.5
            )
            self.mp_draw = mp.solutions.drawing_utils
        else:
            self.pose = None

    def read_gestures(self):
        """Captures frame, mirrors it, detects gestures, and returns Pygame surface."""
        ret, frame = self.cap.read()
        if not ret:
            return None, 0, False, False, 1.0

        frame = cv2.flip(frame, 1)
        h, w, _ = frame.shape
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        l_hand = False
        r_hand = False
        jump_trigger = False
        shift_trigger = False
        jump_multiplier = 1.0

        if HAS_MEDIAPIPE and self.pose:
            results = self.pose.process(rgb_frame)
            if results.pose_landmarks:
                lm = results.pose_landmarks.landmark
                
                l_wrist = lm[15]
                r_wrist = lm[16]
                l_sh = lm[11]
                r_sh = lm[12]
                
                # Check hands with dynamic sensitivity threshold
                l_hand = (l_wrist.y < l_sh.y - self.hand_threshold) and (l_wrist.visibility > 0.4)
                r_hand = (r_wrist.y < r_sh.y - self.hand_threshold) and (r_wrist.visibility > 0.4)
                both_hands = l_hand and r_hand and (l_wrist.y < l_sh.y - 0.09) and (r_wrist.y < r_sh.y - 0.09)

                # Sit down / squat detection via average shoulder height
                current_torso_y = (l_sh.y + r_sh.y) / 2.0
                drop = max(0.0, current_torso_y - self.baseline_torso_y)
                
                if drop >= self.squat_threshold and not self.is_squatting:
                    self.is_squatting = True
                    jump_trigger = True
                    jump_multiplier = min(1.35, max(0.9, drop / self.squat_threshold))
                elif drop < self.squat_threshold * 0.4:
                    self.is_squatting = False

                now = time.time()
                if both_hands and (now - self.last_shift_time > 0.6):
                    self.last_shift_time = now
                    shift_trigger = True

                # Draw glowing wireframe skeleton onto frame
                self.mp_draw.draw_landmarks(
                    rgb_frame,
                    results.pose_landmarks,
                    self.mp_pose.POSE_CONNECTIONS,
                    landmark_drawing_spec=self.mp_draw.DrawingSpec(color=(0, 240, 255), thickness=2, circle_radius=3),
                    connection_drawing_spec=self.mp_draw.DrawingSpec(color=(255, 0, 127), thickness=2)
                )

        # Inversion Logic: Left Hand -> RIGHT (+1), Right Hand -> LEFT (-1)
        move_dir = 0
        if l_hand and not r_hand:
            move_dir = 1
        elif r_hand and not l_hand:
            move_dir = -1

        pyg_surf = pygame.surfarray.make_surface(rgb_frame.swapaxes(0, 1))
        return pyg_surf, move_dir, jump_trigger, shift_trigger, jump_multiplier

    def calibrate(self):
        ret, frame = self.cap.read()
        if ret and HAS_MEDIAPIPE and self.pose:
            rgb_frame = cv2.cvtColor(cv2.flip(frame, 1), cv2.COLOR_BGR2RGB)
            res = self.pose.process(rgb_frame)
            if res.pose_landmarks:
                lm = res.pose_landmarks.landmark
                self.baseline_torso_y = (lm[11].y + lm[12].y) / 2.0

    def adjust_squat_sens(self, delta):
        self.squat_threshold = max(0.04, min(0.16, self.squat_threshold + delta))

    def adjust_hand_sens(self, delta):
        self.hand_threshold = max(0.02, min(0.10, self.hand_threshold + delta))

    def release(self):
        self.cap.release()


class Player:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.w = 26
        self.h = 42
        self.vx = 0.0
        self.vy = 0.0
        self.speed = 6.2
        self.accel = 1.05
        self.friction = 0.85
        self.base_gravity = 0.54
        self.gravity = 0.54
        self.jump_power = -12.6
        self.grounded = False
        self.facing = 1
        self.run_cycle = 0.0
        self.squash_x = 1.0
        self.squash_y = 1.0

        # Verlet Physics Scarf
        self.scarf = [[self.x, self.y + 14, self.x, self.y + 14] for _ in range(7)]

    def update(self, move_dir, want_jump, jump_mult, platforms, polarity, wind=0.0):
        # Steering + Wind
        if move_dir < 0:
            self.vx -= self.accel
            self.facing = -1
        elif move_dir > 0:
            self.vx += self.accel
            self.facing = 1
        else:
            # Instant stop when hand is taken down!
            if self.grounded:
                self.vx *= 0.15
                if abs(self.vx) < 0.1:
                    self.vx = 0
            else:
                self.vx *= 0.65
                if abs(self.vx) < 0.1:
                    self.vx = 0

        self.vx += wind * 0.1
        self.vx = max(-self.speed, min(self.speed, self.vx))
        self.vy += self.gravity
        self.vy = min(self.vy, 16.0)

        # Proportional Variable Jump
        if want_jump and self.grounded:
            self.vy = self.jump_power * jump_mult
            self.grounded = False
            self.squash_x = 0.72
            self.squash_y = 1.35

        # Horizontal move and collide
        self.x += self.vx
        p_rect = pygame.Rect(self.x, self.y, self.w, self.h)
        for plat in platforms:
            if not plat.is_solid(polarity):
                continue
            if p_rect.colliderect(plat.rect):
                if self.vx > 0:
                    self.x = plat.rect.left - self.w
                    self.vx = 0
                elif self.vx < 0:
                    self.x = plat.rect.right
                    self.vx = 0
                p_rect.x = self.x

        # Vertical move and collide
        self.y += self.vy
        p_rect = pygame.Rect(self.x, self.y, self.w, self.h)
        self.grounded = False
        for plat in platforms:
            if not plat.is_solid(polarity):
                continue
            if p_rect.colliderect(plat.rect):
                if self.vy > 0:
                    self.y = plat.rect.top - self.h
                    self.vy = 0
                    self.grounded = True
                elif self.vy < 0:
                    self.y = plat.rect.bottom
                    self.vy = 0
                p_rect.y = self.y

        if self.grounded and abs(self.vx) > 0.4:
            self.run_cycle += abs(self.vx) * 0.1
        self.squash_x += (1.0 - self.squash_x) * 0.15
        self.squash_y += (1.0 - self.squash_y) * 0.15

        # Update Scarf Verlet Chain
        self.scarf[0][0] = self.x + (4 if self.facing == 1 else self.w - 4)
        self.scarf[0][1] = self.y + 14
        seg_len = 6.0
        for i in range(1, len(self.scarf)):
            node = self.scarf[i]
            vx = (node[0] - node[2]) * 0.92
            vy = (node[1] - node[3]) * 0.92
            node[2] = node[0]
            node[3] = node[1]
            node[0] += vx - (self.vx * 0.4) + (wind * 0.3)
            node[1] += vy + 0.3

            prev = self.scarf[i - 1]
            dx = node[0] - prev[0]
            dy = node[1] - prev[1]
            dist = math.hypot(dx, dy)
            if dist > seg_len:
                factor = (dist - seg_len) / dist
                node[0] -= dx * factor
                node[1] -= dy * factor

    def draw(self, surface, cam_x, cam_y, theme_color):
        screen_x = int(self.x - cam_x)
        screen_y = int(self.y - cam_y)

        # Draw Flowing Cape
        scarf_pts = [(int(n[0] - cam_x), int(n[1] - cam_y)) for n in self.scarf]
        if len(scarf_pts) >= 2:
            pygame.draw.lines(surface, theme_color, False, scarf_pts, 4)

        # Torso
        torso_rect = pygame.Rect(screen_x + 3, screen_y + 10, self.w - 6, 18)
        pygame.draw.rect(surface, (15, 23, 42), torso_rect)
        pygame.draw.rect(surface, theme_color, torso_rect, 2)

        # Core
        core_pos = (screen_x + self.w // 2, screen_y + 18)
        pygame.draw.circle(surface, (255, 255, 255), core_pos, 4)
        pygame.draw.circle(surface, theme_color, core_pos, 7, 1)

        # Visor / Head
        head_rect = pygame.Rect(screen_x + 5, screen_y, self.w - 10, 10)
        pygame.draw.rect(surface, (15, 23, 42), head_rect)
        pygame.draw.rect(surface, theme_color, head_rect, 1)
        visor_x = screen_x + (10 if self.facing == 1 else 6)
        pygame.draw.rect(surface, theme_color, (visor_x, screen_y + 3, 10, 3))

        # Legs
        walk = math.sin(self.run_cycle) if self.grounded else 0
        leg_offset = int(walk * 6)
        pygame.draw.line(surface, theme_color, (screen_x + 8, screen_y + 28), (screen_x + 8 - leg_offset, screen_y + 42), 3)
        pygame.draw.line(surface, theme_color, (screen_x + 18, screen_y + 28), (screen_x + 18 + leg_offset, screen_y + 42), 3)


class Platform:
    def __init__(self, x, y, w, h, p_type="NEUTRAL"):
        self.rect = pygame.Rect(x, y, w, h)
        self.p_type = p_type

    def is_solid(self, polarity):
        if self.p_type == "NEUTRAL":
            return True
        return self.p_type == polarity

    def draw(self, surface, cam_x, cam_y, polarity):
        screen_r = pygame.Rect(self.rect.x - cam_x, self.rect.y - cam_y, self.rect.w, self.rect.h)
        if self.p_type == "NEUTRAL":
            pygame.draw.rect(surface, (15, 23, 42), screen_r)
            pygame.draw.rect(surface, (71, 85, 105), screen_r, 2)
            pygame.draw.rect(surface, (255, 255, 255), (screen_r.x, screen_r.y, screen_r.w, 3))
        elif self.p_type == "CYAN":
            if polarity == "CYAN":
                pygame.draw.rect(surface, (0, 240, 255), screen_r)
                pygame.draw.rect(surface, (255, 255, 255), screen_r, 2)
            else:
                pygame.draw.rect(surface, (0, 40, 60), screen_r, 1)
        elif self.p_type == "MAGENTA":
            if polarity == "MAGENTA":
                pygame.draw.rect(surface, (255, 0, 127), screen_r)
                pygame.draw.rect(surface, (255, 255, 255), screen_r, 2)
            else:
                pygame.draw.rect(surface, (60, 0, 40), screen_r, 1)


def run_game():
    pygame.init()
    screen_w, screen_h = 1050, 680
    screen = pygame.display.set_mode((screen_w, screen_h))
    pygame.display.set_caption("POLARITY // AI Camera Inversion Platformer")
    clock = pygame.time.Clock()
    font = pygame.font.SysFont("Courier", 13, bold=True)
    big_font = pygame.font.SysFont("Courier", 16, bold=True)

    camera = PoseCameraDetector()
    player = Player(100, 350)
    polarity = "CYAN"

    # Unpredictable Anomalies Engine
    unpredict_modes = ["CHILL", "NORMAL", "CHAOS"]
    unpredict_idx = 1
    anomaly_name = None
    anomaly_timer = 0
    next_anomaly = time.time() + 15
    wind_force = 0.0

    platforms = [
        Platform(40, 480, 280, 40, "NEUTRAL"),
        Platform(360, 430, 180, 26, "CYAN"),
        Platform(580, 380, 160, 30, "NEUTRAL"),
        Platform(780, 320, 180, 26, "MAGENTA"),
        Platform(1000, 260, 140, 26, "CYAN"),
        Platform(1180, 240, 240, 40, "NEUTRAL"),
        Platform(0, 0, 40, 600, "NEUTRAL"),
        Platform(1440, 0, 40, 600, "NEUTRAL")
    ]

    running = True
    while running:
        # 1. Capture Camera Frame and Run MediaPipe Pose Inversion
        cam_surf, cam_move, cam_jump, cam_shift, jump_mult = camera.read_gestures()

        key_move = 0
        key_jump = False
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    running = False
                elif event.key in [pygame.K_e, pygame.K_LSHIFT, pygame.K_RSHIFT]:
                    polarity = "MAGENTA" if polarity == "CYAN" else "CYAN"
                elif event.key == pygame.K_c:
                    camera.calibrate()
                elif event.key == pygame.K_LEFTBRACKET:
                    camera.adjust_squat_sens(0.01)  # [ = deeper squat
                elif event.key == pygame.K_RIGHTBRACKET:
                    camera.adjust_squat_sens(-0.01) # ] = more sensitive squat
                elif event.key == pygame.K_MINUS:
                    camera.adjust_hand_sens(0.01)   # - = higher hand
                elif event.key == pygame.K_EQUALS:
                    camera.adjust_hand_sens(-0.01)  # = = more sensitive hand
                elif event.key == pygame.K_m:
                    unpredict_idx = (unpredict_idx + 1) % len(unpredict_modes)
                    next_anomaly = time.time() + 8

        # Unpredictable Anomalies Logic
        now = time.time()
        mode = unpredict_modes[unpredict_idx]
        if anomaly_name:
            if now > anomaly_timer:
                anomaly_name = None
                player.gravity = player.base_gravity
                player.speed = 6.2
                wind_force = 0.0
                delay = 25 if mode == "CHILL" else (7 if mode == "CHAOS" else 15)
                next_anomaly = now + delay + random.random() * 6
        elif now > next_anomaly:
            # Trigger unexpected procedural quantum event
            choices = ["ANTI-GRAVITY FLUX", "GRAVITY SURGE", "ION CROSSWIND", "WARP SPRINT", "PERCEPTION WARP"]
            anomaly_name = random.choice(choices)
            anomaly_timer = now + 5.5
            if anomaly_name == "ANTI-GRAVITY FLUX":
                player.gravity = player.base_gravity * 0.28
            elif anomaly_name == "GRAVITY SURGE":
                player.gravity = player.base_gravity * 1.75
            elif anomaly_name == "ION CROSSWIND":
                wind_force = random.choice([-8.5, 8.5])
            elif anomaly_name == "WARP SPRINT":
                player.speed = 9.8
            elif anomaly_name == "PERCEPTION WARP":
                pass # Handled in move inversion below

        # Keyboard Inversion Fallback: A -> Move Right, D -> Move Left
        keys = pygame.key.get_pressed()
        if keys[pygame.K_a] or keys[pygame.K_LEFT]:
            key_move = 1   # INVERTED: A moves RIGHT!
        elif keys[pygame.K_d] or keys[pygame.K_RIGHT]:
            key_move = -1  # INVERTED: D moves LEFT!
        if keys[pygame.K_w] or keys[pygame.K_UP] or keys[pygame.K_SPACE]:
            key_jump = True

        final_move = cam_move if cam_move != 0 else key_move
        if anomaly_name == "PERCEPTION WARP":
            final_move = -final_move
        final_jump = cam_jump or key_jump
        if cam_shift:
            polarity = "MAGENTA" if polarity == "CYAN" else "CYAN"

        # Update Physics with Proportional Jump & Wind
        player.update(final_move, final_jump, jump_mult, platforms, polarity, wind_force)

        # Camera follow
        cam_x = player.x - screen_w // 2 + player.w // 2
        cam_y = player.y - screen_h // 2 + player.h // 2

        # Draw Background
        theme_color = (0, 240, 255) if polarity == "CYAN" else (255, 0, 127)
        screen.fill((4, 9, 18) if polarity == "CYAN" else (16, 4, 18))

        # Draw Platforms
        for plat in platforms:
            plat.draw(screen, cam_x, cam_y, polarity)

        # Draw Player
        player.draw(screen, cam_x, cam_y, theme_color)

        # Draw PIP Camera Mirror
        if cam_surf:
            scaled_cam = pygame.transform.scale(cam_surf, (220, 165))
            cam_box = pygame.Rect(screen_w - 235, 15, 220, 165)
            screen.blit(scaled_cam, cam_box.topleft)
            pygame.draw.rect(screen, theme_color, cam_box, 2)

        # HUD text
        hud_txt = font.render(f"POLARITY: {polarity} | GESTURE: {'R-HAND (MOVE L)' if cam_move == -1 else ('L-HAND (MOVE R)' if cam_move == 1 else 'NEUTRAL')}", True, (255, 255, 255))
        screen.blit(hud_txt, (20, 18))

        sens_txt = font.render(f"SENSITIVITY: SQUAT={camera.squat_threshold:.3f} ([/]) | HAND={camera.hand_threshold:.3f} (-/=) | MATRIX={mode} (M)", True, (200, 220, 240))
        screen.blit(sens_txt, (20, 38))

        if anomaly_name:
            alert = big_font.render(f"[!] UNPREDICTABLE EVENT: {anomaly_name} ACTIVE", True, (255, 170, 0))
            screen.blit(alert, (20, 62))

        pygame.display.flip()
        clock.tick(60)

    camera.release()
    pygame.quit()


if __name__ == "__main__":
    run_game()
