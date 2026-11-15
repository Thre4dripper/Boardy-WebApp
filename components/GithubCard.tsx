'use client';
import React from 'react';
import { Tooltip, buttonVariants } from '@heroui/react';
import { ExternalLink, Github } from 'lucide-react';
import Link from 'next/link';

export default function GithubCard() {
  return (
    <Tooltip delay={0} closeDelay={0}>
      <Tooltip.Trigger
        className={'absolute left-4 sm:left-auto bottom-16 sm:right-4 sm:bottom-4'}
        tabIndex={-1}
      >
        <Link
          href={'https://github.com/Thre4dripper/Boardy-WebApp'}
          target={'_blank'}
          rel={'noopener noreferrer'}
          aria-label={'Open Github'}
          className={buttonVariants({ variant: 'outline', isIconOnly: true })}
        >
          <Github />
        </Link>
      </Tooltip.Trigger>
      <Tooltip.Content placement={'top'}>
        <div className={'flex flex-row gap-2 justify-center items-center'}>
          <p>Open Github</p>
          <ExternalLink size={16} />
        </div>
      </Tooltip.Content>
    </Tooltip>
  );
}
