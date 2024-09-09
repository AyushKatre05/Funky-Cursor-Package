import React, { useEffect, useRef } from "react";

type SwirlTrailProps = {
  color?: string;
  size?: number;
  trails?: number;
  spread?: number;
  lifespan?: number;
};

const SwirlTrailCursor: React.FC<SwirlTrailProps> = ({
  color = "#ff4500",
  size = 6,
  trails = 15,
  spread = 100,
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
      angle: number;
      radius: number;
      creationTime: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.angle = Math.random() * Math.PI * 2;
        this.radius = Math.random() * spread;
        this.creationTime = Date.now();
      }

      update() {
        this.angle += 0.1;
        this.x += Math.cos(this.angle) * this.radius;
        this.y += Math.sin(this.angle) * this.radius;
        this.radius *= 0.98;
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, size, 0, Math.PI * 2);
        ctx!.fillStyle = color;
        ctx!.fill();
        ctx!.closePath();
      }

      isExpired() {
        return Date.now() - this.creationTime > lifespan || this.radius < 1;
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
  }, [color, size, trails, spread, lifespan]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none" />;
};

export default SwirlTrailCursor;
