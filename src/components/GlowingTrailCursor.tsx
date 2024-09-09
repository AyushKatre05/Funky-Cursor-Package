import React, { useEffect, useRef } from "react";

type GlowingTrailProps = {
  color?: string;
  size?: number;
  trails?: number;
  glow?: number;
  lifespan?: number;
};

const GlowingTrailCursor: React.FC<GlowingTrailProps> = ({
  color = "#ff69b4",
  size = 6,
  trails = 15,
  glow = 15,
  lifespan = 500
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
      opacity: number;
      creationTime: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.opacity = 1;
        this.creationTime = Date.now();
      }

      update() {
        this.opacity -= 1 / (lifespan / 20);
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, size, 0, Math.PI * 2);
        ctx!.fillStyle = `${color}`;
        ctx!.globalAlpha = this.opacity;
        ctx!.fill();
        ctx!.globalAlpha = 1;
        ctx!.closePath();
      }

      isExpired() {
        return this.opacity <= 0;
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
  }, [color, size, trails, glow, lifespan]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none" />;
};

export default GlowingTrailCursor;
