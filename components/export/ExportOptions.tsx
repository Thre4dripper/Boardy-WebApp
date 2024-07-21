import { Theme } from '@/enums/Theme';
import { Switch } from '@nextui-org/switch';
import React from 'react';
import { useTheme } from '@/providers/ThemeProvider';

interface ExportOptionsProps {
  includeBackground: boolean;
  setIncludeBackground: (value: boolean) => void;
}

export default function ExportOptions({
  includeBackground,
  setIncludeBackground,
}: ExportOptionsProps) {
  const { theme } = useTheme();
  return (
    <div className={'flex flex-row gap-2 justify-between w-full'}>
      <div className={`${theme === Theme.Dark ? 'text-white' : 'text-black'} text-medium`}>
        Include Background
      </div>
      <Switch
        classNames={{
          wrapper: `${theme === Theme.Dark ? 'bg-gray-700' : 'bg-gray-200'}`,
        }}
        color={'secondary'}
        defaultSelected={includeBackground}
        onValueChange={(value) => setIncludeBackground(value)}
      />
    </div>
  );
}
