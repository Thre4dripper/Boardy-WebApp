import BaseModel from '@/models/base.model';
import { Mouse } from '@/app/page';
import React from 'react';
import { FillColor, StrokeColor } from '@/enums/Colors';
import { StrokeVariant } from '@/enums/StrokeVariant';
import SelectionService from '@/services/selection.service';
import Store from '@/store/Store';
import ResizeService from '@/services/resize.service';
import UndoRedoService, { UndoRedoEventType } from '@/services/undo.redo.service';

class EllipseModel extends BaseModel {
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

  static drawCurrentEllipse(
    mouseRef: React.MutableRefObject<Mouse>,
    selectedStrokeColor: StrokeColor,
    selectedStrokeWidth: number,
    selectedStrokeVariant: StrokeVariant,
    selectedFillColor: FillColor
  ) {
    const ellipses = Store.allShapes.filter(
      (shape) => shape instanceof EllipseModel
    ) as EllipseModel[];
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
        Store.allShapes.pop();
        UndoRedoService.pop();
      }
      Store.allShapes.push(
        new EllipseModel(
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

  static drawStoredEllipse(ctx: CanvasRenderingContext2D, ellipse: EllipseModel) {
    if (ellipse.x1 === ellipse.x2 && ellipse.y1 === ellipse.y2) {
      return;
    }
    BaseModel.draw(ellipse, ctx);
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
      SelectionService.drawEllipseSelectionBox(ctx, ellipse, true);
    }
  }

  static isEllipseHovered(ellipse: EllipseModel, mouseRef: React.MutableRefObject<Mouse>) {
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
      return distance <= 1.2 && distance >= 0.8;
    }
  }

  static isEllipseSelectionHovered(
    ellipse: EllipseModel,
    mouseRef: React.MutableRefObject<Mouse>
  ) {
    // Get rectangular selection bounds

    const minX = Math.min(ellipse.x1, ellipse.x2);
    const minY = Math.min(ellipse.y1, ellipse.y2);
    const maxX = Math.max(ellipse.x1, ellipse.x2);
    const maxY = Math.max(ellipse.y1, ellipse.y2);

    // Get mouse position
    const x = mouseRef.current.x;
    const y = mouseRef.current.y;

    const tolerance = 5;

    // Check if mouse is within bounds
    return (
      x >= minX - tolerance &&
      x <= maxX + tolerance &&
      y >= minY - tolerance &&
      y <= maxY + tolerance
    );
  }

  static getHoveredEdgeOrCorner(ellipse: EllipseModel, mouseRef: React.MutableRefObject<Mouse>) {
    const points = [
      { x: ellipse.x1, y: ellipse.y1 },
      { x: ellipse.x2, y: ellipse.y2 },
    ];

    ellipse.horizontalInverted = ellipse.x1 > ellipse.x2;
    ellipse.verticalInverted = ellipse.y1 > ellipse.y2;

    return ResizeService.detectRectangleResizeSelection(mouseRef, points);
  }
}

export default EllipseModel;
