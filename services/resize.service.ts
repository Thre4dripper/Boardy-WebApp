import React from 'react';
import { Mouse } from '@/app/page';
import Store from '@/store/Store';
import PenService, { Point } from '@/services/pen.service';
import LineService from '@/services/line.service';
import PolygonService from '@/services/polygon.service';
import EllipseService from '@/services/ellipse.service';
import ArrowService from '@/services/arrow.service';
import TextService from '@/services/text.service';
import { SelectionResize } from '@/enums/SelectionResize';
import Cursors from '@/enums/Cursors';

class ResizeService {
  /**
   * @description Detects the resize state of the selected shape and updates the cursor accordingly
   * @param cursor The current cursor state
   * @param mouseRef The mouse reference object
   */
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

  /**
   * @description Detects the resize state on rectangle selection of ellipse, polygon, pen and text
   * @param mouseRef The mouse reference object
   * @param points The points of the shape
   */
  static detectRectangleResizeSelection(mouseRef: React.MutableRefObject<Mouse>, points: Point[]) {
    const tolerance = 10;
    const cornerTolerance = 12; // Extra tolerance for corners

    const minX = Math.min(...points.map((p) => p.x));
    const maxX = Math.max(...points.map((p) => p.x));
    const minY = Math.min(...points.map((p) => p.y));
    const maxY = Math.max(...points.map((p) => p.y));

    const { x: mouseX, y: mouseY } = mouseRef.current;

    // Check if the mouse is within the bounds of each edge or corner
    if (Math.abs(mouseX - minX) <= cornerTolerance && Math.abs(mouseY - minY) <= cornerTolerance) {
      return SelectionResize.TopLeft;
    } else if (
      Math.abs(mouseX - maxX) <= cornerTolerance &&
      Math.abs(mouseY - minY) <= cornerTolerance
    ) {
      return SelectionResize.TopRight;
    } else if (
      Math.abs(mouseX - maxX) <= cornerTolerance &&
      Math.abs(mouseY - maxY) <= cornerTolerance
    ) {
      return SelectionResize.BottomRight;
    } else if (
      Math.abs(mouseX - minX) <= cornerTolerance &&
      Math.abs(mouseY - maxY) <= cornerTolerance
    ) {
      return SelectionResize.BottomLeft;
    } else if (
      mouseX >= minX - tolerance &&
      mouseX <= maxX + tolerance &&
      Math.abs(mouseY - minY) <= tolerance
    ) {
      return SelectionResize.Top;
    } else if (
      mouseX >= minX - tolerance &&
      mouseX <= maxX + tolerance &&
      Math.abs(mouseY - maxY) <= tolerance
    ) {
      return SelectionResize.Bottom;
    } else if (
      mouseY >= minY - tolerance &&
      mouseY <= maxY + tolerance &&
      Math.abs(mouseX - minX) <= tolerance
    ) {
      return SelectionResize.Left;
    } else if (
      mouseY >= minY - tolerance &&
      mouseY <= maxY + tolerance &&
      Math.abs(mouseX - maxX) <= tolerance
    ) {
      return SelectionResize.Right;
    } else {
      return SelectionResize.None;
    }
  }

  /**
   * @description Detects the resize state of line selection of line and arrow
   * @param mouseRef The mouse reference object
   * @param tolerance The tolerance for the resize detection
   * @param x1 The x-coordinate of the start point
   * @param y1 The y-coordinate of the start point
   * @param x2 The x-coordinate of the end point
   * @param y2 The y-coordinate of the end point
   */
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

  /**
   * @description Detects the resize state of the selected shape
   * @param mouseRef The mouse reference object
   * @param ctx The canvas rendering context
   */
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

