import { ArrowHeads } from '@/enums/ArrowHeads';
import { Minus, MoveRight, Play } from 'lucide-react';
import { Button } from '@nextui-org/button';

const arrowHeads = [
  {
    name: ArrowHeads.Line,
    icon: <Minus />,
  },
  {
    name: ArrowHeads.Arrow,
    icon: <MoveRight />,
  },
  {
    name: ArrowHeads.Triangle,
    icon: <Play />,
  },
];

interface ArrowHeadControlsProps {
  selectedLeftArrowHead: string;
  setSelectedLeftArrowHead: (arrowHead: string) => void;
  selectedRightArrowHead: string;
  setSelectedRightArrowHead: (arrowHead: string) => void;
}

export default function ArrowHeadControls({
  selectedLeftArrowHead,
  setSelectedLeftArrowHead,
  selectedRightArrowHead,
  setSelectedRightArrowHead,
}: ArrowHeadControlsProps) {
  return (
    <div className={'flex flex-row gap-2 justify-between'}>
      <div className={'flex flex-col gap-2 justify-start'}>
        <div className={'text-xs'}>Left Arrow Head</div>
        <div className={'flex flex-row gap-2'}>
          {arrowHeads.toReversed().map((arrowHead, index) => (
            <Button
              key={index}
              size={'sm'}
              isIconOnly
              className={'cursor-pointer p-2'}
              style={{
                transform: 'rotate(180deg)',
              }}
              variant={selectedLeftArrowHead === arrowHead.name ? 'solid' : 'light'}
              color={selectedLeftArrowHead === arrowHead.name ? 'secondary' : 'default'}
              onClick={setSelectedLeftArrowHead.bind(null, arrowHead.name)}
            >
              {arrowHead.icon}
            </Button>
          ))}
        </div>
      </div>
      <div className={'flex flex-col gap-2 justify-end'}>
        <div className={'text-xs text-end'}>Right Arrow Head</div>
        <div className={'flex flex-row gap-2'}>
          {arrowHeads.map((arrowHead, index) => (
            <Button
              key={index}
              size={'sm'}
              isIconOnly
              className={'cursor-pointer p-2'}
              variant={selectedRightArrowHead === arrowHead.name ? 'solid' : 'light'}
              color={selectedRightArrowHead === arrowHead.name ? 'secondary' : 'default'}
              onClick={setSelectedRightArrowHead.bind(null, arrowHead.name)}
            >
              {arrowHead.icon}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
