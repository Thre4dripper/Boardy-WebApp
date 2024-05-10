'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Pen from '@/models/Pen';
import Line from '@/models/line';
import ToolsCard from '@/components/ToolsCard';
import { Tools } from '@/enums/Tools';
import Ellipse from '@/models/Ellipse';
import Arrow from '@/models/Arrow';
import Polygon from '@/models/Polygon';
import Text from '@/models/Text';
import PropertiesCard from '@/components/properties-card';
import { StrokeVariant } from '@/enums/StrokeVariant';
import { FillColor, StrokeColor } from '@/enums/Colors';
import { ArrowHeads } from '@/enums/ArrowHeads';
import { Fonts } from '@/enums/Fonts';
import Selection from '@/models/Selection';
import Store from '@/store/Store';

export type Mouse = {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  down: boolean;
  cursor: string;
};
export default function Home() {
  const parentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<Mouse>({
    x: 0,
    y: 0,
    prevX: 0,
    prevY: 0,
    down: false,
    cursor: 'default',
  });

  const [selectedTool, setSelectedTool] = useState<Tools>(Tools.Pen);

  const [selectedStrokeColor, setSelectedStrokeColor] = useState<StrokeColor>(StrokeColor.Black);
  const [selectedStrokeWidth, setSelectedStrokeWidth] = useState<number>(5);
  const [selectedStrokeVariant, setSelectedStrokeVariant] = useState<StrokeVariant>(
    StrokeVariant.Solid
  );

  //shape controls
  const [selectedFillColor, setSelectedFillColor] = useState<FillColor>(FillColor.Transparent);
  const [selectedShapeSides, setSelectedShapeSides] = useState<number>(4);
  const [selectedShapeRotation, setSelectedShapeRotation] = useState<number>(45);

  //arrow head controls
  const [selectedLeftArrowHead, setSelectedLeftArrowHead] = useState<ArrowHeads>(ArrowHeads.Line);
  const [selectedRightArrowHead, setSelectedRightArrowHead] = useState<ArrowHeads>(
    ArrowHeads.Arrow
  );

  //text controls
  const [selectedFontSize, setSelectedFontSize] = useState<number>(30);
  const [selectedFontFamily, setSelectedFontFamily] = useState<string>(Fonts.Arial);

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

      //filter all empty shapes except that is selected
      Store.filterEmptyShapes(selectedTool);

      //draw all shapes
      Store.drawAllShapes(ctx);

      drawFn();
    },
    [selectedTool]
  );

  useEffect(() => {
    initCanvas();

    let animateId: number;

    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    //offscreen canvas
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    const offscreenCtx = offscreenCanvas.getContext('2d');

    if (!offscreenCtx) return;

    const animate = () => {
      animateId = requestAnimationFrame(animate);

      //conversion to html or canvas happen before drawing anything else
      if (selectedTool === Tools.Text) {
        Text.convertToHtml(parentRef.current as HTMLElement);
      } else {
        Text.convertToCanvas(parentRef.current as HTMLElement);
      }

      //clear all selections if the selected tool is not select before drawing anything
      if (selectedTool !== Tools.Select) {
        Selection.clearAllSelections();
      }

      switch (selectedTool) {
        case Tools.Select:
          mouseRef.current.cursor = 'default';
          draw(
            canvas,
            offscreenCtx,
            Selection.drawSelectionBoxes.bind(null, offscreenCtx, mouseRef)
          );
          Selection.moveSelectedShape(mouseRef);
          break;
        case Tools.Pen:
          draw(
            canvas,
            offscreenCtx,
            Pen.drawCurrentPen.bind(
              null,
              mouseRef,
              selectedStrokeColor,
              selectedStrokeWidth,
              selectedStrokeVariant
            )
          );
          mouseRef.current.cursor = 'crosshair';
          break;
        case Tools.Line:
          draw(
            canvas,
            offscreenCtx,
            Line.drawCurrentLine.bind(
              null,
              mouseRef,
              selectedStrokeColor,
              selectedStrokeWidth,
              selectedStrokeVariant
            )
          );
          mouseRef.current.cursor = 'crosshair';
          break;
        case Tools.Ellipse:
          draw(
            canvas,
            offscreenCtx,
            Ellipse.drawCurrentEllipse.bind(
              null,
              mouseRef,
              selectedStrokeColor,
              selectedStrokeWidth,
              selectedStrokeVariant,
              selectedFillColor
            )
          );
          mouseRef.current.cursor = 'crosshair';
          break;
        case Tools.Polygon:
          draw(
            canvas,
            offscreenCtx,
            Polygon.drawCurrentPolygon.bind(
              null,
              mouseRef,
              selectedStrokeColor,
              selectedStrokeWidth,
              selectedStrokeVariant,
              selectedShapeSides,
              selectedShapeRotation,
              selectedFillColor
            )
          );
          mouseRef.current.cursor = 'crosshair';
          break;
        case Tools.Arrow:
          draw(
            canvas,
            offscreenCtx,
            Arrow.drawCurrentArrow.bind(
              null,
              mouseRef,
              selectedStrokeColor,
              selectedStrokeWidth,
              selectedStrokeVariant,
              selectedLeftArrowHead,
              selectedRightArrowHead
            )
          );
          mouseRef.current.cursor = 'crosshair';
          break;
        case Tools.Text:
          draw(
            canvas,
            offscreenCtx,
            Text.drawCurrentText.bind(
              null,
              mouseRef,
              parentRef,
              selectedFontSize,
              selectedStrokeColor,
              selectedFontFamily,
              Date.now()
            )
          );
          mouseRef.current.cursor = 'text';
          break;
      }

      canvas.style.cursor = mouseRef.current.cursor;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(offscreenCanvas, 0, 0);
    };

    animate();

    document.addEventListener('keydown', (e) => {
      if (e.key === '1') setSelectedTool(Tools.Select);
      if (e.key === '2') setSelectedTool(Tools.Pen);
      if (e.key === '3') setSelectedTool(Tools.Line);
      if (e.key === '4') setSelectedTool(Tools.Polygon);
      if (e.key === '5') setSelectedTool(Tools.Ellipse);
      if (e.key === '6') setSelectedTool(Tools.Arrow);
      if (e.key === '7') setSelectedTool(Tools.Text);
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
    selectedFillColor,
    selectedShapeSides,
    selectedShapeRotation,
    selectedLeftArrowHead,
    selectedRightArrowHead,
    selectedFontSize,
    selectedFontFamily,
  ]);

  const throttle = (callback: Function, delay: number) => {
    let previousCall = new Date().getTime();
    return function (this: any) {
      const time = new Date().getTime();
      if (time - previousCall >= delay) {
        previousCall = time;
        callback.apply(this, arguments);
      }
    };
  };

  const handleMouseMove = throttle((e: React.MouseEvent<HTMLCanvasElement> | MouseEvent) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      prevX: mouseRef.current.x,
      prevY: mouseRef.current.y,
      down: mouseRef.current.down,
      cursor: mouseRef.current.cursor,
    };
  }, 5);

  const handleMouseDown = () => {
    mouseRef.current.down = true;
  };

  const handleMouseUp = () => {
    mouseRef.current.down = false;
  };

  return (
    <div className={'h-full bg-white relative overflow-hidden'} ref={parentRef}>
      {selectedTool !== Tools.Select && (
        <PropertiesCard
          selectedTool={selectedTool}
          selectedStrokeColor={selectedStrokeColor}
          setSelectedStrokeColor={(color) => {
            setSelectedStrokeColor(color as StrokeColor);
          }}
          selectedStrokeWidth={selectedStrokeWidth}
          setSelectedStrokeWidth={setSelectedStrokeWidth}
          selectedStrokeVariant={selectedStrokeVariant}
          setSelectedStrokeVariant={(variant) => {
            setSelectedStrokeVariant(variant as StrokeVariant);
          }}
          selectedFillColor={selectedFillColor}
          setSelectedFillColor={(color) => {
            setSelectedFillColor(color as FillColor);
          }}
          selectedShapeSides={selectedShapeSides}
          setSelectedShapeSides={setSelectedShapeSides}
          selectedShapeRotation={selectedShapeRotation}
          setSelectedShapeRotation={setSelectedShapeRotation}
          selectedLeftArrowHead={selectedLeftArrowHead}
          setSelectedLeftArrowHead={(arrowHead) => {
            setSelectedLeftArrowHead(arrowHead as ArrowHeads);
          }}
          selectedRightArrowHead={selectedRightArrowHead}
          setSelectedRightArrowHead={(arrowHead) => {
            setSelectedRightArrowHead(arrowHead as ArrowHeads);
          }}
          selectedFontSize={selectedFontSize}
          setSelectedFontSize={setSelectedFontSize}
          selectedFontFamily={selectedFontFamily}
          setSelectedFontFamily={setSelectedFontFamily}
        />
      )}
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