  /**
   * @description Resizes the selected shape based on the resize state
   * @param mouseRef The mouse reference object
   */
  static resizeSelectedShape(mouseRef: React.MutableRefObject<Mouse>) {
    const allData = Store.allShapes;
    const selectedShape = allData.find((shape) => shape.isSelected);
    if (!selectedShape || !mouseRef.current.down || mouseRef.current.cursorState !== 'resize') {
      return;
    }

    const resizeState = mouseRef.current.resizeState;

    const dx = mouseRef.current.x - mouseRef.current.prevX;
    const dy = mouseRef.current.y - mouseRef.current.prevY;

    switch (selectedShape.constructor) {
      case PenService:
        {
          const pen = selectedShape as PenService;
          this.resizePen(pen, mouseRef, dx, dy);
        }
        break;
      case LineService:
        {
          const line = selectedShape as LineService;
          if (resizeState === SelectionResize.Start) {
            line.x1 += dx;
            line.y1 += dy;
          } else if (resizeState === SelectionResize.End) {
            line.x2 += dx;
            line.y2 += dy;
          }
        }
        break;
      case PolygonService:
        {
          const polygon = selectedShape as PolygonService;

          const resizeProps = this.getResizeMappings(
            resizeState,
            polygon.horizontalInverted,
            polygon.verticalInverted
          );
          if (resizeProps.xProp) {
            polygon[resizeProps.xProp] += dx;
          }
          if (resizeProps.yProp) {
            polygon[resizeProps.yProp] += dy;
          }
        }
        break;
      case EllipseService:
        {
          const ellipse = selectedShape as EllipseService;

          const resizeProps = this.getResizeMappings(
            resizeState,
            ellipse.horizontalInverted,
            ellipse.verticalInverted
          );

          if (resizeProps.xProp) {
            ellipse[resizeProps.xProp] += dx;
          }
          if (resizeProps.yProp) {
            ellipse[resizeProps.yProp] += dy;
          }
        }
        break;
      case ArrowService:
        {
          const arrow = selectedShape as ArrowService;
          if (resizeState === SelectionResize.Start) {
            arrow.x1 += dx;
            arrow.y1 += dy;
          } else if (resizeState === SelectionResize.End) {
            arrow.x2 += dx;
            arrow.y2 += dy;
          }
        }
        break;
      case TextService:
        {
          const text = selectedShape as TextService;
          this.resizeText(text, mouseRef, dx, dy);
        }
        break;
      default:
        break;
    }

    // Update the previous mouse position
    mouseRef.current.prevX = mouseRef.current.x;
    mouseRef.current.prevY = mouseRef.current.y;
  }

  /**
   * @description Returns the resize mappings based on the resize state and inversion of shape, ellipse and polygon
   * @param resizeState
   * @param horizontalInverted
   * @param verticalInverted
   */
  static getResizeMappings(
    resizeState: SelectionResize,
    horizontalInverted: boolean,
    verticalInverted: boolean
  ) {
    interface ResizeProps {
      xProp?: 'x1' | 'x2';
      yProp?: 'y1' | 'y2';
    }

    const resizeMapping: Record<SelectionResize, ResizeProps> = {
      [SelectionResize.TopLeft]: {
        xProp: horizontalInverted ? 'x2' : 'x1',
        yProp: verticalInverted ? 'y2' : 'y1',
      },
      [SelectionResize.BottomRight]: {
        xProp: horizontalInverted ? 'x1' : 'x2',
        yProp: verticalInverted ? 'y1' : 'y2',
      },
      [SelectionResize.TopRight]: {
        xProp: horizontalInverted ? 'x1' : 'x2',
        yProp: verticalInverted ? 'y2' : 'y1',
      },
      [SelectionResize.BottomLeft]: {
        xProp: horizontalInverted ? 'x2' : 'x1',
        yProp: verticalInverted ? 'y1' : 'y2',
      },
      [SelectionResize.Top]: { yProp: verticalInverted ? 'y2' : 'y1' },
      [SelectionResize.Bottom]: { yProp: verticalInverted ? 'y1' : 'y2' },
      [SelectionResize.Left]: { xProp: horizontalInverted ? 'x2' : 'x1' },
      [SelectionResize.Right]: { xProp: horizontalInverted ? 'x1' : 'x2' },
      [SelectionResize.None]: {}, // Explicitly include this case
      [SelectionResize.Start]: {},
      [SelectionResize.End]: {},
    };

    return resizeMapping[resizeState];
  }

