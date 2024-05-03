import { Card, CardBody } from '@nextui-org/card';
import { Baseline, Circle, Diamond, Minus, MoveRight, PenTool, Square } from 'lucide-react';
import { Button } from '@nextui-org/button';
import { Tools } from '@/enums/Tools';
import { Badge } from '@nextui-org/badge';

const ToolsArray = [
  {
    name: Tools.Pen,
    icon: <PenTool />,
  },
  {
    name: Tools.Line,
    icon: <Minus />,
  },
  {
    name: Tools.Rectangle,
    icon: <Square />,
  },
  {
    name: Tools.Diamond,
    icon: <Diamond />,
  },
  {
    name: Tools.Circle,
    icon: <Circle />,
  },
  {
    name: Tools.Arrow,
    icon: <MoveRight />,
  },
  {
    name: Tools.Text,
    icon: <Baseline />,
  },
];

interface ToolsProps {
  onToolSelect: (tool: Tools) => void;
  selectedTool: Tools;
}

export default function ToolsCard({ onToolSelect, selectedTool }: ToolsProps) {
  return (
    <Card className={'absolute bottom-4 transform -translate-x-1/2 left-1/2'}>
      <CardBody className={'px-4 pb-4 flex flex-row gap-6'}>
        {ToolsArray.map((tool, index) => (
          <Badge
            key={index}
            color="secondary"
            content={index}
            size={'sm'}
            isOneChar
            placement={'bottom-right'}
            variant={'faded'}
          >
            <Button
              isIconOnly
              size="sm"
              className={'cursor-pointer p-2'}
              variant={selectedTool === tool.name ? 'solid' : 'light'}
              color={selectedTool === tool.name ? 'secondary' : 'default'}
              onClick={() => onToolSelect(tool.name)}
            >
              {tool.icon}
            </Button>
          </Badge>
        ))}
      </CardBody>
    </Card>
  );
}
