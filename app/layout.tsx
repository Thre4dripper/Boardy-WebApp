import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import React from 'react';
import { NextUIProvider } from '@nextui-org/system';
import Head from 'next/head';
import { ThemeProvider } from '@/providers/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Boardy',
  description: 'A Whiteboard for everyone',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <body className={inter.className}>
        <NextUIProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
