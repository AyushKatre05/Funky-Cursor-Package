import React, { useEffect, useRef } from "react";

type AnimatedDiagonalLinesTrailProps = {
  color?: string;        // Color of the diagonal lines
  width?: number;        // Width of the diagonal lines
  spacing?: number;      // Spacing between lines
  lineLength?: number;   // Length of each line segment
  speed?: number;        // Speed of animation
};

const AnimatedDiagonalLinesTrailCursor: React.FC<AnimatedDiagonalLinesTrailProps> = ({
  color = "#8A2BE2",
  width = 1,
  spacing = 2,
  lineLength = 10,
  speed = 2
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
          for (let i = 0; i < lineLength; i++) {
            const offset = i * spacing;
            ctx.moveTo(trail.x + offset, trail.y);
            ctx.lineTo(trail.x + offset + lineLength, trail.y + lineLength);
            ctx.moveTo(trail.x, trail.y + offset);
            ctx.lineTo(trail.x + lineLength, trail.y + offset + lineLength);
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
  }, [color, width, spacing, lineLength, speed]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none" />;
};

export default AnimatedDiagonalLinesTrailCursor;
