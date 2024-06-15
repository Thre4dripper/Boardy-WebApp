import { Card, CardBody } from '@nextui-org/card';
import { Button } from '@nextui-org/button';
import { Redo2, Undo2 } from 'lucide-react';
import { Tooltip } from '@nextui-org/tooltip';
import { Kbd } from '@nextui-org/kbd';

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
    <Card className={'absolute bottom-4 transform left-4'}>
      <CardBody className={'flex flex-row gap-2 py-1 px-2'}>
        <Tooltip
          content={
            <div className={'flex flex-row gap-2 justify-center items-center'}>
              <p>Undo</p>
              <Kbd keys={['ctrl']} className={'text-xs'}>Z</Kbd>
            </div>
          }
          placement={'top'}
          color={'secondary'}
          delay={0}
          closeDelay={0}
        >
          <Button
            isIconOnly
            size="sm"
            className={'cursor-pointer p-2'}
            variant={'light'}
            color={'secondary'}
            onClick={handleUndo}
          >
            <Undo2 />
          </Button>
        </Tooltip>
        <Tooltip content={
          <div className={'flex flex-row gap-2 justify-center items-center'}>
            <p>Redo</p>
            <Kbd keys={['ctrl']} className={'text-xs'}>Y</Kbd>
          </div>
        } placement={'top'} color={'secondary'} delay={0} closeDelay={0}>
          <Button
            isIconOnly
            size="sm"
            className={'cursor-pointer p-2'}
            variant={'light'}
            color={'secondary'}
            onClick={handleRedo}
          >
            <Redo2 />
          </Button>
        </Tooltip>
      </CardBody>
    </Card>
  );
}
