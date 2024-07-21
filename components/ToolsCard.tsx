import { Card, CardBody } from '@nextui-org/card';
import {
  Baseline,
  Circle,
  Eraser,
  ImageIcon,
  Minus,
  MousePointer,
  MoveRight,
  PenTool,
  Shapes,
} from 'lucide-react';
import { Button } from '@nextui-org/button';
import { Tools } from '@/enums/Tools';
import { Badge } from '@nextui-org/badge';
import { Tooltip } from '@nextui-org/tooltip';

const ToolsArray = [
  {
    name: Tools.Select,
    icon: <MousePointer />,
  },
  {
    name: Tools.Pen,
    icon: <PenTool />,
  },
  {
    name: Tools.Line,
    icon: <Minus />,
  },
  {
    name: Tools.Polygon,
    icon: <Shapes />,
  },
  {
    name: Tools.Ellipse,
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
  {
    name: Tools.Image,
    icon: <ImageIcon />,
  },
  {
    name: Tools.Eraser,
    icon: <Eraser />,
  },
];

interface ToolsProps {
  onToolSelect: (tool: Tools) => void;
  selectedTool: Tools;
}

export default function ToolsCard({ onToolSelect, selectedTool }: ToolsProps) {
  return (
    <Card className={'absolute bottom-4 right-4 sm:right-auto sm:transform sm:-translate-x-1/2 sm:left-1/2'}>
      <CardBody className={'px-4 pb-4 grid grid-cols-3 md:grid-cols-9 gap-x-6'}>
        {ToolsArray.map((tool, index) => (
          <Badge
            key={index}
            color="secondary"
            content={index + 1}
            size={'sm'}
            isOneChar
            placement={'bottom-right'}
            variant={'faded'}
          >
            <Tooltip
              content={tool.name}
              placement={'top'}
              color={'secondary'}
              delay={0}
              closeDelay={0}
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
            </Tooltip>
          </Badge>
        ))}
      </CardBody>
    </Card>
  );
}
