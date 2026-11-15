import ToolBasedCard from '@/components/properties-card/tool-based-card';
import { PropertiesCardProps } from '@/components/properties-card/interface';
import { Tools } from '@/enums/Tools';
import ShapeBasedCard from '@/components/properties-card/shape-based-card';
import { Button, Popover } from '@heroui/react';
import { Palette } from 'lucide-react';

export type ColorControl = 'stroke' | 'fill' | 'text';
export default function PropertiesCard({
  selectedTool,
  selectedShapeType,
  ...rest
}: PropertiesCardProps) {
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
    <Popover>
      <Button
        isIconOnly
        size="sm"
        className={'cursor-pointer p-2'}
        variant={'primary'}
        aria-label={'Properties'}
      >
        <Palette />
      </Button>
      <Popover.Content placement={'right'}>
        <Popover.Arrow />
        <Popover.Dialog aria-label={'Properties'}>{desktopToolCards}</Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
  return (
    <>
      <div className={'hidden md:block'}>{desktopToolCards}</div>
      <div className={'absolute transform -translate-y-1/2 top-1/2 left-4 sm:hidden'}>
        {mobileToolCards}
      </div>
    </>
  );
}
