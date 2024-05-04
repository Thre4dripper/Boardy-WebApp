import BaseShape from '@/models/BaseShape';

class Ellipse extends BaseShape {
  static drawEllipses(ellipses: Ellipse[], ctx: CanvasRenderingContext2D) {
    ellipses.forEach((ellipse) => {
      BaseShape.draw(ellipse, ctx);
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
