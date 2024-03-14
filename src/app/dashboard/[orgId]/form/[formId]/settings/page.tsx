'use client';

import {
  DeleteForm,
  DeleteSubmissions,
} from '@/components/form-settings/delete-actions';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { formDetailsAtom } from '@/jotai/state';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom } from 'jotai';
import { SaveIcon, TrashIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  form_name: z
    .string()
    .min(2, {
      message: 'Form name must be at least 2 characters.',
    })
    .optional(),
  form_description: z.string().optional(),
  email_recipients: z.array(z.string()),
  email_threads: z.boolean().default(true),
  honeypot_field: z.string().optional(),
  custom_spam_words: z.array(z.string()).optional(),
  spam_protection_service: z
    .enum(['None', 'Botpoison', 'Google reCAPTCHA v2', 'hCaptcha', 'Turnstile'])
    .optional(),
  spam_protection_secret: z.string().optional(),
});

export default function FormSettingsPage() {
  const [formDetails] = useAtom(formDetailsAtom);

  const { formName, formDescription, orgUsers, formId, orgId } = formDetails;
  const defaultAdmins =
    orgUsers
      ?.filter((user) => user.role === 'admin')
      .map((admin) => admin.id) || [];

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
                    Select users to receive email notifications.
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
                            {' - '}
                            {user.role}
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

          <FormField
            control={form.control}
            name='honeypot_field'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Honeypot Field</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='example: form_honeypot' />
                </FormControl>
                <FormDescription>
                  Enter the name of a hidden field that acts as a honeypot for
                  bots.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='custom_spam_words'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Spam Words</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='example: spam, junk' />
                </FormControl>
                <FormDescription>
                  Enter words separated by commas that should be flagged as
                  spam.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='spam_protection_service'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Spam Protection Service</FormLabel>
                <FormControl>
                  <Select>
                    <SelectTrigger>
                      <SelectValue {...field} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='None'>None</SelectItem>
                      <SelectItem value='Botpoison'>Botpoison</SelectItem>
                      <SelectItem value='Google reCAPTCHA v2'>
                        Google reCAPTCHA v2
                      </SelectItem>
                      <SelectItem value='hCaptcha'>hCaptcha</SelectItem>
                      <SelectItem value='Turnstile'>Turnstile</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='spam_protection_secret'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Spam Protection Secret Key</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='password'
                    placeholder='Enter secret key'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex flex-col gap-4 md:flex-row md:justify-between'>
            <DeleteSubmissions formId={formId} />
            <DeleteForm formId={formId} orgId={orgId} />
            <Button type='submit'>
              <SaveIcon className='mr-2' size={18} />
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
