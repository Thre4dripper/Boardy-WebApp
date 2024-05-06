import Line from '@/models/line';
import React from 'react';
import { Mouse } from '@/app/page';
import Store from '@/store/Store';
import Pen from '@/models/Pen';

class Selection {
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

  static drawPenSelectionBox(ctx: CanvasRenderingContext2D, pen: Pen) {
    const path = pen.path;
    const minX = Math.min(...path.map((point) => point.x));
    const minY = Math.min(...path.map((point) => point.y));
    const maxX = Math.max(...path.map((point) => point.x));
    const maxY = Math.max(...path.map((point) => point.y));

    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(minX - 5, minY - 5, maxX - minX + 10, maxY - minY + 10);
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
        case Pen:
          if (Pen.isPenHovered(shape as Pen, mouseRef)) {
            Selection.drawPenSelectionBox(ctx, shape as Pen);
          }

          if (mouseRef.current.down && Pen.isPenHovered(shape as Pen, mouseRef)) {
            //remove all selections
            Selection.clearAllSelections();
            (shape as Pen).setIsSelected(true);
          }
          break;
        case Line:
          if (Line.isLineHovered(shape as Line, mouseRef)) {
            Selection.drawLineSelectionBox(ctx, shape as Line);
          }

          if (mouseRef.current.down && Line.isLineHovered(shape as Line, mouseRef)) {
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
