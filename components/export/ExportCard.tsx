import React, { useState } from 'react';
import Image from 'next/image';
import { Button, Popover } from '@heroui/react';
import Preview from '@/components/export/Preview';
import ExportOptions from '@/components/export/ExportOptions';
import ExportButtons from '@/components/export/ExportButtons';

interface ExportCardProps {
  getCanvasData: () => string | undefined;
}

export default function ExportCard({ getCanvasData }: ExportCardProps) {
  const [canvasData, setCanvasData] = useState<string | undefined>(undefined);
  const [includeBackground, setIncludeBackground] = useState<boolean>(false);
  return (
    <Popover
      onOpenChange={(open) => {
        if (open) {
          setCanvasData(getCanvasData());
        }
      }}
    >
      <Button className={'absolute right-4 top-4'} variant={'primary'}>
        Export
        <Image src={'/export.svg'} alt={''} width={20} height={20} />
      </Button>
      <Popover.Content placement={'bottom end'}>
        <Popover.Arrow />
        <Popover.Dialog aria-label={'Export'}>
          <div className={'flex flex-col justify-between gap-4 px-2 py-1'}>
            <Preview canvasData={canvasData} includeBackground={includeBackground} />
            <ExportOptions
              includeBackground={includeBackground}
              setIncludeBackground={setIncludeBackground}
            />
            <ExportButtons canvasData={canvasData} includeBackground={includeBackground} />
          </div>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}
