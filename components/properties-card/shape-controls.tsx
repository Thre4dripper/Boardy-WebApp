import { Hexagon, Octagon, Pentagon, Square, Triangle } from 'lucide-react';
import { Button } from '@nextui-org/button';
import { Slider } from '@nextui-org/slider';

const shapesArray = [
  {
    sides: 3,
    icon: <Triangle />,
  },
  {
    sides: 4,
    icon: <Square />,
  },
  {
    sides: 5,
    icon: <Pentagon />,
  },
  {
    sides: 6,
    icon: <Hexagon />,
  },
  {
    sides: 8,
    icon: <Octagon />,
  },
];

interface ShapeControlsProps {
  selectedShapeSides: number;
  setSelectedShapeSides: (sides: number) => void;
  selectedShapeRotation: number;
  setSelectedShapeRotation: (rotation: number) => void;
}

export default function ShapeControls({
  selectedShapeSides,
  setSelectedShapeSides,
  selectedShapeRotation,
  setSelectedShapeRotation,
}: ShapeControlsProps) {
  const baseAngle = ((selectedShapeSides - 2) * 180) / selectedShapeSides / 2;
  return (
    <div className={'flex flex-col gap-2'}>
      <div className={'text-xs'}>Shapes</div>
      <div className={'flex-1 flex flex-row justify-between'}>
        {shapesArray.map((shape, index) => (
          <Button
            isIconOnly
            key={index}
            size="md"
            className={'cursor-pointer p-2'}
            variant={selectedShapeSides === shape.sides ? 'solid' : 'light'}
            color={selectedShapeSides === shape.sides ? 'secondary' : 'default'}
            onClick={() => {
              setSelectedShapeSides(shape.sides);
              setSelectedShapeRotation(
                selectedShapeRotation - baseAngle + ((shape.sides - 2) * 180) / shape.sides / 2
              );
            }}
          >
            <div
              style={{
                transform: `rotate(${selectedShapeRotation - baseAngle}deg)`,
              }}
            >
              {shape.icon}
            </div>
          </Button>
        ))}
      </div>
      <div className={'text-xs'}>Rotation</div>

      <Slider
        size="sm"
        color="foreground"
        step={3}
        maxValue={360}
        minValue={0}
        defaultValue={selectedShapeRotation - baseAngle}
        onChange={(e) => setSelectedShapeRotation((e as number) + baseAngle)}
        className="max-w-md"
        endContent={
          <div className={'text-xs font-semibold'}>{selectedShapeRotation - baseAngle}</div>
        }
      />
    </div>
  );
}
