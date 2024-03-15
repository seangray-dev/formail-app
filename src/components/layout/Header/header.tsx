import {
  OrganizationSwitcher,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '../../ui/button';
import FormSheet from './forms-sheet';

export default function Header() {
  return (
    <nav className='container border-b py-3 text-sm'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-4'>
          <Link href={'/'}>Formail</Link>
          <SignedIn>
            <FormSheet />
          </SignedIn>
          <div className='-mb-2'>
            <OrganizationSwitcher />
          </div>
        </div>
        <div className='flex gap-4 items-center'>
          <SignedIn>
            <Link
              className='hover:underline hover:text-white text-muted-foreground'
              href={'/dashboard'}>
              Dashboard
            </Link>
          </SignedIn>
          <Link
            className='hover:underline hover:text-white text-muted-foreground'
            href={'/playground'}>
            Playground
          </Link>
          <Link
            className='hover:underline hover:text-white text-muted-foreground'
            href={'/contact'}>
            Contact
          </Link>
          <Link
            className='hover:underline hover:text-white text-muted-foreground'
            href={'/documentation'}>
            Documentaion
          </Link>
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
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
