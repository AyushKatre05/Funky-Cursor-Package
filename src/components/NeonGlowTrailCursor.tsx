import React, { useEffect, useRef } from "react";

type NeonGlowTrailProps = {
  color?: string;
  size?: number;
  trails?: number;
  speed?: number;
  lifespan?: number;
  glowIntensity?: number;
};

const NeonGlowTrailCursor: React.FC<NeonGlowTrailProps> = ({
  color = "#00ff00",
  size = 6,
  trails = 15,
  speed = 2,
  lifespan = 500,
  glowIntensity = 20
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!ctx) return;

    let particles: Particle[] = [];
    let running = true;

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      creationTime: number;
      alpha: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = (Math.random() - 0.5) * speed;
        this.creationTime = Date.now();
        this.alpha = 1; // Start with full opacity
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.95;
        this.vy *= 0.95;
        this.alpha -= 1 / (lifespan / 20); // Fade out effect
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${this.alpha})`;
        ctx!.shadowColor = color;
        ctx!.shadowBlur = glowIntensity;
        ctx!.fill();
        ctx!.closePath();
      }

      isExpired() {
        return this.alpha <= 0;
      }
    }

    const renderAnimation = () => {
      if (running) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        particles.forEach(particle => {
          particle.update();
          particle.draw();
        });
        particles = particles.filter(p => !p.isExpired());
        window.requestAnimationFrame(renderAnimation);
      }
    };

    const move = (event: MouseEvent | TouchEvent) => {
      const x = event instanceof MouseEvent ? event.clientX : event.touches[0].pageX;
      const y = event instanceof MouseEvent ? event.clientY : event.touches[0].pageY;

      for (let i = 0; i < trails; i++) {
        particles.push(new Particle(x, y));
      }
    };

    const resizeCanvas = () => {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    renderAnimation();

    return () => {
      running = false;
      window.removeEventListener("mousemove", move);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [color, size, trails, speed, lifespan, glowIntensity]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none" />;
};

export default NeonGlowTrailCursor;
