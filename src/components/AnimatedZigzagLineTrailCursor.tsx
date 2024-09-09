import React, { useEffect, useRef } from "react";

type AnimatedZigzagLineTrailProps = {
  color?: string;       // Color of the zigzag line
  width?: number;       // Width of the zigzag line
  length?: number;      // Length of the zigzag trail
  stepSize?: number;    // Size of each zigzag step
  speed?: number;       // Speed of animation
};

const AnimatedZigzagLineTrailCursor: React.FC<AnimatedZigzagLineTrailProps> = ({
  color = "#FF00FF",
  width = 3,
  length = 100,
  stepSize = 15,
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
          const currentStep = Math.floor(trail.age / speed) % 2 === 0 ? stepSize : -stepSize;
          ctx.beginPath();
          ctx.moveTo(trail.x, trail.y);
          ctx.lineTo(trail.x + currentStep, trail.y);
          ctx.lineTo(trail.x + currentStep, trail.y + stepSize);
          ctx.lineTo(trail.x, trail.y + stepSize);
          ctx.closePath();
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
  }, [color, width, length, stepSize, speed]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none" />;
};

export default AnimatedZigzagLineTrailCursor;
