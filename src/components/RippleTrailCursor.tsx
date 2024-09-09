import React, { useEffect, useRef } from "react";

type RippleTrailProps = {
  color?: string;            // Color of the ripple
  size?: number;             // Base size of the ripple
  trails?: number;           // Number of ripples per trail
  speed?: number;            // Speed of ripple expansion
  lifespan?: number;         // Lifespan of each ripple in milliseconds
};

const RippleTrailCursor: React.FC<RippleTrailProps> = ({
  color = "#00f",
  size = 10,
  trails = 5,
  speed = 0.5,
  lifespan = 1000
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!ctx) return;

    let ripples: Ripple[] = [];
    let running = true;

    class Ripple {
      x: number;
      y: number;
      radius: number;
      creationTime: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.creationTime = Date.now();
      }

      update() {
        this.radius += speed;
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx!.strokeStyle = color;
        ctx!.lineWidth = 2;
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
        ripples.forEach(ripple => {
          ripple.update();
          ripple.draw();
        });
        ripples = ripples.filter(r => !r.isExpired());
        window.requestAnimationFrame(renderAnimation);
      }
    };

    const move = (event: MouseEvent | TouchEvent) => {
      const x = event instanceof MouseEvent ? event.clientX : event.touches[0].pageX;
      const y = event instanceof MouseEvent ? event.clientY : event.touches[0].pageY;

      for (let i = 0; i < trails; i++) {
        ripples.push(new Ripple(x, y));
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

export default RippleTrailCursor;
