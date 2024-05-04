import { ToolVariant } from '@/enums/Tools';
import Line from '@/models/line';

class Ellipse extends Line {
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
      const x = (ellipse.x1 + ellipse.x2) / 2;
      const y = (ellipse.y1 + ellipse.y2) / 2;
      const radiusX = Math.abs(ellipse.x1 - ellipse.x2) / 2;
      const radiusY = Math.abs(ellipse.y1 - ellipse.y2) / 2;
      ctx.ellipse(x, y, radiusX, radiusY, 0, 0, 2 * Math.PI);
      ctx.stroke();
    });
  }
}

export default Ellipse;
