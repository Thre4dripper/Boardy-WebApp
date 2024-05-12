import BaseShapeService from '@/services/baseShape.service';
import { Mouse } from '@/app/page';
import React from 'react';
import { StrokeColor } from '@/enums/Colors';
import { StrokeVariant } from '@/enums/StrokeVariant';
import SelectionService from '@/services/selection.service';
import Store from '@/store/Store';

class LineService extends BaseShapeService {
  static drawCurrentLine(
    mouseRef: React.MutableRefObject<Mouse>,
    selectedStrokeColor: StrokeColor,
    selectedStrokeWidth: number,
    selectedStrokeVariant: StrokeVariant
  ) {
    const lines = Store.allShapes.filter((shape) => shape instanceof LineService) as LineService[];
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
        Store.allShapes.pop();
      }
      Store.allShapes.push(
        new LineService(
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

  static drawStoredLine(ctx: CanvasRenderingContext2D, line: LineService) {
    if (line.x1 === line.x2 && line.y1 === line.y2) {
      return;
    }
    BaseShapeService.draw(line, ctx);
    ctx.beginPath();
    ctx.moveTo(line.x1, line.y1);
    ctx.lineTo(line.x2, line.y2);
    ctx.stroke();

    if (line.isSelected) {
      SelectionService.drawLineSelectionBox(ctx, line, true);
    }
  }

  static isLineHovered(line: LineService, mouseRef: React.MutableRefObject<Mouse>) {
    const { x1, y1, x2, y2 } = line;
    const { x, y } = mouseRef.current;

    const tolerance = line.strokeWidth / 2 + 5;

    // using the distance formula to calculate the distance between the mouse and the line

    //check for horizontal lines
    if (Math.abs(y1 - y2) < tolerance) {
      return (
        y >= y1 - tolerance && y <= y1 + tolerance && x >= Math.min(x1, x2) && x <= Math.max(x1, x2)
      );
    }

    //check for vertical lines
    if (Math.abs(x1 - x2) < tolerance) {
      return (
        x >= x1 - tolerance && x <= x1 + tolerance && y >= Math.min(y1, y2) && y <= Math.max(y1, y2)
      );
    }

    const dist =
      Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1) /
      Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));

    return (
      dist < line.strokeWidth + 5 &&
      x >= Math.min(x1, x2) &&
      x <= Math.max(x1, x2) &&
      y >= Math.min(y1, y2) &&
      y <= Math.max(y1, y2)
    );
  }
}

export default LineService;
