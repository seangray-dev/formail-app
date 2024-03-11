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
import { MailIcon, ShieldAlertIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';

export default function SubmissionsPage() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <section className='container py-10'>
      <h3 className='mb-6'>Submissions</h3>
      <Table className='w-full border'>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px] border-r'>
              <Checkbox />
            </TableHead>
            <TableHead className='border-r'>Date</TableHead>
            <TableHead className='border-r'>Data</TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className='font-medium border-r'>
              <Checkbox />
            </TableCell>
            <TableCell className='border-r'>
              <div className='flex flex-col gap-2'></div>
            </TableCell>
            <TableCell className='border-r'>
              <div className='flex flex-col gap-2'></div>
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
                      }}>
                      <TrashIcon
                        className='text-muted-foreground hover:text-white transition-all duration-150'
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
        </TableBody>
      </Table>

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
            <AlertDialogAction className='bg-destructive text-destructive-foreground hover:bg-destructive/80 transition-all duration-150'>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
