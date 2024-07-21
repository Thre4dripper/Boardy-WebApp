import { Theme } from '@/enums/Theme';
import React from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import NextImage from 'next/image';

interface PreviewProps {
  canvasData: string | undefined;
  includeBackground: boolean;
}

export default function Preview({ canvasData }: PreviewProps) {
  const { theme } = useTheme();

  return (
    <>
      <div className={`${theme === Theme.Dark ? 'text-white' : 'text-black'} text-medium`}>
        Preview
      </div>
      {canvasData && <NextImage src={canvasData} alt={''} width={300} height={300} />}
    </>
  );
}
