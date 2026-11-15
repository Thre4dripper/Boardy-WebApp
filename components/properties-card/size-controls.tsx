import { Slider } from '@heroui/react';
import { useState } from 'react';

interface SizeControlsProps {
  header: string;
  max: number;
  min: number;
  showSteps: boolean;
  selectedSize: number;
  setSelectedSize: (size: number) => void;
}

export default function SizeControls({
  header,
  max,
  min,
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
        aria-label={header}
        step={1}
        maxValue={max}
        minValue={min}
        value={value}
        className="max-w-md"
        onChange={(e) => setValue(e as number)}
        onChangeEnd={(e) => handleSizeChange(e as number)}
      >
        <Slider.Output className={'text-xs font-semibold'} />
        <Slider.Track>
          {showSteps && <Slider.Steps />}
          <Slider.Fill />
          <Slider.Thumb />
        </Slider.Track>
      </Slider>
    </div>
  );
}
