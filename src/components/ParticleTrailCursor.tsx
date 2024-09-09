import React, { useEffect, useRef } from "react";

type ParticleTrailProps = {
  color?: string;            // Color of the particles
  size?: number;             // Size of the particles
  trails?: number;           // Number of particles per trail
  speed?: number;            // Speed of particle movement
  lifespan?: number;         // Lifespan of each particle in milliseconds
  dampening?: number;        // Dampening for particle smoothness
};

const ParticleTrailCursor: React.FC<ParticleTrailProps> = ({
  color = "#FFD700",
  size = 5,
  trails = 10,
  speed = 2,
  lifespan = 200,
  dampening = 0.9
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

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = (Math.random() - 0.5) * speed;
        this.creationTime = Date.now();
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= dampening;
        this.vy *= dampening;
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
  }, [color, size, trails, speed, lifespan, dampening]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none" />;
};

export default ParticleTrailCursor;
