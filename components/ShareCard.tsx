import Image from 'next/image';
import { Button } from '@nextui-org/button';

export default function ShareCard() {
  return (
    <Button
      className={'absolute right-4 top-4'}
      color={'secondary'}
      endContent={<Image src={'/share.svg'} alt={'Share'} width={20} height={20} />}
    >
      Share
    </Button>
  );
}
