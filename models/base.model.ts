import { StrokeColor } from '@/enums/Colors';
import { StrokeVariant } from '@/enums/StrokeVariant';

class BaseModel {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  strokeColor: StrokeColor;
  strokeWidth: number;
  strokeVariant: StrokeVariant;
  timeStamp: number;
  isSelected: boolean = false;
  horizontalInverted: boolean = false;
  verticalInverted: boolean = false;

  setIsSelected(isSelected: boolean) {
    this.isSelected = isSelected;
  }

  constructor(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    strokeColor: StrokeColor,
    strokeWidth: number,
    strokeVariant: StrokeVariant
  ) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.strokeColor = strokeColor;
    this.strokeWidth = strokeWidth;
    this.strokeVariant = strokeVariant;
    this.timeStamp = Date.now();
  }

  static draw(shape: BaseModel, ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = shape.strokeColor;
    ctx.lineWidth = shape.strokeWidth;
    if (shape.strokeVariant === StrokeVariant.Dashed) {
      ctx.setLineDash([shape.strokeWidth * 4, shape.strokeWidth * 4]);
    } else if (shape.strokeVariant === StrokeVariant.Dotted) {
      ctx.setLineDash([shape.strokeWidth / 2, shape.strokeWidth * 4]);
    } else {
      ctx.setLineDash([]);
    }
  }
}

export default BaseModel;
