import Pen from '@/models/Pen';
import Line from '@/models/line';
import Ellipse from '@/models/Ellipse';
import Arrow from '@/models/Arrow';
import Polygon from '@/models/Polygon';
import Text from '@/models/Text';

class Store {
  //TODO centralize all shapes in one place to avoid explicit computation
  static getCombinedData() {
    return [
      ...Pen.getAllPens().filter((pen) => pen.path.length > 1),
      ...Line.getAllLines().filter((line) => line.x1 !== line.x2 || line.y1 !== line.y2),
      ...Ellipse.getAllEllipses().filter(
        (ellipse) => ellipse.x1 !== ellipse.x2 || ellipse.y1 !== ellipse.y2
      ),
      ...Arrow.getAllArrows().filter((arrow) => arrow.x1 !== arrow.x2 || arrow.y1 !== arrow.y2),
      ...Polygon.getAllPolygons().filter(
        (polygon) => polygon.x1 !== polygon.x2 || polygon.y1 !== polygon.y2
      ),
      ...Text.getAllTexts(),
    ].sort((a, b) => a.timeStamp - b.timeStamp);
  }

  static drawAllShapes(ctx: CanvasRenderingContext2D) {
    const allShapes = Store.getCombinedData();
    allShapes.forEach((shape) => {
      switch (shape.constructor) {
        case Pen:
          Pen.drawStoredPen(ctx, shape as Pen);
          break;
        case Line:
          Line.drawStoredLine(ctx, shape as Line);
          break;
        case Ellipse:
          Ellipse.drawStoredEllipse(ctx, shape as Ellipse);
          break;
        case Arrow:
          Arrow.drawStoredArrow(ctx, shape as Arrow);
          break;
        case Polygon:
          Polygon.drawStoredPolygon(ctx, shape as Polygon);
          break;
        case Text:
          Text.drawStoredText(ctx, shape as Text);
          break;
        default:
          break;
      }
    });
  }
}

export default Store;
