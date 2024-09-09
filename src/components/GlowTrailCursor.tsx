import React, { useEffect, useRef } from "react";

type GlowTrailProps = {
  color?: string;            // Color of the glow
  size?: number;             // Size of the glow
  trails?: number;           // Number of glows per trail
  spread?: number;           // Spread of the glow
  lifespan?: number;         // Lifespan of each glow in milliseconds
};

const GlowTrailCursor: React.FC<GlowTrailProps> = ({
  color = "#ff69b4",
  size = 10,
  trails = 10,
  spread = 1.5,
  lifespan = 600
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!ctx) return;

    let glows: Glow[] = [];
    let running = true;

    class Glow {
      x: number;
      y: number;
      alpha: number;
      creationTime: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.alpha = 1;
        this.creationTime = Date.now();
      }

      update() {
        this.alpha *= 0.95; // Fade out effect
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, size * spread, 0, Math.PI * 2);
        ctx!.fillStyle = `${color}${Math.round(this.alpha * 255).toString(16)}`;
        ctx!.fill();
        ctx!.closePath();
      }

      isExpired() {
        return Date.now() - this.creationTime > lifespan || this.alpha < 0.1;
      }
    }

    const renderAnimation = () => {
      if (running) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        glows.forEach(glow => {
          glow.update();
          glow.draw();
        });
        glows = glows.filter(g => !g.isExpired());
        window.requestAnimationFrame(renderAnimation);
      }
    };

    const move = (event: MouseEvent | TouchEvent) => {
      const x = event instanceof MouseEvent ? event.clientX : event.touches[0].pageX;
      const y = event instanceof MouseEvent ? event.clientY : event.touches[0].pageY;

      for (let i = 0; i < trails; i++) {
        glows.push(new Glow(x, y));
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
  }, [color, size, trails, spread, lifespan]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none" />;
};

export default GlowTrailCursor;
