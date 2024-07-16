import { Slider } from '@nextui-org/slider';
import { useState } from 'react';

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
  const [value, setValue] = useState<number>(selectedSize);
  const handleSizeChange = (width: number) => {
    setSelectedSize(width);
  };
  return (
    <div className={'flex flex-col gap-2'}>
      <div className={'text-xs'}>{header}</div>
      <Slider
        size={size}
        step={1}
        color="secondary"
        showSteps={showSteps}
        maxValue={max}
        minValue={min}
        value={value}
        className="max-w-md"
        onChange={(e) => setValue(e as number)}
        onChangeEnd={(e) => handleSizeChange(e as number)}
        endContent={<div className={'text-xs font-semibold'}>{selectedSize}</div>}
      />
    </div>
  );
}
