import Point from '@/models/Point';
import { ToolColor, ToolVariant } from '@/enums/Tools';
import BaseShape from '@/models/BaseShape';

class Pen extends BaseShape {
  path: Point[] = [];

  constructor(path: Point[], color: ToolColor, size: number, variant: ToolVariant) {
    super(0, 0, 0, 0, color, size, variant);
    this.path = path;
  }

  static drawPens(pens: Pen[], ctx: CanvasRenderingContext2D) {
    pens.forEach((pen) => {
      BaseShape.draw(pen, ctx);
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
