import Point from '@/models/Point';
import { ToolColor, ToolVariant } from '@/enums/Tools';
import BaseShape from '@/models/BaseShape';
import React from 'react';
import { Mouse } from '@/app/page';

class Pen extends BaseShape {
  path: Point[] = [];

  constructor(path: Point[], color: ToolColor, size: number, variant: ToolVariant) {
    super(0, 0, 0, 0, color, size, variant);
    this.path = path;
  }

  private static pens: Pen[] = [];

  static drawCurrentPen(
    mouseRef: React.MutableRefObject<Mouse>,
    selectedStrokeColor: ToolColor,
    selectedStrokeWidth: number,
    selectedStrokeVariant: ToolVariant
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
      ctx.moveTo(pen.path[0].x, pen.path[0].y);
      pen.path.forEach((point) => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    });
  }
}

export default Pen;
