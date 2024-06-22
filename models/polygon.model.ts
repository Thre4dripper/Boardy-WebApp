import BaseModel from '@/models/base.model';
import { Mouse } from '@/app/page';
import React from 'react';
import { FillColor, StrokeColor } from '@/enums/Colors';
import { StrokeVariant } from '@/enums/StrokeVariant';
import SelectionService from '@/services/selection.service';
import LineModel from '@/models/line.model';
import Store from '@/store/Store';
import ResizeService from '@/services/resize.service';
import UndoRedoService, { UndoRedoEventType } from '@/services/undo.redo.service';

class PolygonModel extends BaseModel {
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

  static drawCurrentPolygon(
    mouseRef: React.MutableRefObject<Mouse>,
    selectedStrokeColor: StrokeColor,
    selectedStrokeWidth: number,
    selectedStrokeVariant: StrokeVariant,
    sides: number,
    rotation: number,
    selectedFillColor: FillColor
  ) {
    const polygons = Store.allShapes.filter(
      (shape) => shape instanceof PolygonModel
    ) as PolygonModel[];
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
        Store.allShapes.pop();
        UndoRedoService.pop();
      }
      Store.allShapes.push(
        new PolygonModel(
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
      UndoRedoService.push({
        type: UndoRedoEventType.CREATE,
        index: Store.allShapes.length - 1,
        shape: {
          from: null,
          to: Store.allShapes[Store.allShapes.length - 1],
        },
      });
    }
  }

  static drawStoredPolygon(ctx: CanvasRenderingContext2D, polygon: PolygonModel) {
    if (polygon.x1 === polygon.x2 && polygon.y1 === polygon.y2) {
      return;
    }

    BaseModel.draw(polygon, ctx);
    ctx.fillStyle = polygon.fillColor;

    ctx.beginPath();
    const centerX = (polygon.x1 + polygon.x2) / 2;
    const centerY = (polygon.y1 + polygon.y2) / 2;
    const radiusX = (Math.abs(polygon.x1 - polygon.x2) / 2) * Math.sqrt(2);
    const radiusY = (Math.abs(polygon.y1 - polygon.y2) / 2) * Math.sqrt(2);

    const path = new Path2D();
    const step = (2 * Math.PI) / polygon.sides;

    for (let i = 0; i < polygon.sides; i++) {
      let angle = i * step + polygon.rotation * (Math.PI / 180);
      let x = centerX + radiusX * Math.cos(angle);
      let y = centerY + radiusY * Math.sin(angle);

      // Reflect the point if needed for inversion
      if (polygon.x1 > polygon.x2) {
        x = centerX - (x - centerX);
      }
      if (polygon.y1 > polygon.y2) {
        y = centerY - (y - centerY);
      }

      if (i === 0) {
        path.moveTo(x, y);
      } else {
        path.lineTo(x, y);
      }
    }
    path.closePath();

    ctx.fill(path);
    ctx.stroke(path);

    if (polygon.isSelected) {
      SelectionService.drawPolygonSelectionBox(ctx, polygon, true);
    }
  }

