import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function Footer() {
  return (
    <footer className='mt-20 border-t container py-5 items-center'>
      <div className='text-muted-foreground text-sm text-center md:text-left flex flex-col gap-2 md:flex-row justify-between items-center'>
        <div>@{new Date().getFullYear()} Formail. All Rights Reserved.</div>
        <div className='flex flex-col md:flex-row gap-2'>
          <Link
            className='hover:text-white hover:underline'
            href={'/legal/privacy-policy'}>
            Privacy Policy
          </Link>
          <Link
            className='hover:text-white hover:underline'
            href={'/legal/terms-&-conditions'}>
            Terms & Conditions
          </Link>
          <Link
            className='hover:text-white hover:underline'
            href={'/legal/privacy-policy'}>
            Cookie Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
