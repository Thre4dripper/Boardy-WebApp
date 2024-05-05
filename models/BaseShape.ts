import { ToolColor, ToolVariant } from '@/enums/Tools';

class BaseShape {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  strokeColor: ToolColor;
  strokeWidth: number;
  strokeVariant: ToolVariant;

  constructor(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    strokeColor: ToolColor,
    strokeWidth: number,
    strokeVariant: ToolVariant
  ) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.strokeColor = strokeColor;
    this.strokeWidth = strokeWidth;
    this.strokeVariant = strokeVariant;
  }

  static draw(shape: BaseShape, ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = shape.strokeColor;
    ctx.lineWidth = shape.strokeWidth;
    if (shape.strokeVariant === ToolVariant.Dashed) {
      ctx.setLineDash([shape.strokeWidth * 4, shape.strokeWidth * 4]);
    } else if (shape.strokeVariant === ToolVariant.Dotted) {
      ctx.setLineDash([shape.strokeWidth / 2, shape.strokeWidth * 4]);
    } else {
      ctx.setLineDash([]);
    }
  }
}

export default BaseShape;
