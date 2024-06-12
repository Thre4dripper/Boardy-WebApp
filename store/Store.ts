import PenService from '@/services/pen.service';
import LineService from '@/services/line.service';
import EllipseService from '@/services/ellipse.service';
import ArrowService from '@/services/arrow.service';
import PolygonService from '@/services/polygon.service';
import TextService from '@/services/text.service';
import { Tools } from '@/enums/Tools';
import BaseShapeService from '@/services/baseShape.service';
import ImageService from '@/services/image.service';

export type Shape =
  | PenService
  | LineService
  | EllipseService
  | ArrowService
  | PolygonService
  | TextService
  | ImageService;

class Store {
  static allShapes: Shape[] = [];

  static filterEmptyShapes(selectedTool: Tools) {
    //filter all empty shapes except that is selected

    const allFilters = [
      (shape: Shape) => {
        const pen = shape as PenService;
        return pen.path.length > 1;
      },
      (shape: Shape) => {
        const line = shape as BaseShapeService;
        return line.x1 !== line.x2 || line.y1 !== line.y2;
      },
      (shape: Shape) => {
        const text = shape as TextService;
        return text.text.length > 0;
      },
      (shape: Shape) => {
        const image = shape as ImageService;
        return image.x1 !== image.x2 || image.y1 !== image.y2;
      },
    ];

    for (let i = this.allShapes.length - 1; i >= 0; i--) {
      const shape = this.allShapes[i];
      let condition = false;

      switch (shape.constructor) {
        case PenService:
          condition = selectedTool === Tools.Pen || allFilters[0](shape);
          break;
        case LineService:
          condition = selectedTool === Tools.Line || allFilters[1](shape);
          break;
        case EllipseService:
          condition = selectedTool === Tools.Ellipse || allFilters[1](shape);
          break;
        case ArrowService:
          condition = selectedTool === Tools.Arrow || allFilters[1](shape);
          break;
        case PolygonService:
          condition = selectedTool === Tools.Polygon || allFilters[1](shape);
          break;
        case TextService:
          condition = selectedTool === Tools.Text || allFilters[2](shape);
          break;
        case ImageService:
          condition = selectedTool === Tools.Image || allFilters[3](shape);
          break;
        default:
          condition = false;
      }

      if (!condition) {
        this.allShapes.splice(i, 1);
      }
    }
  }

  static drawAllShapes(ctx: CanvasRenderingContext2D) {
    //draw all shapes
    this.allShapes.forEach((shape) => {
      switch (shape.constructor) {
        case PenService:
          PenService.drawStoredPen(ctx, shape as PenService);
          break;
        case LineService:
          LineService.drawStoredLine(ctx, shape as LineService);
          break;
        case EllipseService:
          EllipseService.drawStoredEllipse(ctx, shape as EllipseService);
          break;
        case ArrowService:
          ArrowService.drawStoredArrow(ctx, shape as ArrowService);
          break;
        case PolygonService:
          PolygonService.drawStoredPolygon(ctx, shape as PolygonService);
          break;
        case TextService:
          TextService.drawStoredText(ctx, shape as TextService);
          break;
        case ImageService:
          ImageService.drawStoredImage(ctx, shape as ImageService);
          break;
        default:
          break;
      }
    });
  }
}

export default Store;
