import { Card, CardBody } from '@nextui-org/card';
import { Button } from '@nextui-org/button';
import { Redo2, Undo2 } from 'lucide-react';
import { Tooltip } from '@nextui-org/tooltip';

export default function UndoRedoCard() {
  return (
    <Card className={'absolute bottom-4 transform left-4'}>
      <CardBody className={'flex flex-row gap-2 py-1 px-2'}>
        <Tooltip content={'Undo'} placement={'top'} color={'secondary'} delay={0} closeDelay={0}>
          <Button
            isIconOnly
            size="sm"
            className={'cursor-pointer p-2'}
            variant={'light'}
            color={'secondary'}
            onClick={() => {}}
          >
            <Undo2 />
          </Button>
        </Tooltip>
        <Tooltip content={'Redo'} placement={'top'} color={'secondary'} delay={0} closeDelay={0}>
          <Button
            isIconOnly
            size="sm"
            className={'cursor-pointer p-2'}
            variant={'light'}
            color={'secondary'}
            onClick={() => {}}
          >
            <Redo2 />
          </Button>
        </Tooltip>
      </CardBody>
    </Card>
  );
}
