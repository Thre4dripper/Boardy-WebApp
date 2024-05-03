import { ToolColor, ToolVariant } from '@/enums/Tools';

class Ellipse {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  radius: number;
  color: ToolColor;
  size: number;
  variant: ToolVariant;

  constructor(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    radius: number,
    color: ToolColor,
    size: number,
    variant: ToolVariant
  ) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.radius = radius;
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

  static drawEllipses(ellipses: Ellipse[], ctx: CanvasRenderingContext2D) {
    ellipses.forEach((ellipse) => {
      ctx.strokeStyle = ellipse.color;
      ctx.lineWidth = ellipse.size;
      if (ellipse.variant === ToolVariant.Dashed) {
        ctx.setLineDash([5, 3]);
      } else if (ellipse.variant === ToolVariant.Dotted) {
        ctx.setLineDash([2, 2]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.beginPath();
      ctx.ellipse(ellipse.x1, ellipse.y1, ellipse.x2, ellipse.y2, 0, 0, 2 * Math.PI);
      ctx.stroke();
    });
  }
}

export default Ellipse;
