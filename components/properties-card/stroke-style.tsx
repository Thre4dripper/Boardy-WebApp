import { ToolVariant } from '@/enums/Tools';
import { Button } from '@nextui-org/button';
import { BoxSelect, Maximize, Square } from 'lucide-react';

interface StrokeStyleProps {
  selectedStrokeVariant: ToolVariant;
  setSelectedStrokeVariant: (variant: ToolVariant) => void;
}

const variants = [
  {
    name: ToolVariant.Solid,
    icon: <Square />,
  },
  {
    name: ToolVariant.Dashed,
    icon: <Maximize />,
  },
  {
    name: ToolVariant.Dotted,
    icon: <BoxSelect />,
  },
];
export default function StrokeStyle({
  selectedStrokeVariant,
  setSelectedStrokeVariant,
}: StrokeStyleProps) {
  return (
    <div className={'flex flex-col gap-2'}>
      <div className={'text-xs'}>Stroke Variant</div>
      <div className={'flex flex-row gap-2'}>
        {variants.map((variant, index) => (
          <Button
            key={index}
            size={'sm'}
            isIconOnly
            variant={selectedStrokeVariant === variant.name ? 'solid' : 'light'}
            color={selectedStrokeVariant === variant.name ? 'secondary' : 'default'}
            onClick={setSelectedStrokeVariant.bind(null, variant.name as ToolVariant)}
          >
            {variant.icon}
          </Button>
        ))}
      </div>
    </div>
  );
}
