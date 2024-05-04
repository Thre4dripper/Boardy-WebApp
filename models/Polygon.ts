import Line from '@/models/line';
import { ToolColor, ToolVariant } from '@/enums/Tools';

class Polygon extends Line {
  sides: number;
  rotation: number;

  constructor(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: ToolColor,
    size: number,
    variant: ToolVariant,
    sides: number,
    rotation: number
  ) {
    super(x1, y1, x2, y2, color, size, variant);
    this.sides = sides;
    this.rotation = rotation;
  }

  static drawPolygon(polygons: Polygon[], ctx: CanvasRenderingContext2D) {
    polygons.forEach((polygon) => {
      ctx.strokeStyle = polygon.strokeColor;
      ctx.lineWidth = polygon.strokeWidth;
      if (polygon.strokeStyle === ToolVariant.Dashed) {
        ctx.setLineDash([5, 3]);
      } else if (polygon.strokeStyle === ToolVariant.Dotted) {
        ctx.setLineDash([2, 2]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.beginPath();
      const x = (polygon.x1 + polygon.x2) / 2;
      const y = (polygon.y1 + polygon.y2) / 2;
      const radiusX = Math.abs(polygon.x1 - polygon.x2) / 2;
      const radiusY = Math.abs(polygon.y1 - polygon.y2) / 2;

      for (let d = 0; d <= 360; d++) {
        if (d % (360 / polygon.sides) === 0) {
          const a = ((d + polygon.rotation) * Math.PI) / 180;
          const x1 = x + radiusX * Math.cos(a);
          const y1 = y + radiusY * Math.sin(a);
          const a2 = ((d + polygon.rotation + 360 / polygon.sides) * Math.PI) / 180;
          const x2 = x + radiusX * Math.cos(a2);
          const y2 = y + radiusY * Math.sin(a2);
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
        }
      }

      ctx.stroke();
    });
  }
}

export default Polygon;
