'use client';

import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { useAction } from 'convex/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../../../convex/_generated/api';
import { Button } from '../../ui/button';
import FormSheet from './forms-sheet';

export default function Header() {
  const pay = useAction(api.stripe.pay);
  const router = useRouter();

  const handleUpgradeClick = async () => {
    const url = await pay();
    router.push(url);
  };

  return (
    <nav className='container border-b py-3 text-sm'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <Link href={'/'}>Formail</Link>
          <FormSheet />
        </div>
        <div className='flex gap-4 items-center'>
          <div className='hidden md:flex gap-4'>
            <SignedIn>
              <Link
                className='hover:underline hover:text-white text-muted-foreground'
                href={'/dashboard'}>
                Dashboard
              </Link>
            </SignedIn>
            <Link
              className='hover:underline hover:text-white text-muted-foreground'
              href={'/contact'}>
              Contact
            </Link>
            <Link
              className='hover:underline hover:text-white text-muted-foreground'
              href={'/documentation'}>
              Docs
            </Link>
          </div>
          <SignedOut>
            <Link
              className='hover:underline hover:text-white text-muted-foreground'
              href={'/sign-in'}>
              Sign In
            </Link>
            <Button asChild variant={'secondary'}>
              <Link href={'/sign-up'}>Try It Free</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <div className='flex items-center gap-3'>
              <Button variant={'secondary'} onClick={handleUpgradeClick}>
                Upgrade
              </Button>
              <UserButton />
            </div>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
