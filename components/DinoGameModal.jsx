"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, VolumeX, RotateCcw, Trophy, Sparkles } from "lucide-react";

// Synthesized Web Audio API sound generator
class GameSound {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  playJump() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }

  playScore() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.setValueAtTime(1000, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } catch {}
  }

  playHit() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.22);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch {}
  }
}

const soundManager = new GameSound();

// Pixel Art Icons for Character Selection
function DinoPixelIcon({ className = "w-6 h-6" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M14 2h7v7h-2v2h3v3h-2v2h-2v2h-2v2h-1v2h2v2h-4v-2h2v-2h-2v-2h-2v-2h-2v-2H5v-2H3v-4h2V8h2V6h2V4h5V2zm2 3h-2v2h2V5z" />
    </svg>
  );
}

function CatPixelIcon({ className = "w-6 h-6" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      {/* Pixel Cat Icon */}
      <path d="M4 3h4v4H4V3zm12 0h4v4h-4V3zM6 7h12v4H6V7zm-2 4h16v6H4v-6zm3 6h3v4H7v-4zm7 0h3v4h-3v-4zM2 13h2v4H2v-4zm18 0h2v4h-2v-4zM8 11h2v2H8v-2zm6 0h2v2h-2v-2z" />
    </svg>
  );
}

function CowPixelIcon({ className = "w-6 h-6" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      {/* Pixel Cow Icon */}
      <path d="M3 2h3v4H3V2zm15 0h3v4h-3V2zM5 6h14v4H5V6zm-3 4h4v3H2v-3zm18 0h4v3h-4v-3zM4 10h16v5H4v-5zm2 5h12v5H6v-5zm2-3h2v2H8v-2zm6 0h2v2h-2v-2zm-3 5h2v2h-2v-2z" />
    </svg>
  );
}

function RhinoPixelIcon({ className = "w-6 h-6" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      {/* Pixel Rhino Icon */}
      <path d="M2 10h8v2H2v-2zm8-5h6v4h-6V5zm6 2h4v3h-4V7zm4-5h3v7h-3V2zm-16 8h18v7H4v-7zm2 7h4v4H6v-4zm8 0h4v4h-4v-4zm-4-3h2v2h-2v-2z" />
    </svg>
  );
}

// Available Playable Characters
export const CHARACTERS = [
  {
    id: "dino",
    name: "Dino",
    badge: "T-Rex",
    accentColor: "#ef745c",
    Icon: DinoPixelIcon,
    description: "Classic Chrome T-Rex runner",
  },
  {
    id: "cat",
    name: "Cat",
    badge: "Feline",
    accentColor: "#f39c12",
    Icon: CatPixelIcon,
    description: "Swift tabby with whisker reflexes",
  },
  {
    id: "cow",
    name: "Cow",
    badge: "Bovine",
    accentColor: "#3498db",
    Icon: CowPixelIcon,
    description: "Mighty pasture runner with hooves",
  },
  {
    id: "rhino",
    name: "Rhino",
    badge: "Beast",
    accentColor: "#9b59b6",
    Icon: RhinoPixelIcon,
    description: "Heavy horned armored sprinter",
  },
];

