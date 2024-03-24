import Image from 'next/image';
import React from 'react';

export default function FormAnalyticsPage() {
  return (
    <div className='flex-1 flex flex-col justify-center items-center gap-10'>
      <Image
        alt='coming soon'
        src='/coming_soon.svg'
        width={200}
        height={200}
      />
      <p className='text-base md:text-2xl text-center'>Coming Soon!</p>
    </div>
  );
}
