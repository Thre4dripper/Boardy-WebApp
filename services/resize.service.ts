import React from 'react';
import { Mouse } from '@/app/page';
import Store from '@/store/Store';
import PenService from '@/services/pen.service';
import LineService from '@/services/line.service';
import PolygonService from '@/services/polygon.service';
import EllipseService from '@/services/ellipse.service';
import ArrowService from '@/services/arrow.service';
import TextService from '@/services/text.service';
import { SelectionResize } from '@/enums/SelectionResize';
import Cursors from '@/enums/Cursors';

class ResizeService {
  static renderResizeCursor(cursor: SelectionResize, mouseRef: React.MutableRefObject<Mouse>) {
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
      case SelectionResize.Start:
      case SelectionResize.End:
        mouseRef.current.cursor = Cursors.POINTER;
        break;
      default:
        break;
    }
  }

  static detectRectangleResizeSelection(
    mouseRef: React.MutableRefObject<Mouse>,
    minX: number,
    minY: number,
    maxX: number,
    maxY: number
  ) {
    const tolerance = 10;
    const cornerTolerance = 12; // Extra tolerance for corners

    // Check if the mouse is within the bounds of each edge or corner
    if (
      Math.abs(mouseRef.current.x - minX) <= cornerTolerance &&
      Math.abs(mouseRef.current.y - minY) <= cornerTolerance
    ) {
      return SelectionResize.TopLeft;
    } else if (
      Math.abs(mouseRef.current.x - maxX) <= cornerTolerance &&
      Math.abs(mouseRef.current.y - minY) <= cornerTolerance
    ) {
      return SelectionResize.TopRight;
    } else if (
      Math.abs(mouseRef.current.x - maxX) <= cornerTolerance &&
      Math.abs(mouseRef.current.y - maxY) <= cornerTolerance
    ) {
      return SelectionResize.BottomRight;
    } else if (
      Math.abs(mouseRef.current.x - minX) <= cornerTolerance &&
      Math.abs(mouseRef.current.y - maxY) <= cornerTolerance
    ) {
      return SelectionResize.BottomLeft;
    } else if (
      mouseRef.current.x >= minX - tolerance &&
      mouseRef.current.x <= maxX + tolerance &&
      Math.abs(mouseRef.current.y - minY) <= tolerance
    ) {
      return SelectionResize.Top;
    } else if (
      mouseRef.current.x >= minX - tolerance &&
      mouseRef.current.x <= maxX + tolerance &&
      Math.abs(mouseRef.current.y - maxY) <= tolerance
    ) {
      return SelectionResize.Bottom;
    } else if (
      mouseRef.current.y >= minY - tolerance &&
      mouseRef.current.y <= maxY + tolerance &&
      Math.abs(mouseRef.current.x - minX) <= tolerance
    ) {
      return SelectionResize.Left;
    } else if (
      mouseRef.current.y >= minY - tolerance &&
      mouseRef.current.y <= maxY + tolerance &&
      Math.abs(mouseRef.current.x - maxX) <= tolerance
    ) {
      return SelectionResize.Right;
    } else {
      return SelectionResize.None;
    }
  }

  static detectLineResizeSelection(
    mouseRef: React.MutableRefObject<Mouse>,
    tolerance: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) {
    const { x, y } = mouseRef.current;

    const start = Math.sqrt(Math.pow(x1 - x, 2) + Math.pow(y1 - y, 2));
    const end = Math.sqrt(Math.pow(x2 - x, 2) + Math.pow(y2 - y, 2));

    if (start < tolerance) {
      return SelectionResize.Start;
    }
    if (end < tolerance) {
      return SelectionResize.End;
    }
    return SelectionResize.None;
  }

  static resizeCursor(mouseRef: React.MutableRefObject<Mouse>, ctx: CanvasRenderingContext2D) {
    const allData = Store.allShapes;
    const selectedShape = allData.find((shape) => shape.isSelected);
    if (!selectedShape) {
      return;
    }

    let cursor: SelectionResize;

    switch (selectedShape.constructor) {
      case PenService:
        const pen = selectedShape as PenService;
        cursor = PenService.getHoveredEdgeOrCorner(pen, mouseRef);
        ResizeService.renderResizeCursor(cursor, mouseRef);
        break;

      case LineService:
        const line = selectedShape as LineService;
        cursor = LineService.getHoveredEnds(line, mouseRef);
        ResizeService.renderResizeCursor(cursor, mouseRef);
        break;

      case PolygonService:
        const polygon = selectedShape as PolygonService;
        cursor = PolygonService.getHoveredEdgeOrCorner(polygon, mouseRef);
        ResizeService.renderResizeCursor(cursor, mouseRef);
        break;

      case EllipseService:
        const ellipse = selectedShape as EllipseService;
        cursor = EllipseService.getHoveredEdgeOrCorner(ellipse, mouseRef);
        ResizeService.renderResizeCursor(cursor, mouseRef);
        break;

      case ArrowService:
        const arrow = selectedShape as ArrowService;
        cursor = ArrowService.getHoveredEnds(arrow, mouseRef);
        ResizeService.renderResizeCursor(cursor, mouseRef);
        break;

      case TextService:
        const text = selectedShape as TextService;
        cursor = TextService.getHoveredEdgeOrCorner(text, mouseRef, ctx);
        ResizeService.renderResizeCursor(cursor, mouseRef);
        break;

      default:
        break;
    }
  }
}

export default ResizeService;
