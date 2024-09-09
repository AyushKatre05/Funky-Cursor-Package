import React, { useEffect, useRef } from "react";

type InkDropTrailProps = {
  color?: string;         // Color of the ink
  size?: number;          // Size of each ink drop
  trails?: number;        // Number of drops per trail
  spread?: number;        // Spread of the ink drops
};

const InkDropTrailCursor: React.FC<InkDropTrailProps> = ({
  color = "#000000",
  size = 10,
  trails = 10,
  spread = 5
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!ctx) return;

    let drops: { x: number; y: number; size: number; spread: number }[] = [];
    let running = true;

    const renderAnimation = () => {
      if (running) {
        ctx.clearRect(0, 0, canvas!.width, canvas!.height);

        drops.forEach(drop => {
          ctx.beginPath();
          ctx.arc(drop.x, drop.y, drop.size, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.globalAlpha = drop.spread / spread;
          ctx.fill();
          ctx.closePath();
          drop.size += 0.5;
          drop.spread -= 0.1;
        });

        drops = drops.filter(drop => drop.spread > 0);
        window.requestAnimationFrame(renderAnimation);
      }
    };

    const move = (event: MouseEvent | TouchEvent) => {
      const x = event instanceof MouseEvent ? event.clientX : event.touches[0].pageX;
      const y = event instanceof MouseEvent ? event.clientY : event.touches[0].pageY;

      for (let i = 0; i < trails; i++) {
        drops.push({ x, y, size, spread });
      }
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
  }, [color, size, trails, spread]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none" />;
};

export default InkDropTrailCursor;
