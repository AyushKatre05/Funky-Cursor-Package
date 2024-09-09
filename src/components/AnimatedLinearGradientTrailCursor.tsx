import React, { useEffect, useRef } from "react";

type AnimatedLinearGradientTrailProps = {
  colors?: string[];     // Colors for the gradient
  width?: number;        // Width of the gradient line
  length?: number;       // Length of the trail
  speed?: number;        // Speed of animation
};

const AnimatedLinearGradientTrailCursor: React.FC<AnimatedLinearGradientTrailProps> = ({
  colors = ["#FF6347", "#FFD700"],
  width = 2,
  length = 50,
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

        trails.forEach(trail => {
          const gradient = ctx.createLinearGradient(
            trail.x - length / 2, trail.y - width / 2,
            trail.x + length / 2, trail.y + width / 2
          );
          gradient.addColorStop(0, colors[0]);
          gradient.addColorStop(1, colors[1]);

          ctx.strokeStyle = gradient;
          ctx.lineWidth = width;

          ctx.beginPath();
          ctx.moveTo(trail.x - length / 2, trail.y);
          ctx.lineTo(trail.x + length / 2, trail.y);
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
  }, [colors, width, length, speed]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none" />;
};

export default AnimatedLinearGradientTrailCursor;
