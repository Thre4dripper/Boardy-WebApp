import BaseShape from '@/models/BaseShape';
import { ToolColor, ToolVariant } from '@/enums/Tools';
import { Mouse } from '@/app/page';
import React from 'react';

class Arrow extends BaseShape {
  private static arrows: Arrow[] = [];

  static drawCurrentArrow(
    mouseRef: React.MutableRefObject<Mouse>,
    selectedStrokeColor: ToolColor,
    selectedStrokeWidth: number,
    selectedStrokeVariant: ToolVariant
  ) {
    const arrows = Arrow.arrows;
    if (mouseRef.current.down) {
      const lastArrow = arrows[arrows.length - 1];
      lastArrow.x2 = mouseRef.current.x;
      lastArrow.y2 = mouseRef.current.y;
    } else {
      if (
        arrows.length > 0 &&
        arrows[arrows.length - 1].x1 === arrows[arrows.length - 1].x2 &&
        arrows[arrows.length - 1].y1 === arrows[arrows.length - 1].y2
      ) {
        arrows.pop();
      }
      arrows.push(
        new Arrow(
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

  static renderAllArrows(ctx: CanvasRenderingContext2D) {
    Arrow.arrows.forEach((arrow) => {
      if (arrow.x1 === arrow.x2 && arrow.y1 === arrow.y2) {
        return;
      }
      BaseShape.draw(arrow, ctx);
      ctx.beginPath();
      ctx.moveTo(arrow.x1, arrow.y1);
      ctx.lineTo(arrow.x2, arrow.y2);
      ctx.stroke();

      // Calculate the angle of the line
      const angle = Math.atan2(arrow.y2 - arrow.y1, arrow.x2 - arrow.x1);

      // Calculate the positions of the arrowhead points
      const arrowheadLength = arrow.strokeWidth * 5;
      const arrowheadWidth = arrowheadLength * 0.5;
      const x3 = arrow.x2 - arrowheadLength * Math.cos(angle);
      const y3 = arrow.y2 - arrowheadLength * Math.sin(angle);
      const x4 = x3 + arrowheadWidth * Math.cos(angle + Math.PI / 2);
      const y4 = y3 + arrowheadWidth * Math.sin(angle + Math.PI / 2);
      const x5 = x3 + arrowheadWidth * Math.cos(angle - Math.PI / 2);
      const y5 = y3 + arrowheadWidth * Math.sin(angle - Math.PI / 2);

      // Draw the arrowhead
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(arrow.x2, arrow.y2);
      ctx.lineTo(x4, y4);
      ctx.moveTo(arrow.x2, arrow.y2);
      ctx.lineTo(x5, y5);
      ctx.stroke();
    });
  }
}

export default Arrow;
