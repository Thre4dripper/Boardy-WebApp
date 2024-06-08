import LineService from '@/services/line.service';
import React from 'react';
import { Mouse } from '@/app/page';
import Store from '@/store/Store';
import PenService from '@/services/pen.service';
import ArrowService from '@/services/arrow.service';
import EllipseService from '@/services/ellipse.service';
import PolygonService from '@/services/polygon.service';
import TextService from '@/services/text.service';
import Cursors from '@/enums/Cursors';
import ResizeService from '@/services/resize.service';

let flag = false;
let isMouseUp = false;

class SelectionService {
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

  static drawPenSelectionBox(ctx: CanvasRenderingContext2D, pen: PenService, fullSelect: boolean) {
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

  static drawLineSelectionBox(
    ctx: CanvasRenderingContext2D,
    line: LineService,
    fullSelect: boolean
  ) {
    if (!fullSelect) return;
    this.drawDots(ctx, line.x1, line.y1);
    this.drawDots(ctx, line.x2, line.y2);
  }

  static drawPolygonSelectionBox(
    ctx: CanvasRenderingContext2D,
    polygon: PolygonService,
    fullSelect: boolean
  ) {
    const vertices = [];

    const xCenter = (polygon.x1 + polygon.x2) / 2;
    const yCenter = (polygon.y1 + polygon.y2) / 2;
    const radiusX = (Math.abs(polygon.x1 - polygon.x2) / 2) * Math.sqrt(2);
    const radiusY = (Math.abs(polygon.y1 - polygon.y2) / 2) * Math.sqrt(2);

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
    ellipse: EllipseService,
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

  static drawTextSelectionBox(
    ctx: CanvasRenderingContext2D,
    text: TextService,
    fullSelect: boolean
  ) {
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
        case PenService:
          const pen = shape as PenService;

          //change cursor to move if pen bounding box is hovered
          if (pen.isSelected && PenService.isPenSelectionHovered(pen, mouseRef)) {
            mouseRef.current.cursor = Cursors.MOVE;
          }

          //clear selection if mouse is clicked outside pen bounding box
          if (isMouseUp && !PenService.isPenSelectionHovered(pen, mouseRef)) {
            pen.setIsSelected(false);
          }

          //draw selection box when pen is not selected and hovered and mouse should be in upstate
          if (!pen.isSelected && !mouseRef.current.down && PenService.isPenHovered(pen, mouseRef)) {
            SelectionService.drawPenSelectionBox(ctx, pen, false);
            mouseRef.current.cursor = Cursors.MOVE;
          }

          //select pen if hovered and mouse is clicked and no other shape is selected
          if (isMouseUp && PenService.isPenHovered(pen, mouseRef)) {
            //remove all selections
            SelectionService.clearAllSelections();
            pen.setIsSelected(true);
          }
          break;
        case LineService:
          const line = shape as LineService;

          //change cursor to move if line bounding box is hovered
          if (line.isSelected && LineService.isLineHovered(line, mouseRef)) {
            mouseRef.current.cursor = Cursors.MOVE;
          }

          //clear selection if mouse is clicked outside line bounding box
          if (isMouseUp && !LineService.isLineHovered(line, mouseRef)) {
            line.setIsSelected(false);
          }

          //draw selection box when pen is not selected and hovered and mouse should be in upstate
          if (
            !line.isSelected &&
            !mouseRef.current.down &&
            LineService.isLineHovered(line, mouseRef)
          ) {
            SelectionService.drawLineSelectionBox(ctx, line, false);
            mouseRef.current.cursor = Cursors.MOVE;
          }

          //select line if hovered and mouse is clicked and no other shape is selected
          if (isMouseUp && LineService.isLineHovered(line, mouseRef)) {
            //remove all selections
            SelectionService.clearAllSelections();
            line.setIsSelected(true);
          }
          break;
        case PolygonService:
          const polygon = shape as PolygonService;

          //change cursor to move if polygon bounding box is hovered
          if (polygon.isSelected && PolygonService.isPolygonSelectionHovered(polygon, mouseRef)) {
            mouseRef.current.cursor = Cursors.MOVE;
          }

          //clear selection if mouse is clicked outside polygon bounding box
          if (isMouseUp && !PolygonService.isPolygonSelectionHovered(polygon, mouseRef)) {
            polygon.setIsSelected(false);
          }

          //draw selection box when pen is not selected and hovered and mouse should be in upstate
          if (
            !polygon.isSelected &&
            !mouseRef.current.down &&
            PolygonService.isPolygonHovered(polygon, mouseRef)
          ) {
            SelectionService.drawPolygonSelectionBox(ctx, polygon, false);
            mouseRef.current.cursor = Cursors.MOVE;
          }

          //select polygon if hovered and mouse is clicked and no other shape is selected
          if (isMouseUp && PolygonService.isPolygonHovered(polygon, mouseRef)) {
            //remove all selections
            SelectionService.clearAllSelections();
            polygon.setIsSelected(true);
          }
          break;
        case EllipseService:
          const ellipse = shape as EllipseService;

          //change cursor to move if ellipse bounding box is hovered
          if (ellipse.isSelected && EllipseService.isEllipseSelectionHovered(ellipse, mouseRef)) {
            mouseRef.current.cursor = Cursors.MOVE;
          }

          //clear selection if mouse is clicked outside ellipse bounding box
          if (isMouseUp && !EllipseService.isEllipseSelectionHovered(ellipse, mouseRef)) {
            ellipse.setIsSelected(false);
          }

          //draw selection box when pen is not selected and hovered and mouse should be in upstate
          if (
            !ellipse.isSelected &&
            !mouseRef.current.down &&
            EllipseService.isEllipseHovered(ellipse, mouseRef)
          ) {
            SelectionService.drawEllipseSelectionBox(ctx, ellipse, false);
            mouseRef.current.cursor = Cursors.MOVE;
          }

          //select ellipse if hovered and mouse is clicked and no other shape is selected
          if (isMouseUp && EllipseService.isEllipseHovered(ellipse, mouseRef)) {
            //remove all selections
            SelectionService.clearAllSelections();
            ellipse.setIsSelected(true);
          }
          break;
        case ArrowService:
          const arrow = shape as ArrowService;

          //change cursor to move if arrow bounding box is hovered
          if (arrow.isSelected && ArrowService.isArrowHovered(arrow, mouseRef)) {
            mouseRef.current.cursor = Cursors.MOVE;
          }

          //clear selection if mouse is clicked outside arrow bounding box
          if (isMouseUp && !ArrowService.isArrowHovered(arrow, mouseRef)) {
            arrow.setIsSelected(false);
          }

          //draw selection box when pen is not selected and hovered and mouse should be in upstate
          if (
            !arrow.isSelected &&
            !mouseRef.current.down &&
            ArrowService.isArrowHovered(arrow, mouseRef)
          ) {
            SelectionService.drawLineSelectionBox(ctx, arrow, false);
            mouseRef.current.cursor = Cursors.MOVE;
          }

          //select arrow if hovered and mouse is clicked and no other shape is selected
          if (isMouseUp && ArrowService.isArrowHovered(arrow, mouseRef)) {
            //remove all selections
            SelectionService.clearAllSelections();
            arrow.setIsSelected(true);
          }
          break;
        case TextService:
          const text = shape as TextService;

          //change cursor to move if text bounding box is hovered
          if (text.isSelected && TextService.isTextHovered(text, mouseRef, ctx)) {
            mouseRef.current.cursor = Cursors.MOVE;
          }

          //clear selection if mouse is clicked outside text bounding box
          if (isMouseUp && !TextService.isTextHovered(text, mouseRef, ctx)) {
            text.setIsSelected(false);
          }

          //draw selection box when pen is not selected and hovered and mouse should be in upstate
          if (
            !text.isSelected &&
            !mouseRef.current.down &&
            TextService.isTextHovered(text, mouseRef, ctx)
          ) {
            SelectionService.drawTextSelectionBox(ctx, text, false);
            mouseRef.current.cursor = Cursors.MOVE;
          }

          //select text if hovered and mouse is clicked and no other shape is selected
          if (isMouseUp && TextService.isTextHovered(text, mouseRef, ctx)) {
            //remove all selections
            SelectionService.clearAllSelections();
            text.setIsSelected(true);
          }
          break;
        default:
          break;
      }
    });

    if (mouseRef.current.cursorState !== 'none') {
      return;
    }

    //cursor state should be none before changing it to resize or move

    ResizeService.resizeCursor(mouseRef, ctx);

    if (mouseRef.current.cursor === Cursors.MOVE && mouseRef.current.down) {
      mouseRef.current.cursorState = 'move';
    } else if (
      [
        Cursors.VERTICAL_RESIZE,
        Cursors.HORIZONTAL_RESIZE,
        Cursors.NESW_RESIZE,
        Cursors.NWSE_RESIZE,
        Cursors.POINTER,
      ].includes(mouseRef.current.cursor) &&
      mouseRef.current.down
    ) {
      mouseRef.current.cursorState = 'resize';
    }
  }
}

export default SelectionService;
