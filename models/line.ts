import { ToolColor, ToolVariant } from '@/enums/Tools';

class Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  strokeColor: ToolColor;
  strokeWidth: number;
  strokeStyle: ToolVariant;

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
    this.strokeColor = color;
    this.strokeWidth = size;
    this.strokeStyle = variant;
  }

  setColor(color: ToolColor) {
    this.strokeColor = color;
  }

  setSize(size: number) {
    this.strokeWidth = size;
  }

  setVariant(variant: ToolVariant) {
    this.strokeStyle = variant;
  }

  static drawLines(lines: Line[], ctx: CanvasRenderingContext2D) {
    lines.forEach((line) => {
      ctx.strokeStyle = line.strokeColor;
      ctx.lineWidth = line.strokeWidth;
      if (line.strokeStyle === ToolVariant.Dashed) {
        ctx.setLineDash([5, 3]);
      } else if (line.strokeStyle === ToolVariant.Dotted) {
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