  /**
   * @description Resizes the pen based on the resize state
   * @param pen The pen object
   * @param mouseRef The mouse reference object
   * @param dx The change in x-coordinate
   * @param dy The change in y-coordinate
   */
  static resizePen(
    pen: PenService,
    mouseRef: React.MutableRefObject<Mouse>,
    dx: number,
    dy: number
  ) {
    const resizeState = mouseRef.current.resizeState;
    const leftMostPoint = pen.horizontalInverted ? pen.path[pen.x2] : pen.path[pen.x1];
    const rightMostPoint = pen.horizontalInverted ? pen.path[pen.x1] : pen.path[pen.x2];
    const topMostPoint = pen.verticalInverted ? pen.path[pen.y2] : pen.path[pen.y1];
    const bottomMostPoint = pen.verticalInverted ? pen.path[pen.y1] : pen.path[pen.y2];

    let width = rightMostPoint.x - leftMostPoint.x;
    let height = topMostPoint.y - bottomMostPoint.y;
    switch (resizeState) {
      case SelectionResize.Right:
        {
          pen.path.forEach((point) => {
            const distance = point.x - leftMostPoint.x;
            let delta = distance * (dx / (width + 0.001)); // Prevent division by zero
            point.x += delta;
          });
        }
        break;
      case SelectionResize.Left:
        {
          pen.path.forEach((point) => {
            const distance = rightMostPoint.x - point.x;
            let delta = distance * (dx / (width + 0.001)); // Prevent division by zero
            point.x += delta;
          });
        }
        break;
      case SelectionResize.Top:
        {
          pen.path.forEach((point) => {
            const distance = point.y - bottomMostPoint.y;
            let delta = distance * (dy / (height + 0.001)); // Prevent division by zero
            point.y += delta;
          });
        }
        break;
      case SelectionResize.Bottom:
        {
          pen.path.forEach((point) => {
            const distance = topMostPoint.y - point.y;
            let delta = distance * (dy / (height + 0.001)); // Prevent division by zero
            point.y += delta;
          });
        }
        break;
      case SelectionResize.TopLeft:
        {
          pen.path.forEach((point) => {
            const distanceX = rightMostPoint.x - point.x;
            const distanceY = point.y - bottomMostPoint.y;
            let deltaX = distanceX * (dx / (width + 0.001)); // Prevent division by zero
            let deltaY = distanceY * (dy / (height + 0.001)); // Prevent division by zero
            point.x += deltaX;
            point.y += deltaY;
          });
        }
        break;
      case SelectionResize.TopRight:
        {
          pen.path.forEach((point) => {
            const distanceX = point.x - leftMostPoint.x;
            const distanceY = point.y - bottomMostPoint.y;
            let deltaX = distanceX * (dx / (width + 0.001)); // Prevent division by zero
            let deltaY = distanceY * (dy / (height + 0.001)); // Prevent division by zero
            point.x += deltaX;
            point.y += deltaY;
          });
        }
        break;
      case SelectionResize.BottomLeft:
        {
          pen.path.forEach((point) => {
            const distanceX = rightMostPoint.x - point.x;
            const distanceY = topMostPoint.y - point.y;
            let deltaX = distanceX * (dx / (width + 0.001)); // Prevent division by zero
            let deltaY = distanceY * (dy / (height + 0.001)); // Prevent division by zero
            point.x += deltaX;
            point.y += deltaY;
          });
        }
        break;
      case SelectionResize.BottomRight:
        {
          pen.path.forEach((point) => {
            const distanceX = point.x - leftMostPoint.x;
            const distanceY = topMostPoint.y - point.y;
            let deltaX = distanceX * (dx / (width + 0.001)); // Prevent division by zero
            let deltaY = distanceY * (dy / (height + 0.001)); // Prevent division by zero
            point.x += deltaX;
            point.y += deltaY;
          });
        }
        break;
      default:
        break;
    }
  }

