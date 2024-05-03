import { ToolColor, ToolVariant } from '@/enums/Tools';

class Rectangle {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: ToolColor;
  size: number;
  variant: ToolVariant;

  constructor(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: ToolColor,
    size: number,
    variant: ToolVariant
  ) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.color = color;
    this.size = size;
    this.variant = variant;
  }

  setColor(color: ToolColor) {
    this.color = color;
  }

  setSize(size: number) {
    this.size = size;
  }

  setVariant(variant: ToolVariant) {
    this.variant = variant;
  }

  static drawRectangles(rectangles: Rectangle[], ctx: CanvasRenderingContext2D) {
    rectangles.forEach((rectangle) => {
      ctx.strokeStyle = rectangle.color;
      ctx.lineWidth = rectangle.size;
      if (rectangle.variant === ToolVariant.Dashed) {
        ctx.setLineDash([5, 3]);
      } else if (rectangle.variant === ToolVariant.Dotted) {
        ctx.setLineDash([2, 2]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.beginPath();
      ctx.rect(rectangle.x1, rectangle.y1, rectangle.x2, rectangle.y2);

      ctx.stroke();
    });
  }

  static drawDiamonds(diamonds: Rectangle[], ctx: CanvasRenderingContext2D) {
    diamonds.forEach((diamond) => {
      ctx.strokeStyle = diamond.color;
      ctx.lineWidth = diamond.size;
      if (diamond.variant === ToolVariant.Dashed) {
        ctx.setLineDash([5, 3]);
      } else if (diamond.variant === ToolVariant.Dotted) {
        ctx.setLineDash([2, 2]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.beginPath();
      ctx.moveTo(diamond.x1 + diamond.x2 / 2, diamond.y1);
      ctx.lineTo(diamond.x1 + diamond.x2, diamond.y1 + diamond.y2 / 2);
      ctx.lineTo(diamond.x1 + diamond.x2 / 2, diamond.y1 + diamond.y2);
      ctx.lineTo(diamond.x1, diamond.y1 + diamond.y2 / 2);
      ctx.closePath();
      ctx.stroke();
    });
  }
}

export default Rectangle;
