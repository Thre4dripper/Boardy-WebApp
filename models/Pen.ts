import Point from '@/models/Point';
import { ToolColor, ToolSize, ToolVariant } from '@/enums/Tools';

class Pen {
  path: Point[] = [];
  color: ToolColor;
  size: ToolSize;
  variant: ToolVariant;

  constructor(path: Point[], color: ToolColor, size: ToolSize, variant: ToolVariant) {
    this.path = path;
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

export default Pen;
