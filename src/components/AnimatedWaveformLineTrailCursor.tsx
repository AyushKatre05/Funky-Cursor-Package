import React, { useEffect, useRef } from "react";

type AnimatedWaveformLineTrailProps = {
  color?: string;       // Color of the waveform line
  width?: number;       // Width of the waveform line
  amplitude?: number;  // Amplitude of the waveform
  frequency?: number;  // Frequency of the waveform
  length?: number;     // Length of the trail
  speed?: number;      // Speed of animation
};

const AnimatedWaveformLineTrailCursor: React.FC<AnimatedWaveformLineTrailProps> = ({
  color = "#FF1493",
  width = 2,
  amplitude = 15,
  frequency = 0.2,
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
        ctx.strokeStyle = color;
        ctx.lineWidth = width;

        trails.forEach(trail => {
          ctx.beginPath();
          for (let i = 0; i < length; i++) {
            const x = trail.x + i;
            const y = trail.y + amplitude * Math.sin(frequency * (x - trail.age * speed));
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
  }, [color, width, amplitude, frequency, length, speed]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none" />;
};

export default AnimatedWaveformLineTrailCursor;
