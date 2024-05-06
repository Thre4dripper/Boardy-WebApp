import Point from '@/models/Point';
import BaseShape from '@/models/BaseShape';
import React from 'react';
import { Mouse } from '@/app/page';
import { StrokeColor } from '@/enums/Colors';
import { StrokeVariant } from '@/enums/StrokeVariant';
import Selection from '@/models/Selection';

class Pen extends BaseShape {
  path: Point[] = [];

  constructor(path: Point[], color: StrokeColor, size: number, variant: StrokeVariant) {
    super(0, 0, 0, 0, color, size, variant);
    this.path = path;
  }

  private static pens: Pen[] = [];

  static getAllPens = () => Pen.pens;

  static drawCurrentPen(
    mouseRef: React.MutableRefObject<Mouse>,
    selectedStrokeColor: StrokeColor,
    selectedStrokeWidth: number,
    selectedStrokeVariant: StrokeVariant
  ) {
    const allPens = Pen.pens;
    if (mouseRef.current.down) {
      const lastPen = allPens[allPens.length - 1];
      lastPen.path.push({ x: mouseRef.current.x, y: mouseRef.current.y });
    } else {
      if (allPens.length > 0 && allPens[allPens.length - 1].path.length <= 1) {
        allPens.pop();
      }
      allPens.push(
        new Pen(
          [{ x: mouseRef.current.x, y: mouseRef.current.y }],
          selectedStrokeColor,
          selectedStrokeWidth,
          selectedStrokeVariant
        )
      );
    }
  }

  static renderAllPens(ctx: CanvasRenderingContext2D) {
    Pen.pens.forEach((pen) => {
      BaseShape.draw(pen, ctx);
      ctx.beginPath();
      if (pen.path.length > 3) {
        ctx.moveTo(pen.path[0].x, pen.path[0].y);
        for (let i = 1; i < pen.path.length - 2; i++) {
          const cp1x = (pen.path[i].x + pen.path[i + 1].x) / 2;
          const cp1y = (pen.path[i].y + pen.path[i + 1].y) / 2;
          const cp2x = (pen.path[i + 1].x + pen.path[i + 2].x) / 2;
          const cp2y = (pen.path[i + 1].y + pen.path[i + 2].y) / 2;
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, pen.path[i + 1].x, pen.path[i + 1].y);
        }
        // curve through the last two points
        ctx.quadraticCurveTo(
          pen.path[pen.path.length - 2].x,
          pen.path[pen.path.length - 2].y,
          pen.path[pen.path.length - 1].x,
          pen.path[pen.path.length - 1].y
        );
      } else if (pen.path.length === 3) {
        ctx.moveTo(pen.path[0].x, pen.path[0].y);
        ctx.quadraticCurveTo(pen.path[1].x, pen.path[1].y, pen.path[2].x, pen.path[2].y);
      } else if (pen.path.length === 2) {
        ctx.moveTo(pen.path[0].x, pen.path[0].y);
        ctx.lineTo(pen.path[1].x, pen.path[1].y);
      }
      ctx.stroke();

      if (pen.isSelected) {
        Selection.drawPenSelectionBox(ctx, pen);
      }
    });
  }

  static isPenHovered(pen: Pen, mouseRef: React.MutableRefObject<Mouse>) {
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
}

export default Pen;
