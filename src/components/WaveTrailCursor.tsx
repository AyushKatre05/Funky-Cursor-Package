import React, { useEffect, useRef } from "react";

type WaveTrailProps = {
  color?: string;
  size?: number;
  trails?: number;
  speed?: number;
  wavelength?: number;
  amplitude?: number;
  lifespan?: number;
};

const WaveTrailCursor: React.FC<WaveTrailProps> = ({
  color = "#ff4500",
  size = 5,
  trails = 12,
  speed = 2,
  wavelength = 50,
  amplitude = 20,
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
      startY: number;
      creationTime: number;
      offset: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.startY = y;
        this.creationTime = Date.now();
        this.offset = Math.random() * wavelength;
      }

      update() {
        this.y = this.startY + amplitude * Math.sin((Date.now() - this.creationTime) / wavelength + this.offset);
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
  }, [color, size, trails, speed, wavelength, amplitude, lifespan]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none" />;
};

export default WaveTrailCursor;
