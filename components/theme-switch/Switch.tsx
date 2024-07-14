import { Switch } from '@nextui-org/switch';
import { SunIcon } from '@/components/theme-switch/SunIcon';
import { MoonIcon } from '@/components/theme-switch/MoonIcon';

export default function DarkSwitch() {
  return (
    <Switch
      className={'absolute top-5 right-32'}
      size="lg"
      color="secondary"
      thumbIcon={({ isSelected, className }) =>
        isSelected ? <MoonIcon className={className} /> : <SunIcon className={className} />
      }
    />
  );
}
