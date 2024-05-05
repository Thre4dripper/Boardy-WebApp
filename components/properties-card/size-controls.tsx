import { Slider } from '@nextui-org/slider';

interface SizeControlsProps {
  header: string;
  max: number;
  min: number;
  size: 'sm' | 'md';
  showSteps: boolean;
  selectedSize: number;
  setSelectedSize: (size: number) => void;
}

export default function SizeControls({
  header,
  max,
  min,
  size,
  showSteps,
  selectedSize,
  setSelectedSize,
}: SizeControlsProps) {
  const handleSizeChange = (width: number) => {
    setSelectedSize(width);
  };
  return (
    <div className={'flex flex-col gap-2'}>
      <div className={'text-xs'}>{header}</div>
      <Slider
        size={size}
        step={1}
        color="foreground"
        showSteps={showSteps}
        maxValue={max}
        minValue={min}
        value={selectedSize}
        onChange={(e) => handleSizeChange(e as number)}
        className="max-w-md"
        endContent={<div className={'text-xs font-semibold'}>{selectedSize}</div>}
      />
    </div>
  );
}
