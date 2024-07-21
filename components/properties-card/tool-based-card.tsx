import { Card, CardBody } from '@nextui-org/card';
import { Tools } from '@/enums/Tools';
import ColorControls from '@/components/properties-card/color-controls';
import ShapeControls from '@/components/properties-card/shape-controls';
import SizeControls from '@/components/properties-card/size-controls';
import { FontFamilyControls } from '@/components/properties-card/font-family-controls';
import StrokeVariantControls from '@/components/properties-card/stroke-variant-controls';
import ArrowHeadControls from '@/components/properties-card/arrow-head-controls';
import { ToolBasedCardProps } from '@/components/properties-card/interface';

export default function ToolBasedCard({
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
  selectedLeftArrowHead,
  setSelectedLeftArrowHead,
  selectedRightArrowHead,
  setSelectedRightArrowHead,
  selectedFontSize,
  setSelectedFontSize,
  selectedFontFamily,
  setSelectedFontFamily,
}: ToolBasedCardProps) {
  return (
    <Card className={'w-56 absolute left-4 transform -translate-y-1/2 top-1/2'}>
      <CardBody className={'px-4 flex flex-col gap-4'}>
        {selectedTool === Tools.Text ? (
          <ColorControls
            header={'Font Color'}
            type={'text'}
            selectedColor={selectedStrokeColor}
            setSelectedColor={setSelectedStrokeColor}
          />
        ) : (
          <ColorControls
            header={'Stroke Color'}
            type={'stroke'}
            selectedColor={selectedStrokeColor}
            setSelectedColor={setSelectedStrokeColor}
          />
        )}
        {(selectedTool === Tools.Polygon || selectedTool === Tools.Ellipse) && (
          <>
            <ColorControls
              header={'Fill Color'}
              type={'fill'}
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
        {selectedTool === Tools.Text ? (
          <SizeControls
            header={'Font Size'}
            max={100}
            min={15}
            size={'sm'}
            showSteps={false}
            selectedSize={selectedFontSize}
            setSelectedSize={setSelectedFontSize}
          />
        ) : (
          <SizeControls
            header={'Stroke Width'}
            max={10}
            min={1}
            size={'md'}
            showSteps={true}
            selectedSize={selectedStrokeWidth}
            setSelectedSize={setSelectedStrokeWidth}
          />
        )}
        {selectedTool === Tools.Text && (
          <FontFamilyControls
            selectedFontFamily={selectedFontFamily}
            setSelectedFontFamily={setSelectedFontFamily}
          />
        )}
        {selectedTool !== Tools.Text && (
          <StrokeVariantControls
            selectedStrokeVariant={selectedStrokeVariant}
            setSelectedStrokeVariant={setSelectedStrokeVariant}
          />
        )}
        {selectedTool === Tools.Arrow && (
          <ArrowHeadControls
            selectedLeftArrowHead={selectedLeftArrowHead}
            setSelectedLeftArrowHead={setSelectedLeftArrowHead}
            selectedRightArrowHead={selectedRightArrowHead}
            setSelectedRightArrowHead={setSelectedRightArrowHead}
          />
        )}
      </CardBody>
    </Card>
  );
}
