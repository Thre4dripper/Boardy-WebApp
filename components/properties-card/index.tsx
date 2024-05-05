import { Card, CardBody } from '@nextui-org/card';
import ColorControls from '@/components/properties-card/color-controls';
import StrokeWidthControls from '@/components/properties-card/stroke-width-controls';
import StrokeVariantControls from '@/components/properties-card/stroke-variant-controls';
import { StrokeVariant } from '@/enums/StrokeVariant';
import { Tools } from '@/enums/Tools';
import ShapeControls from '@/components/properties-card/shape-controls';

interface PropertiesCardProps {
  selectedTool: string;
  selectedStrokeColor: string;
  setSelectedStrokeColor: (color: string) => void;
  selectedStrokeWidth: number;
  setSelectedStrokeWidth: (width: number) => void;
  selectedStrokeVariant: StrokeVariant;
  setSelectedStrokeVariant: (variant: StrokeVariant) => void;
  selectedFillColor: string;
  setSelectedFillColor: (color: string) => void;
  selectedShapeSides: number;
  setSelectedShapeSides: (sides: number) => void;
  selectedShapeRotation: number;
  setSelectedShapeRotation: (rotation: number) => void;
}

export default function PropertiesCard({
  selectedTool,
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
}: PropertiesCardProps) {
  return (
    <Card className={'w-64 absolute left-4 transform -translate-y-1/2 top-1/2'}>
      <CardBody className={'px-4 flex flex-col gap-4'}>
        <ColorControls
          header={'Stroke Color'}
          selectedColor={selectedStrokeColor}
          setSelectedColor={setSelectedStrokeColor}
        />
        {(selectedTool === Tools.Polygon || selectedTool === Tools.Ellipse) && (
          <>
            <ColorControls
              header={'Fill Color'}
              selectedColor={selectedFillColor}
              setSelectedColor={setSelectedFillColor}
            />
          </>
        )}
        {selectedTool === Tools.Polygon && (
          <ShapeControls
            selectedShapeSides={selectedShapeSides}
            setSelectedShapeSides={setSelectedShapeSides}
            selectedShapeRotation={selectedShapeRotation}
            setSelectedShapeRotation={setSelectedShapeRotation}
          />
        )}
        <StrokeWidthControls
          selectedStrokeWidth={selectedStrokeWidth}
          setSelectedStrokeWidth={setSelectedStrokeWidth}
        />
        <StrokeVariantControls
          selectedStrokeVariant={selectedStrokeVariant}
          setSelectedStrokeVariant={setSelectedStrokeVariant}
        />
      </CardBody>
    </Card>
  );
}
