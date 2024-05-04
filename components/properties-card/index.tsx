import { Card, CardBody } from '@nextui-org/card';
import StrokeColor from '@/components/properties-card/stroke-color';
import StrokeWidth from '@/components/properties-card/stroke-width';
import StrokeStyle from '@/components/properties-card/stroke-style';
import { ToolVariant } from '@/enums/Tools';

interface PropertiesCardProps {
  selectedTool: string;
  selectedStrokeColor: string;
  setSelectedStrokeColor: (color: string) => void;
  selectedStrokeWidth: number;
  setSelectedStrokeWidth: (width: number) => void;
  selectedStrokeVariant: ToolVariant;
  setSelectedStrokeVariant: (variant: ToolVariant) => void;
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
        <StrokeColor
          selectedStrokeColor={selectedStrokeColor}
          setSelectedStrokeColor={setSelectedStrokeColor}
        />
        <StrokeWidth
          selectedStrokeWidth={selectedStrokeWidth}
          setSelectedStrokeWidth={setSelectedStrokeWidth}
        />
        <StrokeStyle
          selectedStrokeVariant={selectedStrokeVariant}
          setSelectedStrokeVariant={setSelectedStrokeVariant}
        />
      </CardBody>
    </Card>
  );
}
