import BaseModel from '@/models/base.model';
import React from 'react';
import { Mouse } from '@/app/page';
import { StrokeColor } from '@/enums/Colors';
import { StrokeVariant } from '@/enums/StrokeVariant';
import SelectionService from '@/services/selection.service';
import Store from '@/store/Store';
import ResizeService from '@/services/resize.service';
import { Point } from '@/models/point.model';
import UndoRedoService, { UndoRedoEventType } from '@/services/undo.redo.service';

class PenModel extends BaseModel {
  //for storing bounding box
  x1: number = 0;
  y1: number = 0;
  x2: number = 0;
  y2: number = 0;
  path: Point[] = [];

  constructor(path: Point[], color: StrokeColor, size: number, variant: StrokeVariant) {
    super(0, 0, 0, 0, color, size, variant);
    this.path = path;
  }

  static drawCurrentPen(
    mouseRef: React.MutableRefObject<Mouse>,
    selectedStrokeColor: StrokeColor,
    selectedStrokeWidth: number,
    selectedStrokeVariant: StrokeVariant
  ) {
    const allPens = Store.allShapes.filter((shape) => shape instanceof PenModel) as PenModel[];
    if (mouseRef.current.down) {
      const lastPen = allPens[allPens.length - 1];
      //bounding box corresponding to the max and min points of the path in x and y direction
      lastPen.x1 = lastPen.path.reduce(
        (minIndex, point, index, array) => (point.x < array[minIndex].x ? index : minIndex),
        0
      );
      lastPen.y1 = lastPen.path.reduce(
        (minIndex, point, index, array) => (point.y < array[minIndex].y ? index : minIndex),
        0
      );
      lastPen.x2 = lastPen.path.reduce(
        (maxIndex, point, index, array) => (point.x > array[maxIndex].x ? index : maxIndex),
        0
      );
      lastPen.y2 = lastPen.path.reduce(
        (maxIndex, point, index, array) => (point.y > array[maxIndex].y ? index : maxIndex),
        0
      );
      lastPen.path.push({ x: mouseRef.current.x, y: mouseRef.current.y });
    } else {
      if (allPens.length > 0 && allPens[allPens.length - 1].path.length <= 1) {
        Store.allShapes.pop();
        UndoRedoService.pop();
      }
      Store.allShapes.push(
        new PenModel(
          [{ x: mouseRef.current.x, y: mouseRef.current.y }],
          selectedStrokeColor,
          selectedStrokeWidth,
          selectedStrokeVariant
        )
      );
      UndoRedoService.push({
        type: UndoRedoEventType.CREATE,
        index: Store.allShapes.length - 1,
        shape: {
          from: null,
          to: Store.allShapes[Store.allShapes.length - 1],
        },
      });
    }
  }

  static drawStoredPen(ctx: CanvasRenderingContext2D, pen: PenModel) {
    BaseModel.draw(pen, ctx);
    ctx.beginPath();
    ctx.moveTo(pen.path[0].x, pen.path[0].y); // Move to the start of the path

    for (let i = 0; i < pen.path.length - 1; i++) {
      const midPoint = {
        x: (pen.path[i].x + pen.path[i + 1].x) / 2,
        y: (pen.path[i].y + pen.path[i + 1].y) / 2,
      };
      if (i === 0) {
        ctx.lineTo(midPoint.x, midPoint.y); // Move to the first midpoint
      } else {
        ctx.quadraticCurveTo(pen.path[i].x, pen.path[i].y, midPoint.x, midPoint.y);
      }
    }

    // For the last segment, draw a line to the last point
    if (pen.path.length > 1) {
      const lastPoint = pen.path[pen.path.length - 1];
      ctx.lineTo(lastPoint.x, lastPoint.y);
    }

    ctx.stroke();

    if (pen.isSelected) {
      SelectionService.drawPenSelectionBox(ctx, pen, true);
    }
  }

  static isPenHovered(pen: PenModel, mouseRef: React.MutableRefObject<Mouse>) {
    const path = pen.path;
    const threshold = pen.strokeWidth + 2; // distance threshold

    for (let i = 0; i < path.length - 1; i++) {
      const { x: x1, y: y1 } = path[i];
      const { x: x2, y: y2 } = path[i + 1];
      const { x: px, y: py } = mouseRef.current;

      // Calculate the shortest distance from the point to the line segment
      const dx = x2 - x1;
      const dy = y2 - y1;
      const t = ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy);
      const tt = Math.max(0, Math.min(1, t));
      const lx = x1 + tt * dx;
      const ly = y1 + tt * dy;
      const dist = Math.sqrt((px - lx) * (px - lx) + (py - ly) * (py - ly));

      if (dist < threshold) {
        return true;
      }
    }

    return false;
  }

  static isPenSelectionHovered(pen: PenModel, mouseRef: React.MutableRefObject<Mouse>) {
    // Get selection bounds
    const minX = Math.min(...pen.path.map((point) => point.x));
    const minY = Math.min(...pen.path.map((point) => point.y));
    const maxX = Math.max(...pen.path.map((point) => point.x));
    const maxY = Math.max(...pen.path.map((point) => point.y));

    const tolerance = 10;

    // Check if the mouse is within the bounds
    return (
      mouseRef.current.x >= minX - tolerance &&
      mouseRef.current.x <= maxX + tolerance &&
      mouseRef.current.y >= minY - tolerance &&
      mouseRef.current.y <= maxY + tolerance
    );
  }

  static getHoveredEdgeOrCorner(pen: PenModel, mouseRef: React.MutableRefObject<Mouse>) {
    // Get selection bounds

    pen.horizontalInverted = pen.path[pen.x1].x > pen.path[pen.x2].x;
    pen.verticalInverted = pen.path[pen.y1].y > pen.path[pen.y2].y;
    return ResizeService.detectRectangleResizeSelection(mouseRef, pen.path);
  }
}

export default PenModel;
