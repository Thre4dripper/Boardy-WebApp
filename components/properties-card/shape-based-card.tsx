import { ShapeBasedCardProps } from '@/components/properties-card/interface';
import Store, { Shape } from '@/store/Store';
import { FillColor, StrokeColor } from '@/enums/Colors';
import PenModel from '@/models/pen.model';
import LineModel from '@/models/line.model';
import EllipseModel from '@/models/ellipse.model';
import ArrowModel from '@/models/arrow.model';
import PolygonModel from '@/models/polygon.model';
import TextModel from '@/models/text.model';
import { Card, CardBody } from '@nextui-org/card';
import { Tools } from '@/enums/Tools';
import ColorControls from '@/components/properties-card/color-controls';
import ShapeControls from '@/components/properties-card/shape-controls';
import SizeControls from '@/components/properties-card/size-controls';
import { FontFamilyControls } from '@/components/properties-card/font-family-controls';
import StrokeVariantControls from '@/components/properties-card/stroke-variant-controls';
import ArrowHeadControls from '@/components/properties-card/arrow-head-controls';
import { StrokeVariant } from '@/enums/StrokeVariant';
import { ArrowHeads } from '@/enums/ArrowHeads';
import UndoRedoService, { UndoRedoEventType } from '@/services/undo.redo.service';
import { deepCopy } from '@/utils/Utils';
import CopyDeleteControls from '@/components/properties-card/copy-delete-controls';
import { useCallback } from 'react';

