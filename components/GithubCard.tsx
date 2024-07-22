'use client';
import React from 'react';
import { Button } from '@nextui-org/button';
import { ExternalLink, Github } from 'lucide-react';
import { Tooltip } from '@nextui-org/tooltip';
import Link from 'next/link';

export default function GithubCard() {
  return (
    <Tooltip
      content={
        <div className={'flex flex-row gap-2 justify-center items-center'}>
          <p>Open Github</p>
          <ExternalLink size={16} />
        </div>
      }
      placement={'top'}
      color={'secondary'}
      delay={0}
      closeDelay={0}
    >
      <Link href={'https://github.com/Thre4dripper/Boardy-WebApp'} passHref target={'_blank'} className={'absolute left-4 sm:left-auto bottom-16 sm:right-4 sm:bottom-4'}>
        <Button isIconOnly variant={'ghost'} color={'secondary'}>
          <Github />
        </Button>
      </Link>
    </Tooltip>
  );
}