  /**
   * @description Resizes the text based on the resize state
   * @param text The text object
   * @param mouseRef The mouse reference object
   * @param dx The change in x-coordinate
   * @param dy The change in y-coordinate
   * @private
   */
  private static resizeText(
    text: TextService,
    mouseRef: React.MutableRefObject<Mouse>,
    dx: number,
    dy: number
  ) {
    const resizeState = mouseRef.current.resizeState;
    if (resizeState === SelectionResize.Top) {
      if (text.fontSize >= 15) {
        text.fontSize -= dy;
        if (text.fontSize < 15) {
          text.fontSize = 15.00000001;
          return;
        }
        text.x += (dy * text.text.length) / 4;
        text.y += dy;
      }
    } else if (resizeState === SelectionResize.Bottom) {
      if (text.fontSize >= 15) {
        text.fontSize += dy;
        if (text.fontSize < 15) {
          text.fontSize = 15.00000001;
          return;
        }
        text.x -= (dy * text.text.length) / 4;
        text.y -= dy;
      }
    } else if (resizeState === SelectionResize.Left) {
      if (text.fontSize >= 15) {
        text.fontSize -= dx / 4;
        if (text.fontSize < 15) {
          text.fontSize = 15.00000001;
          return;
        }
        text.x += dx;
      }
    } else if (resizeState === SelectionResize.Right) {
      if (text.fontSize >= 15) {
        text.fontSize += dx / 4;
        if (text.fontSize < 15) {
          text.fontSize = 15.00000001;
          return;
        }
      }
    } else if (resizeState === SelectionResize.BottomRight) {
      // Calculate the diagonal distance moved by the mouse
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Determine the direction of the mouse movement
      const directionX = mouseRef.current.x - mouseRef.current.prevX;
      const directionY = mouseRef.current.y - mouseRef.current.prevY;

      // Increase the font size if the mouse is moving towards bottom-right, decrease if it's moving towards top-left
      if (directionX > 0 && directionY > 0) {
        text.fontSize += distance / 4;
      } else if (directionX < 0 && directionY < 0) {
        text.fontSize -= distance / 4;
      }

      // Ensure the font size doesn't go below the minimum size
      if (text.fontSize < 15) {
        text.fontSize = 15.00000001;
        return;
      }
    } else if (resizeState === SelectionResize.TopRight) {
      // Calculate the diagonal distance moved by the mouse
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Determine the direction of the mouse movement
      const directionX = mouseRef.current.x - mouseRef.current.prevX;
      const directionY = mouseRef.current.y - mouseRef.current.prevY;

      // Increase the font size if the mouse is moving towards top-right, decrease if it's moving towards bottom-left
      if (directionX > 0 && directionY < 0) {
        text.fontSize += distance / 4;
      } else if (directionX < 0 && directionY > 0) {
        text.fontSize -= distance / 4;
      }

      // Ensure the font size doesn't go below the minimum size
      if (text.fontSize < 15) {
        text.fontSize = 15.00000001;
        return;
      }
      text.y += dy;
    } else if (resizeState === SelectionResize.TopLeft) {
      // Calculate the diagonal distance moved by the mouse
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Determine the direction of the mouse movement
      const directionX = mouseRef.current.x - mouseRef.current.prevX;
      const directionY = mouseRef.current.y - mouseRef.current.prevY;

      // Increase the font size if the mouse is moving towards top-left, decrease if it's moving towards bottom-right
      if (directionX < 0 && directionY < 0) {
        text.fontSize += distance / 4;
      } else if (directionX > 0 && directionY > 0) {
        text.fontSize -= distance / 4;
      }

      // Ensure the font size doesn't go below the minimum size
      if (text.fontSize < 15) {
        text.fontSize = 15.00000001;
        return;
      }
      text.x += dx;
      text.y += dy;
    } else if (resizeState === SelectionResize.BottomLeft) {
      // Calculate the diagonal distance moved by the mouse
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Determine the direction of the mouse movement
      const directionX = mouseRef.current.x - mouseRef.current.prevX;
      const directionY = mouseRef.current.y - mouseRef.current.prevY;

      // Increase the font size if the mouse is moving towards bottom-left, decrease if it's moving towards top-right
      if (directionX < 0 && directionY > 0) {
        text.fontSize += distance / 4;
      } else if (directionX > 0 && directionY < 0) {
        text.fontSize -= distance / 4;
      }

      // Ensure the font size doesn't go below the minimum size
      if (text.fontSize < 15) {
        text.fontSize = 15.00000001;
        return;
      }
      text.x += dx;
    }
  }
}

export default ResizeService;
