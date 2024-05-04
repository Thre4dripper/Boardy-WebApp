import { Card, CardBody } from '@nextui-org/card';
import { ToolColor } from '@/enums/Tools';
import { Divider } from '@nextui-org/divider';

interface PropertiesCardProps {
  selectedTool: string;
  selectedStrokeColor: string;
  setSelectedStrokeColor: (color: string) => void;
  selectedStrokeWidth: number;
  setSelectedStrokeWidth: (width: number) => void;
  selectedStrokeVariant: string;
  setSelectedStrokeVariant: (variant: string) => void;
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
    <Card className={'w-52 absolute left-4 transform -translate-y-1/2 top-1/2'}>
      <CardBody className={'px-4 flex flex-col gap-4'}>
        <div className={'flex flex-col gap-2'}>
          <div className={'text-xs font-semibold'}>Stroke</div>
          <div className={'flex flex-row gap-2'}>
            {Object.values(ToolColor).map((color, index) => (
              <div
                key={index}
                className={'w-6 h-6 rounded-lg cursor-pointer'}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedStrokeColor(color)}
              />
            ))}
            <Divider orientation={'vertical'} />
            <div
              className={'w-8 h-8 rounded-lg cursor-pointer'}
              style={{ backgroundColor: selectedStrokeColor }}
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
