'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Pen from '@/models/Pen';
import Line from '@/models/line';
import ToolsCard from '@/components/ToolsCard';
import { ToolColor, Tools, ToolVariant } from '@/enums/Tools';
import Ellipse from '@/models/Ellipse';
import Arrow from '@/models/Arrow';
import Polygon from '@/models/Polygon';
import Text from '@/models/Text';
import PropertiesCard from '@/components/properties-card';

export type Mouse = {
  x: number;
  y: number;
  down: boolean;
};
export default function Home() {
  const parentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<Mouse>({ x: 0, y: 0, down: false });

  const [selectedTool, setSelectedTool] = useState<Tools>(Tools.Pen);
  const [selectedStrokeColor, setSelectedStrokeColor] = useState<ToolColor>(ToolColor.Black);
  const [selectedStrokeWidth, setSelectedStrokeWidth] = useState<number>(5);
  const [selectedStrokeVariant, setSelectedStrokeVariant] = useState<ToolVariant>(
    ToolVariant.Solid
  );

  const initCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    const ratio = Math.ceil(window.devicePixelRatio);
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(ratio, ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
  }, []);

  const draw = useCallback(
    (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, drawFn: () => void) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      //draw pens
      Pen.renderAllPens(ctx);

      //draw lines
      Line.renderAllLines(ctx);

      //draw ellipses
      Ellipse.renderAllEllipses(ctx);

      //draw arrows
      Arrow.renderAllArrows(ctx);

      //draw polygons
      Polygon.renderAllPolygons(ctx);

      //draw texts
      Text.renderAllTexts(ctx);
      drawFn();
    },
    []
  );

  useEffect(() => {
    initCanvas();

    let animateId: number;

    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      switch (selectedTool) {
        case Tools.Pen:
          draw(
            canvas,
            ctx,
            Pen.drawCurrentPen.bind(
              null,
              mouseRef,
              selectedStrokeColor,
              selectedStrokeWidth,
              selectedStrokeVariant
            )
          );
          break;
        case Tools.Line:
          draw(
            canvas,
            ctx,
            Line.drawCurrentLine.bind(
              null,
              mouseRef,
              selectedStrokeColor,
              selectedStrokeWidth,
              selectedStrokeVariant
            )
          );
          break;
        case Tools.Ellipse:
          draw(
            canvas,
            ctx,
            Ellipse.drawCurrentEllipse.bind(
              null,
              mouseRef,
              selectedStrokeColor,
              selectedStrokeWidth,
              selectedStrokeVariant
            )
          );
          break;
        case Tools.Polygon:
          draw(
            canvas,
            ctx,
            Polygon.drawCurrentPolygon.bind(
              null,
              mouseRef,
              selectedStrokeColor,
              selectedStrokeWidth,
              selectedStrokeVariant,
              4,
              0
            )
          );
          break;
        case Tools.Arrow:
          draw(
            canvas,
            ctx,
            Arrow.drawCurrentArrow.bind(
              null,
              mouseRef,
              selectedStrokeColor,
              selectedStrokeWidth,
              selectedStrokeVariant
            )
          );
          break;
        case Tools.Text:
          draw(
            canvas,
            ctx,
            Text.drawCurrentText.bind(null, mouseRef, parentRef, 20, selectedStrokeColor, 'Arial')
          );
          break;
      }
      animateId = requestAnimationFrame(animate);
    };

    animate();

    if (selectedTool === Tools.Text) {
      Text.convertToHtml(parentRef.current as HTMLElement);
    } else {
      Text.convertToCanvas(parentRef.current as HTMLElement);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === '1') setSelectedTool(Tools.Pen);
      if (e.key === '2') setSelectedTool(Tools.Line);
      if (e.key === '3') setSelectedTool(Tools.Polygon);
      if (e.key === '4') setSelectedTool(Tools.Ellipse);
      if (e.key === '5') setSelectedTool(Tools.Arrow);
      if (e.key === '6') setSelectedTool(Tools.Text);
    });
    return () => {
      window.cancelAnimationFrame(animateId);
    };
  }, [
    draw,
    initCanvas,
    selectedStrokeColor,
    selectedStrokeVariant,
    selectedStrokeWidth,
    selectedTool,
  ]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement> | MouseEvent) => {
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
    <div className={'h-full bg-white relative overflow-hidden'} ref={parentRef}>
      <PropertiesCard
        selectedTool={selectedTool}
        selectedStrokeColor={selectedStrokeColor}
        setSelectedStrokeColor={(color) => {
          setSelectedStrokeColor(color as ToolColor);
        }}
        selectedStrokeWidth={selectedStrokeWidth}
        setSelectedStrokeWidth={setSelectedStrokeWidth}
        selectedStrokeVariant={selectedStrokeVariant}
        setSelectedStrokeVariant={(variant) => {
          setSelectedStrokeVariant(variant as ToolVariant);
        }}
      />
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
