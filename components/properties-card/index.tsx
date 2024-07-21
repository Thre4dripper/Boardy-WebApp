import ToolBasedCard from '@/components/properties-card/tool-based-card';
import { PropertiesCardProps } from '@/components/properties-card/interface';
import { Tools } from '@/enums/Tools';
import ShapeBasedCard from '@/components/properties-card/shape-based-card';
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover';
import { Button } from '@nextui-org/button';
import { Palette } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/enums/Theme';

export type ColorControl = 'stroke' | 'fill' | 'text';
export default function PropertiesCard({
  selectedTool,
  selectedShapeType,
  ...rest
}: PropertiesCardProps) {
  const { theme } = useTheme();
  const desktopToolCards = (
    <>
      {selectedTool !== Tools.Select ? (
        <ToolBasedCard selectedTool={selectedTool} {...rest} />
      ) : (
        <ShapeBasedCard selectedShapeType={selectedShapeType} {...rest} />
      )}
    </>
  );

  const mobileToolCards = (
    <Popover
      showArrow={true}
      placement={'right'}
      color={`${theme === Theme.Dark ? 'foreground' : 'default'}`}
    >
      <PopoverTrigger>
        <Button
          isIconOnly
          size="sm"
          className={'cursor-pointer p-2'}
          variant={'solid'}
          color={'secondary'}
        >
          <Palette />
        </Button>
      </PopoverTrigger>
      <PopoverContent>{desktopToolCards}</PopoverContent>
    </Popover>
  );
  return (
    <>
      <div className={'hidden md:block'}>{desktopToolCards}</div>
      <div className={'absolute transform -translate-y-1/2 top-1/2 left-4 sm:hidden'}>{mobileToolCards}</div>
    </>
  );
}
