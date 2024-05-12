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

class MoveResizeService {
  static moveSelectedShape(mouseRef: React.MutableRefObject<Mouse>) {
    const allData = Store.allShapes;
    const selectedShape = allData.find((shape) => shape.isSelected);
    if (!selectedShape || !mouseRef.current.down) {
      return;
    }

    const dx = mouseRef.current.x - mouseRef.current.prevX;
    const dy = mouseRef.current.y - mouseRef.current.prevY;

    switch (selectedShape.constructor) {
      case PenService:
        const pen = selectedShape as PenService;
        pen.path.forEach((point) => {
          point.x += dx;
          point.y += dy;
        });
        break;
      case LineService:
        const line = selectedShape as LineService;
        line.x1 += dx;
        line.y1 += dy;
        line.x2 += dx;
        line.y2 += dy;
        break;
      case PolygonService:
        const polygon = selectedShape as PolygonService;
        polygon.x1 += dx;
        polygon.y1 += dy;
        polygon.x2 += dx;
        polygon.y2 += dy;
        break;
      case EllipseService:
        const ellipse = selectedShape as EllipseService;
        ellipse.x1 += dx;
        ellipse.y1 += dy;
        ellipse.x2 += dx;
        ellipse.y2 += dy;
        break;
      case ArrowService:
        const arrow = selectedShape as ArrowService;
        arrow.x1 += dx;
        arrow.y1 += dy;
        arrow.x2 += dx;
        arrow.y2 += dy;
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

  static renderResizeCursor(mouseRef: React.MutableRefObject<Mouse>) {
    const allData = Store.allShapes;
    const selectedShape = allData.find((shape) => shape.isSelected);
    if (!selectedShape) {
      return;
    }

    switch (selectedShape.constructor) {
      case PenService:
        const pen = selectedShape as PenService;
        const cursor = PenService.getHoveredEdgeOrCorner(pen, mouseRef);
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

export default MoveResizeService;
