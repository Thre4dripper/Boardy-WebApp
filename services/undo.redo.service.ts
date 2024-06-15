import Store, { Shape } from '@/store/Store';
import { Tools } from '@/enums/Tools';
import PenModel from '@/models/pen.model';
import LineModel from '@/models/line.model';
import EllipseModel from '@/models/ellipse.model';
import ArrowModel from '@/models/arrow.model';
import PolygonModel from '@/models/polygon.model';
import TextModel from '@/models/text.model';
import ImageModel from '@/models/image.model';

export enum Events {
  CREATE = 'CREATE',
  DELETE = 'DELETE',
  MOVE = 'MOVE',
  RESIZE = 'RESIZE',
}

type UndoRedoEvent = {
  type: Events;
  index: number;
  shape: Shape;
};

let pushFlag = 0;

class UndoRedoService {
  private static undoStack: UndoRedoEvent[] = [];
  private static redoStack: UndoRedoEvent[] = [];

  public static push(event: UndoRedoEvent, flag: boolean) {
    this.undoStack.push(event);

    pushFlag++;
    if (flag && pushFlag > 1) {
      //for resetting redo stack when new shape is created and push is constantly called
      this.redoStack = [];
      pushFlag = 1;
    }
  }

  public static pop() {
    pushFlag--;
    return this.undoStack.pop();
  }

  public static undo(selectedTool: Tools) {
    let popIndex = this.undoStack.length - 1;
    if ([Tools.Pen, Tools.Line, Tools.Polygon, Tools.Ellipse, Tools.Arrow].includes(selectedTool)) {
      popIndex--;
    }

    if (popIndex < 0) return;

    const event = this.undoStack[popIndex];
    this.undoStack.splice(popIndex, 1);

    if (!event) return;
    //remove selection from the shape before pushing it to redo stack
    event.shape.setIsSelected(false);
    this.redoStack.push(event);
    switch (event.type) {
      case Events.CREATE:
        //remove the last shape
        Store.allShapes.splice(event.index, 1);
        break;
      case Events.DELETE:
        //add the shape back
        Store.allShapes.splice(event.index, 0, event.shape);
        break;
    }
  }

  public static redo(selectedTool: Tools) {
    const event = this.redoStack.pop();
    if (!event) return;

    this.undoStack.splice(event.index, 0, event);
    switch (event.type) {
      case Events.CREATE:
        //add the shape back
        Store.allShapes.splice(event.index, 0, event.shape);
        break;
      case Events.DELETE:
        //remove the last shape
        Store.allShapes.splice(event.index, 1);
        break;
    }
  }

  static filterEmptyShapes(selectedTool: Tools) {
    //filter all empty shapes except that is selected

    for (let i = this.undoStack.length - 1; i >= 0; i--) {
      const event = this.undoStack[i];
      let condition = false;

      const shape = event.shape;
      const filter = Store.getFilter(shape);

      switch (shape.constructor) {
        case PenModel:
          condition = selectedTool === Tools.Pen || filter;
          break;
        case LineModel:
          condition = selectedTool === Tools.Line || filter;
          break;
        case EllipseModel:
          condition = selectedTool === Tools.Ellipse || filter;
          break;
        case ArrowModel:
          condition = selectedTool === Tools.Arrow || filter;
          break;
        case PolygonModel:
          condition = selectedTool === Tools.Polygon || filter;
          break;
        case TextModel:
          condition = selectedTool === Tools.Text || filter;
          break;
        case ImageModel:
          condition = selectedTool === Tools.Image || filter;
          break;
        default:
          condition = false;
      }

      if (!condition) {
        this.undoStack.splice(i, 1);
      }
    }
  }
}

export default UndoRedoService;
