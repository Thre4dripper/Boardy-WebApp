import Point from '@/models/Point';
import { ToolColor, ToolVariant } from '@/enums/Tools';

class Pen {
  path: Point[] = [];
  color: ToolColor;
  size: number;
  variant: ToolVariant;

  constructor(path: Point[], color: ToolColor, size: number, variant: ToolVariant) {
    this.path = path;
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

  static drawPens(pens: Pen[], ctx: CanvasRenderingContext2D) {
    pens.forEach((pen) => {
      ctx.strokeStyle = pen.color;
      ctx.lineWidth = pen.size;
      if (pen.variant === ToolVariant.Dashed) {
        ctx.setLineDash([5, 3]);
      } else if (pen.variant === ToolVariant.Dotted) {
        ctx.setLineDash([2, 2]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.beginPath();
      ctx.moveTo(pen.path[0].x, pen.path[0].y);
      pen.path.forEach((point) => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    });
  }
}

export default Pen;
