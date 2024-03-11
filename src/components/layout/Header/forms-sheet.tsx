'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useOrganization, useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { api } from '../../../../convex/_generated/api';
import CreateFormDialog from './create-new-form-dialog';

export default function FormSheet() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const organization = useOrganization();
  const user = useUser();

  let orgId: string | undefined = undefined;
  let orgName: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  if (organization.isLoaded && user.isLoaded) {
    orgName = organization.organization?.name ?? 'Personal account';
  }
  const forms = useQuery(api.forms.getForms, orgId ? { orgId } : 'skip');

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger>
        <MenuIcon size={18} />
      </SheetTrigger>
      <SheetContent side={'left'}>
        <SheetHeader>
          <SheetTitle>
            <h6 className='mb-10'>Organization: {orgName}</h6>
          </SheetTitle>
        </SheetHeader>
        <div className='flex items-center justify-between mb-4'>
          <p className='font-bold text-xl'>Forms</p>
          <CreateFormDialog />
        </div>
        <ul className='w-full flex flex-col'>
          {forms?.map((form) => {
            return (
              <li key={form._id} className='hover:bg-secondary w-full'>
                <Button
                  onClick={() => {
                    setIsSheetOpen(false);
                  }}
                  asChild
                  variant={'link'}
                  className='w-full justify-start'>
                  <Link
                    className='w-full'
                    href={`/dashboard/${orgId}/form/${form._id}/submissions`}>
                    {form.name}
                  </Link>
                </Button>
              </li>
            );
          })}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