export default function ShapeBasedCard({
  selectedShapeType,
  selectedStrokeColor,
  setSelectedStrokeColor,
  selectedStrokeWidth,
  setSelectedStrokeWidth,
  selectedStrokeVariant,
  setSelectedStrokeVariant,
  selectedFillColor,
  setSelectedFillColor,
  selectedShapeSides,
  setSelectedShapeSides,
  selectedShapeRotation,
  setSelectedShapeRotation,
  selectedLeftArrowHead,
  setSelectedLeftArrowHead,
  selectedRightArrowHead,
  setSelectedRightArrowHead,
  selectedFontSize,
  setSelectedFontSize,
  selectedFontFamily,
  setSelectedFontFamily,
}: ShapeBasedCardProps) {
  const getSelectedShape = () => {
    return Store.allShapes.find((shape) => shape.isSelected);
  };

  /* METHODS FOR GENERIC SHAPE */
  const setSelectedShapeStrokeColor = (color: StrokeColor, undoRedoCount: boolean) => {
    const selectedShape = getSelectedShape();
    if (!selectedShape) {
      return;
    }

    const fromShape = deepCopy(selectedShape);

    if (
      selectedShape instanceof PenModel ||
      selectedShape instanceof LineModel ||
      selectedShape instanceof EllipseModel ||
      selectedShape instanceof ArrowModel ||
      selectedShape instanceof PolygonModel
    ) {
      selectedShape.strokeColor = color;
    } else if (selectedShape instanceof TextModel) {
      selectedShape.fontColor = color;
    }

    if (!undoRedoCount) return;

    pushToUndoRedoService(
      Store.allShapes.indexOf(selectedShape),
      fromShape,
      deepCopy(selectedShape)
    );
  };

  const setSelectedShapeFillColor = (color: FillColor, undoRedoCount: boolean) => {
    const selectedShape = getSelectedShape();
    if (!selectedShape) {
      return;
    }

    const fromShape = deepCopy(selectedShape);

    if (selectedShape instanceof PolygonModel || selectedShape instanceof EllipseModel) {
      (selectedShape as PolygonModel | EllipseModel).fillColor = color;
    }

    if (!undoRedoCount) return;

    pushToUndoRedoService(
      Store.allShapes.indexOf(selectedShape),
      fromShape,
      deepCopy(selectedShape)
    );
  };

  const setSelectedShapeStrokeWidth = (width: number) => {
    const selectedShape = getSelectedShape();
    if (!selectedShape) {
      return;
    }

    const fromShape = deepCopy(selectedShape);

    if (
      selectedShape instanceof PenModel ||
      selectedShape instanceof LineModel ||
      selectedShape instanceof EllipseModel ||
      selectedShape instanceof ArrowModel ||
      selectedShape instanceof PolygonModel
    ) {
      selectedShape.strokeWidth = width;
    }

    pushToUndoRedoService(
      Store.allShapes.indexOf(selectedShape),
      fromShape,
      deepCopy(selectedShape)
    );
  };

  const setSelectedShapeStrokeVariant = (variant: StrokeVariant) => {
    const selectedShape = getSelectedShape();
    if (!selectedShape) {
      return;
    }

    const fromShape = deepCopy(selectedShape);

    if (
      selectedShape instanceof PenModel ||
      selectedShape instanceof LineModel ||
      selectedShape instanceof EllipseModel ||
      selectedShape instanceof ArrowModel ||
      selectedShape instanceof PolygonModel
    ) {
      selectedShape.strokeVariant = variant;
    }

    pushToUndoRedoService(
      Store.allShapes.indexOf(selectedShape),
      fromShape,
      deepCopy(selectedShape)
    );
  };

  /* METHODS FOR TEXT SHAPE */
  const setSelectedTextFontColor = (color: StrokeColor, undoRedoCount: boolean) => {
    const selectedShape = getSelectedShape();
    if (!selectedShape) {
      return;
    }

    const fromShape = deepCopy(selectedShape);

    if (selectedShape instanceof TextModel) {
      selectedShape.fontColor = color;
    }

    if (!undoRedoCount) return;

    pushToUndoRedoService(
      Store.allShapes.indexOf(selectedShape),
      fromShape,
      deepCopy(selectedShape)
    );
  };

  const setSelectedTextFontSize = (size: number) => {
    const selectedShape = getSelectedShape();
    if (!selectedShape) {
      return;
    }

    const fromShape = deepCopy(selectedShape);

    if (selectedShape instanceof TextModel) {
      selectedShape.fontSize = size;
    }

    pushToUndoRedoService(
      Store.allShapes.indexOf(selectedShape),
      fromShape,
      deepCopy(selectedShape)
    );
  };

  const setSelectedTextFontFamily = (font: string) => {
    const selectedShape = getSelectedShape();
    if (!selectedShape) {
      return;
    }

    const fromShape = deepCopy(selectedShape);

    if (selectedShape instanceof TextModel) {
      selectedShape.fontFamily = font;
    }

    pushToUndoRedoService(
      Store.allShapes.indexOf(selectedShape),
      fromShape,
      deepCopy(selectedShape)
    );
  };

  /* METHODS FOR POLYGON SHAPE */
  const setSelectedPolygonSides = (sides: number) => {
    const selectedShape = getSelectedShape();
    if (!selectedShape) {
      return;
    }

    const fromShape = deepCopy(selectedShape);

    if (selectedShape instanceof PolygonModel) {
      selectedShape.sides = sides;
    }

    pushToUndoRedoService(
      Store.allShapes.indexOf(selectedShape),
      fromShape,
      deepCopy(selectedShape)
    );
  };

  const setSelectedPolygonRotation = (rotation: number) => {
    const selectedShape = getSelectedShape();
    if (!selectedShape) {
      return;
    }

    const fromShape = deepCopy(selectedShape);

    if (selectedShape instanceof PolygonModel) {
      selectedShape.rotation = rotation;
    }

    pushToUndoRedoService(
      Store.allShapes.indexOf(selectedShape),
      fromShape,
      deepCopy(selectedShape)
    );
  };

  /* METHODS FOR ARROW SHAPE */
  const setSelectedArrowLeftArrowHead = (arrowHead: ArrowHeads) => {
    const selectedShape = getSelectedShape();
    if (!selectedShape) {
      return;
    }

    const fromShape = deepCopy(selectedShape);

    if (selectedShape instanceof ArrowModel) {
      selectedShape.leftArrowHead = arrowHead;
    }

    pushToUndoRedoService(
      Store.allShapes.indexOf(selectedShape),
      fromShape,
      deepCopy(selectedShape)
    );
  };

  const setSelectedArrowRightArrowHead = (arrowHead: ArrowHeads) => {
    const selectedShape = getSelectedShape();
    if (!selectedShape) {
      return;
    }

    const fromShape = deepCopy(selectedShape);

    if (selectedShape instanceof ArrowModel) {
      selectedShape.rightArrowHead = arrowHead;
    }

    pushToUndoRedoService(
      Store.allShapes.indexOf(selectedShape),
      fromShape,
      deepCopy(selectedShape)
    );
  };

  const pushToUndoRedoService = useCallback((index: number, fromShape: Shape, toShape: Shape) => {
    UndoRedoService.push({
      type: UndoRedoEventType.DELETE,
      index,
      shape: {
        from: fromShape,
        to: toShape,
      },
    });
  }, []);

  return (
    <Card className={'w-64 absolute left-4 transform -translate-y-1/2 top-1/2'}>
      <CardBody className={'px-4 flex flex-col gap-4'}>
        {selectedShapeType === Tools.Text ? (
          <ColorControls
            header={'Font Color'}
            type={'text'}
            selectedColor={selectedStrokeColor}
            setSelectedColor={(color, undoRedoCount) => {
              setSelectedStrokeColor(color);
              setSelectedTextFontColor(color as StrokeColor, undoRedoCount);
            }}
          />
        ) : (
          <ColorControls
            header={'Stroke Color'}
            type={'stroke'}
            selectedColor={selectedStrokeColor}
            setSelectedColor={(color, undoRedoCount) => {
              setSelectedStrokeColor(color);
              setSelectedShapeStrokeColor(color as StrokeColor, undoRedoCount);
            }}
          />
        )}
        {(selectedShapeType === Tools.Polygon || selectedShapeType === Tools.Ellipse) && (
          <>
            <ColorControls
              header={'Fill Color'}
              type={'fill'}
              selectedColor={selectedFillColor}
              setSelectedColor={(color, undoRedoCount) => {
                setSelectedFillColor(color);
                setSelectedShapeFillColor(color as FillColor, undoRedoCount);
              }}
            />
          </>
        )}
        {selectedShapeType === Tools.Polygon && (
          <ShapeControls
            selectedShapeSides={selectedShapeSides}
            setSelectedShapeSides={(sides) => {
              setSelectedShapeSides(sides);
              setSelectedPolygonSides(sides);
            }}
            selectedShapeRotation={selectedShapeRotation}
            setSelectedShapeRotation={(rotation) => {
              setSelectedShapeRotation(rotation);
              setSelectedPolygonRotation(rotation);
            }}
          />
        )}
        {selectedShapeType === Tools.Text ? (
          <SizeControls
            header={'Font Size'}
            max={100}
            min={15}
            size={'sm'}
            showSteps={false}
            selectedSize={selectedFontSize}
            setSelectedSize={(size) => {
              setSelectedFontSize(size);
              setSelectedTextFontSize(size);
            }}
          />
        ) : (
          <SizeControls
            header={'Stroke Width'}
            max={10}
            min={1}
            size={'md'}
            showSteps={true}
            selectedSize={selectedStrokeWidth}
            setSelectedSize={(width) => {
              setSelectedStrokeWidth(width);
              setSelectedShapeStrokeWidth(width);
            }}
          />
        )}
        {selectedShapeType === Tools.Text && (
          <FontFamilyControls
            selectedFontFamily={selectedFontFamily}
            setSelectedFontFamily={(font) => {
              setSelectedFontFamily(font);
              setSelectedTextFontFamily(font);
            }}
          />
        )}
        {selectedShapeType !== Tools.Text && (
          <StrokeVariantControls
            selectedStrokeVariant={selectedStrokeVariant}
            setSelectedStrokeVariant={(variant) => {
              setSelectedStrokeVariant(variant);
              setSelectedShapeStrokeVariant(variant as StrokeVariant);
            }}
          />
        )}
        {selectedShapeType === Tools.Arrow && (
          <ArrowHeadControls
            selectedLeftArrowHead={selectedLeftArrowHead}
            setSelectedLeftArrowHead={(arrowHead) => {
              setSelectedLeftArrowHead(arrowHead as ArrowHeads);
              setSelectedArrowLeftArrowHead(arrowHead as ArrowHeads);
            }}
            selectedRightArrowHead={selectedRightArrowHead}
            setSelectedRightArrowHead={(arrowHead) => {
              setSelectedRightArrowHead(arrowHead as ArrowHeads);
              setSelectedArrowRightArrowHead(arrowHead as ArrowHeads);
            }}
          />
        )}
        <CopyDeleteControls />
      </CardBody>
    </Card>
  );
}
