import { ToolColor, ToolVariant } from '@/enums/Tools';

class Arrow {
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

  static drawArrows(arrows: Arrow[], ctx: CanvasRenderingContext2D) {
    arrows.forEach((arrow) => {
      ctx.strokeStyle = arrow.color;
      ctx.lineWidth = arrow.size;
      if (arrow.variant === ToolVariant.Dashed) {
        ctx.setLineDash([5, 3]);
      } else if (arrow.variant === ToolVariant.Dotted) {
        ctx.setLineDash([2, 2]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.beginPath();
      ctx.moveTo(arrow.x1, arrow.y1);
      ctx.lineTo(arrow.x2, arrow.y2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(arrow.x2, arrow.y2);
      ctx.lineTo(arrow.x2 - 10, arrow.y2 - 10);
      ctx.lineTo(arrow.x2 - 10, arrow.y2 + 10);
      ctx.lineTo(arrow.x2, arrow.y2);
      ctx.stroke();
    });
  }
}

export default Arrow;