import { Switch, Tooltip } from '@heroui/react';
import { SunIcon } from '@/components/theme-switch/SunIcon';
import { MoonIcon } from '@/components/theme-switch/MoonIcon';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/enums/Theme';

export default function DarkSwitch() {
  const { theme, setTheme } = useTheme();
  return (
    <Tooltip delay={0} closeDelay={0}>
      <Tooltip.Trigger className={'absolute top-16 right-2 sm:top-5 sm:right-32'} tabIndex={-1}>
        <Switch
          size="lg"
          aria-label={'Toggle Theme'}
          isSelected={theme === Theme.Dark}
          onChange={(value) => {
            setTheme(value ? Theme.Dark : Theme.Light);
            localStorage.setItem('theme', value ? Theme.Dark : Theme.Light);
          }}
        >
          {({ isSelected }) => (
            <Switch.Content>
              <Switch.Control>
                <Switch.Thumb>
                  <Switch.Icon>
                    {isSelected ? (
                      <MoonIcon className={'size-3'} />
                    ) : (
                      <SunIcon className={'size-3'} />
                    )}
                  </Switch.Icon>
                </Switch.Thumb>
              </Switch.Control>
            </Switch.Content>
          )}
        </Switch>
      </Tooltip.Trigger>
      <Tooltip.Content placement={'bottom'}>Toggle Theme</Tooltip.Content>
    </Tooltip>
  );
}
