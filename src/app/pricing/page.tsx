'use client';

import PricingCard from '@/components/pricing/pricing-card';
import { useUser } from '@clerk/nextjs';
import { useAction } from 'convex/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { api } from '../../../convex/_generated/api';

export default function PricingPage() {
  const freeFeatures = [
    { text: 'Up to 5 Forms', included: true },
    { text: '500 total submissions', included: true },
    { text: 'Basic Analytics', included: true },
    { text: 'File Submissions', included: false },
    { text: 'Multi-Organization Access', included: false },
  ];

  const premiumFeatures = [
    { text: 'Unlimited Forms', included: true },
    { text: 'Unlimited submissions', included: true },
    { text: 'Advanced Analytics', included: true },
    { text: 'File Submissions', included: true },
    { text: 'Multi-Organization Access', included: true },
  ];

  const pay = useAction(api.stripe.pay);
  const router = useRouter();
  const user = useUser();

  const handleUpgradeClick = async () => {
    if (user.isSignedIn) {
      const url = await pay();
      router.push(url);
    } else {
      router.push('/sign-up');
    }
  };

  return (
    <section className='flex-1 flex flex-col gap-10 container justify-center items-center py-10'>
      <div className='text-center flex flex-col gap-4'>
        <h1 className='font-extrabold tracking-tight leading-none text-3xl md:text-5xl 2xl:text-6xl capitalize'>
          Build Your Projects,
          <br />
          <span className='bg-clip-text text-transparent bg-gradient-to-r from-zinc-300 to-zinc-600 transition-opacity'>
            Not Your Bills
          </span>
        </h1>
        <p className='text-muted-foreground'>
          Our pricing is designed to be clear and predictable. Simple choices,
          no surprises.
        </p>
      </div>
      <div className='flex flex-col sm:flex-row gap-10 justify-between'>
        <PricingCard
          title='Free'
          description='Great for getting started and small projects'
          price='$0/mo'
          features={freeFeatures}
          buttonText='Try It Free'
          buttonLink='/sign-up'
          buttonVariant='secondary'
        />
        <PricingCard
          title='Premium'
          description='Best for professionals and teams needing advanced features'
          price='$4.99/mo'
          features={premiumFeatures}
          buttonText='Upgrade Now'
          buttonVariant='default'
          onClick={handleUpgradeClick}
        />
      </div>
    </section>
  );
}
