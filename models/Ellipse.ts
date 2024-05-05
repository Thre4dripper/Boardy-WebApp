import BaseShape from '@/models/BaseShape';
import { ToolColor, ToolVariant } from '@/enums/Tools';
import { Mouse } from '@/app/page';
import React from 'react';

class Ellipse extends BaseShape {
  private static ellipses: Ellipse[] = [];

  static drawCurrentEllipse(
    mouseRef: React.MutableRefObject<Mouse>,
    selectedStrokeColor: ToolColor,
    selectedStrokeWidth: number,
    selectedStrokeVariant: ToolVariant
  ) {
    const ellipses = Ellipse.ellipses;
    if (mouseRef.current.down) {
      const lastEllipse = ellipses[ellipses.length - 1];
      lastEllipse.x2 = mouseRef.current.x;
      lastEllipse.y2 = mouseRef.current.y;
    } else {
      if (
        ellipses.length > 0 &&
        ellipses[ellipses.length - 1].x1 === ellipses[ellipses.length - 1].x2 &&
        ellipses[ellipses.length - 1].y1 === ellipses[ellipses.length - 1].y2
      ) {
        ellipses.pop();
      }
      ellipses.push(
        new Ellipse(
          mouseRef.current.x,
          mouseRef.current.y,
          mouseRef.current.x,
          mouseRef.current.y,
          selectedStrokeColor,
          selectedStrokeWidth,
          selectedStrokeVariant
        )
      );
    }
  }

  static renderAllEllipses(ctx: CanvasRenderingContext2D) {
    Ellipse.ellipses.forEach((ellipse) => {
      if (ellipse.x1 === ellipse.x2 && ellipse.y1 === ellipse.y2) {
        return;
      }
      BaseShape.draw(ellipse, ctx);
      ctx.beginPath();
      const x = (ellipse.x1 + ellipse.x2) / 2;
      const y = (ellipse.y1 + ellipse.y2) / 2;
      const radiusX = Math.abs(ellipse.x1 - ellipse.x2) / 2;
      const radiusY = Math.abs(ellipse.y1 - ellipse.y2) / 2;
      ctx.ellipse(x, y, radiusX, radiusY, 0, 0, 2 * Math.PI);
      ctx.stroke();
    });
  }
}

export default Ellipse;
