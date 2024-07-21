import Store from '@/store/Store';
import { deepCopy } from '@/utils/Utils';
import PenModel from '@/models/pen.model';
import LineModel from '@/models/line.model';
import PolygonModel from '@/models/polygon.model';
import ArrowModel from '@/models/arrow.model';
import EllipseModel from '@/models/ellipse.model';
import ImageModel from '@/models/image.model';
import TextModel from '@/models/text.model';
import UndoRedoService, { UndoRedoEventType } from '@/services/undo.redo.service';

class ActionsService {
  static offset = 15;

  static copySelectedShape() {
    const shapes = Store.allShapes;

    const selectedShape = shapes.find((shape) => shape.isSelected);

    if (!selectedShape) {
      return;
    }

    const copiedShape = deepCopy(selectedShape);
    switch (copiedShape.constructor) {
      case PenModel:
        {
          const pen = copiedShape as PenModel;
          const path = pen.path;
          pen.path = path.map((point) => ({ x: point.x + this.offset, y: point.y + this.offset }));
        }
        break;
      case LineModel:
      case ArrowModel:
        {
          const shape = copiedShape as LineModel | ArrowModel;
          shape.x1 += this.offset;
          shape.y1 += this.offset;
          shape.x2 += this.offset;
          shape.y2 += this.offset;
        }
        break;
      case PolygonModel:
      case EllipseModel:
      case ImageModel:
        {
          const shape = copiedShape as PolygonModel | EllipseModel | ImageModel;
          shape.x1 += this.offset;
          shape.y1 += this.offset;
          shape.x2 += this.offset;
          shape.y2 += this.offset;
        }
        break;
      case TextModel:
        {
          const text = copiedShape as TextModel;
          text.x += this.offset;
          text.y += this.offset;
        }
        break;
    }

    selectedShape.isSelected = false;
    copiedShape.isSelected = true;
    Store.allShapes.push(copiedShape);

    UndoRedoService.push({
      type: UndoRedoEventType.CREATE,
      index: Store.allShapes.length - 1,
      shape: {
        from: null,
        to: copiedShape,
      },
    });
  }

  static deleteSelectedShape() {
    const shapes = Store.allShapes;

    const selectedShape = shapes.find((shape) => shape.isSelected);

    if (!selectedShape) {
      return;
    }

    const index = shapes.indexOf(selectedShape);
    shapes.splice(index, 1);

    UndoRedoService.push({
      type: UndoRedoEventType.DELETE,
      index,
      shape: {
        from: selectedShape,
        to: null,
      },
    });
  }
}

export default ActionsService;
