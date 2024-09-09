import React, { useEffect, useRef } from "react";

type GridPatternTrailProps = {
  color?: string;       // Color of the grid lines
  width?: number;       // Width of the grid lines
  gridSize?: number;    // Size of each grid cell
  lineSpacing?: number; // Spacing between grid lines
};

const GridPatternTrailCursor: React.FC<GridPatternTrailProps> = ({
  color = "#FF4500",
  width = 1,
  gridSize = 4,
  lineSpacing = 5
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
          const startX = Math.floor(trail.x / gridSize) * gridSize;
          const startY = Math.floor(trail.y / gridSize) * gridSize;

          ctx.beginPath();
          for (let i = startX; i < canvas!.width; i += gridSize + lineSpacing) {
            ctx.moveTo(i, startY);
            ctx.lineTo(i, canvas!.height);
          }
          for (let i = startY; i < canvas!.height; i += gridSize + lineSpacing) {
            ctx.moveTo(startX, i);
            ctx.lineTo(canvas!.width, i);
          }
          ctx.stroke();
          trail.age++;
        });

        trails = trails.filter(trail => trail.age < 100);
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
  }, [color, width, gridSize, lineSpacing]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none" />;
};

export default GridPatternTrailCursor;
