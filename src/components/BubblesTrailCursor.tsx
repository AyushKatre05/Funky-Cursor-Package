import React, { useEffect, useRef } from "react";

type BubblesTrailProps = {
  color?: string;            // Color of the bubbles
  size?: number;             // Base size of the bubbles
  trails?: number;           // Number of bubbles per trail
  speed?: number;            // Speed of bubble movement
  lifespan?: number;         // Lifespan of each bubble in milliseconds
};

const BubblesTrailCursor: React.FC<BubblesTrailProps> = ({
  color = "#0f0",
  size = 8,
  trails = 8,
  speed = 1,
  lifespan = 800
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!ctx) return;

    let bubbles: Bubble[] = [];
    let running = true;

    class Bubble {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      creationTime: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.radius = size;
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = (Math.random() - 0.5) * speed;
        this.creationTime = Date.now();
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.radius *= 0.98; // Shrink over time
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
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
        bubbles.forEach(bubble => {
          bubble.update();
          bubble.draw();
        });
        bubbles = bubbles.filter(b => !b.isExpired());
        window.requestAnimationFrame(renderAnimation);
      }
    };

    const move = (event: MouseEvent | TouchEvent) => {
      const x = event instanceof MouseEvent ? event.clientX : event.touches[0].pageX;
      const y = event instanceof MouseEvent ? event.clientY : event.touches[0].pageY;

      for (let i = 0; i < trails; i++) {
        bubbles.push(new Bubble(x, y));
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
  }, [color, size, trails, speed, lifespan]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none" />;
};

export default BubblesTrailCursor;
