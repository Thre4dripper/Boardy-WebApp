import BaseShape from '@/models/BaseShape';
import { Mouse } from '@/app/page';
import React from 'react';
import { StrokeColor } from '@/enums/Colors';
import { StrokeVariant } from '@/enums/StrokeVariant';
import Selection from '@/models/Selection';

class Line extends BaseShape {
  private static lines: Line[] = [];

  static getAllLines = () => Line.lines;

  static drawCurrentLine(
    mouseRef: React.MutableRefObject<Mouse>,
    selectedStrokeColor: StrokeColor,
    selectedStrokeWidth: number,
    selectedStrokeVariant: StrokeVariant
  ) {
    const lines = Line.lines;
    if (mouseRef.current.down) {
      const lastLine = lines[lines.length - 1];
      lastLine.x2 = mouseRef.current.x;
      lastLine.y2 = mouseRef.current.y;
    } else {
      if (
        lines.length > 0 &&
        lines[lines.length - 1].x1 === lines[lines.length - 1].x2 &&
        lines[lines.length - 1].y1 === lines[lines.length - 1].y2
      ) {
        lines.pop();
      }
      lines.push(
        new Line(
          mouseRef.current.x,
          mouseRef.current.y,
          mouseRef.current.x,
          mouseRef.current.y,
          selectedStrokeColor,
          selectedStrokeWidth,
          selectedStrokeVariant
        )
      );
    }
  }

  static renderAllLines(ctx: CanvasRenderingContext2D) {
    Line.lines.forEach((line) => {
      if (line.x1 === line.x2 && line.y1 === line.y2) {
        return;
      }
      BaseShape.draw(line, ctx);
      ctx.beginPath();
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(line.x2, line.y2);
      ctx.stroke();

      if (line.isSelected) {
        Selection.drawLineSelectionBox(ctx, line);
      }
    });
  }

  static isLineHovered(line: Line, mouseRef: React.MutableRefObject<Mouse>) {
    const { x1, y1, x2, y2 } = line;
    const { x, y } = mouseRef.current;

    // using the distance formula to calculate the distance between the mouse and the line

    const dist =
      Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1) /
      Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));

    return (
      dist < line.strokeWidth + 2 &&
      x >= Math.min(x1, x2) &&
      x <= Math.max(x1, x2) &&
      y >= Math.min(y1, y2) &&
      y <= Math.max(y1, y2)
    );
  }
}

export default Line;
