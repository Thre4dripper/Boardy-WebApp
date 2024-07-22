import { Switch } from '@nextui-org/switch';
import { SunIcon } from '@/components/theme-switch/SunIcon';
import { MoonIcon } from '@/components/theme-switch/MoonIcon';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/enums/Theme';
import { Tooltip } from '@nextui-org/tooltip';

export default function DarkSwitch() {
  const { theme, setTheme } = useTheme();
  return (
    <Tooltip
      content={
        <div className={'flex flex-row gap-2 justify-center items-center'}>
          <p>Toggle Theme</p>
        </div>
      }
      placement={'bottom'}
      color={'secondary'}
      delay={0}
      closeDelay={0}
    >
      <Switch
        className={'absolute top-16 right-2 sm:top-5 sm:right-32'}
        size="lg"
        color="secondary"
        isSelected={theme === Theme.Dark}
        thumbIcon={({ isSelected, className }) =>
          isSelected ? <MoonIcon className={className} /> : <SunIcon className={className} />
        }
        onValueChange={(value) => {
          setTheme(value ? Theme.Dark : Theme.Light);
          localStorage.setItem('theme', value ? Theme.Dark : Theme.Light);
        }}
      />
    </Tooltip>
  );
}
