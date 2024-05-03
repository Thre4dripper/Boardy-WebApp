'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Pen from '@/app/components/Pen';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, down: false });

  const [pens, setPens] = useState<Pen[]>([]);

  const initCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  const draw = useCallback((drawFn: () => void) => {
    const canvas = canvasRef.current as HTMLCanvasElement;

    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //draw pens
    pens.forEach((pen) => {
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(pen.path[0].x, pen.path[0].y);
      pen.path.forEach((point) => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    });
    drawFn();
  }, []);

  const drawPen = useCallback(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    if (mouseRef.current.down) {
      const lastPen = pens[pens.length - 1];
      lastPen.path.push({ x: mouseRef.current.x, y: mouseRef.current.y });
    } else {
      if (pens.length > 0 && pens[pens.length - 1].path.length === 0) {
        pens.pop();
      }
      pens.push(new Pen([{ x: mouseRef.current.x, y: mouseRef.current.y }]));
    }

    setPens([...pens]);
  }, []);

  useEffect(() => {
    initCanvas();

    const interval = setInterval(() => {
      draw(drawPen);
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [initCanvas]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      down: mouseRef.current.down,
    };
  };

  const handleMouseDown = () => {
    mouseRef.current.down = true;
  };

  const handleMouseUp = () => {
    mouseRef.current.down = false;
  };

  return (
    <div className={'h-full bg-white'}>
      <canvas
        className={'h-full w-full'}
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
}
