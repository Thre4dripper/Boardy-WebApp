import { Button } from '@heroui/react';
import React from 'react';
import { Copy, Download } from 'lucide-react';
import { CanvasThemeColor, Theme } from '@/enums/Theme';
import { useTheme } from '@/providers/ThemeProvider';

interface ExportButtonsProps {
  canvasData: string | undefined;
  includeBackground: boolean;
}

export default function ExportButtons({ canvasData, includeBackground }: ExportButtonsProps) {
  const { theme } = useTheme();
  const handleDownload = () => {
    if (includeBackground) {
      const img = new Image();
      img.src = canvasData || '';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.fillStyle = theme === Theme.Dark ? CanvasThemeColor.Dark : CanvasThemeColor.Light;
        ctx?.fillRect(0, 0, canvas.width, canvas.height);
        ctx?.drawImage(img, 0, 0);

        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'canvas.png';
        a.click();
      };
    } else {
      const a = document.createElement('a');
      a.href = canvasData || '';
      a.download = 'canvas.png';
      a.click();
    }
  };

  const handleCopy = () => {
    if (!canvasData) return;

    const img = new Image();
    img.src = canvasData;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = img.width;
      canvas.height = img.height;
      if (includeBackground) {
        ctx.fillStyle = theme === Theme.Dark ? CanvasThemeColor.Dark : CanvasThemeColor.Light;
        ctx?.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx?.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          const item = new ClipboardItem({ 'image/png': blob });
          navigator.clipboard.write([item]);
        }
      });
    };
  };
  return (
    <div className={'flex flex-row gap-4 justify-between w-full'}>
      <Button variant={'outline'} size={'md'} className={'w-full'} onPress={handleDownload}>
        Download
        <Download className={'w-5 h-5'} />
      </Button>
      <Button variant={'outline'} size={'md'} className={'w-full'} onPress={handleCopy}>
        Copy
        <Copy className={'w-5 h-5'} />
      </Button>
    </div>
  );
}
