"use client";

import React, { useEffect, useRef } from 'react';

/**
 * SIERRA BLU — GRAVITY WARP VISUAL SYSTEM V12.1
 * A high-performance canvas animation simulating gravitational lensing
 * using Burnished Gold (#D4AF37) and Electric Cyan (#4299E1).
 */
class Particle {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.5;
    this.speedX = Math.random() * 0.4 - 0.2;
    this.speedY = Math.random() * 0.4 - 0.2;
    this.opacity = Math.random() * 0.6 + 0.2;
    // Mix Gold and Cyan particles for 'Intelligence' feel
    this.color = Math.random() > 0.8 ? '#4299E1' : '#D4AF37';
  }

  update(mouse: { x: number; y: number; active: boolean }) {
    this.x += this.speedX;
    this.y += this.speedY;

    if (mouse.active) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 250) {
        // Smooth gravitational pull
        this.x += dx * 0.015;
        this.y += dy * 0.015;
      }
    }

    if (this.x > this.canvas.width) this.x = 0;
    if (this.x < 0) this.x = this.canvas.width;
    if (this.y > this.canvas.height) this.y = 0;
    if (this.y < 0) this.y = this.canvas.height;
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.globalAlpha = this.opacity;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.globalAlpha = 1.0;
  }
}

export default function GravityWarp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 80;

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas, ctx));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Multi-layered radial glow (Gold Core, Cyan Edge)
      if (mouse.current.active) {
        const gradient = ctx.createRadialGradient(
          mouse.current.x, mouse.current.y, 0,
          mouse.current.x, mouse.current.y, 400
        );
        gradient.addColorStop(0, 'rgba(212, 175, 55, 0.12)'); // Gold center
        gradient.addColorStop(0.5, 'rgba(66, 153, 225, 0.05)'); // Cyan edge
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      particles.forEach(p => {
        p.update(mouse.current);
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      mouse.current.active = true;
      
      // Pass coordinates to CSS for CSS-based parallax
      document.documentElement.style.setProperty('--mouse-x', `${(e.clientX / window.innerWidth - 0.5) * 20}px`);
      document.documentElement.style.setProperty('--mouse-y', `${(e.clientY / window.innerHeight - 0.5) * 20}px`);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    init();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="block"
        style={{ filter: 'blur(0.5px)' }}
      />
      {/* Cinematic Fog Layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050B14]/20 to-[#050B14]" />
    </div>
  );
}
