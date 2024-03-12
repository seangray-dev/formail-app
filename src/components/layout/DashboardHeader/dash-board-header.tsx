'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { useOrganization, useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { ClipboardCheckIcon, ClipboardIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

export default function DashboardHeader() {
  const [isCopied, setIsCopied] = useState(false);
  const pathname = usePathname();
  const organization = useOrganization();
  const user = useUser();
  const isActive = (href: string) => pathname === href;

  let orgId: string | undefined = undefined;
  let orgName: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  if (organization.isLoaded && user.isLoaded) {
    orgName = organization.organization?.name ?? 'Personal account';
  }

  // Parse the pathname to extract formId if present
  const pathSegments = pathname.split('/').filter(Boolean); // Remove empty segments
  const isFormPage = pathSegments.length > 2 && pathSegments[2] === 'form';
  const formId = isFormPage ? pathSegments[3] : null;

  // Use `useQuery` with 'skip' option when formId is not available
  const formQueryArg =
    user.isLoaded && formId ? { formId: formId as Id<'forms'> } : 'skip';
  const form = useQuery(api.forms.getFormById, formQueryArg);
  let formName = form?.name ?? 'Unknown';

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('failed to copy', error);
    }
  };

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className='hover:cursor-not-allowed'>
            {orgName}
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {!formId && <BreadcrumbPage>Dashboard</BreadcrumbPage>}
            {formId && (
              <BreadcrumbLink href='/dashboard'>Dashboard</BreadcrumbLink>
            )}
          </BreadcrumbItem>
          {isFormPage && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem className='hover:cursor-not-allowed'>
                Forms
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{formName}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      {formId && (
        <>
          <div className='mt-6 text-muted-foreground'>
            <p>
              Organization: <span className='text-white'>{orgName}</span>
            </p>
            <p>
              Form Name: <span className='text-white'>{formName}</span>
            </p>
            <p>
              Description:{' '}
              <span className='text-white'>{form?.description}</span>
            </p>
            <p className='flex gap-2 items-center'>
              Form ID: <span className='text-white'>{form?._id}</span>
              <Button
                title='Copy to clipboard'
                size={'icon'}
                variant={'ghost'}
                className='p-0 m-0 w-fit h-fit hover:bg-transparent mb-1 relative'
                onClick={() => {
                  if (form?._id) {
                    copyToClipboard(form._id);
                  }
                }}>
                {isCopied ? (
                  <ClipboardCheckIcon size={20} />
                ) : (
                  <ClipboardIcon size={20} />
                )}
                {isCopied && (
                  <div className='absolute bottom-6 text-xs'>Copied!</div>
                )}
              </Button>
            </p>
          </div>
          <nav className='mt-6 border-b pb-2 flex gap-4 text-muted-foreground'>
            <Link
              href={`/dashboard/${orgId}/form/${form?._id}/submissions`}
              className={
                isActive(`/dashboard/${orgId}/form/${form?._id}/submissions`)
                  ? 'text-white'
                  : 'hover:text-white duration-150 transition-all'
              }>
              Submissions
            </Link>
            <Link
              href={`/dashboard/${orgId}/form/${form?._id}/analytics`}
              className={
                isActive(`/dashboard/${orgId}/form/${form?._id}/analytics`)
                  ? 'text-white'
                  : 'hover:text-white duration-150 transition-all'
              }>
              Analytics
            </Link>
            <Link
              href={`/dashboard/${orgId}/form/${form?._id}/export`}
              className={
                isActive(`/dashboard/${orgId}/form/${form?._id}/export`)
                  ? 'text-white'
                  : 'hover:text-white duration-150 transition-all'
              }>
              Export
            </Link>
            <Link
              href={`/dashboard/${orgId}/form/${form?._id}/settings`}
              className={
                isActive(`/dashboard/${orgId}/form/${form?._id}/settings`)
                  ? 'text-white'
                  : 'hover:text-white duration-150 transition-all'
              }>
              Settings
            </Link>
            <Link
              href={`/dashboard/${orgId}/form/${form?._id}/how-to`}
              className={
                isActive(`/dashboard/${orgId}/form/${form?._id}/how-to`)
                  ? 'text-white'
                  : 'hover:text-white duration-150 transition-all'
              }>
              How-to
            </Link>
          </nav>
        </>
      )}
    </>
  );
}
