import React from 'react';
import { Mouse } from '@/app/page';
import Store from '@/store/Store';
import Pen from '@/models/Pen';
import Line from '@/models/line';
import Ellipse from '@/models/Ellipse';
import Arrow from '@/models/Arrow';
import Polygon from '@/models/Polygon';
import Text from '@/models/Text';

class Eraser {
  static eraserTrail: { x: number; y: number }[] = [];

  static drawEraser(mouseRef: React.MutableRefObject<Mouse>, ctx: CanvasRenderingContext2D) {
    const { x, y } = mouseRef.current;
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'gray';
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();

    if (mouseRef.current.down) {
      Eraser.eraserTrail.push({ x, y });
      Eraser.drawEraserTrail(ctx);
      setTimeout(() => {
        Eraser.erase(mouseRef, ctx);
        Eraser.eraserTrail.shift();
      }, 100); // Delay
    }
  }

  private static drawEraserTrail(ctx: CanvasRenderingContext2D) {
    if (Eraser.eraserTrail.length < 3) return;

    ctx.beginPath();
    ctx.strokeStyle = 'lightgray';
    ctx.lineWidth = 8;

    ctx.moveTo(Eraser.eraserTrail[0].x, Eraser.eraserTrail[0].y);

    for (let i = 1; i < Eraser.eraserTrail.length - 2; i++) {
      const midPoint1 = {
        x: (Eraser.eraserTrail[i].x + Eraser.eraserTrail[i + 1].x) / 2,
        y: (Eraser.eraserTrail[i].y + Eraser.eraserTrail[i + 1].y) / 2,
      };
      const midPoint2 = {
        x: (Eraser.eraserTrail[i + 1].x + Eraser.eraserTrail[i + 2].x) / 2,
        y: (Eraser.eraserTrail[i + 1].y + Eraser.eraserTrail[i + 2].y) / 2,
      };

      ctx.bezierCurveTo(
        Eraser.eraserTrail[i].x,
        Eraser.eraserTrail[i].y,
        midPoint1.x,
        midPoint1.y,
        midPoint2.x,
        midPoint2.y
      );
    }

    ctx.lineTo(
      Eraser.eraserTrail[Eraser.eraserTrail.length - 1].x,
      Eraser.eraserTrail[Eraser.eraserTrail.length - 1].y
    );

    ctx.stroke();
  }

  private static erase(mouseRef: React.MutableRefObject<Mouse>, ctx: CanvasRenderingContext2D) {
    const allShapes = Store.allShapes;

    for (let i = allShapes.length - 1; i >= 0; i--) {
      const shape = allShapes[i];

      switch (shape.constructor) {
        case Pen:
          if (Pen.isPenHovered(shape as Pen, mouseRef)) {
            allShapes.splice(i, 1);
          }
          break;
        case Line:
          if (Line.isLineHovered(shape as Line, mouseRef)) {
            allShapes.splice(i, 1);
          }
          break;
        case Ellipse:
          if (Ellipse.isEllipseHovered(shape as Ellipse, mouseRef)) {
            allShapes.splice(i, 1);
          }
          break;
        case Arrow:
          if (Arrow.isArrowHovered(shape as Arrow, mouseRef)) {
            allShapes.splice(i, 1);
          }
          break;
        case Polygon:
          if (Polygon.isPolygonHovered(shape as Polygon, mouseRef)) {
            allShapes.splice(i, 1);
          }
          break;
        case Text:
          if (Text.isTextHovered(shape as Text, mouseRef, ctx)) {
            allShapes.splice(i, 1);
          }
          break;
        default:
          break;
      }
    }
  }
}

export default Eraser;
