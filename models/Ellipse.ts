import BaseShape from '@/models/BaseShape';
import { Mouse } from '@/app/page';
import React from 'react';
import { FillColor, StrokeColor } from '@/enums/Colors';
import { StrokeVariant } from '@/enums/StrokeVariant';
import Selection from '@/models/Selection';

class Ellipse extends BaseShape {
  fillColor: FillColor;

  constructor(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: StrokeColor,
    size: number,
    variant: StrokeVariant,
    fillColor: FillColor
  ) {
    super(x1, y1, x2, y2, color, size, variant);
    this.fillColor = fillColor;
  }

  private static ellipses: Ellipse[] = [];

  static getAllEllipses = () => Ellipse.ellipses;

  static drawCurrentEllipse(
    mouseRef: React.MutableRefObject<Mouse>,
    selectedStrokeColor: StrokeColor,
    selectedStrokeWidth: number,
    selectedStrokeVariant: StrokeVariant,
    selectedFillColor: FillColor
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
          selectedStrokeVariant,
          selectedFillColor
        )
      );
    }
  }

  static drawStoredEllipse(ctx: CanvasRenderingContext2D, ellipse: Ellipse) {
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

    ctx.fillStyle = ellipse.fillColor;
    ctx.fill();
    ctx.stroke();

    if (ellipse.isSelected) {
      Selection.drawEllipseSelectionBox(ctx, ellipse);
    }
  }

  static isEllipseHovered(ellipse: Ellipse, mouseRef: React.MutableRefObject<Mouse>) {
    const xCenter = (ellipse.x1 + ellipse.x2) / 2;
    const yCenter = (ellipse.y1 + ellipse.y2) / 2;
    const radiusX = Math.abs(ellipse.x1 - ellipse.x2) / 2;
    const radiusY = Math.abs(ellipse.y1 - ellipse.y2) / 2;

    const dx = mouseRef.current.x - xCenter;
    const dy = mouseRef.current.y - yCenter;

    const distance = Math.pow(dx / radiusX, 2) + Math.pow(dy / radiusY, 2);

    if (ellipse.fillColor !== FillColor.Transparent) {
      return distance <= 1;
    } else {
      return distance <= 1 && distance >= 0.9;
    }
  }
}

export default Ellipse;
