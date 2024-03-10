'use client';

import { Button } from '@/components/ui/button';
import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function Home() {
  const createForm = useMutation(api.forms.createForm);
  const forms = useQuery(api.forms.getForms);

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <SignedIn>
        <SignOutButton>
          <Button>Sign Out</Button>
        </SignOutButton>
      </SignedIn>
      <SignedOut>
        <SignInButton mode='modal'>
          <Button>Sign In</Button>
        </SignInButton>
      </SignedOut>

      {forms?.map((form) => {
        return <div key={form._id}>{form.name}</div>;
      })}

      <Button
        onClick={() => {
          createForm({ name: 'hello world' });
        }}>
        Click Me
      </Button>
    </main>
  );
}
