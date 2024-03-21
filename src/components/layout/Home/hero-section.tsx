import { Button } from '@/components/ui/button';
import { CheckIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function HeroSection() {
  return (
    <section className='flex flex-col-reverse gap-16 justify-between items-center md:grid md:grid-cols-2 mt-8 md:mt-20 md:gap-10 mb-20 md:mb-32 2xl:mb-36'>
      <div>
        <div className='flex flex-col gap-3 md:gap-4 2xl:gap-5 max-w-xl text-center md:text-left'>
          <h1 className='font-extrabold tracking-tight leading-none text-3xl md:text-5xl 2xl:text-6xl capitalize'>
            Streamline your workflow with Formail
          </h1>
          <p className='text-muted-foreground'>
            Formail simplifies your workflow by revolutionizing form submission
            management, turning each entry into a step towards your goals. Our
            platform not just collects data but unlocks smarter decisions.
          </p>
        </div>
        <div className='mt-12 flex flex-col md:flex-row gap-3 items-center justify-start md:items-center'>
          <Button asChild className='max-w-56'>
            <Link href={'/sign-up'}>Get Started For Free</Link>
          </Button>
          <div className='flex gap-1'>
            <CheckIcon className='text-muted-foreground' />
            <p>No Credit Card Required</p>
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
