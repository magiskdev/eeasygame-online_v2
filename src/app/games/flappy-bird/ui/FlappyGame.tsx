
'use client';

import React, { useEffect, useRef, useState } from "react";

type Vec2 = { x: number; y: number };

const WIDTH = 420;
const HEIGHT = 600;
const GRAVITY = 0.4;
const FLAP = -7.5;
const PIPE_GAP = 150;
const PIPE_WIDTH = 70;
const PIPE_DIST = 220;
const GROUND = HEIGHT - 60;

type Pipe = { x: number; top: number; bottom: number; passed: boolean };

function makePipe(prevX: number): Pipe {
  const center = 100 + Math.random() * (HEIGHT - 260);
  return {
    x: prevX + PIPE_DIST,
    top: center - PIPE_GAP / 2,
    bottom: HEIGHT - (center + PIPE_GAP / 2),
    passed: false,
  };
}

export const FlappyGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    return Number(localStorage.getItem("best") || 0);
  });

  const bird = useRef<Vec2>({ x: 100, y: HEIGHT / 2 });
  const vel = useRef<Vec2>({ x: 0, y: 0 });
  const pipes = useRef<Pipe[]>([]);
  const raf = useRef<number | null>(null);

  function reset() {
    bird.current = { x: 100, y: HEIGHT / 2 };
    vel.current = { x: 0, y: 0 };
    pipes.current = [makePipe(400), makePipe(400 + PIPE_DIST), makePipe(400 + 2 * PIPE_DIST)];
    setScore(0);
  }

  function start() {
    reset();
    setRunning(true);
  }

  function gameOver() {
    setRunning(false);
    if (score > best) {
      setBest(score);
      localStorage.setItem("best", String(score));
    }
  }

  function flap() {
    if (!running) { start(); } else { vel.current.y = FLAP; }
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") { e.preventDefault(); flap(); }
      if (!running && (e.code === "Enter" || e.code === "KeyR")) { e.preventDefault(); start(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [running]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const drawBackground = () => {
      const grd = ctx.createLinearGradient(0, 0, 0, HEIGHT);
      grd.addColorStop(0, "#1e3a8a");
      grd.addColorStop(1, "#0b1020");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, GROUND, WIDTH, HEIGHT - GROUND);
    };

    const drawBird = (x: number, y: number) => {
      ctx.save(); ctx.translate(x, y);
      const angle = Math.max(-0.6, Math.min(0.6, vel.current.y * 0.06));
      ctx.rotate(angle);
      ctx.fillStyle = "#fbbf24"; ctx.beginPath(); ctx.ellipse(0, 0, 16, 12, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#f59e0b"; ctx.beginPath(); ctx.ellipse(-4, 0, 8, 6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "white"; ctx.beginPath(); ctx.arc(6, -4, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "black"; ctx.beginPath(); ctx.arc(7, -4, 2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#f97316"; ctx.beginPath(); ctx.moveTo(16, -2); ctx.lineTo(26, 0); ctx.lineTo(16, 2); ctx.closePath(); ctx.fill();
      ctx.restore();
    };

    const drawPipes = (ps: Pipe[]) => {
      ps.forEach((p) => {
        ctx.fillStyle = "#22c55e";
        ctx.fillRect(p.x, 0, PIPE_WIDTH, p.top - 20);
        ctx.fillRect(p.x - 5, p.top - 20, PIPE_WIDTH + 10, 20);
        const y = HEIGHT - p.bottom;
        ctx.fillRect(p.x, y, PIPE_WIDTH, p.bottom - 20);
        ctx.fillRect(p.x - 5, y - 20, PIPE_WIDTH + 10, 20);
      });
    };

    const drawHUD = () => {
      ctx.fillStyle = "rgba(0,0,0,0.35)"; ctx.fillRect(10, 10, 110, 56);
      ctx.fillStyle = "white"; ctx.font = "bold 18px ui-sans-serif, system-ui, -apple-system";
      ctx.fillText(`Очки: ${score}`, 20, 35); ctx.fillText(`Рекорд: ${best}`, 20, 58);
      if (!running) {
        ctx.fillStyle = "rgba(0,0,0,0.55)"; ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = "white"; ctx.font = "bold 24px ui-sans-serif, system-ui, -apple-system"; ctx.textAlign = "center";
        ctx.fillText("Нажми ПРОБЕЛ или кликни", WIDTH / 2, HEIGHT / 2 - 20);
        ctx.fillText("чтобы взмахнуть", WIDTH / 2, HEIGHT / 2 + 10); ctx.textAlign = "start";
      }
    };

    const step = () => {
      drawBackground();
      if (running) {
        vel.current.y += 0.4; bird.current.y += vel.current.y;
        pipes.current = pipes.current.map((p) => ({ ...p, x: p.x - 2 }));
        if (pipes.current[0].x + PIPE_WIDTH < -10) {
          pipes.current.shift(); const lastX = pipes.current[pipes.current.length - 1].x; pipes.current.push(makePipe(lastX));
        }
        const b = bird.current;
        if (b.y > GROUND - 12 || b.y < 12) { gameOver(); }
        for (const p of pipes.current) {
          const inX = b.x + 16 > p.x && b.x - 16 < p.x + PIPE_WIDTH;
          const gapTop = p.top; const gapBottom = HEIGHT - p.bottom;
          const inGap = b.y - 12 > gapTop && b.y + 12 < gapBottom;
          if (inX && !inGap) gameOver();
          if (!p.passed && p.x + PIPE_WIDTH < b.x) { p.passed = true; setScore((s) => s + 1); }
        }
      }
      drawPipes(pipes.current); drawBird(bird.current.x, bird.current.y); drawHUD();
      raf.current = requestAnimationFrame(step);
    };
    step(); return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [running, score, best]);

  return (<div className="w-full flex justify-center">
    <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} className="rounded-xl border border-white/10 bg-black/20" onClick={() => { flap(); }} />
  </div>);
};
