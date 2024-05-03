import { ToolColor, ToolSize, ToolVariant } from '@/enums/Tools';

class Line {
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

  static drawLines(lines: Line[], ctx: CanvasRenderingContext2D) {
    lines.forEach((line) => {
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.size;
      if (line.variant === ToolVariant.Dashed) {
        ctx.setLineDash([5, 3]);
      } else if (line.variant === ToolVariant.Dotted) {
        ctx.setLineDash([2, 2]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.beginPath();
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(line.x2, line.y2);
      ctx.stroke();
    });
  }
}

export default Line;
