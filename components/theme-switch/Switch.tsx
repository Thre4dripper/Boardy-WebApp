import { Switch } from '@nextui-org/switch';
import { SunIcon } from '@/components/theme-switch/SunIcon';
import { MoonIcon } from '@/components/theme-switch/MoonIcon';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/enums/Theme';

export default function DarkSwitch() {
  const { setTheme } = useTheme();
  return (
    <Switch
      className={'absolute top-5 right-32'}
      size="lg"
      color="secondary"
      thumbIcon={({ isSelected, className }) =>
        isSelected ? <MoonIcon className={className} /> : <SunIcon className={className} />
      }
      onValueChange={(value) => {
        setTheme(value ? Theme.Dark : Theme.Light);
      }}
    />
  );
}
