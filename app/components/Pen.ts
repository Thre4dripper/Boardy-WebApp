import Point from '@/app/components/Point';

class Pen {
  path: Point[] = [];
  width: number = 5;
  color: string = 'black';

  constructor(path: Point[]) {
    this.path = path;
  }
}

export default Pen;
