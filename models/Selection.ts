import Line from '@/models/line';
import React from 'react';
import { Mouse } from '@/app/page';
import Store from '@/store/Store';

class Selection {
  static isLineHovered(line: Line, mouseRef: React.MutableRefObject<Mouse>) {
    const { x1, y1, x2, y2 } = line;
    const { x, y } = mouseRef.current;

    // using the distance formula to calculate the distance between the mouse and the line

    const dist =
      Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1) /
      Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));

    return (
      dist < 10 &&
      x >= Math.min(x1, x2) &&
      x <= Math.max(x1, x2) &&
      y >= Math.min(y1, y2) &&
      y <= Math.max(y1, y2)
    );
  }

  static drawLineSelectionBox(ctx: CanvasRenderingContext2D, line: Line) {
    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(
      Math.min(line.x1, line.x2) - 5,
      Math.min(line.y1, line.y2) - 5,
      Math.abs(line.x1 - line.x2) + 10,
      Math.abs(line.y1 - line.y2) + 10
    );
  }

  static clearAllSelections() {
    const allData = Store.getCombinedData();
    allData.forEach((shape) => {
      shape.setIsSelected(false);
    });
  }

  static drawSelectionBoxes(
    ctx: CanvasRenderingContext2D,
    mouseRef: React.MutableRefObject<Mouse>
  ) {
    const allData = Store.getCombinedData();
    allData.forEach((shape) => {
      switch (shape.constructor) {
        case Line:
          if (Selection.isLineHovered(shape as Line, mouseRef)) {
            Selection.drawLineSelectionBox(ctx, shape as Line);
          }

          if (mouseRef.current.down && Selection.isLineHovered(shape as Line, mouseRef)) {
            //remove all selections
            Selection.clearAllSelections();
            (shape as Line).setIsSelected(true);
          }
          break;
        default:
          break;
      }
    });
  }
}

export default Selection;
