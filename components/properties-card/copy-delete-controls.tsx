import { Button } from '@nextui-org/button';
import { Copy, Trash } from 'lucide-react';

export default function CopyDeleteControls() {
  return (
    <div className={'flex flex-col gap-2'}>
      <div className={'text-xs'}>Actions</div>
      <div className={'flex flex-row gap-2'}>
        <Button
          size={'sm'}
          isIconOnly
          className={'cursor-pointer p-1.5'}
          variant={'light'}
          color={'secondary'}
        >
          <Copy />
        </Button>
        <Button
          size={'sm'}
          isIconOnly
          className={'cursor-pointer p-1.5'}
          variant={'light'}
          color={'secondary'}
        >
          <Trash />
        </Button>
      </div>
    </div>
  );
}
