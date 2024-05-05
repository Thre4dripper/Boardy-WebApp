import { Card, CardBody } from '@nextui-org/card';
import StrokeColorControl from '@/components/properties-card/stroke-color-control';
import StrokeWidthControl from '@/components/properties-card/stroke-width-control';
import StrokeVariantControl from '@/components/properties-card/stroke-variant-control';
import { StrokeVariant } from '@/enums/StrokeVariant';

interface PropertiesCardProps {
  selectedTool: string;
  selectedStrokeColor: string;
  setSelectedStrokeColor: (color: string) => void;
  selectedStrokeWidth: number;
  setSelectedStrokeWidth: (width: number) => void;
  selectedStrokeVariant: StrokeVariant;
  setSelectedStrokeVariant: (variant: StrokeVariant) => void;
}

export default function PropertiesCard({
  selectedTool,
  selectedStrokeColor,
  setSelectedStrokeColor,
  selectedStrokeWidth,
  setSelectedStrokeWidth,
  selectedStrokeVariant,
  setSelectedStrokeVariant,
}: PropertiesCardProps) {
  return (
    <Card className={'w-64 absolute left-4 transform -translate-y-1/2 top-1/2'}>
      <CardBody className={'px-4 flex flex-col gap-4'}>
        <StrokeColorControl
          selectedStrokeColor={selectedStrokeColor}
          setSelectedStrokeColor={setSelectedStrokeColor}
        />
        <StrokeWidthControl
          selectedStrokeWidth={selectedStrokeWidth}
          setSelectedStrokeWidth={setSelectedStrokeWidth}
        />
        <StrokeVariantControl
          selectedStrokeVariant={selectedStrokeVariant}
          setSelectedStrokeVariant={setSelectedStrokeVariant}
        />
      </CardBody>
    </Card>
  );
}
