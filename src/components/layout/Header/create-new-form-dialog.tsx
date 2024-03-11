import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useOrganization, useUser } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'convex/react';
import { Loader2, PlusIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { api } from '../../../../convex/_generated/api';
import { Button } from '../../ui/button';

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(50),
});

export default function CreateFormDialog() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  const organization = useOrganization();
  const user = useUser();
  const createForm = useMutation(api.forms.createForm);
  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!orgId) {
        throw new Error();
      }

      await createForm({
        name: values.name,
        description: values.description,
        orgId,
      });

      form.reset();
      setIsFormOpen(false);
      toast({
        variant: 'default',
        title: 'Form Created',
        description: 'You can now start collecting submissions!',
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Something went wrong!',
        description: 'Your form was not created, please try again.',
      });
    }
  }

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogTrigger asChild>
        <div className='text-sm rounded-md border px-4 py-2 cursor-pointer hover:bg-secondary transition-all duration-150 flex gap-2 items-center'>
          <PlusIcon className='h-4 w-4' />
          Create New Form
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new form</DialogTitle>
          <DialogDescription>
            This form will be accessible by anyone within your organization.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Form Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type='submit'
              className='w-full'
              disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              )}
              Create
            </Button>
          </form>
        </Form>
        <DialogClose asChild>
          <Button type='button' variant='secondary'>
            Cancel
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
