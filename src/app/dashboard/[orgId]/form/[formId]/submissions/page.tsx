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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import { formDetailsAtom } from '@/jotai/state';
import { useMutation, useQuery } from 'convex/react';
import { formatRelative } from 'date-fns';
import { useAtom } from 'jotai';
import { MailIcon, ShieldAlertIcon, TrashIcon } from 'lucide-react';
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
      <h3 className='mb-6'>Submissions</h3>
      {submissions && submissions.length > 0 ? (
        <>
          <Table className='w-full border'>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[100px] border-r'>
                  <Checkbox />
                </TableHead>
                <TableHead className='border-r'>Date</TableHead>
                <TableHead className='border-r'>Data</TableHead>
                <TableHead className='text-center'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions?.map((submission, index) => (
                <TableRow key={index}>
                  <TableCell className='font-medium border-r'>
                    <Checkbox />
                  </TableCell>
                  <TableCell className='border-r'>
                    <div className='flex flex-col gap-2'>
                      {formatRelative(submission._creationTime, new Date())}
                    </div>
                  </TableCell>
                  <TableCell className='border-r'>
                    <div className='flex flex-col gap-2'>
                      {Object.entries(
                        JSON.parse(submission.data) as Record<string, string>
                      ).map(([key, value]) => (
                        <div key={key} className='flex gap-2'>
                          <span className='font-medium'>{key}:</span>
                          <span className='text-muted-foreground'>{value}</span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex gap-2 justify-end'>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <MailIcon
                              className='text-muted-foreground hover:text-white transition-all duration-150'
                              size={20}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Email</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <ShieldAlertIcon
                              className='text-muted-foreground hover:text-white transition-all duration-150'
                              size={20}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Mark as spam</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger
                            onClick={() => {
                              setIsDeleteDialogOpen(true);
                              handleDeleteClick(submission._id);
                            }}>
                            <TrashIcon
                              className='text-muted-foreground hover:text-destructive transition-all duration-150'
                              size={20}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete Submission</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      ) : (
        <div className='flex-1 flex flex-col justify-center items-center gap-10'>
          <Image alt='' width={200} height={200} src='/no_submissions.svg' />
          <div className='text-base md:text-2xl text-center'>
            You don&apos;t have any submissions for this form yet.
          </div>
        </div>
      )}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this submission?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              submission and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirmation}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/80 transition-all duration-150'>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
