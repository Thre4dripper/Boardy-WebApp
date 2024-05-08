import BaseShape from '@/models/BaseShape';
import { Mouse } from '@/app/page';
import React from 'react';
import { StrokeColor } from '@/enums/Colors';
import { StrokeVariant } from '@/enums/StrokeVariant';
import { ArrowHeads } from '@/enums/ArrowHeads';
import Selection from '@/models/Selection';

class Arrow extends BaseShape {
  leftArrowHead: ArrowHeads;
  rightArrowHead: ArrowHeads;

  constructor(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    strokeColor: StrokeColor,
    strokeWidth: number,
    strokeVariant: StrokeVariant,
    leftArrowHead: ArrowHeads,
    rightArrowHead: ArrowHeads
  ) {
    super(x1, y1, x2, y2, strokeColor, strokeWidth, strokeVariant);
    this.leftArrowHead = leftArrowHead;
    this.rightArrowHead = rightArrowHead;
  }

  private static arrows: Arrow[] = [];

  static getAllArrows = () => Arrow.arrows;

  static drawCurrentArrow(
    mouseRef: React.MutableRefObject<Mouse>,
    selectedStrokeColor: StrokeColor,
    selectedStrokeWidth: number,
    selectedStrokeVariant: StrokeVariant,
    selectedLeftArrowHead: ArrowHeads,
    selectedRightArrowHead: ArrowHeads
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
          selectedStrokeVariant,
          selectedLeftArrowHead,
          selectedRightArrowHead
        )
      );
    }
  }

  private static calculateArrowheadPoints(
    x: number,
    y: number,
    angle: number,
    arrowheadLength: number,
    arrowheadWidth: number
  ) {
    const x3 = x + arrowheadLength * Math.cos(angle);
    const y3 = y + arrowheadLength * Math.sin(angle);
    const x4 = x3 + arrowheadWidth * Math.cos(angle + Math.PI / 2);
    const y4 = y3 + arrowheadWidth * Math.sin(angle + Math.PI / 2);
    const x5 = x3 + arrowheadWidth * Math.cos(angle - Math.PI / 2);
    const y5 = y3 + arrowheadWidth * Math.sin(angle - Math.PI / 2);
    return { x4, y4, x5, y5 };
  }

  static drawStoredArrow(ctx: CanvasRenderingContext2D, arrow: Arrow) {
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
    const arrowheadLength = arrow.strokeWidth * 5;
    const arrowheadWidth = arrowheadLength * 0.5;

    // Calculate the positions of the arrowhead points
    if (arrow.leftArrowHead === ArrowHeads.Arrow) {
      const { x4, y4, x5, y5 } = Arrow.calculateArrowheadPoints(
        arrow.x1,
        arrow.y1,
        angle,
        arrowheadLength,
        arrowheadWidth
      );

      // Draw the arrowhead
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(arrow.x1, arrow.y1);
      ctx.lineTo(x4, y4);
      ctx.moveTo(arrow.x1, arrow.y1);
      ctx.lineTo(x5, y5);
      ctx.stroke();
    } else if (arrow.leftArrowHead === ArrowHeads.Triangle) {
      const { x4, y4, x5, y5 } = Arrow.calculateArrowheadPoints(
        arrow.x1,
        arrow.y1,
        angle,
        arrowheadLength,
        arrowheadWidth
      );

      // Draw the arrowhead
      ctx.setLineDash([]);
      ctx.beginPath();

      const path = new Path2D();
      path.moveTo(arrow.x1, arrow.y1);
      path.lineTo(x4, y4);
      path.lineTo(x5, y5);
      path.lineTo(arrow.x1, arrow.y1);
      ctx.fillStyle = arrow.strokeColor;
      ctx.fill(path);
      ctx.stroke(path);
    }

    if (arrow.rightArrowHead === ArrowHeads.Arrow) {
      const { x4, y4, x5, y5 } = Arrow.calculateArrowheadPoints(
        arrow.x2,
        arrow.y2,
        angle + Math.PI,
        arrowheadLength,
        arrowheadWidth
      );

      // Draw the arrowhead
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(arrow.x2, arrow.y2);
      ctx.lineTo(x4, y4);
      ctx.moveTo(arrow.x2, arrow.y2);
      ctx.lineTo(x5, y5);
      ctx.stroke();
    } else if (arrow.rightArrowHead === ArrowHeads.Triangle) {
      const { x4, y4, x5, y5 } = Arrow.calculateArrowheadPoints(
        arrow.x2,
        arrow.y2,
        angle + Math.PI,
        arrowheadLength,
        arrowheadWidth
      );

      // Draw the arrowhead
      ctx.setLineDash([]);
      ctx.beginPath();
      const path = new Path2D();
      path.moveTo(arrow.x2, arrow.y2);
      path.lineTo(x4, y4);
      path.lineTo(x5, y5);
      path.lineTo(arrow.x2, arrow.y2);
      ctx.fillStyle = arrow.strokeColor;
      ctx.fill(path);
      ctx.stroke(path);
    }

    if (arrow.isSelected) {
      Selection.drawLineSelectionBox(ctx, arrow);
    }
  }

  static isArrowHovered(arrow: Arrow, mouseRef: React.MutableRefObject<Mouse>) {
    const { x1, y1, x2, y2 } = arrow;
    const { x, y } = mouseRef.current;
    const dist =
      Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1) /
      Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
    return (
      dist < arrow.strokeWidth + 2 &&
      x >= Math.min(x1, x2) &&
      x <= Math.max(x1, x2) &&
      y >= Math.min(y1, y2) &&
      y <= Math.max(y1, y2)
    );
  }
}

export default Arrow;
