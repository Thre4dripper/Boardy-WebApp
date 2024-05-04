import BaseShape from '@/models/BaseShape';

class Arrow extends BaseShape {
  static drawArrows(arrows: Arrow[], ctx: CanvasRenderingContext2D) {
    arrows.forEach((arrow) => {
      BaseShape.draw(arrow, ctx);
      ctx.beginPath();
      ctx.moveTo(arrow.x1, arrow.y1);
      ctx.lineTo(arrow.x2, arrow.y2);
      ctx.stroke();

      // Calculate the angle of the line
      const angle = Math.atan2(arrow.y2 - arrow.y1, arrow.x2 - arrow.x1);

      // Calculate the positions of the arrowhead points
      const arrowheadLength = arrow.strokeWidth * 5;
      const arrowheadWidth = arrowheadLength * 0.5;
      const x3 = arrow.x2 - arrowheadLength * Math.cos(angle);
      const y3 = arrow.y2 - arrowheadLength * Math.sin(angle);
      const x4 = x3 + arrowheadWidth * Math.cos(angle + Math.PI / 2);
      const y4 = y3 + arrowheadWidth * Math.sin(angle + Math.PI / 2);
      const x5 = x3 + arrowheadWidth * Math.cos(angle - Math.PI / 2);
      const y5 = y3 + arrowheadWidth * Math.sin(angle - Math.PI / 2);

      // Draw the arrowhead
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(arrow.x2, arrow.y2);
      ctx.lineTo(x4, y4);
      ctx.moveTo(arrow.x2, arrow.y2);
      ctx.lineTo(x5, y5);
      ctx.stroke();
    });
  }
}

export default Arrow;
