import { Button } from '@nextui-org/button';
import { Copy, Trash } from 'lucide-react';

export default function CopyDeleteControls() {
  const handleCopy = () => {
    //fire keydown event for copy
    const event = new KeyboardEvent('keydown', {
      key: 'c',
      ctrlKey: true,
    });
    document.dispatchEvent(event);
  };

  const handleDelete = () => {
    //fire keydown event for delete
    const event = new KeyboardEvent('keydown', {
      key: 'Delete',
    });
    document.dispatchEvent(event);
  };
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
          onClick={handleCopy}
        >
          <Copy />
        </Button>
        <Button
          size={'sm'}
          isIconOnly
          className={'cursor-pointer p-1.5'}
          variant={'light'}
          color={'secondary'}
          onClick={handleDelete}
        >
          <Trash />
        </Button>
      </div>
    </div>
  );
}
