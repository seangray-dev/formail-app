import {
  OrganizationSwitcher,
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import { Button } from '../ui/button';
export default function Header() {
  return (
    <div className='border-b py-4'>
      <div className='container flex justify-between items-center'>
        <div>Formail</div>
        <div className='flex gap-4 items-center'>
          <div className='-mb-2'>
            <OrganizationSwitcher />
          </div>
          <UserButton />
          <SignedOut>
            <SignInButton>
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <SignOutButton>
              <Button>Sign Out</Button>
            </SignOutButton>
          </SignedIn>
        </div>
      </div>
    </div>
  );
}
