import { Button } from '@nextui-org/button';
import React from 'react';
import { Fonts } from '@/enums/Fonts';

interface FontFamilyControlsProps {
  selectedFontFamily: string;
  setSelectedFontFamily: (font: string) => void;
}

export function FontFamilyControls({
  selectedFontFamily,
  setSelectedFontFamily,
}: FontFamilyControlsProps) {
  return (
    <div className={'flex flex-col gap-4'}>
      <div className={'text-xs'}>Font Family</div>
      <div className={'grid grid-cols-2 gap-x-2 gap-y-4 justify-center items-center'}>
        {Object.values(Fonts).map((font) => (
          <Button
            key={font}
            size={'sm'}
            style={{ fontFamily: font }}
            variant={selectedFontFamily === font ? 'solid' : 'bordered'}
            color={selectedFontFamily === font ? 'secondary' : 'default'}
            onClick={() => setSelectedFontFamily(font)}
          >
            {font}
          </Button>
        ))}
      </div>
    </div>
  );
}
