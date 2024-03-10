'use client';

import { Button } from '@/components/ui/button';
import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  useOrganization,
  useUser,
} from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function Home() {
  const organization = useOrganization();
  const user = useUser();

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }
  const forms = useQuery(api.forms.getForms, orgId ? { orgId } : 'skip');
  const createForm = useMutation(api.forms.createForm);

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      {forms?.map((form) => {
        return <div key={form._id}>{form.name}</div>;
      })}

      <Button
        onClick={() => {
          if (!orgId) return;
          createForm({
            name: 'hello world',
            orgId,
          });
        }}>
        Click Me
      </Button>
    </main>
  );
}
