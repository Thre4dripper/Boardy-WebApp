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

    //pen smoothing, by using Bézier curves and catmull-rom splines
    Pen.pens.forEach((pen) => {
      BaseShape.draw(pen, ctx);
      ctx.beginPath();
      if (pen.path.length > 3) {
        ctx.moveTo(pen.path[0].x, pen.path[0].y);
        for (let i = 0; i < pen.path.length - 1; i++) {
          const p0 = pen.path[i === 0 ? i : i - 1];
          const p1 = pen.path[i];
          const p2 = pen.path[i + 1];
          const p3 = pen.path[i + 2 === pen.path.length ? i + 1 : i + 2];
          for (let t = 0; t <= 1; t += 0.01) {
            const t2 = t * t;
            const t3 = t2 * t;
            const x =
              0.5 *
              (2 * p1.x +
                (-p0.x + p2.x) * t +
                (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
                (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
            const y =
              0.5 *
              (2 * p1.y +
                (-p0.y + p2.y) * t +
                (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
                (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);
            ctx.lineTo(x, y);
          }
        }
      } else if (pen.path.length === 3) {
        ctx.moveTo(pen.path[0].x, pen.path[0].y);
        ctx.quadraticCurveTo(pen.path[1].x, pen.path[1].y, pen.path[2].x, pen.path[2].y);
      } else if (pen.path.length === 2) {
        ctx.moveTo(pen.path[0].x, pen.path[0].y);
        ctx.lineTo(pen.path[1].x, pen.path[1].y);
      }
      ctx.stroke();
    });
  }
}

export default Pen;
