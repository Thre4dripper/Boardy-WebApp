import Line from '@/models/line';
import React from 'react';
import { Mouse } from '@/app/page';
import Store from '@/store/Store';
import Pen from '@/models/Pen';
import Arrow from '@/models/Arrow';
import Ellipse from '@/models/Ellipse';

class Selection {
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

  static drawEllipseSelectionBox(ctx: CanvasRenderingContext2D, ellipse: Ellipse) {
    const xCenter = (ellipse.x1 + ellipse.x2) / 2;
    const yCenter = (ellipse.y1 + ellipse.y2) / 2;
    const radiusX = Math.abs(ellipse.x1 - ellipse.x2) / 2;
    const radiusY = Math.abs(ellipse.y1 - ellipse.y2) / 2;

    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(
      xCenter - radiusX - 5,
      yCenter - radiusY - 5,
      radiusX * 2 + 10,
      radiusY * 2 + 10
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
        case Ellipse:
          if (Ellipse.isEllipseHovered(shape as Ellipse, mouseRef)) {
            Selection.drawEllipseSelectionBox(ctx, shape as Ellipse);
          }

          if (mouseRef.current.down && Ellipse.isEllipseHovered(shape as Ellipse, mouseRef)) {
            //remove all selections
            Selection.clearAllSelections();
            (shape as Ellipse).setIsSelected(true);
          }
          break;
        case Arrow:
          if (Arrow.isArrowHovered(shape as Arrow, mouseRef)) {
            Selection.drawLineSelectionBox(ctx, shape as Arrow);
          }

          if (mouseRef.current.down && Arrow.isArrowHovered(shape as Arrow, mouseRef)) {
            //remove all selections
            Selection.clearAllSelections();
            (shape as Arrow).setIsSelected(true);
          }
          break;
        default:
          break;
      }
    });
  }
}

export default Selection;
