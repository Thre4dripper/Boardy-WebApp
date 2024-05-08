import BaseShape from '@/models/BaseShape';
import { Mouse } from '@/app/page';
import React from 'react';
import { FillColor, StrokeColor } from '@/enums/Colors';
import { StrokeVariant } from '@/enums/StrokeVariant';
import Selection from '@/models/Selection';
import Line from '@/models/line';

class Polygon extends BaseShape {
  sides: number;
  rotation: number;
  fillColor: FillColor;

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

  static getAllPolygons = () => Polygon.polygons;

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

      if (polygon.isSelected) {
        Selection.drawPolygonSelectionBox(ctx, polygon);
      }
    });
  }

  static isPolygonHovered(polygon: Polygon, mouseRef: React.MutableRefObject<Mouse>) {
    const x = mouseRef.current.x;
    const y = mouseRef.current.y;
    const vertices = [];

    const xCenter = (polygon.x1 + polygon.x2) / 2;
    const yCenter = (polygon.y1 + polygon.y2) / 2;
    const radiusX = Math.abs(polygon.x1 - polygon.x2) / 2;
    const radiusY = Math.abs(polygon.y1 - polygon.y2) / 2;

    for (let d = 0; d <= 360; d++) {
      if (d % (360 / polygon.sides) === 0) {
        const a = ((d + polygon.rotation) * Math.PI) / 180;
        const x1 = xCenter + radiusX * Math.cos(a);
        const y1 = yCenter + radiusY * Math.sin(a);
        vertices.push({ x: x1, y: y1 });
      }
    }

    if (polygon.fillColor === FillColor.Transparent) {
      let isOnBoundary = false;
      for (let i = 0; i < vertices.length; i++) {
        // Get all lines of the polygon
        const p1 = vertices[i];
        const p2 = vertices[(i + 1) % vertices.length];

        const line = new Line(
          p1.x,
          p1.y,
          p2.x,
          p2.y,
          polygon.strokeColor,
          polygon.strokeWidth,
          polygon.strokeVariant
        );

        // Check if the mouse is hovering over the line
        if (Line.isLineHovered(line, mouseRef)) {
          isOnBoundary = true;
          break;
        }
      }

      return isOnBoundary;
    } else {
      //ray casting algorithm
      let inside = false;

      for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
        const xi = vertices[i].x;
        const yi = vertices[i].y;
        const xj = vertices[j].x;
        const yj = vertices[j].y;
        const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
      }

      return inside;
    }
  }
}

export default Polygon;
