import { Button } from '@nextui-org/button';
import { BoxSelect, Maximize, Square } from 'lucide-react';
import { StrokeVariant } from '@/enums/StrokeVariant';

interface StrokeStyleProps {
  selectedStrokeVariant: StrokeVariant;
  setSelectedStrokeVariant: (variant: StrokeVariant) => void;
}

const variants = [
  {
    name: StrokeVariant.Solid,
    icon: <Square />,
  },
  {
    name: StrokeVariant.Dashed,
    icon: <Maximize />,
  },
  {
    name: StrokeVariant.Dotted,
    icon: <BoxSelect />,
  },
];
export default function StrokeVariantControls({
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
            onClick={setSelectedStrokeVariant.bind(null, variant.name as StrokeVariant)}
          >
            {variant.icon}
          </Button>
        ))}
      </div>
    </div>
  );
}
