import { Slider } from '@nextui-org/slider';

interface StrokeWidthProps {
  selectedStrokeWidth: number;
  setSelectedStrokeWidth: (width: number) => void;
}

export default function StrokeWidthControl({
  selectedStrokeWidth,
  setSelectedStrokeWidth,
}: StrokeWidthProps) {
  const handleStrokeWidthChange = (width: number) => {
    setSelectedStrokeWidth(width);
  };
  return (
    <div className={'flex flex-col gap-2'}>
      <div className={'text-xs'}>Stroke Width</div>
      <Slider
        size="md"
        step={1}
        color="foreground"
        showSteps={true}
        maxValue={10}
        minValue={1}
        defaultValue={selectedStrokeWidth}
        onChange={(e) => handleStrokeWidthChange(e as number)}
        className="max-w-md"
        endContent={<div className={'text-xs font-semibold'}>{selectedStrokeWidth}</div>}
      />
    </div>
  );
}
