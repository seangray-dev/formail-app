'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { Textarea } from '../ui/textarea';
import { useToast } from '../ui/use-toast';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'name must be at least 2 characters.',
  }),
  email: z.string().min(2, { message: 'must be a valid email.' }),
  file: z.any().optional(),
});

export function PlaygroundForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      file: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formId = 'j57evqejd8wp63gb4rp1h63df56na96q';
      const response = await fetch(`http://localhost:3000/submit/${formId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          file: values.file,
        }),
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
        description: 'Please try again ',
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
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type='email'
                  placeholder='michaelscott@dundermifflin.com'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='file'
          render={({ field }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <Input type='file' {...field} />
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
