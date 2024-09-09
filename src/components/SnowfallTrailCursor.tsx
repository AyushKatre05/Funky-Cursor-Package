import React, { useEffect, useRef } from "react";

type SnowfallTrailProps = {
  color?: string;
  size?: number;
  trails?: number;
  speed?: number;
  lifespan?: number;
};

const SnowfallTrailCursor: React.FC<SnowfallTrailProps> = ({
  color = "#fff",
  size = 4,
  trails = 20,
  speed = 1,
  lifespan = 1000
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
      vy: number;
      creationTime: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.vy = speed;
        this.creationTime = Date.now();
      }

      update() {
        this.y += this.vy;
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, size, 0, Math.PI * 2);
        ctx!.fillStyle = color;
        ctx!.fill();
        ctx!.closePath();
      }

      isExpired() {
        return Date.now() - this.creationTime > lifespan;
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
  }, [color, size, trails, speed, lifespan]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none" />;
};

export default SnowfallTrailCursor;
