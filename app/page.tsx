'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Pen from '@/models/Pen';
import Line from '@/models/line';
import ToolsCard from '@/components/ToolsCard';
import { ToolColor, Tools, ToolVariant } from '@/enums/Tools';
import Ellipse from '@/models/Ellipse';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, down: false });

  const [pens, setPens] = useState<Pen[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [ellipses, setEllipses] = useState<Ellipse[]>([]);

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
      Pen.drawPens(pens, ctx);

      //draw lines
      Line.drawLines(lines, ctx);

      //draw ellipses
      Ellipse.drawEllipses(ellipses, ctx);
      drawFn();
    },
    [ellipses, lines, pens]
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
          5,
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
          5,
          ToolVariant.Solid
        )
      );
    }
    setLines([...lines]);
  }, [lines]);

  const drawCircle = useCallback(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    if (mouseRef.current.down) {
      const lastEllipse = ellipses[ellipses.length - 1];
      lastEllipse.x2 = Math.abs(mouseRef.current.x - lastEllipse.x1);
      lastEllipse.y2 = Math.abs(mouseRef.current.y - lastEllipse.y1);
    } else {
      if (
        ellipses.length > 0 &&
        ellipses[ellipses.length - 1].x2 === 0 &&
        ellipses[ellipses.length - 1].y2 === 0
      ) {
        ellipses.pop();
      }
      ellipses.push(
        new Ellipse(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          0,
          0,
          ToolColor.Black,
          5,
          ToolVariant.Solid
        )
      );
    }
    setEllipses([...ellipses]);
  }, [ellipses]);

  useEffect(() => {
    initCanvas();

    let animateId: number;

    const animate = () => {
      switch (selectedTool) {
        case Tools.Pen:
          draw(drawPen);
          break;
        case Tools.Line:
          draw(drawLine);
          break;
        case Tools.Circle:
          draw(drawCircle);
          break;
      }
      animateId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(animateId);
    };
  }, [draw, drawCircle, drawLine, drawPen, initCanvas, selectedTool]);

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
