import PenModel from '@/models/pen.model';
import LineModel from '@/models/line.model';
import EllipseModel from '@/models/ellipse.model';
import ArrowModel from '@/models/arrow.model';
import PolygonModel from '@/models/polygon.model';
import TextModel from '@/models/text.model';
import { Tools } from '@/enums/Tools';
import BaseModel from '@/models/base.model';
import ImageModel from '@/models/image.model';
import { Theme } from '@/enums/Theme';
import ThemeService from '@/services/theme.service';

export type Shape =
  | PenModel
  | LineModel
  | EllipseModel
  | ArrowModel
  | PolygonModel
  | TextModel
  | ImageModel;

class Store {
  static allShapes: Shape[] = [];

  static getFilter(shape: Shape) {
    //get all filters for shapes
    switch (shape.constructor) {
      case PenModel:
        const pen = shape as PenModel;
        return pen.path.length > 1;
      case LineModel:
      case EllipseModel:
      case ArrowModel:
      case PolygonModel:
        const line = shape as BaseModel;
        return line.x1 !== line.x2 || line.y1 !== line.y2;
      case TextModel:
        const text = shape as TextModel;
        return text.text.length > 0;
      case ImageModel:
        const image = shape as ImageModel;
        return image.x1 !== image.x2 || image.y1 !== image.y2;
      default:
        return false;
    }
  }

  static filterEmptyShapes(selectedTool: Tools) {
    //filter all empty shapes except that is selected

    for (let i = this.allShapes.length - 1; i >= 0; i--) {
      const shape = this.allShapes[i];
      let condition = false;

      const filter = this.getFilter(shape);

      switch (shape.constructor) {
        case PenModel:
          condition = selectedTool === Tools.Pen || filter;
          break;
        case LineModel:
          condition = selectedTool === Tools.Line || filter;
          break;
        case EllipseModel:
          condition = selectedTool === Tools.Ellipse || filter;
          break;
        case ArrowModel:
          condition = selectedTool === Tools.Arrow || filter;
          break;
        case PolygonModel:
          condition = selectedTool === Tools.Polygon || filter;
          break;
        case TextModel:
          condition = selectedTool === Tools.Text || filter;
          break;
        case ImageModel:
          condition = selectedTool === Tools.Image || filter;
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
        case PenModel:
          PenModel.drawStoredPen(ctx, shape as PenModel);
          break;
        case LineModel:
          LineModel.drawStoredLine(ctx, shape as LineModel);
          break;
        case EllipseModel:
          EllipseModel.drawStoredEllipse(ctx, shape as EllipseModel);
          break;
        case ArrowModel:
          ArrowModel.drawStoredArrow(ctx, shape as ArrowModel);
          break;
        case PolygonModel:
          PolygonModel.drawStoredPolygon(ctx, shape as PolygonModel);
          break;
        case TextModel:
          TextModel.drawStoredText(ctx, shape as TextModel);
          break;
        case ImageModel:
          ImageModel.drawStoredImage(ctx, shape as ImageModel);
          break;
        default:
          break;
      }
    });
  }

  static changeTheme(theme: Theme, parentDiv: HTMLElement) {
    //change all shapes themes
    this.allShapes.forEach((shape) => {
      ThemeService.changeShapesTheme(shape, theme);
    });
    TextModel.changeHtmlTextTheme(parentDiv, theme);
  }
}

export default Store;
