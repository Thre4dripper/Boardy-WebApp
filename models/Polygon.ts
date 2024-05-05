import BaseShape from '@/models/BaseShape';
import { Mouse } from '@/app/page';
import React from 'react';
import { FillColor, StrokeColor } from '@/enums/Colors';
import { StrokeVariant } from '@/enums/StrokeVariant';

class Polygon extends BaseShape {
  sides: number;
  rotation: number;
  fillColor: string;

  constructor(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: StrokeColor,
    size: number,
    variant: StrokeVariant,
    sides: number,
    rotation: number,
    fillColor: FillColor
  ) {
    super(x1, y1, x2, y2, color, size, variant);
    this.sides = sides;
    this.rotation = rotation;
    this.fillColor = fillColor;
  }

  private static polygons: Polygon[] = [];

  static drawCurrentPolygon(
    mouseRef: React.MutableRefObject<Mouse>,
    selectedStrokeColor: StrokeColor,
    selectedStrokeWidth: number,
    selectedStrokeVariant: StrokeVariant,
    sides: number,
    rotation: number,
    selectedFillColor: FillColor
  ) {
    const polygons = Polygon.polygons;
    if (mouseRef.current.down) {
      const lastPolygon = polygons[polygons.length - 1];
      lastPolygon.x2 = mouseRef.current.x;
      lastPolygon.y2 = mouseRef.current.y;
    } else {
      if (
        polygons.length > 0 &&
        polygons[polygons.length - 1].x1 === polygons[polygons.length - 1].x2 &&
        polygons[polygons.length - 1].y1 === polygons[polygons.length - 1].y2
      ) {
        polygons.pop();
      }
      polygons.push(
        new Polygon(
          mouseRef.current.x,
          mouseRef.current.y,
          mouseRef.current.x,
          mouseRef.current.y,
          selectedStrokeColor,
          selectedStrokeWidth,
          selectedStrokeVariant,
          sides,
          rotation,
          selectedFillColor
        )
      );
    }
  }

  static renderAllPolygons(ctx: CanvasRenderingContext2D) {
    Polygon.polygons.forEach((polygon) => {
      if (polygon.x1 === polygon.x2 && polygon.y1 === polygon.y2) {
        return;
      }
      BaseShape.draw(polygon, ctx);
      ctx.fillStyle = polygon.fillColor;

      ctx.beginPath();
      const x = (polygon.x1 + polygon.x2) / 2;
      const y = (polygon.y1 + polygon.y2) / 2;
      const radiusX = Math.abs(polygon.x1 - polygon.x2) / 2;
      const radiusY = Math.abs(polygon.y1 - polygon.y2) / 2;

      const path = new Path2D();
      for (let d = 0; d <= 360; d++) {
        if (d % (360 / polygon.sides) === 0) {
          const a = ((d + polygon.rotation) * Math.PI) / 180;
          const x1 = x + radiusX * Math.cos(a);
          const y1 = y + radiusY * Math.sin(a);
          const a2 = ((d + polygon.rotation + 360 / polygon.sides) * Math.PI) / 180;
          const x2 = x + radiusX * Math.cos(a2);
          const y2 = y + radiusY * Math.sin(a2);
          if (d === 0) {
            path.moveTo(x1, y1);
          } else {
            path.lineTo(x1, y1);
          }
        }
      }
      path.closePath();

      ctx.fill(path);
      ctx.stroke(path);
    });
  }
}

export default Polygon;
