import React, { useEffect, useRef } from "react";

type RainbowTrailProps = {
  size?: number;
  trails?: number;
  speed?: number;
  lifespan?: number;
  rainbowSpeed?: number;
};

const RainbowTrailCursor: React.FC<RainbowTrailProps> = ({
  size = 5,
  trails = 15,
  speed = 3,
  lifespan = 400,
  rainbowSpeed = 0.05
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!ctx) return;

    let particles: Particle[] = [];
    let running = true;

    const getRainbowColor = (offset: number) => {
      const colors = [
        "#FF0000", "#FF7F00", "#FFFF00", "#7FFF00", "#00FF00",
        "#00FF7F", "#00FFFF", "#007FFF", "#0000FF", "#7F00FF",
        "#FF00FF", "#FF007F"
      ];
      return colors[Math.floor((offset + Date.now() * rainbowSpeed) % colors.length)];
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      creationTime: number;
      color: string;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = (Math.random() - 0.5) * speed;
        this.creationTime = Date.now();
        this.color = getRainbowColor(0);
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.color = getRainbowColor(this.creationTime);
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, size, 0, Math.PI * 2);
        ctx!.fillStyle = this.color;
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
  }, [size, trails, speed, lifespan, rainbowSpeed]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none" />;
};

export default RainbowTrailCursor;
