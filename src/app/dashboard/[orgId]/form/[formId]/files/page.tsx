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
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { formDetailsAtom } from '@/jotai/state';
import { useMutation, useQuery } from 'convex/react';
import { useAtom } from 'jotai';
import Image from 'next/image';
import { useState } from 'react';
import { api } from '../../../../../../../convex/_generated/api';
import { Id } from '../../../../../../../convex/_generated/dataModel';
type submissionId = Id<'submissions'>;

export default function SubmissionsPage() {
  const { toast } = useToast();
  const [formDetails] = useAtom(formDetailsAtom);
  const { formId } = formDetails;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] =
    useState<submissionId | null>(null);

  const formQueryArg = formId ? { formId: formId as Id<'forms'> } : 'skip';
  const submissions = useQuery(
    api.submissions.getSubmissionsByFormId,
    formQueryArg
  );

  const deleteSubmission = useMutation(api.submissions.deleteSubmissionById);

  const handleDeleteClick = (submissionId: submissionId) => {
    setSelectedSubmissionId(submissionId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirmation = async () => {
    if (selectedSubmissionId) {
      try {
        await deleteSubmission({ submissionId: selectedSubmissionId });
        setIsDeleteDialogOpen(false);
        setSelectedSubmissionId(null);
        toast({
          variant: 'default',
          title: 'Submission deleted successfully',
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Deleting submission failed, please try again.',
          description:
            'You may not have permission to delete this submission. Contact your organization admin',
        });
      }
    }
  };

  return (
    <section className='container flex-1 flex flex-col'>
      <h3 className='mb-6'>Files</h3>
      {submissions && submissions.length > 0 ? (
        <></>
      ) : (
        <div className='flex-1 flex flex-col justify-center items-center gap-10'>
          <Image alt='' width={200} height={200} src='/no_files.svg' />
          <div className='text-base md:text-2xl text-center'>
            You don&apos;t have any file submissions for this form yet.
          </div>
        </div>
      )}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this file?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              submission and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              // onClick={''}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/80 transition-all duration-150'>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
