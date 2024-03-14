'use client';

import DashboardHeader from '@/components/layout/DashboardHeader/dash-board-header';
import { formDetailsAtom } from '@/jotai/state';
import { useOrganization, useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { useAtom } from 'jotai';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [, setFormDetails] = useAtom(formDetailsAtom);

  const pathname = usePathname();
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

  // Parse the pathname to extract formId if present
  const pathSegments = pathname.split('/').filter(Boolean); // Remove empty segments
  const isFormPage = pathSegments.length > 2 && pathSegments[2] === 'form';
  const formId = isFormPage ? pathSegments[3] : null;

  // Use `useQuery` with 'skip' option when formId is not available
  const formQueryArg =
    user.isLoaded && formId ? { formId: formId as Id<'forms'> } : 'skip';
  const adminQueryArg = user.isLoaded && orgId ? { orgId: orgId } : 'skip';
  const form = useQuery(api.forms.getFormById, formQueryArg);
  let formName = form?.name ?? 'Unknown';
  const admins = useQuery(api.users.getAdminsByOrgId, adminQueryArg);

  useEffect(() => {
    if (formId && form) {
      setFormDetails({
        orgId,
        orgName,
        formId,
        formName,
        formDescription: form.description,
        pathname,
      });
    }
  }, [formId, form, admins, setFormDetails, orgId, orgName, pathname]);

  return (
    <section className='flex-1 flex flex-col'>
      <div className='container my-6'>
        <DashboardHeader />
      </div>
      {children}
    </section>
  );
}
