"use client";
import React, { useEffect, useRef } from "react";

export default function BackgroundGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Configuration
    const particleCount = width < 768 ? 40 : 80; // Fewer dots on mobile
    const connectionDistance = 150;
    const mouseDistance = 200;
    
    // Particle Class
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5; // Speed X
        this.vy = (Math.random() - 0.5) * 0.5; // Speed Y
        this.size = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(99, 102, 241, 0.2)"; // Indigo with low opacity
        ctx.fill();
      }
    }

    // Initialize Particles
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Mouse Tracking
    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Animation Loop
    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Update and Draw Particles
      particles.forEach((particle, i) => {
        particle.update();
        particle.draw();

        // Check connections
        for (let j = i; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = particle.x - p2.x;
          const dy = particle.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99, 102, 241, ${1 - distance / connectionDistance})`; // Fade out line
            ctx.lineWidth = 1;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Mouse Interaction (Connect to mouse)
        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouseDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.15})`; // Faint line to mouse
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none opacity-50" // Low opacity so it doesn't distract
    />
  );
}