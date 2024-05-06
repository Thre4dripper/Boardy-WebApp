import { Divider } from '@nextui-org/divider';
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover';
import { useState } from 'react';
import { FillColor, StrokeColor } from '@/enums/Colors';
import { Ban } from 'lucide-react';
import { ColorControl } from '@/components/properties-card/index';

interface StrokeColorProps {
  header: string;
  type: ColorControl;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
}

export default function ColorControls({
  header,
  type,
  selectedColor,
  setSelectedColor,
}: StrokeColorProps) {
  // states for stroke color
  const allStrokeColors = Object.values(StrokeColor);
  const [selectedStrokeShade, setSelectedStrokeShade] = useState<number>(3);
  const [baseStrokeColorIndex, setBaseStrokeColorIndex] = useState<number>(
    allStrokeColors.findIndex((color) => color === selectedColor)
  );

  // states for fill color
  const allFillColors = Object.values(FillColor);
  const [selectedFillShade, setSelectedFillShade] = useState<number>(1);
  const [baseFillColorIndex, setBaseFillColorIndex] = useState<number>(
    allFillColors.findIndex((color) => color === selectedColor)
  );

  const selectedIndex =
    type === 'stroke' || type === 'text' ? baseStrokeColorIndex : baseFillColorIndex - 1;

  const handleColorChange = (color: string) => {
    if (type === 'stroke' || type === 'text') {
      const opacity = (selectedStrokeShade + 1) * 0.25;
      setSelectedColor(color.replace(/[^,]+(?=\))/, opacity.toString()));

      const index = allStrokeColors.findIndex((c) => c === color);
      setBaseStrokeColorIndex(index);
    } else {
      //in case of transparent color, just set the color, as there is no shade
      if (color === FillColor.Transparent) {
        setSelectedColor(color);
        return;
      }
      const opacity = (selectedFillShade + 1) * 0.25;
      setSelectedColor(color.replace(/[^,]+(?=\))/, opacity.toString()));

      const index = allFillColors.findIndex((c) => c === color);
      setBaseFillColorIndex(index);
    }
  };

  const handleShadeChange = (shade: number) => {
    if (type === 'stroke' || type === 'text') {
      setSelectedStrokeShade(shade);
      const opacity = (shade + 1) * 0.25;

      setSelectedColor(selectedColor.replace(/[^,]+(?=\))/, opacity.toString()));
    } else {
      setSelectedFillShade(shade);
      const opacity = (shade + 1) * 0.25;

      setSelectedColor(selectedColor.replace(/[^,]+(?=\))/, opacity.toString()));
    }
  };

  return (
    <div className={'flex flex-col gap-2'}>
      <div className={'text-xs'}>{header}</div>
      <div className={'flex flex-row justify-center items-center'}>
        {/*Only for Fill Color, Transparent*/}
        {type === 'fill' && (
          <div
            className={'w-8 h-8 rounded-lg cursor-pointer flex justify-center items-center'}
            style={{
              border: selectedIndex === -1 ? `1.5px solid #272e3f` : 'none',
            }}
            onClick={handleColorChange.bind(null, FillColor.Transparent)}
          >
            <Ban />
          </div>
        )}
        {/*For Both*/}
        {Object.values(StrokeColor)
          .slice(0, type === 'stroke' || type === 'text' ? 6 : 5)
          .map((color, index) => (
            <div
              key={index}
              className={'w-8 h-8 rounded-lg cursor-pointer flex justify-center items-center'}
              style={{
                border: selectedIndex === index ? `1.5px solid #272e3f` : 'none',
              }}
              onClick={handleColorChange.bind(null, color)}
            >
              <div
                className={'w-6 h-6 rounded-lg'}
                style={{
                  backgroundColor: color,
                  opacity:
                    // separate logic for stroke and fill color
                    type === 'stroke' || type === 'text'
                      ? (selectedStrokeShade + 1) * 0.25
                      : (selectedFillShade + 1) * 0.25,
                }}
              />
            </div>
          ))}
        <div className={'flex-1'} />
        <Divider orientation={'vertical'} className={'h-8 mx-2'} />
        <div className={'flex-1'} />

        <Popover placement="right-end" showArrow={true}>
          <PopoverTrigger>
            <div className={'flex justify-center items-center'}>
              {/*Separate logic for stroke and fill color*/}
              {selectedColor === FillColor.Transparent ? (
                <Ban />
              ) : (
                <div
                  className={'w-8 h-8 rounded-lg cursor-pointer'}
                  style={{
                    backgroundColor:
                      // separate logic for stroke and fill color
                      type === 'stroke' || type === 'text'
                        ? allStrokeColors[baseStrokeColorIndex]
                        : allFillColors[baseFillColorIndex],
                    opacity:
                      type === 'stroke' || type === 'text'
                        ? (selectedStrokeShade + 1) * 0.25
                        : (selectedFillShade + 1) * 0.25,
                  }}
                />
              )}
            </div>
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
                        border: selectedIndex === index + 5 ? `1.5px solid #272e3f` : 'none',
                      }}
                      onClick={handleColorChange.bind(null, color)}
                    >
                      <div
                        className={'w-7 h-7 rounded-lg border-2 border-white'}
                        style={{
                          backgroundColor: color,
                          opacity:
                            // separate logic for stroke and fill color
                            type === 'stroke' || type === 'text'
                              ? (selectedStrokeShade + 1) * 0.25
                              : (selectedFillShade + 1) * 0.25,
                        }}
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
                      border:
                        // separate logic for stroke and fill color
                        type === 'stroke' || type === 'text'
                          ? index === selectedStrokeShade
                            ? `1.5px solid #272e3f`
                            : 'none'
                          : index === selectedFillShade
                            ? `1.5px solid #272e3f`
                            : 'none',
                    }}
                    onClick={handleShadeChange.bind(null, index)}
                  >
                    <div
                      className={'w-7 h-7 rounded-lg border-2 border-white'}
                      style={{
                        backgroundColor:
                          // separate logic for stroke and fill color
                          type === 'stroke' || type === 'text'
                            ? allStrokeColors[baseStrokeColorIndex]
                            : allFillColors[baseFillColorIndex],
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
