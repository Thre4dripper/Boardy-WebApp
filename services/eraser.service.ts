import React from 'react';
import { Mouse } from '@/app/page';
import Store, { Shape } from '@/store/Store';
import PenModel from '@/models/pen.model';
import LineModel from '@/models/line.model';
import EllipseModel from '@/models/ellipse.model';
import ArrowModel from '@/models/arrow.model';
import PolygonModel from '@/models/polygon.model';
import TextModel from '@/models/text.model';
import ImageModel from '@/models/image.model';
import UndoRedoService, { UndoRedoEventType } from '@/services/undo.redo.service';
import { Theme } from '@/enums/Theme';

class EraserService {
  static eraserTrail: { x: number; y: number }[] = [];

  static drawEraser(
    mouseRef: React.MutableRefObject<Mouse>,
    ctx: CanvasRenderingContext2D,
    theme: Theme
  ) {
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
      EraserService.drawEraserTrail(ctx, theme);
      setTimeout(() => {
        EraserService.erase(mouseRef, ctx);
        EraserService.eraserTrail.shift();
      }, 100); // Delay
    }
  }

  private static drawEraserTrail(ctx: CanvasRenderingContext2D, theme: Theme) {
    if (EraserService.eraserTrail.length < 3) return;

    ctx.beginPath();
    ctx.strokeStyle = theme === Theme.Dark ? 'gray' : 'lightgray';
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
        case PenModel:
          if (PenModel.isPenHovered(shape as PenModel, mouseRef)) {
            allShapes.splice(i, 1);
            this.pushToUndoRedoService(i, shape);
          }
          break;
        case LineModel:
          if (LineModel.isLineHovered(shape as LineModel, mouseRef)) {
            allShapes.splice(i, 1);
            this.pushToUndoRedoService(i, shape);
          }
          break;
        case EllipseModel:
          if (EllipseModel.isEllipseHovered(shape as EllipseModel, mouseRef)) {
            allShapes.splice(i, 1);
            this.pushToUndoRedoService(i, shape);
          }
          break;
        case ArrowModel:
          if (ArrowModel.isArrowHovered(shape as ArrowModel, mouseRef)) {
            allShapes.splice(i, 1);
            this.pushToUndoRedoService(i, shape);
          }
          break;
        case PolygonModel:
          if (PolygonModel.isPolygonHovered(shape as PolygonModel, mouseRef)) {
            allShapes.splice(i, 1);
            this.pushToUndoRedoService(i, shape);
          }
          break;
        case TextModel:
          if (TextModel.isTextHovered(shape as TextModel, mouseRef, ctx)) {
            allShapes.splice(i, 1);
            this.pushToUndoRedoService(i, shape);
          }
          break;
        case ImageModel:
          if (ImageModel.isImageHovered(shape as ImageModel, mouseRef)) {
            allShapes.splice(i, 1);
            this.pushToUndoRedoService(i, shape);
          }
          break;
        default:
          break;
      }
    }
  }

  private static pushToUndoRedoService(index: number, shape: Shape) {
    UndoRedoService.push({
      type: UndoRedoEventType.DELETE,
      index,
      shape: {
        from: shape,
        to: null,
      },
    });
  }
}

export default EraserService;
