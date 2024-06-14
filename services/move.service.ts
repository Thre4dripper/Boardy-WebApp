import React from 'react';
import { Mouse } from '@/app/page';
import Store from '@/store/Store';
import PenModel from '@/models/pen.model';
import LineModel from '@/models/line.model';
import PolygonModel from '@/models/polygon.model';
import EllipseModel from '@/models/ellipse.model';
import ArrowModel from '@/models/arrow.model';
import TextModel from '@/models/text.model';
import ImageModel from '@/models/image.model';

class MoveService {
  static moveSelectedShape(mouseRef: React.MutableRefObject<Mouse>) {
    const allData = Store.allShapes;
    const selectedShape = allData.find((shape) => shape.isSelected);
    if (!selectedShape || !mouseRef.current.down || mouseRef.current.cursorState !== 'move') {
      return;
    }

    const dx = mouseRef.current.x - mouseRef.current.prevX;
    const dy = mouseRef.current.y - mouseRef.current.prevY;

    switch (selectedShape.constructor) {
      case PenModel:
        const pen = selectedShape as PenModel;
        pen.path.forEach((point) => {
          point.x += dx;
          point.y += dy;
        });
        break;
      case LineModel:
        const line = selectedShape as LineModel;
        line.x1 += dx;
        line.y1 += dy;
        line.x2 += dx;
        line.y2 += dy;
        break;
      case PolygonModel:
        const polygon = selectedShape as PolygonModel;
        polygon.x1 += dx;
        polygon.y1 += dy;
        polygon.x2 += dx;
        polygon.y2 += dy;
        break;
      case EllipseModel:
        const ellipse = selectedShape as EllipseModel;
        ellipse.x1 += dx;
        ellipse.y1 += dy;
        ellipse.x2 += dx;
        ellipse.y2 += dy;
        break;
      case ArrowModel:
        const arrow = selectedShape as ArrowModel;
        arrow.x1 += dx;
        arrow.y1 += dy;
        arrow.x2 += dx;
        arrow.y2 += dy;
        break;
      case TextModel:
        const text = selectedShape as TextModel;
        text.x += dx;
        text.y += dy;
        break;
      case ImageModel:
        const image = selectedShape as ImageModel;
        image.x1 += dx;
        image.y1 += dy;
        break;
      default:
        break;
    }

    // Update the previous mouse position
    mouseRef.current.prevX = mouseRef.current.x;
    mouseRef.current.prevY = mouseRef.current.y;
  }
}

export default MoveService;
