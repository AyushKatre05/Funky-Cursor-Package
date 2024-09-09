import React, { useEffect, useRef } from "react";

type LaserBeamTrailProps = {
  color?: string;          // Color of the laser beam
  width?: number;          // Width of the laser beam
  length?: number;         // Length of the laser beam trail
  speed?: number;          // Speed of the trail
};

const LaserBeamTrailCursor: React.FC<LaserBeamTrailProps> = ({
  color = "#FF0000",
  width = 4,
  length = 100,
  speed = 5
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!ctx) return;

    let trails: { x: number; y: number; age: number }[] = [];
    let running = true;

    const renderAnimation = () => {
      if (running) {
        ctx.clearRect(0, 0, canvas!.width, canvas!.height);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;

        trails.forEach(trail => {
          ctx.beginPath();
          ctx.moveTo(trail.x, trail.y);
          ctx.lineTo(trail.x + speed, trail.y);
          ctx.stroke();
          trail.age++;
        });

        trails = trails.filter(trail => trail.age < length);
        window.requestAnimationFrame(renderAnimation);
      }
    };

    const move = (event: MouseEvent | TouchEvent) => {
      const x = event instanceof MouseEvent ? event.clientX : event.touches[0].pageX;
      const y = event instanceof MouseEvent ? event.clientY : event.touches[0].pageY;

      trails.push({ x, y, age: 0 });
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
  }, [color, width, length, speed]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none" />;
};

export default LaserBeamTrailCursor;
