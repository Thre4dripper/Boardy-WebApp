'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import PenModel from '@/models/pen.model';
import LineModel from '@/models/line.model';
import ToolsCard from '@/components/ToolsCard';
import { Tools } from '@/enums/Tools';
import EllipseModel from '@/models/ellipse.model';
import ArrowModel from '@/models/arrow.model';
import PolygonModel from '@/models/polygon.model';
import TextModel from '@/models/text.model';
import PropertiesCard from '@/components/properties-card';
import { StrokeVariant } from '@/enums/StrokeVariant';
import { FillColor, StrokeColor } from '@/enums/Colors';
import { ArrowHeads } from '@/enums/ArrowHeads';
import { Fonts } from '@/enums/Fonts';
import SelectionService from '@/services/selection.service';
import Store from '@/store/Store';
import { Cursors } from '@/enums/Cursors';
import EraserService from '@/services/eraser.service';
import MoveService from '@/services/move.service';
import { SelectionResize } from '@/enums/SelectionResize';
import ResizeService from '@/services/resize.service';
import ImageModel from '@/models/image.model';
import UndoRedoCard from '@/components/UndoRedoCard';
import UndoRedoService from '@/services/undo.redo.service';

export type Mouse = {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  down: boolean;
  cursor: Cursors;
  resizeState: SelectionResize;
  cursorState: 'move' | 'resize' | 'none';
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
    cursor: Cursors.DEFAULT,
    resizeState: SelectionResize.None,
    cursorState: 'none',
  });

  const [selectedTool, setSelectedTool] = useState<Tools>(Tools.Pen);
  const [selectedShapeType, setSelectedShapeType] = useState<
    | Tools.Pen
    | Tools.Line
    | Tools.Polygon
    | Tools.Ellipse
    | Tools.Arrow
    | Tools.Text
    | Tools.Image
    | null
  >(null);

  const [selectedStrokeColor, setSelectedStrokeColor] = useState<StrokeColor>(StrokeColor.Black);
  const [selectedStrokeWidth, setSelectedStrokeWidth] = useState<number>(3);
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

  const detectSelectedShape = useCallback(() => {
    const allShapes = Store.allShapes;
    const selectedShape = allShapes.find((shape) => shape.isSelected);

    if (!selectedShape) {
      setSelectedShapeType(null);
      return;
    }

    switch (selectedShape.constructor) {
      case PenModel:
        setSelectedShapeType(Tools.Pen);
        break;
      case LineModel:
        setSelectedShapeType(Tools.Line);
        break;
      case EllipseModel:
        setSelectedShapeType(Tools.Ellipse);
        break;
      case ArrowModel:
        setSelectedShapeType(Tools.Arrow);
        break;
      case PolygonModel:
        setSelectedShapeType(Tools.Polygon);
        break;
      case TextModel:
        setSelectedShapeType(Tools.Text);
        break;
      case ImageModel:
        setSelectedShapeType(Tools.Image);
        break;
      default:
        setSelectedShapeType(null);
    }
  }, []);

  const draw = useCallback(
    (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, drawFn: () => void) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      //filter all empty shapes except that is selected
      Store.filterEmptyShapes(selectedTool);
      UndoRedoService.filterEmptyShapes(selectedTool);

      //draw all shapes
      Store.drawAllShapes(ctx);

      detectSelectedShape();

      drawFn();
    },
    [detectSelectedShape, selectedTool]
  );

  const keyDownHandler = useCallback(
    (e: KeyboardEvent) => {
      //handle tool selection from 1 to 9
      if (
        //do not change tool if any text input is focused
        !(
          selectedTool === Tools.Text &&
          TextModel.isAnyTextFocused(parentRef.current as HTMLElement)
        )
      ) {
        Object.values(Tools).forEach((tool, index) => {
          if (e.key === (index + 1).toString()) setSelectedTool(tool);
        });
      }

      //handle undo redo
      if (e.key === 'z' && e.ctrlKey) {
        //do not undo if any text input is focused
        e.preventDefault();
        TextModel.convertToCanvas(parentRef.current as HTMLElement);
        UndoRedoService.undo(selectedTool);
        TextModel.convertToHtml(parentRef.current as HTMLElement);
      } else if (e.key === 'y' && e.ctrlKey) {
        UndoRedoService.redo(selectedTool);
      }
    },
    [selectedTool]
  );

  const pasteImageHandler = useCallback((e: ClipboardEvent) => {
    ImageModel.pasteImage(setSelectedTool, parentRef, e);
  }, []);

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
        TextModel.convertToHtml(parentRef.current as HTMLElement);
      } else {
        TextModel.convertToCanvas(parentRef.current as HTMLElement);
      }

      //clear all selections if the selected tool is not select before drawing anything
      if (selectedTool !== Tools.Select) {
        SelectionService.clearAllSelections();
      }

      switch (selectedTool) {
        case Tools.Select:
          mouseRef.current.cursor = Cursors.DEFAULT;
          draw(
            canvas,
            offscreenCtx,
            SelectionService.drawSelectionBoxes.bind(null, offscreenCtx, mouseRef)
          );
          MoveService.moveSelectedShape(mouseRef);
          ResizeService.resizeSelectedShape(mouseRef);
          break;
        case Tools.Pen:
          draw(
            canvas,
            offscreenCtx,
            PenModel.drawCurrentPen.bind(
              null,
              mouseRef,
              selectedStrokeColor,
              selectedStrokeWidth,
              selectedStrokeVariant
            )
          );
          mouseRef.current.cursor = Cursors.CROSSHAIR;
          break;
        case Tools.Line:
          draw(
            canvas,
            offscreenCtx,
            LineModel.drawCurrentLine.bind(
              null,
              mouseRef,
              selectedStrokeColor,
              selectedStrokeWidth,
              selectedStrokeVariant
            )
          );
          mouseRef.current.cursor = Cursors.CROSSHAIR;
          break;
        case Tools.Ellipse:
          draw(
            canvas,
            offscreenCtx,
            EllipseModel.drawCurrentEllipse.bind(
              null,
              mouseRef,
              selectedStrokeColor,
              selectedStrokeWidth,
              selectedStrokeVariant,
              selectedFillColor
            )
          );
          mouseRef.current.cursor = Cursors.CROSSHAIR;
          break;
        case Tools.Polygon:
          draw(
            canvas,
            offscreenCtx,
            PolygonModel.drawCurrentPolygon.bind(
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
          mouseRef.current.cursor = Cursors.CROSSHAIR;
          break;
        case Tools.Arrow:
          draw(
            canvas,
            offscreenCtx,
            ArrowModel.drawCurrentArrow.bind(
              null,
              mouseRef,
              selectedStrokeColor,
              selectedStrokeWidth,
              selectedStrokeVariant,
              selectedLeftArrowHead,
              selectedRightArrowHead
            )
          );
          mouseRef.current.cursor = Cursors.CROSSHAIR;
          break;
        case Tools.Text:
          draw(
            canvas,
            offscreenCtx,
            TextModel.drawCurrentText.bind(
              null,
              mouseRef,
              parentRef,
              selectedFontSize,
              selectedStrokeColor,
              selectedFontFamily,
              Store.allShapes.length
            )
          );
          mouseRef.current.cursor = Cursors.TEXT;
          break;
        case Tools.Image:
          draw(
            canvas,
            offscreenCtx,
            ImageModel.openFileChooser.bind(ImageModel, setSelectedTool, parentRef)
          );
          break;
        case Tools.Eraser:
          draw(canvas, offscreenCtx, EraserService.drawEraser.bind(null, mouseRef, offscreenCtx));
          mouseRef.current.cursor = Cursors.NONE;
          break;
      }

      canvas.style.cursor = mouseRef.current.cursor;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(offscreenCanvas, 0, 0);
    };

    animate();

    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('paste', pasteImageHandler);
    return () => {
      window.cancelAnimationFrame(animateId);
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('paste', pasteImageHandler);
    };
  }, [
    draw,
    initCanvas,
    selectedStrokeColor,
    selectedStrokeVariant,
    selectedStrokeWidth,
    selectedTool,
    selectedShapeType,
    selectedFillColor,
    selectedShapeSides,
    selectedShapeRotation,
    selectedLeftArrowHead,
    selectedRightArrowHead,
    selectedFontSize,
    selectedFontFamily,
    keyDownHandler,
    pasteImageHandler,
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

  const handleMouseMove = throttle(
    (e: React.MouseEvent<HTMLCanvasElement> | MouseEvent) => {
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
        resizeState: mouseRef.current.resizeState,
        cursorState: mouseRef.current.cursorState,
      };
    },
    selectedTool === Tools.Eraser ? 0 : 5
  );

  const handleMouseDown = () => {
    mouseRef.current.down = true;
  };

  const handleMouseUp = () => {
    mouseRef.current.down = false;
    mouseRef.current.cursorState = 'none';
  };

  return (
    <div className={'h-full bg-white relative overflow-hidden'} ref={parentRef}>
      {![Tools.Eraser, Tools.Image].includes(selectedTool) &&
        ((selectedTool === Tools.Select && selectedShapeType !== null) ||
          (selectedTool !== Tools.Select && selectedShapeType === null)) && (
          <PropertiesCard
            selectedTool={selectedTool}
            selectedShapeType={selectedShapeType}
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
      <UndoRedoCard />
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
