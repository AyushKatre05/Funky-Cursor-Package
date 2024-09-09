import React, { useEffect, useRef } from "react";

type AnimatedConcentricLinesTrailProps = {
  color?: string;        // Color of the concentric lines
  width?: number;        // Width of the lines
  lineCount?: number;    // Number of concentric lines
  spacing?: number;      // Spacing between lines
  speed?: number;        // Speed of animation
};

const AnimatedConcentricLinesTrailCursor: React.FC<AnimatedConcentricLinesTrailProps> = ({
  color = "#00BFFF",
  width = 1,
  lineCount = 7,
  spacing = 2,
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
          for (let i = 0; i < lineCount; i++) {
            const radius = i * spacing + trail.age * speed;
            ctx.beginPath();
            ctx.arc(trail.x, trail.y, radius, 0, Math.PI * 2);
            ctx.stroke();
          }
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
  }, [color, width, lineCount, spacing, speed]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none" />;
};

export default AnimatedConcentricLinesTrailCursor;
