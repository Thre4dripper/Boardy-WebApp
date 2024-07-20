import { Theme } from '@/enums/Theme';
import PenModel from '@/models/pen.model';
import LineModel from '@/models/line.model';
import EllipseModel from '@/models/ellipse.model';
import ArrowModel from '@/models/arrow.model';
import PolygonModel from '@/models/polygon.model';
import BaseModel from '@/models/base.model';
import { StrokeColor } from '@/enums/Colors';
import TextModel from '@/models/text.model';
import { Shape } from '@/store/Store';

class ThemeService {
  static changeShapesTheme(shape: Shape, theme: Theme) {
    switch (shape.constructor) {
      case PenModel:
      case LineModel:
      case EllipseModel:
      case ArrowModel:
      case PolygonModel:
        {
          const base = shape as BaseModel;
          // for changing the stroke color of the shapes based on the theme,
          // the stroke color should be either black or white or their shades
          const shade = base.strokeColor.split(',')[3].replace(')', '');
          const baseColor = base.strokeColor.substring(0, base.strokeColor.lastIndexOf(','));

          if (StrokeColor.Black.includes(baseColor) || StrokeColor.White.includes(baseColor)) {
            base.strokeColor =
              theme === Theme.Dark
                ? (StrokeColor.White.replace('1)', shade + ')') as StrokeColor)
                : (StrokeColor.Black.replace('1)', shade + ')') as StrokeColor);
          }
        }
        break;
      case TextModel:
        {
          const text = shape as TextModel;
          //changing theme for canvas converted text
          let shade = text.fontColor.split(',')[3];
          let baseColor = text.fontColor;
          if (shade === undefined) {
            //it means the color is rgb() not rgba()
            //convert it to rgba() by adding alpha value 1

            baseColor = baseColor.replace('rgb', 'rgba').replace(')', ',1)') as StrokeColor;

            shade = '1';
          } else {
            shade = shade.replace(')', '');
          }

          baseColor = baseColor
            .replaceAll(' ', '')
            .substring(0, baseColor.lastIndexOf(',') - 1) as StrokeColor;

          if (StrokeColor.Black.includes(baseColor) || StrokeColor.White.includes(baseColor)) {
            text.fontColor =
              theme === Theme.Dark
                ? (StrokeColor.White.replace('1)', shade + ')') as StrokeColor)
                : (StrokeColor.Black.replace('1)', shade + ')') as StrokeColor);
          }
        }
        break;
      default:
        break;
    }
  }
}

export default ThemeService;
