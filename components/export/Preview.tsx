import { CanvasThemeColor, Theme } from '@/enums/Theme';
import React, { useEffect } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import NextImage from 'next/image';

interface PreviewProps {
  canvasData: string | undefined;
  includeBackground: boolean;
}

export default function Preview({ canvasData, includeBackground }: PreviewProps) {
  const { theme } = useTheme();
  const [preview, setPreview] = React.useState<string | undefined>(canvasData);
  const imageRef = React.useRef<HTMLImageElement>(null);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.src = canvasData || '';
    if (!includeBackground) {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = img.width;
        const height = img.height;

        const size = 100;
        const rows = height / size;
        const cols = width / size;

        const color1 = theme === Theme.Dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(45,51,59,0.1)';
        const color2 = theme === Theme.Dark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(45,51,59, 0.2)';

        //draw checkerboard
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            ctx.fillStyle = (i + j) % 2 === 0 ? color1 : color2;
            ctx.fillRect(j * size, i * size, size, size);
          }
        }

        // Draw canvas data on top
        ctx.drawImage(img, 0, 0, img.width, img.height);
        setPreview(canvas.toDataURL());
      };
    } else {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = img.width;
        const height = img.height;

        ctx.fillStyle = theme === Theme.Dark ? CanvasThemeColor.Dark : CanvasThemeColor.Light;
        ctx.fillRect(0, 0, width, height);

        // Draw canvas data on top
        ctx.drawImage(img, 0, 0, img.width, img.height);
        setPreview(canvas.toDataURL());
      };
    }
  }, [canvasData, includeBackground, theme]);

  return (
    <div className={'flex flex-col gap-2'}>
      <div className={`${theme === Theme.Dark ? 'text-white' : 'text-black'} text-medium`}>
        Preview
      </div>
      {preview && <NextImage src={preview} alt={''} width={300} height={300} ref={imageRef} className={'rounded-lg'}/>}
    </div>
  );
}
