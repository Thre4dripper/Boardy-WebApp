import Line from '@/models/line';
import React from 'react';
import { Mouse } from '@/app/page';
import Store from '@/store/Store';
import Pen from '@/models/Pen';
import Arrow from '@/models/Arrow';
import Ellipse from '@/models/Ellipse';
import Polygon from '@/models/Polygon';
import Text from '@/models/Text';

class Selection {
  static SELECTION_COLOR = 'rgb(93,121,157)';
  static DOTS_COLOR = 'rgb(171,207,255)';

  static drawDots(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.setLineDash([]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = this.SELECTION_COLOR;
    ctx.fillStyle = this.DOTS_COLOR;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }

  static drawPenSelectionBox(ctx: CanvasRenderingContext2D, pen: Pen) {
    const path = pen.path;
    const minX = Math.min(...path.map((point) => point.x));
    const minY = Math.min(...path.map((point) => point.y));
    const maxX = Math.max(...path.map((point) => point.x));
    const maxY = Math.max(...path.map((point) => point.y));

    ctx.strokeStyle = this.SELECTION_COLOR;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(minX - 5, minY - 5, maxX - minX + 10, maxY - minY + 10);

    //four dots in each corner
    this.drawDots(ctx, minX - 5, minY - 5);
    this.drawDots(ctx, maxX + 5, minY - 5);
    this.drawDots(ctx, minX - 5, maxY + 5);
    this.drawDots(ctx, maxX + 5, maxY + 5);
  }

  static drawLineSelectionBox(ctx: CanvasRenderingContext2D, line: Line) {
    this.drawDots(ctx, line.x1, line.y1);
    this.drawDots(ctx, line.x2, line.y2);
  }

  static drawPolygonSelectionBox(ctx: CanvasRenderingContext2D, polygon: Polygon) {
    const vertices = [];

    const xCenter = (polygon.x1 + polygon.x2) / 2;
    const yCenter = (polygon.y1 + polygon.y2) / 2;
    const radiusX = Math.abs(polygon.x1 - polygon.x2) / 2;
    const radiusY = Math.abs(polygon.y1 - polygon.y2) / 2;

    for (let d = 0; d <= 360; d++) {
      if (d % (360 / polygon.sides) === 0) {
        const a = ((d + polygon.rotation) * Math.PI) / 180;
        const x1 = xCenter + radiusX * Math.cos(a);
        const y1 = yCenter + radiusY * Math.sin(a);
        vertices.push({ x: x1, y: y1 });
      }
    }

    const minX = Math.min(...vertices.map((v) => v.x));
    const minY = Math.min(...vertices.map((v) => v.y));
    const maxX = Math.max(...vertices.map((v) => v.x));
    const maxY = Math.max(...vertices.map((v) => v.y));

    ctx.strokeStyle = this.SELECTION_COLOR;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(minX - 5, minY - 5, maxX - minX + 10, maxY - minY + 10);

    //four dots in each corner
    this.drawDots(ctx, minX - 5, minY - 5);
    this.drawDots(ctx, maxX + 5, minY - 5);
    this.drawDots(ctx, minX - 5, maxY + 5);
    this.drawDots(ctx, maxX + 5, maxY + 5);
  }

  static drawEllipseSelectionBox(ctx: CanvasRenderingContext2D, ellipse: Ellipse) {
    const xCenter = (ellipse.x1 + ellipse.x2) / 2;
    const yCenter = (ellipse.y1 + ellipse.y2) / 2;
    const radiusX = Math.abs(ellipse.x1 - ellipse.x2) / 2;
    const radiusY = Math.abs(ellipse.y1 - ellipse.y2) / 2;

    const minX = xCenter - radiusX;
    const minY = yCenter - radiusY;
    const maxX = radiusX * 2;
    const maxY = radiusY * 2;

    ctx.strokeStyle = this.SELECTION_COLOR;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(minX - 5, minY - 5, maxX + 10, maxY + 10);

    //four dots in each corner
    this.drawDots(ctx, minX - 5, minY - 5);
    this.drawDots(ctx, minX - 5, minY + maxY + 5);
    this.drawDots(ctx, minX + maxX + 5, minY - 5);
    this.drawDots(ctx, minX + maxX + 5, minY + maxY + 5);
  }

  static drawTextSelectionBox(ctx: CanvasRenderingContext2D, text: Text) {
    ctx.strokeStyle = this.SELECTION_COLOR;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    const lines = text.text.split('\n');

    const minX = text.x;
    const minY = text.y;
    const maxX = text.x + Math.max(...lines.map((line) => ctx.measureText(line).width));
    const maxY = text.y + text.fontSize * 1.5 * lines.length;

    ctx.strokeRect(minX - 5, minY - 5, maxX - minX + 10, maxY - minY + 10);

    //four dots in each corner
    this.drawDots(ctx, minX - 5, minY - 5);
    this.drawDots(ctx, minX - 5, maxY + 5);
    this.drawDots(ctx, maxX + 5, minY - 5);
    this.drawDots(ctx, maxX + 5, maxY + 5);
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
        case Polygon:
          if (Polygon.isPolygonHovered(shape as Polygon, mouseRef)) {
            Selection.drawPolygonSelectionBox(ctx, shape as Polygon);
          }

          if (mouseRef.current.down && Polygon.isPolygonHovered(shape as Polygon, mouseRef)) {
            //remove all selections
            Selection.clearAllSelections();
            (shape as Polygon).setIsSelected(true);
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
        case Text:
          if (Text.isTextHovered(shape as Text, mouseRef, ctx)) {
            console.log((shape as Text).text);
            Selection.drawTextSelectionBox(ctx, shape as Text);
          }

          if (mouseRef.current.down && Text.isTextHovered(shape as Text, mouseRef, ctx)) {
            //remove all selections
            Selection.clearAllSelections();
            (shape as Text).setIsSelected(true);
          }
          break;
        default:
          break;
      }
    });
  }

  static moveSelectedShape(mouseRef: React.MutableRefObject<Mouse>) {
    const allData = Store.getCombinedData();
    const selectedShape = allData.find((shape) => shape.isSelected);
    if (!selectedShape || !mouseRef.current.down) {
      return;
    }

    if (!mouseRef.current.prevX || !mouseRef.current.prevY) {
      mouseRef.current.prevX = mouseRef.current.x;
      mouseRef.current.prevY = mouseRef.current.y;
      return; // Skip moving the shape if it's the first mouse movement
    }

    const dx = mouseRef.current.x - mouseRef.current.prevX;
    const dy = mouseRef.current.y - mouseRef.current.prevY;

    switch (selectedShape.constructor) {
      case Pen:
        const pen = selectedShape as Pen;
        pen.path.forEach((point) => {
          point.x += dx;
          point.y += dy;
        });
        break;
      case Line:
        const line = selectedShape as Line;
        line.x1 += dx;
        line.y1 += dy;
        line.x2 += dx;
        line.y2 += dy;
        break;
      case Polygon:
        const polygon = selectedShape as Polygon;
        polygon.x1 += dx;
        polygon.y1 += dy;
        polygon.x2 += dx;
        polygon.y2 += dy;
        break;
      case Ellipse:
        const ellipse = selectedShape as Ellipse;
        ellipse.x1 += dx;
        ellipse.y1 += dy;
        ellipse.x2 += dx;
        ellipse.y2 += dy;
        break;
      case Arrow:
        const arrow = selectedShape as Arrow;
        arrow.x1 += dx;
        arrow.y1 += dy;
        arrow.x2 += dx;
        arrow.y2 += dy;
        break;
      case Text:
        const text = selectedShape as Text;
        text.x += dx;
        text.y += dy;
        break;
      default:
        break;
    }

    // Update the previous mouse position
    mouseRef.current.prevX = mouseRef.current.x;
    mouseRef.current.prevY = mouseRef.current.y;
  }

}

export default Selection;
