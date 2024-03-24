'use client';

import { Button } from '@/components/ui/button';
import { CheckIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function HeroSection() {
  return (
    <section className='flex flex-col-reverse gap-16 justify-between items-center md:grid md:grid-cols-2 md:gap-10 mb-20 md:mb-32 2xl:mb-36'>
      <div>
        <div className='flex flex-col gap-3 md:gap-4 2xl:gap-5 max-w-xl text-center md:text-left'>
          <h1 className='font-extrabold tracking-tight leading-none text-3xl md:text-5xl 2xl:text-6xl capitalize'>
            Make{' '}
            <span
              className={`bg-clip-text bg-gradient-to-r from-zinc-300 to-zinc-600 text-transparent transition-opacity`}>
              Form
            </span>{' '}
            Management Effortless
          </h1>
          <p className='text-muted-foreground'>
            Streamline your form handling effortlessly with our intuitive
            platform. Assign unique IDs to your forms, utilize our API for
            seamless submissions, and enjoy tailored management solutions
            perfect for developers and small businesses. Ideal for contact
            forms, surveys, and feedback, Formail enhances your strategy
            seamlessly.
          </p>
        </div>
        <div className='mt-12 flex flex-col gap-3 md:items-start justify-start items-center'>
          <Button asChild className='max-w-52'>
            <Link href={'/sign-up'}>Get Started For Free</Link>
          </Button>
          <div className='flex items-center gap-1'>
            <CheckIcon size={18} className='text-muted-foreground' />
            <p className='text-sm'>No Credit Card Required</p>
          </div>
        </div>
      </div>
      <div>
        <Image
          className='object-contain w-full h-full'
          src={'/screenshot.png'}
          height={600}
          width={600}
          alt='screenshot of product'
        />
      </div>
    </section>
  );
}
