import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@nextui-org/button';
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/enums/Theme';
import Preview from '@/components/export/Preview';
import ExportOptions from '@/components/export/ExportOptions';
import ExportButtons from '@/components/export/ExportButtons';

interface ExportCardProps {
  getCanvasData: () => string | undefined;
}

export default function ExportCard({ getCanvasData }: ExportCardProps) {
  const { theme } = useTheme();
  const [canvasData, setCanvasData] = useState<string | undefined>(undefined);
  const [includeBackground, setIncludeBackground] = useState<boolean>(false);
  return (
    <Popover
      color={`${theme === Theme.Dark ? 'foreground' : 'default'}`}
      showArrow={true}
      placement={'top-end'}
      onOpenChange={(open) => {
        if (open) {
          setCanvasData(getCanvasData());
        }
      }}
    >
      <PopoverTrigger>
        <Button
          className={'absolute right-4 top-4'}
          color={'secondary'}
          endContent={<Image src={'/export.svg'} alt={'Share'} width={20} height={20} />}
        >
          Export
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className={'flex flex-col justify-between gap-4 px-2 py-1'}>
          <Preview canvasData={canvasData} includeBackground={includeBackground} />
          <ExportOptions
            includeBackground={includeBackground}
            setIncludeBackground={setIncludeBackground}
          />
          <ExportButtons canvasData={canvasData} includeBackground={includeBackground} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
