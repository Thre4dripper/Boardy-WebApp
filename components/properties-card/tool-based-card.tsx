import { Card } from '@heroui/react';
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
    <Card className={'w-64 absolute left-4 transform -translate-y-1/2 top-1/2 p-0 rounded-2xl'}>
      <Card.Content className={'px-4 py-3 flex flex-col gap-4'}>
        {selectedTool === Tools.Text ? (
          <ColorControls
            header={'Font Color'}
            type={'text'}
            selectedColor={selectedStrokeColor}
            setSelectedColor={(color, _) => setSelectedStrokeColor(color)}
          />
        ) : (
          <ColorControls
            header={'Stroke Color'}
            type={'stroke'}
            selectedColor={selectedStrokeColor}
            setSelectedColor={(color, _) => setSelectedStrokeColor(color)}
          />
        )}
        {(selectedTool === Tools.Polygon || selectedTool === Tools.Ellipse) && (
          <>
            <ColorControls
              header={'Fill Color'}
              type={'fill'}
              selectedColor={selectedFillColor}
              setSelectedColor={(color, _) => setSelectedFillColor(color)}
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
            showSteps={false}
            selectedSize={selectedFontSize}
            setSelectedSize={setSelectedFontSize}
          />
        ) : (
          <SizeControls
            header={'Stroke Width'}
            max={10}
            min={1}
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
      </Card.Content>
    </Card>
  );
}
