import Store, { Shape } from '@/store/Store';
import { Tools } from '@/enums/Tools';
import PenModel from '@/models/pen.model';
import LineModel from '@/models/line.model';
import EllipseModel from '@/models/ellipse.model';
import ArrowModel from '@/models/arrow.model';
import PolygonModel from '@/models/polygon.model';
import TextModel from '@/models/text.model';
import ImageModel from '@/models/image.model';
import { deepCopy } from '@/utils/Utils';
import { Theme } from '@/enums/Theme';
import ThemeService from '@/services/theme.service';

export enum UndoRedoEventType {
  CREATE = 'CREATE',
  DELETE = 'DELETE',
  MOVE = 'MOVE',
  RESIZE = 'RESIZE',
  UPDATE = 'UPDATE',
}

type UndoRedoEvent = {
  type: UndoRedoEventType;
  index: number;
  shape: {
    from: Shape | null;
    to: Shape | null;
  };
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

    const shape = undoRedoEvent.shape.to;
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

        //decouple the last shape from the current shape
        const lastShapeIndex = this.undoStack.length - 2;
        if (lastShapeIndex >= 0) {
          const lastShape = this.undoStack[lastShapeIndex].shape;
          this.undoStack[lastShapeIndex].shape = deepCopy(lastShape);
        }
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
      return !(event.shape.from instanceof TextModel || event.shape.to instanceof TextModel);
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

    //remove selection from the shape before undo
    event.shape.from?.setIsSelected(false);
    event.shape.to?.setIsSelected(false);

    this.redoStack.push(event);

    switch (event.type) {
      case UndoRedoEventType.CREATE:
        //remove the last shape
        Store.allShapes.splice(event.index, 1);
        break;
      case UndoRedoEventType.DELETE:
        //add the shape back
        Store.allShapes.splice(event.index, 0, event.shape.from!);
        break;
      case UndoRedoEventType.MOVE:
        //move the shape back to its previous position by deleting the current shape and adding the previous shape
        Store.allShapes.splice(event.index, 1);
        Store.allShapes.splice(event.index, 0, event.shape.from!);
        break;
      case UndoRedoEventType.RESIZE:
        //resize the shape back to its previous size by deleting the current shape and adding the previous shape
        Store.allShapes.splice(event.index, 1);
        Store.allShapes.splice(event.index, 0, event.shape.from!);
        break;
      case UndoRedoEventType.UPDATE:
        //update the shape back to its previous state by deleting the current shape and adding the previous shape
        Store.allShapes.splice(event.index, 1);
        Store.allShapes.splice(event.index, 0, event.shape.from!);
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
        Store.allShapes.splice(event.index, 0, event.shape.to!);
        break;
      case UndoRedoEventType.DELETE:
        //remove the last shape
        Store.allShapes.splice(event.index, 1);
        break;
      case UndoRedoEventType.MOVE:
        //move the shape back to its previous position by deleting the current shape and adding the previous shape
        Store.allShapes.splice(event.index, 1);
        Store.allShapes.splice(event.index, 0, event.shape.to!);
        break;
      case UndoRedoEventType.RESIZE:
        //resize the shape back to its previous size by deleting the current shape and adding the previous shape
        Store.allShapes.splice(event.index, 1);
        Store.allShapes.splice(event.index, 0, event.shape.to!);
        break;
      case UndoRedoEventType.UPDATE:
        //update the shape back to its previous state by deleting the current shape and adding the previous shape
        Store.allShapes.splice(event.index, 1);
        Store.allShapes.splice(event.index, 0, event.shape.to!);
        break;
    }
  }

  static filterEmptyShapes(selectedTool: Tools) {
    //filter all empty shapes except that is selected

    for (let i = this.undoStack.length - 1; i >= 0; i--) {
      const event = this.undoStack[i];
      let condition = false;

      let shape;
      if (event.type === UndoRedoEventType.CREATE) {
        shape = event.shape.to!;
      } else if (event.type === UndoRedoEventType.DELETE) {
        shape = event.shape.from!;
      } else {
        shape = event.shape.to!;
      }
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

  static changeTheme(theme: Theme) {
    function eventCallback() {
      return (event: UndoRedoEvent) => {
        const shapeFrom = event.shape.from;
        if (shapeFrom) {
          ThemeService.changeShapesTheme(shapeFrom, theme);
        }

        const shapeTo = event.shape.to;
        if (shapeTo) {
          ThemeService.changeShapesTheme(shapeTo, theme);
        }
      };
    }

    //change all shapes themes in undo stack
    this.undoStack.forEach(eventCallback());

    //change all shapes themes in redo stack
    this.redoStack.forEach(eventCallback());
  }
}

export default UndoRedoService;
