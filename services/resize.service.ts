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
        mouseRef.current.cursor = Cursors.NWSE_RESIZE;
        mouseRef.current.resizeState = SelectionResize.TopLeft;
        break;
      case SelectionResize.BottomRight:
        mouseRef.current.cursor = Cursors.NWSE_RESIZE;
        mouseRef.current.resizeState = SelectionResize.BottomRight;
        break;
      case SelectionResize.TopRight:
        mouseRef.current.cursor = Cursors.NESW_RESIZE;
        mouseRef.current.resizeState = SelectionResize.TopRight;
        break;
      case SelectionResize.BottomLeft:
        mouseRef.current.cursor = Cursors.NESW_RESIZE;
        mouseRef.current.resizeState = SelectionResize.BottomLeft;
        break;
      case SelectionResize.Top:
        mouseRef.current.cursor = Cursors.VERTICAL_RESIZE;
        mouseRef.current.resizeState = SelectionResize.Top;
        break;
      case SelectionResize.Bottom:
        mouseRef.current.cursor = Cursors.VERTICAL_RESIZE;
        mouseRef.current.resizeState = SelectionResize.Bottom;
        break;
      case SelectionResize.Left:
        mouseRef.current.cursor = Cursors.HORIZONTAL_RESIZE;
        mouseRef.current.resizeState = SelectionResize.Left;
        break;
      case SelectionResize.Right:
        mouseRef.current.cursor = Cursors.HORIZONTAL_RESIZE;
        mouseRef.current.resizeState = SelectionResize.Right;
        break;
      case SelectionResize.Start:
        mouseRef.current.cursor = Cursors.POINTER;
        mouseRef.current.resizeState = SelectionResize.Start;
        break;
      case SelectionResize.End:
        mouseRef.current.cursor = Cursors.POINTER;
        mouseRef.current.resizeState = SelectionResize.End;
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

  static resizeSelectedShape(mouseRef: React.MutableRefObject<Mouse>) {
    const allData = Store.allShapes;
    const selectedShape = allData.find((shape) => shape.isSelected);
    if (!selectedShape || !mouseRef.current.down) {
      return;
    }

    const resizeState = mouseRef.current.resizeState;

    const dx = mouseRef.current.x - mouseRef.current.prevX;
    const dy = mouseRef.current.y - mouseRef.current.prevY;

    switch (selectedShape.constructor) {
      case PenService:
        const pen = selectedShape as PenService;
        this.resizePen(pen, mouseRef, dx, dy);
        break;
      case LineService:
        const line = selectedShape as LineService;
        if (resizeState === SelectionResize.Start) {
          line.x1 += dx;
          line.y1 += dy;
        } else if (resizeState === SelectionResize.End) {
          line.x2 += dx;
          line.y2 += dy;
        }
        break;
      case PolygonService:
        const polygon = selectedShape as PolygonService;
        if (resizeState === SelectionResize.TopLeft) {
          polygon.x1 += dx;
          polygon.y1 += dy;
        }
        if (resizeState === SelectionResize.BottomRight) {
          polygon.x2 += dx;
          polygon.y2 += dy;
        }
        if (resizeState === SelectionResize.TopRight) {
          polygon.x2 += dx;
          polygon.y1 += dy;
        }
        if (resizeState === SelectionResize.BottomLeft) {
          polygon.x1 += dx;
          polygon.y2 += dy;
        }
        if (resizeState === SelectionResize.Top) {
          polygon.y1 += dy;
        }
        if (resizeState === SelectionResize.Bottom) {
          polygon.y2 += dy;
        }
        if (resizeState === SelectionResize.Left) {
          polygon.x1 += dx;
        }
        if (resizeState === SelectionResize.Right) {
          polygon.x2 += dx;
        }

        break;
      case EllipseService:
        const ellipse = selectedShape as EllipseService;
        if (resizeState === SelectionResize.TopLeft) {
          ellipse.x1 += dx;
          ellipse.y1 += dy;
        }
        if (resizeState === SelectionResize.BottomRight) {
          ellipse.x2 += dx;
          ellipse.y2 += dy;
        }
        if (resizeState === SelectionResize.TopRight) {
          ellipse.x2 += dx;
          ellipse.y1 += dy;
        }
        if (resizeState === SelectionResize.BottomLeft) {
          ellipse.x1 += dx;
          ellipse.y2 += dy;
        }
        if (resizeState === SelectionResize.Top) {
          ellipse.y1 += dy;
        }
        if (resizeState === SelectionResize.Bottom) {
          ellipse.y2 += dy;
        }
        if (resizeState === SelectionResize.Left) {
          ellipse.x1 += dx;
        }
        if (resizeState === SelectionResize.Right) {
          ellipse.x2 += dx;
        }
        break;
      case ArrowService:
        const arrow = selectedShape as ArrowService;
        if (resizeState === SelectionResize.Start) {
          arrow.x1 += dx;
          arrow.y1 += dy;
        } else if (resizeState === SelectionResize.End) {
          arrow.x2 += dx;
          arrow.y2 += dy;
        }
        break;
      case TextService:
        const text = selectedShape as TextService;
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

  static resizePen(
    pen: PenService,
    mouseRef: React.MutableRefObject<Mouse>,
    dx: number,
    dy: number
  ) {
    if (mouseRef.current.resizeState === SelectionResize.Right) {
      const leftMostPoint = pen.path.reduce((acc, point) => {
        return point.x < acc.x ? point : acc;
      }, pen.path[0]);
      pen.path.forEach((point) => {
        const distance = Math.abs(leftMostPoint.x - point.x);

        const moveFactorX = distance / Math.abs(leftMostPoint.x - mouseRef.current.x);

        point.x += dx * moveFactorX;
      });
    } else if (mouseRef.current.resizeState === SelectionResize.Left) {
      const rightMostPoint = pen.path.reduce((acc, point) => {
        return point.x > acc.x ? point : acc;
      }, pen.path[0]);
      pen.path.forEach((point) => {
        const distance = Math.abs(rightMostPoint.x - point.x);

        const moveFactorX = distance / Math.abs(rightMostPoint.x - mouseRef.current.x);

        point.x += dx * moveFactorX;
      });
    } else if (mouseRef.current.resizeState === SelectionResize.Top) {
      const bottomMostPoint = pen.path.reduce((acc, point) => {
        return point.y > acc.y ? point : acc;
      }, pen.path[0]);
      pen.path.forEach((point) => {
        const distance = Math.abs(bottomMostPoint.y - point.y);

        const moveFactorY = distance / Math.abs(bottomMostPoint.y - mouseRef.current.y);

        point.y += dy * moveFactorY;
      });
    } else if (mouseRef.current.resizeState === SelectionResize.Bottom) {
      const topMostPoint = pen.path.reduce((acc, point) => {
        return point.y < acc.y ? point : acc;
      }, pen.path[0]);
      pen.path.forEach((point) => {
        const distance = Math.abs(topMostPoint.y - point.y);

        const moveFactorY = distance / Math.abs(topMostPoint.y - mouseRef.current.y);

        point.y += dy * moveFactorY;
      });
    } else if (mouseRef.current.resizeState === SelectionResize.TopLeft) {
      const bottomMostPoint = pen.path.reduce((acc, point) => {
        return point.y > acc.y ? point : acc;
      }, pen.path[0]);
      const rightMostPoint = pen.path.reduce((acc, point) => {
        return point.x > acc.x ? point : acc;
      }, pen.path[0]);

      pen.path.forEach((point) => {
        const distanceX = Math.abs(rightMostPoint.x - point.x);
        const distanceY = Math.abs(bottomMostPoint.y - point.y);

        const moveFactorX = distanceX / Math.abs(rightMostPoint.x - mouseRef.current.x);
        const moveFactorY = distanceY / Math.abs(bottomMostPoint.y - mouseRef.current.y);

        point.x += dx * moveFactorX;
        point.y += dy * moveFactorY;
      });
    } else if (mouseRef.current.resizeState === SelectionResize.TopRight) {
      const bottomMostPoint = pen.path.reduce((acc, point) => {
        return point.y > acc.y ? point : acc;
      }, pen.path[0]);
      const leftMostPoint = pen.path.reduce((acc, point) => {
        return point.x < acc.x ? point : acc;
      }, pen.path[0]);

      pen.path.forEach((point) => {
        const distanceX = Math.abs(leftMostPoint.x - point.x);
        const distanceY = Math.abs(bottomMostPoint.y - point.y);

        const moveFactorX = distanceX / Math.abs(leftMostPoint.x - mouseRef.current.x);
        const moveFactorY = distanceY / Math.abs(bottomMostPoint.y - mouseRef.current.y);

        point.x += dx * moveFactorX;
        point.y += dy * moveFactorY;
      });
    } else if (mouseRef.current.resizeState === SelectionResize.BottomLeft) {
      const topMostPoint = pen.path.reduce((acc, point) => {
        return point.y < acc.y ? point : acc;
      }, pen.path[0]);
      const rightMostPoint = pen.path.reduce((acc, point) => {
        return point.x > acc.x ? point : acc;
      }, pen.path[0]);

      pen.path.forEach((point) => {
        const distanceX = Math.abs(rightMostPoint.x - point.x);
        const distanceY = Math.abs(topMostPoint.y - point.y);

        const moveFactorX = distanceX / Math.abs(rightMostPoint.x - mouseRef.current.x);
        const moveFactorY = distanceY / Math.abs(topMostPoint.y - mouseRef.current.y);

        point.x += dx * moveFactorX;
        point.y += dy * moveFactorY;
      });
    } else if (mouseRef.current.resizeState === SelectionResize.BottomRight) {
      const topMostPoint = pen.path.reduce((acc, point) => {
        return point.y < acc.y ? point : acc;
      }, pen.path[0]);
      const leftMostPoint = pen.path.reduce((acc, point) => {
        return point.x < acc.x ? point : acc;
      }, pen.path[0]);

      pen.path.forEach((point) => {
        const distanceX = Math.abs(leftMostPoint.x - point.x);
        const distanceY = Math.abs(topMostPoint.y - point.y);

        const moveFactorX = distanceX / Math.abs(leftMostPoint.x - mouseRef.current.x);
        const moveFactorY = distanceY / Math.abs(topMostPoint.y - mouseRef.current.y);

        point.x += dx * moveFactorX;
        point.y += dy * moveFactorY;
      });
    }
  }
}

export default ResizeService;
