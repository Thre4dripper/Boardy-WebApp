import BaseShape from '@/models/BaseShape';

class Line extends BaseShape {
  static drawLines(lines: Line[], ctx: CanvasRenderingContext2D) {
    lines.forEach((line) => {
      BaseShape.draw(line, ctx);
      ctx.beginPath();
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(line.x2, line.y2);
      ctx.stroke();
    });
  }
}

export default Line;
