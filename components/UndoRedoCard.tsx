import { Button, Card, Kbd, Tooltip } from '@heroui/react';
import { Redo2, Undo2 } from 'lucide-react';

export default function UndoRedoCard() {
  const handleUndo = () => {
    //fire keydown event for undo
    const event = new KeyboardEvent('keydown', {
      key: 'z',
      ctrlKey: true,
    });
    document.dispatchEvent(event);
  };
  const handleRedo = () => {
    //fire keydown event for redo
    const event = new KeyboardEvent('keydown', {
      key: 'y',
      ctrlKey: true,
    });
    document.dispatchEvent(event);
  };

  return (
    <Card className={'absolute bottom-4 transform left-4 p-0 rounded-2xl'}>
      <Card.Content className={'flex flex-row gap-2 py-1 px-2'}>
        <Tooltip delay={0} closeDelay={0}>
          <Button
            isIconOnly
            size="sm"
            className={'cursor-pointer p-2'}
            variant={'ghost'}
            aria-label={'Undo'}
            onPress={handleUndo}
          >
            <Undo2 />
          </Button>
          <Tooltip.Content placement={'top'}>
            <div className={'flex flex-row gap-2 justify-center items-center'}>
              <p>Undo</p>
              <Kbd className={'text-xs'}>
                <Kbd.Abbr keyValue={'ctrl'} />
                <Kbd.Content>Z</Kbd.Content>
              </Kbd>
            </div>
          </Tooltip.Content>
        </Tooltip>
        <Tooltip delay={0} closeDelay={0}>
          <Button
            isIconOnly
            size="sm"
            className={'cursor-pointer p-2'}
            variant={'ghost'}
            aria-label={'Redo'}
            onPress={handleRedo}
          >
            <Redo2 />
          </Button>
          <Tooltip.Content placement={'top'}>
            <div className={'flex flex-row gap-2 justify-center items-center'}>
              <p>Redo</p>
              <Kbd className={'text-xs'}>
                <Kbd.Abbr keyValue={'ctrl'} />
                <Kbd.Content>Y</Kbd.Content>
              </Kbd>
            </div>
          </Tooltip.Content>
        </Tooltip>
      </Card.Content>
    </Card>
  );
}
