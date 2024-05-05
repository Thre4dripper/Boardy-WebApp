import { Divider } from '@nextui-org/divider';
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover';
import { useState } from 'react';
import { StrokeColor } from '@/enums/Colors';

interface StrokeColorProps {
  selectedStrokeColor: string;
  setSelectedStrokeColor: (color: string) => void;
}

export default function StrokeColorControl({
  selectedStrokeColor,
  setSelectedStrokeColor,
}: StrokeColorProps) {
  const allColors = Object.values(StrokeColor);
  const [selectedShade, setSelectedShade] = useState<number>(0);
  const [baseColorIndex, setBaseColorIndex] = useState<number>(
    allColors.findIndex((color) => color === selectedStrokeColor)
  );

  const handleStrokeColorChange = (color: string) => {
    setSelectedStrokeColor(color);

    const index = allColors.findIndex((c) => c === color);
    setBaseColorIndex(index);
  };

  const handleShadeChange = (shade: number) => {
    setSelectedShade(shade);
    const opacity = (shade + 1) * 0.25;

    setSelectedStrokeColor(selectedStrokeColor.replace(/[^,]+(?=\))/, opacity.toString()));
  };
  return (
    <div className={'flex flex-col gap-2'}>
      <div className={'text-xs'}>Stroke Color</div>
      <div className={'flex flex-row justify-center items-center'}>
        {Object.values(StrokeColor)
          .slice(0, 5)
          .map((color, index) => (
            <div
              key={index}
              className={'w-8 h-8 rounded-lg cursor-pointer flex justify-center items-center'}
              style={{
                border: selectedStrokeColor === color ? `1.5px solid #272e3f` : 'none',
              }}
              onClick={handleStrokeColorChange.bind(null, color)}
            >
              <div
                className={'w-6 h-6 rounded-lg'}
                style={{
                  backgroundColor: color,
                }}
              />
            </div>
          ))}
        <div className={'flex-1'} />
        <Divider orientation={'vertical'} className={'h-8 mx-2'} />
        <div className={'flex-1'} />

        <Popover placement="right-end" showArrow={true}>
          <PopoverTrigger>
            <div
              className={'w-8 h-8 rounded-lg cursor-pointer'}
              style={{ backgroundColor: selectedStrokeColor }}
            />
          </PopoverTrigger>
          <PopoverContent>
            <div className={'flex flex-col gap-2 p-2'}>
              <div className={'text-slate-700 text-xs font-semibold '}>Colors</div>
              <div className={'grid grid-cols-4 gap-2'}>
                {Object.values(StrokeColor)
                  .slice(5)
                  .map((color, index) => (
                    <div
                      key={index}
                      className={
                        'w-8 h-8 rounded-lg cursor-pointer flex justify-center items-center'
                      }
                      style={{
                        border: selectedStrokeColor === color ? `1.5px solid #272e3f` : 'none',
                      }}
                      onClick={handleStrokeColorChange.bind(null, color)}
                    >
                      <div
                        className={'w-7 h-7 rounded-lg border-2 border-white'}
                        style={{ backgroundColor: color }}
                      />
                    </div>
                  ))}
              </div>
              <Divider className={'my-2'} />
              <div className={'text-slate-700 text-xs font-semibold'}>Shades</div>
              <div className={'grid grid-cols-4 gap-1'}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className={'w-8 h-8 rounded-lg cursor-pointer flex justify-center items-center'}
                    style={{
                      border: selectedShade === index ? `1.5px solid #272e3f` : 'none',
                    }}
                    onClick={handleShadeChange.bind(null, index)}
                  >
                    <div
                      className={'w-7 h-7 rounded-lg border-2 border-white'}
                      style={{
                        backgroundColor: allColors[baseColorIndex],
                        opacity: (index + 1) * 0.25,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
