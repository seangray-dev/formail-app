'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  SignedIn,
  SignedOut,
  UserButton,
  useOrganization,
  useUser,
} from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { ChevronRightIcon, MenuIcon } from 'lucide-react';
import Image from 'next/image';
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
      <SheetContent
        side={'left'}
        className='max-h-screen flex flex-col justify-between'>
        <SheetHeader>
          <SheetTitle>
            <div className='mb-10'>Formail</div>
            <SignedIn>
              <div className='mb-10'>{orgName}</div>
            </SignedIn>
          </SheetTitle>
        </SheetHeader>
        <SignedOut>
          <div className='flex flex-col justify-center items-center gap-4'>
            <Image
              src={'./no_forms.svg'}
              alt='must be signed in'
              height={150}
              width={150}
            />
            <p>Sign in to view your forms</p>
          </div>
        </SignedOut>
        <SignedIn>
          <div className='flex-1'>
            <div className='flex flex-col gap-4 items-center justify-between mb-4 md:flex-row'>
              <p className='font-bold text-xl'>Forms</p>
              <CreateFormDialog />
            </div>

            <ul className='w-full flex flex-col'>
              {forms?.map((form) => {
                return (
                  <li
                    key={form._id}
                    className='group hover:bg-secondary transition-all duration-150 w-full flex justify-between items-center'>
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
                    <ChevronRightIcon
                      size={20}
                      className='hidden group-hover:block mr-4'
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        </SignedIn>
        <SheetFooter className='self-start border-t w-full pt-6'>
          <div className='flex flex-col gap-4 self-start w-full text-sm'>
            <SignedIn>
              <Link
                onClick={() => {
                  setIsSheetOpen(false);
                }}
                className='hover:underline hover:text-white text-muted-foreground'
                href={'/dashboard'}>
                Dashboard
              </Link>
            </SignedIn>
            <Link
              onClick={() => {
                setIsSheetOpen(false);
              }}
              className='hover:underline hover:text-white text-muted-foreground'
              href={'/contact'}>
              Contact
            </Link>
            <Link
              onClick={() => {
                setIsSheetOpen(false);
              }}
              className='hover:underline hover:text-white text-muted-foreground'
              href={'/documentation'}>
              Docs
            </Link>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