export default function DinoGameModal({ isOpen, onClose }) {
  const canvasRef = useRef(null);
  const [selectedChar, setSelectedChar] = useState("dino");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState("idle"); // 'idle', 'running', 'gameover'
  const [isMuted, setIsMuted] = useState(false);
  const [isDuckPressed, setIsDuckPressed] = useState(false);
  const [isJumpPressed, setIsJumpPressed] = useState(false);

  // Engine state references for 60fps loop
  const engineRef = useRef({
    animationFrameId: null,
    score: 0,
    speed: 3.6,
    initialSpeed: 3.6,
    distance: 0,
    nextObstacleDistance: 120,
    player: {
      x: 55,
      y: 0,
      baseY: 0,
      vy: 0,
      width: 50,
      height: 54,
      isGrounded: true,
      isDucking: false,
      legStep: 0,
      stepTimer: 0,
      crashed: false,
    },
    obstacles: [],
    clouds: [],
    groundOffset: 0,
    groundPebbles: [],
    lastTime: 0,
    nightMode: false,
    nightAlpha: 0,
    lastMilestone: 0,
  });

  // Load High Score on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("dino_runner_high_score");
      if (saved) setHighScore(parseInt(saved, 10) || 0);
    } catch {}
  }, []);

  const toggleMute = () => {
    soundManager.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Draw Pixel Sprites on 2D Context
  const drawSprite = (ctx, charId, x, y, isDucking, legStep, crashed) => {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));

    let fill = "#535353";
    if (charId === "cat") fill = "#2c3e50";
    if (charId === "cow") fill = "#34495e";
    if (charId === "rhino") fill = "#4a4a4a";

    ctx.fillStyle = fill;

    if (charId === "dino") {
      // Classic Chrome T-Rex runner
      if (isDucking) {
        ctx.fillRect(0, 20, 56, 18);
        ctx.fillRect(44, 14, 18, 14);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(52, 16, 4, 4);
        ctx.fillStyle = fill;
        if (legStep === 0) {
          ctx.fillRect(18, 38, 7, 9);
          ctx.fillRect(36, 38, 7, 5);
        } else {
          ctx.fillRect(18, 38, 7, 5);
          ctx.fillRect(36, 38, 7, 9);
        }
      } else {
        // Body & Tail
        ctx.fillRect(0, 20, 10, 14);
        ctx.fillRect(7, 16, 10, 20);
        ctx.fillRect(14, 12, 16, 28);
        ctx.fillRect(21, 7, 16, 32);
        // Head & Snout
        ctx.fillRect(25, 0, 23, 18);
        ctx.fillRect(34, 5, 16, 11);
        // Eye
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(crashed ? 36 : 32, 5, 4, 4);
        ctx.fillStyle = fill;
        if (crashed) {
          ctx.fillRect(36, 5, 4, 1);
          ctx.fillRect(37, 4, 1, 4);
        }
        // Mouth slit
        ctx.clearRect(40, 12, 10, 2);
        // Little Arm
        ctx.fillRect(36, 21, 9, 3);
        ctx.fillRect(42, 24, 3, 5);

        // Legs
        if (crashed) {
          ctx.fillRect(18, 39, 5, 14);
          ctx.fillRect(27, 39, 5, 14);
        } else if (legStep === 0) {
          ctx.fillRect(18, 39, 5, 15);
          ctx.fillRect(18, 52, 7, 2);
          ctx.fillRect(30, 39, 5, 9);
        } else {
          ctx.fillRect(18, 39, 5, 9);
          ctx.fillRect(30, 39, 5, 15);
          ctx.fillRect(30, 52, 7, 2);
        }
      }
    } else if (charId === "cat") {
      // Speedy Cat Sprite
      if (isDucking) {
        ctx.fillRect(4, 20, 46, 16);
        ctx.fillRect(42, 12, 14, 14);
        ctx.fillRect(42, 7, 4, 5);
        ctx.fillRect(52, 7, 4, 5);
        ctx.fillRect(0, 14, 4, 12);
        ctx.fillRect(0, 12, 9, 3);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(48, 15, 3, 3);
        ctx.fillStyle = fill;
        if (legStep === 0) {
          ctx.fillRect(14, 36, 7, 9);
          ctx.fillRect(36, 36, 7, 5);
        } else {
          ctx.fillRect(14, 36, 7, 5);
          ctx.fillRect(36, 36, 7, 9);
        }
      } else {
        // Tail
        ctx.fillRect(0, 14, 5, 16);
        ctx.fillRect(2, 9, 5, 7);
        ctx.fillRect(7, 7, 5, 4);
        // Body
        ctx.fillRect(7, 18, 30, 21);
        // Neck & Head
        ctx.fillRect(30, 9, 18, 18);
        // Pointy Ears
        ctx.fillRect(32, 2, 5, 7);
        ctx.fillRect(43, 2, 5, 7);
        // Snout & Whiskers
        ctx.fillRect(48, 16, 5, 7);
        ctx.fillRect(53, 17, 5, 1);
        ctx.fillRect(53, 21, 5, 1);
        // Eye
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(41, 13, 4, 4);
        ctx.fillStyle = fill;
        if (crashed) {
          ctx.fillRect(40, 14, 6, 1);
        }
        // Running Paws
        if (legStep === 0) {
          ctx.fillRect(12, 39, 6, 15);
          ctx.fillRect(10, 52, 8, 2);
          ctx.fillRect(28, 39, 6, 9);
        } else {
          ctx.fillRect(12, 39, 6, 9);
          ctx.fillRect(28, 39, 6, 15);
          ctx.fillRect(26, 52, 8, 2);
        }
      }
    } else if (charId === "cow") {
      // Mighty Cow Sprite
      if (isDucking) {
        ctx.fillRect(4, 18, 48, 18);
        ctx.fillRect(44, 14, 16, 14);
        ctx.fillStyle = "#e67e22";
        ctx.fillRect(46, 9, 4, 5);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(18, 20, 14, 9);
        ctx.fillRect(50, 16, 4, 4);
        ctx.fillStyle = fill;
        if (legStep === 0) {
          ctx.fillRect(14, 36, 7, 9);
          ctx.fillRect(36, 36, 7, 6);
        } else {
          ctx.fillRect(14, 36, 7, 6);
          ctx.fillRect(36, 36, 7, 9);
        }
      } else {
        // Body
        ctx.fillRect(7, 14, 32, 25);
        // White patches
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(14, 18, 9, 9);
        ctx.fillRect(25, 23, 7, 9);
        ctx.fillStyle = fill;
        // Head & Snout
        ctx.fillRect(32, 7, 18, 18);
        ctx.fillRect(44, 14, 9, 11);
        // Horns
        ctx.fillStyle = "#f39c12";
        ctx.fillRect(34, 0, 4, 7);
        ctx.fillRect(43, 0, 4, 7);
        ctx.fillStyle = fill;
        // Eye
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(39, 10, 4, 4);
        ctx.fillStyle = fill;
        // Tail
        ctx.fillRect(2, 16, 5, 14);
        ctx.fillRect(0, 28, 5, 6);
        // Hooves
        if (legStep === 0) {
          ctx.fillRect(12, 39, 7, 15);
          ctx.fillRect(28, 39, 7, 10);
        } else {
          ctx.fillRect(12, 39, 7, 10);
          ctx.fillRect(28, 39, 7, 15);
        }
      }
    } else if (charId === "rhino") {
      // Armored Rhino Sprite
      if (isDucking) {
        ctx.fillRect(2, 18, 50, 18);
        ctx.fillRect(41, 14, 16, 14);
        ctx.fillStyle = "#bdc3c7";
        ctx.fillRect(52, 7, 6, 9);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(46, 16, 4, 4);
        ctx.fillStyle = fill;
        if (legStep === 0) {
          ctx.fillRect(14, 36, 8, 9);
          ctx.fillRect(36, 36, 8, 6);
        } else {
          ctx.fillRect(14, 36, 8, 6);
          ctx.fillRect(36, 36, 8, 9);
        }
      } else {
        // Armored back ridge
        ctx.fillRect(5, 11, 37, 28);
        ctx.fillRect(9, 7, 9, 5);
        ctx.fillRect(23, 7, 9, 5);
        // Head
        ctx.fillRect(32, 14, 18, 18);
        // Large Horn
        ctx.fillStyle = "#bdc3c7";
        ctx.fillRect(48, 7, 6, 14);
        ctx.fillRect(50, 2, 4, 7);
        // Small horn
        ctx.fillRect(42, 9, 4, 6);
        ctx.fillStyle = fill;
        // Small tail
        ctx.fillRect(0, 21, 5, 9);
        // Eye
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(39, 17, 4, 4);
        ctx.fillStyle = fill;
        // Sturdy legs
        if (legStep === 0) {
          ctx.fillRect(12, 39, 8, 15);
          ctx.fillRect(28, 39, 8, 10);
        } else {
          ctx.fillRect(12, 39, 8, 10);
          ctx.fillRect(28, 39, 8, 15);
        }
      }
    }

    ctx.restore();
  };

  // Draw Pterodactyl Bird Obstacle
  const drawBird = (ctx, x, y, wingUp) => {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    ctx.fillStyle = "#535353";

    ctx.fillRect(12, 14, 21, 9);
    ctx.fillRect(0, 16, 14, 6);
    ctx.fillRect(5, 12, 9, 6);

    if (wingUp) {
      ctx.fillRect(16, 0, 9, 14);
      ctx.fillRect(21, 2, 9, 7);
    } else {
      ctx.fillRect(16, 21, 9, 14);
      ctx.fillRect(21, 26, 9, 7);
    }

    ctx.restore();
  };

  // Draw Cactus Obstacles
  const drawCactus = (ctx, x, y, type) => {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    ctx.fillStyle = "#535353";

    if (type === "small") {
      ctx.fillRect(7, 0, 7, 42);
      ctx.fillRect(0, 9, 7, 16);
      ctx.fillRect(0, 9, 14, 6);
      ctx.fillRect(14, 14, 7, 14);
      ctx.fillRect(7, 14, 14, 6);
    } else if (type === "double") {
      ctx.fillRect(5, 5, 6, 37);
      ctx.fillRect(0, 12, 5, 12);
      ctx.fillRect(18, 0, 7, 42);
      ctx.fillRect(25, 9, 5, 14);
    } else {
      ctx.fillRect(12, 0, 9, 58);
      ctx.fillRect(2, 14, 9, 23);
      ctx.fillRect(2, 14, 19, 7);
      ctx.fillRect(21, 19, 9, 23);
      ctx.fillRect(12, 19, 19, 7);
    }
    ctx.restore();
  };

  // Restart Engine Run
  const restartGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const groundY = 205;
    const engine = engineRef.current;

    engine.score = 0;
    engine.speed = 3.6; // Gentle, relaxed initial start speed
    engine.distance = 0;
    engine.nextObstacleDistance = 140;
    engine.obstacles = [];
    engine.clouds = [
      { x: 150, y: 40, speed: 0.4 },
      { x: 420, y: 30, speed: 0.35 },
      { x: 720, y: 55, speed: 0.5 },
      { x: 920, y: 35, speed: 0.4 },
    ];
    engine.groundPebbles = [
      { x: 60, w: 3 }, { x: 210, w: 5 }, { x: 340, w: 2 }, { x: 520, w: 4 }, { x: 740, w: 3 }, { x: 910, w: 4 },
    ];
    engine.player = {
      x: 55,
      y: groundY - 54,
      baseY: groundY - 54,
      vy: 0,
      width: 50,
      height: 54,
      isGrounded: true,
      isDucking: false,
      legStep: 0,
      stepTimer: 0,
      crashed: false,
    };
    engine.nightMode = false;
    engine.nightAlpha = 0;
    engine.lastMilestone = 0;

    setScore(0);
    setGameState("running");
  }, []);

  // Jump Action
  const handleJump = useCallback(() => {
    const engine = engineRef.current;
    if (gameState === "idle" || gameState === "gameover") {
      restartGame();
      soundManager.playJump();
      return;
    }
    if (engine.player.isGrounded && !engine.player.isDucking) {
      engine.player.vy = -12.2;
      engine.player.isGrounded = false;
      soundManager.playJump();
    }
  }, [gameState, restartGame]);

  // Duck Action
  const handleDuck = useCallback((ducking) => {
    const engine = engineRef.current;
    if (gameState !== "running") return;
    engine.player.isDucking = ducking;
    if (ducking && !engine.player.isGrounded) {
      engine.player.vy += 5;
    }
  }, [gameState]);

  // Keyboard Listeners
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        setIsJumpPressed(true);
        handleJump();
      } else if (e.code === "ArrowDown") {
        e.preventDefault();
        setIsDuckPressed(true);
        handleDuck(true);
      }
    };

    const onKeyUp = (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        setIsJumpPressed(false);
      } else if (e.code === "ArrowDown") {
        setIsDuckPressed(false);
        handleDuck(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [isOpen, gameState, handleJump, handleDuck]);

  // Main 60FPS Game Loop
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const groundY = 205;
    const engine = engineRef.current;
    engine.player.baseY = groundY - 54;
    if (gameState === "idle") {
      engine.player.y = groundY - 54;
    }

    let lastTick = performance.now();

    const loop = (currentTime) => {
      const dt = Math.min((currentTime - lastTick) / 1000, 0.1);
      lastTick = currentTime;

      const width = canvas.width;
      const height = canvas.height;

      // Update simulation if running
      if (gameState === "running") {
        engine.distance += engine.speed;
        const currentScore = Math.floor(engine.distance / 10);
        engine.score = currentScore;
        setScore(currentScore);

        // Milestone audio every 100 points
        if (currentScore > 0 && currentScore % 100 === 0 && currentScore !== engine.lastMilestone) {
          engine.lastMilestone = currentScore;
          soundManager.playScore();
        }

        // Night / Day cycle every 700 points
        const cycle = Math.floor(currentScore / 700) % 2;
        engine.nightMode = cycle === 1;
        if (engine.nightMode && engine.nightAlpha < 1) engine.nightAlpha = Math.min(1, engine.nightAlpha + 0.02);
        if (!engine.nightMode && engine.nightAlpha > 0) engine.nightAlpha = Math.max(0, engine.nightAlpha - 0.02);

        // Gentle progressive acceleration starting from 3.6
        engine.speed = 3.6 + Math.min(8.5, (currentScore / 180) * 0.45);

        // Player physics
        const p = engine.player;
        if (!p.isGrounded) {
          p.vy += 0.58; // gentle gravity
          p.y += p.vy;
          if (p.y >= p.baseY) {
            p.y = p.baseY;
            p.vy = 0;
            p.isGrounded = true;
          }
        }

        // Step legs
        p.stepTimer += dt;
        if (p.stepTimer > 0.09) {
          p.stepTimer = 0;
          p.legStep = p.legStep === 0 ? 1 : 0;
        }

        // Move Ground pebbles
        engine.groundOffset = (engine.groundOffset + engine.speed) % width;
        engine.groundPebbles.forEach((pebble) => {
          pebble.x -= engine.speed;
          if (pebble.x < -10) pebble.x = width + Math.random() * 80;
        });

        // Move Clouds
        engine.clouds.forEach((cloud) => {
          cloud.x -= cloud.speed;
          if (cloud.x < -60) {
            cloud.x = width + Math.random() * 120;
            cloud.y = 25 + Math.random() * 50;
          }
        });

        // Spawn obstacles
        engine.nextObstacleDistance -= engine.speed;
        if (engine.nextObstacleDistance <= 0) {
          const spawnBird = currentScore > 350 && Math.random() > 0.65;
          if (spawnBird) {
            const birdHeights = [groundY - 30, groundY - 55, groundY - 80];
            const birdY = birdHeights[Math.floor(Math.random() * birdHeights.length)];
            engine.obstacles.push({
              type: "bird",
              x: width + 30,
              y: birdY,
              width: 38,
              height: 26,
              wingTimer: 0,
              wingUp: false,
            });
          } else {
            const types = ["small", "double", "large"];
            const t = types[Math.floor(Math.random() * types.length)];
            const obsH = t === "large" ? 58 : 42;
            const obsW = t === "double" ? 34 : (t === "large" ? 28 : 22);
            engine.obstacles.push({
              type: t,
              x: width + 30,
              y: groundY - obsH,
              width: obsW,
              height: obsH,
            });
          }

          // Gap between obstacles proportional to current speed
          engine.nextObstacleDistance = Math.floor(250 + Math.random() * 260 + (engine.speed * 14));
        }

        // Move obstacles and collision detect
        for (let i = engine.obstacles.length - 1; i >= 0; i--) {
          const obs = engine.obstacles[i];
          obs.x -= engine.speed;

          if (obs.type === "bird") {
            obs.wingTimer = (obs.wingTimer || 0) + dt;
            if (obs.wingTimer > 0.15) {
              obs.wingTimer = 0;
              obs.wingUp = !obs.wingUp;
            }
          }

          // Collision Box
          const pBox = {
            x: p.x + 10,
            y: p.y + (p.isDucking ? 20 : 8),
            w: p.isDucking ? 48 : 34,
            h: p.isDucking ? 28 : 44,
          };
          const obsBox = {
            x: obs.x + 4,
            y: obs.y + 4,
            w: obs.width - 8,
            h: obs.height - 6,
          };

          if (
            pBox.x < obsBox.x + obsBox.w &&
            pBox.x + pBox.w > obsBox.x &&
            pBox.y < obsBox.y + obsBox.h &&
            pBox.y + pBox.h > obsBox.y
          ) {
            engine.player.crashed = true;
            soundManager.playHit();
            setGameState("gameover");

            const finalScore = engine.score;
            setHighScore((prev) => {
              const updated = Math.max(prev, finalScore);
              try {
                localStorage.setItem("dino_runner_high_score", updated.toString());
              } catch {}
              return updated;
            });
            break;
          }

          if (obs.x < -80) {
            engine.obstacles.splice(i, 1);
          }
        }
      }

      // ----------------------------------------------------
      // DRAW CANVAS FRAME
      // ----------------------------------------------------
      // Spacious White Gaming Arcade Screen
      ctx.fillStyle = "#f8f9fa";
      ctx.fillRect(0, 0, width, height);

      // Night Mode Overlay
      if (engine.nightAlpha > 0) {
        ctx.fillStyle = `rgba(20, 20, 20, ${engine.nightAlpha * 0.95})`;
        ctx.fillRect(0, 0, width, height);
      }

      // Draw Clouds
      ctx.fillStyle = engine.nightMode ? "#333333" : "#d3d3d3";
      engine.clouds.forEach((cloud) => {
        ctx.fillRect(cloud.x, cloud.y, 44, 12);
        ctx.fillRect(cloud.x + 10, cloud.y - 8, 24, 8);
      });

      // Draw Moon / Stars in night mode
      if (engine.nightAlpha > 0.2) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(width - 80, 25, 20, 20);
        ctx.fillStyle = `rgba(20, 20, 20, ${engine.nightAlpha * 0.95})`;
        ctx.fillRect(width - 75, 22, 18, 18);
      }

      // Draw Ground Horizon Line
      ctx.fillStyle = engine.nightMode ? "#666666" : "#535353";
      ctx.fillRect(0, groundY, width, 2);

      // Draw Ground Pebble Texture
      engine.groundPebbles.forEach((pebble) => {
        ctx.fillRect(pebble.x, groundY + 5, pebble.w, 2);
      });

      // Draw Obstacles
      engine.obstacles.forEach((obs) => {
        if (obs.type === "bird") {
          drawBird(ctx, obs.x, obs.y, obs.wingUp);
        } else {
          drawCactus(ctx, obs.x, obs.y, obs.type);
        }
      });

      // Draw Selected Character Runner
      drawSprite(
        ctx,
        selectedChar,
        engine.player.x,
        engine.player.y,
        engine.player.isDucking,
        engine.player.legStep,
        engine.player.crashed
      );

      // Idle / Start Banner
      if (gameState === "idle") {
        ctx.fillStyle = engine.nightMode ? "#ffffff" : "#444444";
        ctx.font = "bold 15px var(--font-heading), Sora, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("PRESS SPACE OR TAP TO JUMP & START", width / 2, groundY - 80);
      }

      // Game Over Screen
      if (gameState === "gameover") {
        ctx.fillStyle = engine.nightMode ? "#ffffff" : "#222222";
        ctx.font = "bold 20px var(--font-heading), Sora, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("G A M E   O V E R", width / 2, groundY - 85);

        ctx.font = "13px var(--font-heading), Sora, sans-serif";
        ctx.fillStyle = engine.nightMode ? "#aaaaaa" : "#666666";
        ctx.fillText("PRESS SPACE OR CLICK TO RESTART", width / 2, groundY - 58);

        // Circular restart symbol
        const rx = width / 2;
        const ry = groundY - 30;
        ctx.beginPath();
        ctx.arc(rx, ry, 13, 0.4, Math.PI * 1.8);
        ctx.strokeStyle = engine.nightMode ? "#ffffff" : "#535353";
        ctx.lineWidth = 2.8;
        ctx.stroke();
      }

      engine.animationFrameId = requestAnimationFrame(loop);
    };

    engine.animationFrameId = requestAnimationFrame(loop);

    return () => {
      if (engine.animationFrameId) {
        cancelAnimationFrame(engine.animationFrameId);
      }
    };
  }, [isOpen, gameState, selectedChar]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={onClose}
        />

        {/* Big Spacious Arcade Modal */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-6xl rounded-3xl border border-white/15 bg-[#0f0f0f] shadow-2xl overflow-hidden z-10 flex flex-col"
        >
          {/* Top Bar: Title, Pixel Character Selector, Audio, High Score */}
          <div className="px-6 py-4 border-b border-white/[0.08] bg-white/[0.03] flex flex-wrap items-center justify-between gap-4">
            {/* Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ef745c]/30 to-[#34073d]/30 border border-[#ef745c]/40 flex items-center justify-center text-white shrink-0 shadow-[0_0_15px_rgba(239,116,92,0.25)]">
                <Sparkles size={18} className="text-[#ef745c]" />
              </div>
              <div>
                <h3 className="text-white text-base font-bold font-[family-name:var(--font-heading)] tracking-wider uppercase flex items-center gap-2">
                  CHROME RUNNER ARCADE
                  <span className="px-2 py-0.5 rounded text-[10px] font-[family-name:var(--font-heading)] uppercase tracking-widest bg-[#ef745c]/20 text-[#ef745c] border border-[#ef745c]/30">
                    Pro
                  </span>
                </h3>
                <p className="text-[#888888] text-xs font-[family-name:var(--font-sans)]">
                  Pick your runner icon above & dodge oncoming obstacles
                </p>
              </div>
            </div>

            {/* Pixel Character Selector Icons on Top */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/10 shadow-inner">
              {CHARACTERS.map((char) => {
                const isSelected = selectedChar === char.id;
                const IconComponent = char.Icon;
                return (
                  <button
                    key={char.id}
                    onClick={() => {
                      setSelectedChar(char.id);
                      soundManager.playJump();
                    }}
                    className={`group relative flex flex-col items-center justify-center px-3.5 py-2 rounded-xl transition-all ${
                      isSelected
                        ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)] scale-105"
                        : "text-[#888888] hover:text-white hover:bg-white/[0.06]"
                    }`}
                    title={char.description}
                  >
                    <IconComponent
                      className={`w-7 h-7 transition-transform group-hover:scale-110 ${
                        isSelected ? "text-black" : "text-[#cccccc]"
                      }`}
                    />
                    <span
                      className={`text-[10px] font-bold font-[family-name:var(--font-heading)] tracking-wider uppercase mt-1 ${
                        isSelected ? "text-black" : "text-[#777777]"
                      }`}
                    >
                      {char.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Audio Toggle, High Score & Close */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-[family-name:var(--font-heading)] text-[#aaaaaa] bg-white/[0.04] px-4 py-2 rounded-2xl border border-white/[0.08]">
                <Trophy size={14} className="text-yellow-400" />
                <span className="text-[#666666] tracking-wider">HI:</span>
                <span className="text-white font-bold text-sm tracking-widest font-mono">
                  {highScore.toString().padStart(5, "0")}
                </span>
              </div>

              <button
                onClick={toggleMute}
                className="p-2.5 rounded-2xl border border-white/10 text-[#aaaaaa] hover:text-white hover:bg-white/[0.06] transition-colors"
                title={isMuted ? "Unmute sound" : "Mute sound"}
              >
                {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
              </button>

              <button
                onClick={onClose}
                className="p-2.5 rounded-2xl border border-white/10 text-[#aaaaaa] hover:text-white hover:bg-white/[0.06] transition-colors"
                title="Close arcade modal"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Large Game Area - White Gaming Canvas Screen */}
          <div className="p-4 md:p-8 flex flex-col items-center justify-center bg-black">
            <div className="w-full relative rounded-3xl overflow-hidden border border-white/15 shadow-[0_0_50px_rgba(0,0,0,0.8)] bg-[#f8f9fa]">
              {/* Score Overlay */}
              <div className="absolute top-4 right-6 font-[family-name:var(--font-heading)] text-base tracking-widest flex items-center gap-4 text-[#535353] select-none z-10">
                {highScore > 0 && (
                  <span className="opacity-50 text-sm">HI {highScore.toString().padStart(5, "0")}</span>
                )}
                <span className="font-extrabold text-xl text-[#111111] font-mono tracking-widest">
                  {score.toString().padStart(5, "0")}
                </span>
              </div>

              {/* Active Runner Badge Overlay */}
              <div className="absolute top-4 left-6 font-[family-name:var(--font-heading)] text-xs tracking-wider uppercase px-3 py-1.5 rounded-xl bg-black/10 backdrop-blur-md text-[#333333] select-none z-10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ef745c] animate-pulse" />
                Runner: <span className="font-bold text-[#111111]">{CHARACTERS.find((c) => c.id === selectedChar)?.name}</span>
              </div>

              {/* High-Resolution Big Game Canvas */}
              <canvas
                ref={canvasRef}
                width={1000}
                height={260}
                onClick={handleJump}
                className="w-full h-auto block cursor-pointer select-none aspect-[1000/260]"
                style={{ imageRendering: "pixelated" }}
              />
            </div>

            {/* Bottom Controls Legend and On-Screen Action Buttons */}
            <div className="w-full mt-6 flex items-center justify-between text-xs text-[#888888] flex-wrap gap-4 font-[family-name:var(--font-sans)]">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.04] text-white font-[family-name:var(--font-heading)] text-xs font-semibold">
                  SPACE / UP
                </span>
                <span className="text-[#aaaaaa]">Jump</span>
                <span className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.04] text-white font-[family-name:var(--font-heading)] text-xs font-semibold ml-2">
                  DOWN
                </span>
                <span className="text-[#aaaaaa]">Duck</span>
                <span className="text-[#555555] text-xs ml-3 hidden sm:inline">
                  Speed scales up with your score
                </span>
              </div>

              {/* Touch Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onMouseDown={() => { setIsDuckPressed(true); handleDuck(true); }}
                  onMouseUp={() => { setIsDuckPressed(false); handleDuck(false); }}
                  onTouchStart={(e) => { e.preventDefault(); setIsDuckPressed(true); handleDuck(true); }}
                  onTouchEnd={(e) => { e.preventDefault(); setIsDuckPressed(false); handleDuck(false); }}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-[family-name:var(--font-heading)] font-bold tracking-wider uppercase transition-all ${
                    isDuckPressed
                      ? "bg-white text-black scale-95"
                      : "bg-white/[0.06] border border-white/15 text-white hover:bg-white/[0.12]"
                  }`}
                >
                  DUCK
                </button>
                <button
                  onMouseDown={() => { setIsJumpPressed(true); handleJump(); }}
                  onMouseUp={() => setIsJumpPressed(false)}
                  onTouchStart={(e) => { e.preventDefault(); setIsJumpPressed(true); handleJump(); }}
                  onTouchEnd={(e) => { e.preventDefault(); setIsJumpPressed(false); }}
                  className={`px-8 py-2.5 rounded-2xl text-xs font-[family-name:var(--font-heading)] font-bold tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(239,116,92,0.3)] ${
                    isJumpPressed
                      ? "bg-[#ef745c] text-white scale-95"
                      : "bg-gradient-to-r from-white to-[#eeeeee] text-black hover:opacity-95"
                  }`}
                >
                  JUMP
                </button>
                {gameState === "gameover" && (
                  <button
                    onClick={restartGame}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-white/20 text-white hover:bg-white hover:text-black transition-all text-xs font-[family-name:var(--font-heading)] font-bold tracking-wider uppercase"
                  >
                    <RotateCcw size={14} /> Play Again
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
