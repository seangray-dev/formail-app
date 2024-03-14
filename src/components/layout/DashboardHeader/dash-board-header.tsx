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
import { useAtom } from 'jotai';
import { ClipboardCheckIcon, ClipboardIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function DashboardHeader() {
  const [isCopied, setIsCopied] = useState(false);
  const [formDetails] = useAtom(formDetailsAtom);
  const isActive = (href: string) => pathname === href;
  const {
    orgId,
    orgName,
    admins,
    formName,
    formId,
    formDescription,
    pathname,
  } = formDetails;
  const isFormPage = pathname?.includes('/form/');

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
              Description: <span className='text-white'>{formDescription}</span>
            </p>
            <p className='flex gap-2 items-center'>
              Form ID: <span className='text-white'>{formId}</span>
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
          <nav className='mt-6 border-b pb-2 flex gap-4 text-muted-foreground'>
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