  static isPolygonHovered(polygon: PolygonModel, mouseRef: React.MutableRefObject<Mouse>) {
    const x = mouseRef.current.x;
    const y = mouseRef.current.y;
    const vertices = [];

    const xCenter = (polygon.x1 + polygon.x2) / 2;
    const yCenter = (polygon.y1 + polygon.y2) / 2;
    const radiusX = (Math.abs(polygon.x1 - polygon.x2) / 2) * Math.sqrt(2);
    const radiusY = (Math.abs(polygon.y1 - polygon.y2) / 2) * Math.sqrt(2);

    const step = (2 * Math.PI) / polygon.sides;
    for (let i = 0; i < polygon.sides; i++) {
      let angle = i * step + polygon.rotation * (Math.PI / 180);
      let x1 = xCenter + radiusX * Math.cos(angle);
      let y1 = yCenter + radiusY * Math.sin(angle);

      // Reflect the point if needed for inversion
      if (polygon.x1 > polygon.x2) {
        x1 = xCenter - (x1 - xCenter);
      }
      if (polygon.y1 > polygon.y2) {
        y1 = yCenter - (y1 - yCenter);
      }

      vertices.push({ x: x1, y: y1 });
    }

    if (polygon.fillColor === FillColor.Transparent) {
      let isOnBoundary = false;
      for (let i = 0; i < vertices.length; i++) {
        // Get all lines of the polygon
        const p1 = vertices[i];
        const p2 = vertices[(i + 1) % vertices.length];

        const line = new LineModel(
          p1.x,
          p1.y,
          p2.x,
          p2.y,
          polygon.strokeColor,
          polygon.strokeWidth,
          polygon.strokeVariant
        );

        // Check if the mouse is hovering over the line
        if (LineModel.isLineHovered(line, mouseRef)) {
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

  static isPolygonSelectionHovered(
    polygon: PolygonModel,
    mouseRef: React.MutableRefObject<Mouse>
  ) {
    // Get rectangular selection bounds

    const xCenter = (polygon.x1 + polygon.x2) / 2;
    const yCenter = (polygon.y1 + polygon.y2) / 2;
    const radiusX = (Math.abs(polygon.x1 - polygon.x2) / 2) * Math.sqrt(2);
    const radiusY = (Math.abs(polygon.y1 - polygon.y2) / 2) * Math.sqrt(2);

    const vertices = [];
    const step = (2 * Math.PI) / polygon.sides;
    for (let i = 0; i < polygon.sides; i++) {
      let angle = i * step + polygon.rotation * (Math.PI / 180);
      let x1 = xCenter + radiusX * Math.cos(angle);
      let y1 = yCenter + radiusY * Math.sin(angle);

      // Reflect the point if needed for inversion
      if (polygon.x1 > polygon.x2) {
        x1 = xCenter - (x1 - xCenter);
      }
      if (polygon.y1 > polygon.y2) {
        y1 = yCenter - (y1 - yCenter);
      }

      vertices.push({ x: x1, y: y1 });
    }

    const minX = Math.min(...vertices.map((point) => point.x));
    const minY = Math.min(...vertices.map((point) => point.y));
    const maxX = Math.max(...vertices.map((point) => point.x));
    const maxY = Math.max(...vertices.map((point) => point.y));

    const tolerance = 5;

    // Check if the mouse is within the bounds
    return (
      mouseRef.current.x >= minX - tolerance &&
      mouseRef.current.x <= maxX + tolerance &&
      mouseRef.current.y >= minY - tolerance &&
      mouseRef.current.y <= maxY + tolerance
    );
  }

  static getHoveredEdgeOrCorner(polygon: PolygonModel, mouseRef: React.MutableRefObject<Mouse>) {
    const xCenter = (polygon.x1 + polygon.x2) / 2;
    const yCenter = (polygon.y1 + polygon.y2) / 2;
    const radiusX = (Math.abs(polygon.x1 - polygon.x2) / 2) * Math.sqrt(2);
    const radiusY = (Math.abs(polygon.y1 - polygon.y2) / 2) * Math.sqrt(2);

    const vertices = [];
    const step = (2 * Math.PI) / polygon.sides;
    for (let i = 0; i < polygon.sides; i++) {
      let angle = i * step + polygon.rotation * (Math.PI / 180);
      let x1 = xCenter + radiusX * Math.cos(angle);
      let y1 = yCenter + radiusY * Math.sin(angle);

      // Reflect the point if needed for inversion
      if (polygon.x1 > polygon.x2) {
        x1 = xCenter - (x1 - xCenter);
      }
      if (polygon.y1 > polygon.y2) {
        y1 = yCenter - (y1 - yCenter);
      }

      vertices.push({ x: x1, y: y1 });
    }

    const points = [
      {
        x: Math.min(...vertices.map((point) => point.x)),
        y: Math.min(...vertices.map((point) => point.y)),
      },
      {
        x: Math.max(...vertices.map((point) => point.x)),
        y: Math.max(...vertices.map((point) => point.y)),
      },
    ];

    polygon.horizontalInverted = polygon.x1 > polygon.x2;
    polygon.verticalInverted = polygon.y1 > polygon.y2;

    return ResizeService.detectRectangleResizeSelection(mouseRef, points);
  }
}

export default PolygonModel;
