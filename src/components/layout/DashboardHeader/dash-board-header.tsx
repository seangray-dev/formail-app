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
import { formDetailsAtom } from '@/jotai/state';
import { OrganizationSwitcher, useOrganization, useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { useAtom } from 'jotai';
import { ClipboardCheckIcon, ClipboardIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '../../../../convex/_generated/api';

export default function DashboardHeader() {
  const pathname = usePathname();
  const [isCopied, setIsCopied] = useState(false);
  const [isFormPage, setIsFormPage] = useState(false);
  const organization = useOrganization();
  const user = useUser();
  const [formDetails] = useAtom(formDetailsAtom);
  const isActive = (href: string) => pathname === href;
  const { formName, formId, formDescription } = formDetails;

  const userActive = useQuery(api.users.getMe);
  const isSubActive = useQuery(
    api.utils.checkUserSubscription,
    userActive ? { userId: userActive._id } : 'skip'
  );

  let orgId: string | undefined = undefined;
  let orgName: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }
  if (organization.isLoaded && user.isLoaded) {
    orgName = organization.organization?.name ?? 'Personal Account';
  }

  useEffect(() => {
    // Check if the current pathname includes '/form/'
    const isForm = pathname.includes('/form/');
    setIsFormPage(isForm);
  }, [pathname]);

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
      <div className='mb-4'>
        {isSubActive && (
          <OrganizationSwitcher
            afterSelectOrganizationUrl='/dashboard'
            afterLeaveOrganizationUrl='/dashboard'
          />
        )}
      </div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className='hover:cursor-not-allowed'>
            {orgName}
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {!formId && <BreadcrumbPage>Dashboard</BreadcrumbPage>}
            {isFormPage && (
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
      {isFormPage && (
        <>
          <div className='mt-6 text-muted-foreground'>
            <p>
              Organization: <span className='text-white'>{orgName}</span>
            </p>
            <p>
              Form Name: <span className='text-white'>{formName}</span>
            </p>
            <p>
              Description: <span className='text-white'>{formDescription}</span>
            </p>
            <p className='flex gap-2 items-center whitespace-nowrap'>
              Form ID:{' '}
              <span className='text-white overflow-x-clip text-ellipsis'>
                {formId}
              </span>
              <Button
                title='Copy to clipboard'
                size={'icon'}
                variant={'ghost'}
                className='p-0 m-0 w-fit h-fit hover:bg-transparent mb-1 relative'
                onClick={() => {
                  if (formId) {
                    copyToClipboard(formId);
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
          <nav className='mt-6 border-b pb-2 flex gap-4 text-muted-foreground overflow-x-scroll whitespace-nowrap'>
            <Link
              href={`/dashboard/${orgId}/form/${formId}/submissions`}
              className={
                isActive(`/dashboard/${orgId}/form/${formId}/submissions`)
                  ? 'text-white'
                  : 'hover:text-white duration-150 transition-all'
              }>
              Submissions
            </Link>
            <Link
              href={`/dashboard/${orgId}/form/${formId}/files`}
              className={
                isActive(`/dashboard/${orgId}/form/${formId}/files`)
                  ? 'text-white'
                  : 'hover:text-white duration-150 transition-all'
              }>
              Files
            </Link>
            <Link
              href={`/dashboard/${orgId}/form/${formId}/analytics`}
              className={
                isActive(`/dashboard/${orgId}/form/${formId}/analytics`)
                  ? 'text-white'
                  : 'hover:text-white duration-150 transition-all'
              }>
              Analytics
            </Link>
            <Link
              href={`/dashboard/${orgId}/form/${formId}/export`}
              className={
                isActive(`/dashboard/${orgId}/form/${formId}/export`)
                  ? 'text-white'
                  : 'hover:text-white duration-150 transition-all'
              }>
              Export
            </Link>
            <Link
              href={`/dashboard/${orgId}/form/${formId}/settings`}
              className={
                isActive(`/dashboard/${orgId}/form/${formId}/settings`)
                  ? 'text-white'
                  : 'hover:text-white duration-150 transition-all'
              }>
              Settings
            </Link>
            <Link
              href={`/dashboard/${orgId}/form/${formId}/how-to`}
              className={
                isActive(`/dashboard/${orgId}/form/${formId}/how-to`)
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
