import React from 'react';
import { Mouse } from '@/app/page';
import Store from '@/store/Store';
import PenService from '@/services/pen.service';
import LineService from '@/services/line.service';
import EllipseService from '@/services/ellipse.service';
import ArrowService from '@/services/arrow.service';
import PolygonService from '@/services/polygon.service';
import TextService from '@/services/text.service';

class EraserService {
  static eraserTrail: { x: number; y: number }[] = [];

  static drawEraser(mouseRef: React.MutableRefObject<Mouse>, ctx: CanvasRenderingContext2D) {
    const { x, y } = mouseRef.current;
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'gray';
    ctx.setLineDash([]);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();

    if (mouseRef.current.down) {
      EraserService.eraserTrail.push({ x, y });
      EraserService.drawEraserTrail(ctx);
      setTimeout(() => {
        EraserService.erase(mouseRef, ctx);
        EraserService.eraserTrail.shift();
      }, 100); // Delay
    }
  }

  private static drawEraserTrail(ctx: CanvasRenderingContext2D) {
    if (EraserService.eraserTrail.length < 3) return;

    ctx.beginPath();
    ctx.strokeStyle = 'lightgray';
    ctx.lineWidth = 8;
    ctx.setLineDash([]);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    ctx.moveTo(EraserService.eraserTrail[0].x, EraserService.eraserTrail[0].y);

    for (let i = 1; i < EraserService.eraserTrail.length - 2; i++) {
      const midPoint1 = {
        x: (EraserService.eraserTrail[i].x + EraserService.eraserTrail[i + 1].x) / 2,
        y: (EraserService.eraserTrail[i].y + EraserService.eraserTrail[i + 1].y) / 2,
      };
      const midPoint2 = {
        x: (EraserService.eraserTrail[i + 1].x + EraserService.eraserTrail[i + 2].x) / 2,
        y: (EraserService.eraserTrail[i + 1].y + EraserService.eraserTrail[i + 2].y) / 2,
      };

      ctx.bezierCurveTo(
        EraserService.eraserTrail[i].x,
        EraserService.eraserTrail[i].y,
        midPoint1.x,
        midPoint1.y,
        midPoint2.x,
        midPoint2.y
      );
    }

    ctx.lineTo(
      EraserService.eraserTrail[EraserService.eraserTrail.length - 1].x,
      EraserService.eraserTrail[EraserService.eraserTrail.length - 1].y
    );

    ctx.stroke();
  }

  private static erase(mouseRef: React.MutableRefObject<Mouse>, ctx: CanvasRenderingContext2D) {
    const allShapes = Store.allShapes;

    for (let i = allShapes.length - 1; i >= 0; i--) {
      const shape = allShapes[i];

      switch (shape.constructor) {
        case PenService:
          if (PenService.isPenHovered(shape as PenService, mouseRef)) {
            allShapes.splice(i, 1);
          }
          break;
        case LineService:
          if (LineService.isLineHovered(shape as LineService, mouseRef)) {
            allShapes.splice(i, 1);
          }
          break;
        case EllipseService:
          if (EllipseService.isEllipseHovered(shape as EllipseService, mouseRef)) {
            allShapes.splice(i, 1);
          }
          break;
        case ArrowService:
          if (ArrowService.isArrowHovered(shape as ArrowService, mouseRef)) {
            allShapes.splice(i, 1);
          }
          break;
        case PolygonService:
          if (PolygonService.isPolygonHovered(shape as PolygonService, mouseRef)) {
            allShapes.splice(i, 1);
          }
          break;
        case TextService:
          if (TextService.isTextHovered(shape as TextService, mouseRef, ctx)) {
            allShapes.splice(i, 1);
          }
          break;
        default:
          break;
      }
    }
  }
}

export default EraserService;
