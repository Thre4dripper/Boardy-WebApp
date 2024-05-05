import BaseShape from '@/models/BaseShape';
import { ToolColor, ToolVariant } from '@/enums/Tools';
import { Mouse } from '@/app/page';
import React from 'react';

class Line extends BaseShape {
  private static lines: Line[] = [];

  static drawCurrentLine(
    mouseRef: React.MutableRefObject<Mouse>,
    selectedStrokeColor: ToolColor,
    selectedStrokeWidth: number,
    selectedStrokeVariant: ToolVariant
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
      BaseShape.draw(line, ctx);
      ctx.beginPath();
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(line.x2, line.y2);
      ctx.stroke();
    });
  }
}

export default Line;
