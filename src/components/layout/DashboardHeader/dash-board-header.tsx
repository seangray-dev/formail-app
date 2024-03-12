'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useOrganization, useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

export default function DashboardHeader() {
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
              Form ID: <span className='text-white'>{form?._id}</span>
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
