import { ToolColor, ToolSize, ToolVariant } from '@/enums/Tools';

class Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: ToolColor;
  size: ToolSize;
  variant: ToolVariant;

  constructor(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: ToolColor,
    size: ToolSize,
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

  setSize(size: ToolSize) {
    this.size = size;
  }

  setVariant(variant: ToolVariant) {
    this.variant = variant;
  }
}

export default Line;
