import React, { useEffect, useRef } from "react";

type SparkleTrailProps = {
  color?: string;            // Color of the sparkles
  size?: number;             // Size of the sparkles
  trails?: number;           // Number of sparkles per trail
  lifespan?: number;         // Lifespan of each sparkle in milliseconds
};

const SparkleTrailCursor: React.FC<SparkleTrailProps> = ({
  color = "#ff0",
  size = 4,
  trails = 15,
  lifespan = 500
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!ctx) return;

    let sparkles: Sparkle[] = [];
    let running = true;

    class Sparkle {
      x: number;
      y: number;
      size: number;
      creationTime: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.creationTime = Date.now();
      }

      update() {
        this.size *= 0.95; // Sparkles shrink over time
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fillStyle = color;
        ctx!.fill();
        ctx!.closePath();
      }

      isExpired() {
        return Date.now() - this.creationTime > lifespan || this.size < 0.5;
      }
    }

    const renderAnimation = () => {
      if (running) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        sparkles.forEach(sparkle => {
          sparkle.update();
          sparkle.draw();
        });
        sparkles = sparkles.filter(s => !s.isExpired());
        window.requestAnimationFrame(renderAnimation);
      }
    };

    const move = (event: MouseEvent | TouchEvent) => {
      const x = event instanceof MouseEvent ? event.clientX : event.touches[0].pageX;
      const y = event instanceof MouseEvent ? event.clientY : event.touches[0].pageY;

      for (let i = 0; i < trails; i++) {
        sparkles.push(new Sparkle(x, y));
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
  }, [color, size, trails, lifespan]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none" />;
};

export default SparkleTrailCursor;
