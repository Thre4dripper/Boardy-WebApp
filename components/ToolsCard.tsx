import { Badge, Button, Card, Tooltip } from '@heroui/react';
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
import { Tools } from '@/enums/Tools';

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
    <Card
      className={
        'absolute bottom-4 right-4 sm:right-auto sm:transform sm:-translate-x-1/2 sm:left-1/2 p-0 rounded-2xl'
      }
    >
      <Card.Content className={'px-4 pt-3 pb-4 grid grid-cols-3 md:grid-cols-9 gap-x-6'}>
        {ToolsArray.map((tool, index) => (
          <Badge.Anchor key={index}>
            <Tooltip delay={0} closeDelay={0}>
              <Button
                isIconOnly
                size="sm"
                className={'cursor-pointer p-2'}
                variant={selectedTool === tool.name ? 'primary' : 'ghost'}
                aria-label={tool.name}
                onPress={() => onToolSelect(tool.name)}
              >
                {tool.icon}
              </Button>
              <Tooltip.Content placement={'top'}>{tool.name}</Tooltip.Content>
            </Tooltip>
            <Badge
              color={'accent'}
              size={'sm'}
              placement={'bottom-right'}
              variant={'secondary'}
              className={'[transform:translate(45%,45%)]'}
            >
              {index + 1}
            </Badge>
          </Badge.Anchor>
        ))}
      </Card.Content>
    </Card>
  );
}
