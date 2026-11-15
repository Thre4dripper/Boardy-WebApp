import { Theme } from '@/enums/Theme';
import { Switch } from '@heroui/react';
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
      <div className={`${theme === Theme.Dark ? 'text-white' : 'text-black'} text-base`}>
        Include Background
      </div>
      <Switch
        aria-label={'Include Background'}
        defaultSelected={includeBackground}
        onChange={(value) => setIncludeBackground(value)}
      >
        <Switch.Content>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch.Content>
      </Switch>
    </div>
  );
}
