import React from 'react';
import { Card } from '@heroui/react';
import Image from 'next/image';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/enums/Theme';

export default function IconCard() {
  const { theme } = useTheme();
  return (
    <Card className={'absolute top-4 left-4 p-0 rounded-2xl'}>
      <Card.Content className={'flex flex-row gap-4 justify-center items-center px-4 py-3'}>
        <div className={'bg-[#7728c7] rounded-xl p-1.5'}>
          <Image src={'/icon.png'} alt={''} width={28} height={28} />
        </div>
        <p
          className={`mb-1 text-xl ${theme === Theme.Light ? 'text-[#7728c7]' : 'text-white'} font-bold text-center select-none`}
          style={{
            fontFamily: 'Comic Sans MS',
          }}
        >
          Boardy
        </p>
      </Card.Content>
    </Card>
  );
}
