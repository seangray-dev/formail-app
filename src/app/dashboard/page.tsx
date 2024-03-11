'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import { useOrganization, useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { CogIcon, TrashIcon } from 'lucide-react';
import Link from 'next/link';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
type FormId = Id<'forms'>;

export default function Home() {
  const organization = useOrganization();
  const user = useUser();
  const { toast } = useToast();

  let orgId: string | undefined = undefined;
  let orgName: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }
  if (organization.isLoaded && user.isLoaded) {
    orgName = organization.organization?.name ?? 'Personal account';
  }
  const forms = useQuery(api.forms.getForms, orgId ? { orgId } : 'skip');
  const createForm = useMutation(api.forms.createForm);
  const deleteForm = useMutation(api.forms.deleteForm);

  async function handleDeleteForm(formId: FormId) {
    try {
      await deleteForm({ formId: formId });
      toast({
        variant: 'success',
        title: 'Form Deleted',
        description: 'Your form has been successfully deleted.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Deletion Failed',
        description:
          'There was a problem deleting your form. Please try again.',
      });
    }
  }

  return (
    <main className='container py-10'>
      <div className='text-3xl mb-8 font-medium'>{orgName} Forms</div>
      <ul className='flex flex-col'>
        {forms?.map((form) => {
          return (
            <li
              className='border-b p-4 flex justify-between hover:bg-secondary duration-150 transition-all'
              key={form._id}>
              <Link
                className='hover:underline'
                href={`/dashboard/${orgId}/form/${form._id}/submissions`}>
                {form.name}
              </Link>
              <div className='flex gap-4 items-center'>
                <div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Link
                          href={`/dashboard/${orgId}/form/${form._id}/settings`}>
                          <CogIcon className='h-5 w-5 text-muted-foreground hover:text-white transition-all duration-150' />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className='text-sm text-muted-foreground font-normal'>
                          Go to <span className='text-white'>{form.name}</span>{' '}
                          form settings
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger title='Delete Form'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <TrashIcon className='w-5 h-5 text-destructive hover:text-destructive/80' />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className='text-sm text-muted-foreground font-normal'>
                            Delete{' '}
                            <span className='text-white'>{form.name}</span> form
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className='text-muted-foreground'>
                        Are you sure you want to delete the{' '}
                        <span className='text-white'>"{form.name}"</span> form?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your form and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteForm(form._id)}
                        className='bg-destructive text-destructive-foreground hover:bg-destructive/80 transition-all duration-150'>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
