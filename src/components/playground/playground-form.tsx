'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '../ui/use-toast';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  file1: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, 'At least one file is required.'),
  file2: z.instanceof(FileList).optional(),
});

export function PlaygroundForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      file1: undefined,
      file2: undefined,
    },
  });

  const file1Ref = form.register('file1');
  const file2Ref = form.register('file2');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formId = 'j574wd5phr7eevfvnf9bhgbrm16nbcqt';
    const formData = new FormData();

    formData.append('name', values.name);

    // Append all files from the 'file1' input
    Array.from(values.file1).forEach((file, index) => {
      formData.append(`file1_${index}`, file);
    });

    // Append a single file from the 'file2' input, if present
    if (values.file2 && values.file2[0]) {
      formData.append('file2', values.file2[0]);
    }

    try {
      const response = await fetch(`http://localhost:3000/submit/${formId}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      form.reset();
      toast({
        variant: 'default',
        title: 'Message sent!',
        description:
          'Thanks for contacting us, someone will be in touch with you soon.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Your message was not sent',
        description: 'Please try again',
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-4 max-w-md mx-auto md:mx-0 md:max-w-2xl'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Michael Scott' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='file1'
          render={() => (
            <FormItem>
              <FormLabel>File(s)</FormLabel>
              <FormControl>
                <Input type='file' {...file1Ref} multiple />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='file2'
          render={() => (
            <FormItem>
              <FormLabel>File 2 (Optional)</FormLabel>
              <FormControl>
                <Input type='file' {...file2Ref} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  );
}
