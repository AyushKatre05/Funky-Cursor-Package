import React, { useEffect, useRef } from "react";

type ParticleLineTrailProps = {
  color?: string;            // Color of the lines and particles
  size?: number;             // Size of the particles
  trails?: number;           // Number of lines per trail
  lifespan?: number;         // Lifespan of each line in milliseconds
  lineWidth?: number;        // Width of the lines
};

const ParticleLineTrailCursor: React.FC<ParticleLineTrailProps> = ({
  color = "#00f",
  size = 5,
  trails = 10,
  lifespan = 1000,
  lineWidth = 2
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!ctx) return;

    let particles: Particle[] = [];
    let lines: Line[] = [];
    let running = true;

    class Particle {
      x: number;
      y: number;
      creationTime: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.creationTime = Date.now();
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

    class Line {
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      creationTime: number;

      constructor(startX: number, startY: number, endX: number, endY: number) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.creationTime = Date.now();
      }

      draw() {
        ctx!.beginPath();
        ctx!.moveTo(this.startX, this.startY);
        ctx!.lineTo(this.endX, this.endY);
        ctx!.strokeStyle = color;
        ctx!.lineWidth = lineWidth;
        ctx!.stroke();
        ctx!.closePath();
      }

      isExpired() {
        return Date.now() - this.creationTime > lifespan;
      }
    }

    const renderAnimation = () => {
      if (running) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        particles.forEach(particle => particle.draw());
        lines.forEach(line => line.draw());
        particles = particles.filter(p => !p.isExpired());
        lines = lines.filter(l => !l.isExpired());
        window.requestAnimationFrame(renderAnimation);
      }
    };

    const move = (event: MouseEvent | TouchEvent) => {
      const x = event instanceof MouseEvent ? event.clientX : event.touches[0].pageX;
      const y = event instanceof MouseEvent ? event.clientY : event.touches[0].pageY;

      for (let i = 0; i < trails; i++) {
        particles.push(new Particle(x, y));
        if (particles.length > 1) {
          const lastParticle = particles[particles.length - 2];
          lines.push(new Line(lastParticle.x, lastParticle.y, x, y));
        }
      }
    };

    const resizeCanvas = () => {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    };

    // Start the animation
    window.addEventListener("mousemove", move);
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    renderAnimation();

    return () => {
      running = false;
      window.removeEventListener("mousemove", move);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [color, size, trails, lifespan, lineWidth]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none" />;
};

export default ParticleLineTrailCursor;
