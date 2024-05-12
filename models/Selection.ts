import Line from '@/models/line';
import React from 'react';
import { Mouse } from '@/app/page';
import Store from '@/store/Store';
import Pen from '@/models/Pen';
import Arrow from '@/models/Arrow';
import Ellipse from '@/models/Ellipse';
import Polygon from '@/models/Polygon';
import Text from '@/models/Text';
import Cursors from '@/enums/Cursors';
import { SelectionResize } from '@/enums/SelectionResize';

let flag = false;
let isMouseUp = false;

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

  static drawPenSelectionBox(ctx: CanvasRenderingContext2D, pen: Pen, fullSelect: boolean) {
    const path = pen.path;
    const minX = Math.min(...path.map((point) => point.x));
    const minY = Math.min(...path.map((point) => point.y));
    const maxX = Math.max(...path.map((point) => point.x));
    const maxY = Math.max(...path.map((point) => point.y));

    ctx.strokeStyle = this.SELECTION_COLOR;
    if (fullSelect) {
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
    } else {
      ctx.lineWidth = 0.8;
      ctx.setLineDash([]);
    }
    ctx.strokeRect(minX - 5, minY - 5, maxX - minX + 10, maxY - minY + 10);

    if (!fullSelect) return;
    //four dots in each corner
    this.drawDots(ctx, minX - 5, minY - 5);
    this.drawDots(ctx, maxX + 5, minY - 5);
    this.drawDots(ctx, minX - 5, maxY + 5);
    this.drawDots(ctx, maxX + 5, maxY + 5);
  }

  static drawLineSelectionBox(ctx: CanvasRenderingContext2D, line: Line, fullSelect: boolean) {
    if (!fullSelect) return;
    this.drawDots(ctx, line.x1, line.y1);
    this.drawDots(ctx, line.x2, line.y2);
  }

  static drawPolygonSelectionBox(
    ctx: CanvasRenderingContext2D,
    polygon: Polygon,
    fullSelect: boolean
  ) {
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
    if (fullSelect) {
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
    } else {
      ctx.lineWidth = 0.8;
      ctx.setLineDash([]);
    }
    ctx.strokeRect(minX - 10, minY - 10, maxX - minX + 20, maxY - minY + 20);

    if (!fullSelect) return;
    //four dots in each corner
    this.drawDots(ctx, minX - 10, minY - 10);
    this.drawDots(ctx, maxX + 10, minY - 10);
    this.drawDots(ctx, minX - 10, maxY + 10);
    this.drawDots(ctx, maxX + 10, maxY + 10);
  }

  static drawEllipseSelectionBox(
    ctx: CanvasRenderingContext2D,
    ellipse: Ellipse,
    fullSelect: boolean
  ) {
    const xCenter = (ellipse.x1 + ellipse.x2) / 2;
    const yCenter = (ellipse.y1 + ellipse.y2) / 2;
    const radiusX = Math.abs(ellipse.x1 - ellipse.x2) / 2;
    const radiusY = Math.abs(ellipse.y1 - ellipse.y2) / 2;

    const minX = xCenter - radiusX;
    const minY = yCenter - radiusY;
    const maxX = radiusX * 2;
    const maxY = radiusY * 2;

    ctx.strokeStyle = this.SELECTION_COLOR;
    if (fullSelect) {
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
    } else {
      ctx.lineWidth = 0.8;
      ctx.setLineDash([]);
    }
    ctx.strokeRect(minX - 5, minY - 5, maxX + 10, maxY + 10);

    if (!fullSelect) return;
    //four dots in each corner
    this.drawDots(ctx, minX - 5, minY - 5);
    this.drawDots(ctx, minX - 5, minY + maxY + 5);
    this.drawDots(ctx, minX + maxX + 5, minY - 5);
    this.drawDots(ctx, minX + maxX + 5, minY + maxY + 5);
  }

  static drawTextSelectionBox(ctx: CanvasRenderingContext2D, text: Text, fullSelect: boolean) {
    ctx.strokeStyle = this.SELECTION_COLOR;
    if (fullSelect) {
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 2;
    } else {
      ctx.setLineDash([]);
      ctx.lineWidth = 0.8;
    }

    const lines = text.text.split('\n');

    const minX = text.x;
    const minY = text.y;
    const maxX = text.x + Math.max(...lines.map((line) => ctx.measureText(line).width));
    const maxY = text.y + text.fontSize * 1.5 * lines.length;

    ctx.strokeRect(minX - 5, minY - 5, maxX - minX + 10, maxY - minY + 10);

    if (!fullSelect) return;
    //four dots in each corner
    this.drawDots(ctx, minX - 5, minY - 5);
    this.drawDots(ctx, minX - 5, maxY + 5);
    this.drawDots(ctx, maxX + 5, minY - 5);
    this.drawDots(ctx, maxX + 5, maxY + 5);
  }

  static clearAllSelections() {
    const allData = Store.allShapes;
    allData.forEach((shape) => {
      shape.setIsSelected(false);
    });
  }

  static drawSelectionBoxes(
    ctx: CanvasRenderingContext2D,
    mouseRef: React.MutableRefObject<Mouse>
  ) {
    const allData = Store.allShapes;

    if (mouseRef.current.down) {
      flag = true;
    }

    //when mouse is up then for an instant, isMouseUp will be true
    if (!mouseRef.current.down && flag) {
      setTimeout(() => {
        isMouseUp = false;
      }, 10);
      flag = false;
      isMouseUp = true;
    }

    allData.forEach((shape) => {
      switch (shape.constructor) {
        case Pen:
          const pen = shape as Pen;

          //change cursor to move if pen bounding box is hovered
          if (pen.isSelected && Pen.isPenSelectionHovered(pen, mouseRef)) {
            mouseRef.current.cursor = Cursors.MOVE;
          }

          //clear selection if mouse is clicked outside pen bounding box
          if (isMouseUp && !Pen.isPenSelectionHovered(pen, mouseRef)) {
            pen.setIsSelected(false);
          }

          //draw selection box when pen is not selected and hovered and mouse should be in upstate
          if (!pen.isSelected && !mouseRef.current.down && Pen.isPenHovered(pen, mouseRef)) {
            Selection.drawPenSelectionBox(ctx, pen, false);
            mouseRef.current.cursor = Cursors.MOVE;
          }

          //select pen if hovered and mouse is clicked and no other shape is selected
          if (isMouseUp && Pen.isPenHovered(pen, mouseRef)) {
            //remove all selections
            Selection.clearAllSelections();
            pen.setIsSelected(true);
          }
          break;
        case Line:
          const line = shape as Line;

          //change cursor to move if line bounding box is hovered
          if (line.isSelected && Line.isLineHovered(line, mouseRef)) {
            mouseRef.current.cursor = Cursors.MOVE;
          }

          //clear selection if mouse is clicked outside line bounding box
          if (isMouseUp && !Line.isLineHovered(line, mouseRef)) {
            line.setIsSelected(false);
          }

          //draw selection box when pen is not selected and hovered and mouse should be in upstate
          if (!line.isSelected && !mouseRef.current.down && Line.isLineHovered(line, mouseRef)) {
            Selection.drawLineSelectionBox(ctx, line, false);
            mouseRef.current.cursor = Cursors.MOVE;
          }

          //select line if hovered and mouse is clicked and no other shape is selected
          if (isMouseUp && Line.isLineHovered(line, mouseRef)) {
            //remove all selections
            Selection.clearAllSelections();
            line.setIsSelected(true);
          }
          break;
        case Polygon:
          const polygon = shape as Polygon;

          //change cursor to move if polygon bounding box is hovered
          if (polygon.isSelected && Polygon.isPolygonSelectionHovered(polygon, mouseRef)) {
            mouseRef.current.cursor = Cursors.MOVE;
          }

          //clear selection if mouse is clicked outside polygon bounding box
          if (isMouseUp && !Polygon.isPolygonSelectionHovered(polygon, mouseRef)) {
            polygon.setIsSelected(false);
          }

          //draw selection box when pen is not selected and hovered and mouse should be in upstate
          if (
            !polygon.isSelected &&
            !mouseRef.current.down &&
            Polygon.isPolygonHovered(polygon, mouseRef)
          ) {
            Selection.drawPolygonSelectionBox(ctx, polygon, false);
            mouseRef.current.cursor = Cursors.MOVE;
          }

          //select polygon if hovered and mouse is clicked and no other shape is selected
          if (isMouseUp && Polygon.isPolygonHovered(polygon, mouseRef)) {
            //remove all selections
            Selection.clearAllSelections();
            polygon.setIsSelected(true);
          }
          break;
        case Ellipse:
          const ellipse = shape as Ellipse;

          //change cursor to move if ellipse bounding box is hovered
          if (ellipse.isSelected && Ellipse.isEllipseSelectionHovered(ellipse, mouseRef)) {
            mouseRef.current.cursor = Cursors.MOVE;
          }

          //clear selection if mouse is clicked outside ellipse bounding box
          if (isMouseUp && !Ellipse.isEllipseSelectionHovered(ellipse, mouseRef)) {
            ellipse.setIsSelected(false);
          }

          //draw selection box when pen is not selected and hovered and mouse should be in upstate
          if (
            !ellipse.isSelected &&
            !mouseRef.current.down &&
            Ellipse.isEllipseHovered(ellipse, mouseRef)
          ) {
            Selection.drawEllipseSelectionBox(ctx, ellipse, false);
            mouseRef.current.cursor = Cursors.MOVE;
          }

          //select ellipse if hovered and mouse is clicked and no other shape is selected
          if (isMouseUp && Ellipse.isEllipseHovered(ellipse, mouseRef)) {
            //remove all selections
            Selection.clearAllSelections();
            ellipse.setIsSelected(true);
          }
          break;
        case Arrow:
          const arrow = shape as Arrow;

          //change cursor to move if arrow bounding box is hovered
          if (arrow.isSelected && Arrow.isArrowHovered(arrow, mouseRef)) {
            mouseRef.current.cursor = Cursors.MOVE;
          }

          //clear selection if mouse is clicked outside arrow bounding box
          if (isMouseUp && !Arrow.isArrowHovered(arrow, mouseRef)) {
            arrow.setIsSelected(false);
          }

          //draw selection box when pen is not selected and hovered and mouse should be in upstate
          if (
            !arrow.isSelected &&
            !mouseRef.current.down &&
            Arrow.isArrowHovered(arrow, mouseRef)
          ) {
            Selection.drawLineSelectionBox(ctx, arrow, false);
            mouseRef.current.cursor = Cursors.MOVE;
          }

          //select arrow if hovered and mouse is clicked and no other shape is selected
          if (isMouseUp && Arrow.isArrowHovered(arrow, mouseRef)) {
            //remove all selections
            Selection.clearAllSelections();
            arrow.setIsSelected(true);
          }
          break;
        case Text:
          const text = shape as Text;

          //change cursor to move if text bounding box is hovered
          if (text.isSelected && Text.isTextHovered(text, mouseRef, ctx)) {
            mouseRef.current.cursor = Cursors.MOVE;
          }

          //clear selection if mouse is clicked outside text bounding box
          if (isMouseUp && !Text.isTextHovered(text, mouseRef, ctx)) {
            text.setIsSelected(false);
          }

          //draw selection box when pen is not selected and hovered and mouse should be in upstate
          if (
            !text.isSelected &&
            !mouseRef.current.down &&
            Text.isTextHovered(text, mouseRef, ctx)
          ) {
            Selection.drawTextSelectionBox(ctx, text, false);
            mouseRef.current.cursor = Cursors.MOVE;
          }

          //select text if hovered and mouse is clicked and no other shape is selected
          if (isMouseUp && Text.isTextHovered(text, mouseRef, ctx)) {
            //remove all selections
            Selection.clearAllSelections();
            text.setIsSelected(true);
          }
          break;
        default:
          break;
      }
    });

    //render resize cursor
    Selection.renderResizeCursor(mouseRef);
  }

  static moveSelectedShape(mouseRef: React.MutableRefObject<Mouse>) {
    const allData = Store.allShapes;
    const selectedShape = allData.find((shape) => shape.isSelected);
    if (!selectedShape || !mouseRef.current.down) {
      return;
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

  static renderResizeCursor(mouseRef: React.MutableRefObject<Mouse>) {
    const allData = Store.allShapes;
    const selectedShape = allData.find((shape) => shape.isSelected);
    if (!selectedShape) {
      return;
    }

    switch (selectedShape.constructor) {
      case Pen:
        const pen = selectedShape as Pen;
        const cursor = Pen.getHoveredEdgeOrCorner(pen, mouseRef);
        switch (cursor) {
          case SelectionResize.TopLeft:
          case SelectionResize.BottomRight:
            mouseRef.current.cursor = Cursors.NWSE_RESIZE;
            break;
          case SelectionResize.TopRight:
          case SelectionResize.BottomLeft:
            mouseRef.current.cursor = Cursors.NESW_RESIZE;
            break;
          case SelectionResize.Top:
          case SelectionResize.Bottom:
            mouseRef.current.cursor = Cursors.VERTICAL_RESIZE;
            break;
          case SelectionResize.Left:
          case SelectionResize.Right:
            mouseRef.current.cursor = Cursors.HORIZONTAL_RESIZE;
            break;
          default:
            break;
        }
        break;

      default:
        break;
    }
  }
}

export default Selection;
