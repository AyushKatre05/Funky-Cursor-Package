import React, { useEffect, useRef } from "react";

type SpiralLineTrailProps = {
  color?: string;       // Color of the spiral line
  width?: number;       // Width of the spiral line
  length?: number;      // Length of the spiral trail
  turns?: number;       // Number of turns in the spiral
  spacing?: number;     // Spacing between lines in the spiral
};

const SpiralLineTrailCursor: React.FC<SpiralLineTrailProps> = ({
  color = "#00FF00",
  width = 2,
  length = 10,
  turns = 7,
  spacing = 2
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
          const centerX = trail.x;
          const centerY = trail.y;
          ctx.beginPath();
          for (let i = 0; i < length; i++) {
            const angle = i / turns;
            const radius = i * spacing;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            ctx.lineTo(x, y);
          }
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
  }, [color, width, length, turns, spacing]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none" />;
};

export default SpiralLineTrailCursor;
