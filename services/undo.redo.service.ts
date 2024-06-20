import Store, { Shape } from '@/store/Store';
import { Tools } from '@/enums/Tools';
import PenModel from '@/models/pen.model';
import LineModel from '@/models/line.model';
import EllipseModel from '@/models/ellipse.model';
import ArrowModel from '@/models/arrow.model';
import PolygonModel from '@/models/polygon.model';
import TextModel from '@/models/text.model';
import ImageModel from '@/models/image.model';

export enum UndoRedoEventType {
  CREATE = 'CREATE',
  DELETE = 'DELETE',
  MOVE = 'MOVE',
  RESIZE = 'RESIZE',
}

type UndoRedoEvent = {
  type: UndoRedoEventType;
  index: number;
  shape: Shape;
};

let pushFlag = 0;

class UndoRedoService {
  private static undoStack: UndoRedoEvent[] = [];
  private static redoStack: UndoRedoEvent[] = [];

  public static push(undoRedoEvent: UndoRedoEvent, index?: number) {
    if (index !== undefined) {
      this.undoStack.splice(index, 0, undoRedoEvent);
    } else {
      this.undoStack.push(undoRedoEvent);
    }

    const shape = undoRedoEvent.shape;
    if (
      shape instanceof PenModel ||
      shape instanceof LineModel ||
      shape instanceof PolygonModel ||
      shape instanceof EllipseModel ||
      shape instanceof ArrowModel
    ) {
      pushFlag++;
      //for resetting redo stack when new shape is created and push is constantly called
      if (pushFlag > 1) {
        this.redoStack = [];
        pushFlag = 1;
      }
    } else if (shape instanceof ImageModel) {
      this.redoStack = [];
    }
  }

  public static pop() {
    pushFlag--;
    return this.undoStack.pop();
  }

  public static removeAllTexts() {
    this.undoStack = this.undoStack.filter((event) => {
      return !(event.shape instanceof TextModel);
    });
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
      case UndoRedoEventType.CREATE:
        //remove the last shape
        Store.allShapes.splice(event.index, 1);
        break;
      case UndoRedoEventType.DELETE:
        //add the shape back
        Store.allShapes.splice(event.index, 0, event.shape);
        break;
    }
  }

  public static redo(selectedTool: Tools) {
    const event = this.redoStack.pop();
    if (!event) return;

    if ([Tools.Pen, Tools.Line, Tools.Polygon, Tools.Ellipse, Tools.Arrow].includes(selectedTool)) {
      this.undoStack.splice(this.undoStack.length - 1, 0, event);
    } else if (selectedTool === Tools.Text) {
      this.undoStack.splice(event.index, 0, event);
    } else {
      this.undoStack.push(event);
    }
    switch (event.type) {
      case UndoRedoEventType.CREATE:
        //add the shape back
        Store.allShapes.splice(event.index, 0, event.shape);
        break;
      case UndoRedoEventType.DELETE:
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
