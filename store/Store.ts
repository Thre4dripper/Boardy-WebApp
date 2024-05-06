import Pen from '@/models/Pen';
import Line from '@/models/line';
import Ellipse from '@/models/Ellipse';
import Arrow from '@/models/Arrow';
import Polygon from '@/models/Polygon';
import Text from '@/models/Text';

class Store {
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
}

export default Store;
