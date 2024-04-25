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
  message: z
    .string()
    .min(10, { message: 'must be at least 10 characters.' })
    .max(1000, { message: 'Message must not be longer than 1000 characters.' }),
});

export function ContactForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });
  const messageValue = useWatch({ control: form.control, name: 'message' });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch(
        "https://www.formail.dev/submit/j5745zzef22t8c916q9sqqm7e96p2adt",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            message: values.message,
          }),
        },
      );
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
          name='message'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  maxLength={1000}
                  className='resize-none'
                  placeholder='Your message'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                <p className='text-right'>{`${messageValue.length}/1000`}</p>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  );
}
