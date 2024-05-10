import Pen from '@/models/Pen';
import Line from '@/models/line';
import Ellipse from '@/models/Ellipse';
import Arrow from '@/models/Arrow';
import Polygon from '@/models/Polygon';
import Text from '@/models/Text';
import { Tools } from '@/enums/Tools';
import BaseShape from '@/models/BaseShape';

type Shape = Pen | Line | Ellipse | Arrow | Polygon | Text;

class Store {
  static allShapes: Shape[] = [];

  static filterEmptyShapes(selectedTool: Tools) {
    //filter all empty shapes except that is selected

    const allFilters = [
      (shape: Shape) => {
        const pen = shape as Pen;
        return pen.path.length > 1;
      },
      (shape: Shape) => {
        const line = shape as BaseShape;
        return line.x1 !== line.x2 || line.y1 !== line.y2;
      },
      (shape: Shape) => {
        const text = shape as Text;
        return text.text.length > 0;
      },
    ];

    for (let i = this.allShapes.length - 1; i >= 0; i--) {
      const shape = this.allShapes[i];
      let condition = false;

      switch (shape.constructor) {
        case Pen:
          condition = selectedTool === Tools.Pen || allFilters[0](shape);
          break;
        case Line:
          condition = selectedTool === Tools.Line || allFilters[1](shape);
          break;
        case Ellipse:
          condition = selectedTool === Tools.Ellipse || allFilters[1](shape);
          break;
        case Arrow:
          condition = selectedTool === Tools.Arrow || allFilters[1](shape);
          break;
        case Polygon:
          condition = selectedTool === Tools.Polygon || allFilters[1](shape);
          break;
        case Text:
          condition = selectedTool === Tools.Text || allFilters[2](shape);
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
        case Pen:
          Pen.drawStoredPen(ctx, shape as Pen);
          break;
        case Line:
          Line.drawStoredLine(ctx, shape as Line);
          break;
        case Ellipse:
          Ellipse.drawStoredEllipse(ctx, shape as Ellipse);
          break;
        case Arrow:
          Arrow.drawStoredArrow(ctx, shape as Arrow);
          break;
        case Polygon:
          Polygon.drawStoredPolygon(ctx, shape as Polygon);
          break;
        case Text:
          Text.drawStoredText(ctx, shape as Text);
          break;
        default:
          break;
      }
    });
  }
}

export default Store;
