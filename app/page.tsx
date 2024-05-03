'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Pen from '@/models/Pen';
import Line from '@/models/line';
import ToolsCard from '@/components/ToolsCard';
import { ToolColor, Tools, ToolSize, ToolVariant } from '@/enums/Tools';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, down: false });

  const [pens, setPens] = useState<Pen[]>([]);
  const [lines, setLines] = useState<Line[]>([]);

  const [selectedTool, setSelectedTool] = useState<Tools>(Tools.Pen);

  const initCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  const draw = useCallback(
    (drawFn: () => void) => {
      const canvas = canvasRef.current as HTMLCanvasElement;

      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.lineCap = 'round';
      //draw pens
      pens.forEach((pen) => {
        ctx.strokeStyle = pen.color;
        ctx.lineWidth = pen.size === ToolSize.Small ? 2 : pen.size === ToolSize.Medium ? 5 : 10;
        ctx.beginPath();
        ctx.moveTo(pen.path[0].x, pen.path[0].y);
        pen.path.forEach((point) => {
          ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
      });

      //draw lines
      lines.forEach((line) => {
        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.size === ToolSize.Small ? 2 : line.size === ToolSize.Medium ? 5 : 10;
        if (line.variant === ToolVariant.Dashed) {
          ctx.setLineDash([5, 3]);
        } else if (line.variant === ToolVariant.Dotted) {
          ctx.setLineDash([2, 2]);
        } else {
          ctx.setLineDash([]);
        }
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.stroke();
      });
      drawFn();
    },
    [lines, pens]
  );

  const drawPen = useCallback(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    if (mouseRef.current.down) {
      const lastPen = pens[pens.length - 1];
      lastPen.path.push({ x: mouseRef.current.x, y: mouseRef.current.y });
    } else {
      if (pens.length > 0 && pens[pens.length - 1].path.length <= 1) {
        pens.pop();
      }
      pens.push(
        new Pen(
          [{ x: mouseRef.current.x, y: mouseRef.current.y }],
          ToolColor.Black,
          ToolSize.Medium,
          ToolVariant.Solid
        )
      );
    }

    setPens([...pens]);
  }, [pens]);

  const drawLine = useCallback(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    if (mouseRef.current.down) {
      const lastLine = lines[lines.length - 1];
      lastLine.x2 = mouseRef.current.x;
      lastLine.y2 = mouseRef.current.y;
    } else {
      if (
        lines.length > 0 &&
        lines[lines.length - 1].x1 === lines[lines.length - 1].x2 &&
        lines[lines.length - 1].y1 === lines[lines.length - 1].y2
      ) {
        lines.pop();
      }

      lines.push(
        new Line(
          mouseRef.current.x,
          mouseRef.current.y,
          mouseRef.current.x,
          mouseRef.current.y,
          ToolColor.Black,
          ToolSize.Medium,
          ToolVariant.Solid
        )
      );
    }
    setLines([...lines]);
  }, [lines]);

  useEffect(() => {
    initCanvas();

    let animateId: number;

    const animate = () => {
      if (selectedTool === Tools.Pen) {
        draw(drawPen);
      } else if (selectedTool === Tools.Line) {
        draw(drawLine);
      }
      animateId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(animateId);
    };
  }, [draw, drawLine, drawPen, initCanvas, selectedTool]);

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
      <ToolsCard onToolSelect={setSelectedTool} selectedTool={selectedTool} />
      <canvas
        className={'h-full w-full'}
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
}
