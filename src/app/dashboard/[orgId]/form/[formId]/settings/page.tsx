'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Switch } from '@/components/ui/switch';
import { formDetailsAtom } from '@/jotai/state';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom } from 'jotai';
import { SaveIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  form_name: z.string().min(2, {
    message: 'Form name must be at least 2 characters.',
  }),
  form_description: z.string().min(2, {
    message: 'Form name must be at least 2 characters.',
  }),
  email_recipients: z
    .array(z.string())
    .refine((value) => value.some((admin) => admin), {
      message: 'You have to select at least one admin.',
    }),
  email_threads: z.boolean().default(true),
});

export default function FormSettingsPage() {
  const [formDetails] = useAtom(formDetailsAtom);

  const { formName, orgUsers } = formDetails;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      form_name: '',
      form_description: '',
      email_recipients: [],
      email_threads: true,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <section className='container'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='form_name'
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
            name='form_description'
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

          <FormField
            control={form.control}
            name='email_recipients'
            render={() => (
              <FormItem>
                <div className='mb-4'>
                  <FormLabel className='text-base'>
                    Email Notifications
                  </FormLabel>
                  <FormDescription>
                    Select admins to receive email notifications.
                  </FormDescription>
                </div>
                {orgUsers?.map((user) => (
                  <FormField
                    key={user.id}
                    control={form.control}
                    name='email_recipients'
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={user.id}
                          className='flex flex-row items-start space-x-3 space-y-0'>
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(user.id || '')}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, user.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== user.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className='font-normal cursor-pointer'>
                            <span className='mr-1'>{user.name}</span>
                            <span className='text-muted-foreground'>
                              {'('}
                              {user.email}
                              {')'}
                            </span>
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='email_threads'
            render={({ field }) => (
              <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                <div className='space-y-0.5'>
                  <FormLabel className='text-base'>Email Threads</FormLabel>
                  <FormDescription>
                    {form.watch('email_threads')
                      ? 'Enabled: grouping notifications from the same form in one email thread'
                      : 'Disabled: creating a separate email thread for each notification'}
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type='submit'>
            <SaveIcon className='mr-2' size={18} />
            Save Changes
          </Button>
        </form>
      </Form>
    </section>
  );
}
