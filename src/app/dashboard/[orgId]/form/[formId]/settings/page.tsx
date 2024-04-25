"use client";

import {
  DeleteForm,
  DeleteSubmissions,
} from "@/components/form-settings/delete-actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { formDetailsAtom } from "@/jotai/state";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { useAtom } from "jotai";
import { SaveIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { api } from "../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../convex/_generated/dataModel";

const formSchema = z.object({
  form_name: z
    .string()
    .min(2, {
      message: "Form name must be at least 2 characters.",
    })
    .optional(),
  form_description: z.string().optional(),
  email_recipients: z.array(z.string()),
  email_threads: z.boolean().default(true),
  honeypot_field: z.string().optional(),
  custom_spam_words: z
    .string()
    .optional()
    .transform((value) => {
      return value
        ? value
            .split(/[\s,]+/)
            .filter(Boolean)
            .join(", ")
        : "";
    }),
  spam_protection_service: z.string().optional(),
  spam_protection_secret: z.string().optional(),
});

export default function FormSettingsPage() {
  const { toast } = useToast();
  const [formDetails] = useAtom(formDetailsAtom);
  const updateFormSettingsMutation = useMutation(api.forms.updateFormSettings);
  const { orgUsers, formId } = formDetails;
  const formSettings = useQuery(
    api.forms.getFormById,
    formId ? { formId: formId as Id<"forms"> } : "skip",
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      form_name: "",
      form_description: "",
      email_recipients: [],
      email_threads: true,
      honeypot_field: "",
      custom_spam_words: "",
      spam_protection_service: "",
      spam_protection_secret: "",
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (formSettings) {
      const {
        settings: {
          emailRecipients,
          emailThreads,
          honeypotField,
          customSpamWords,
          spamProtectionService,
          spamProtectionSecret,
        } = {},
      } = formSettings;

      reset({
        form_name: formSettings.name || "",
        form_description: formSettings.description || "",
        email_recipients: emailRecipients,
        email_threads: emailThreads,
        honeypot_field: honeypotField,
        custom_spam_words: customSpamWords,
        spam_protection_service: spamProtectionService,
        spam_protection_secret: spamProtectionSecret,
      });
    }
  }, [formSettings, reset]);

  const spamProtectionService = useWatch({
    control: form.control,
    name: "spam_protection_service",
    defaultValue: "None",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Ensure formId is correctly typed as Id<'forms'>
    const typedFormId = formId as Id<"forms">;
    const { form_name, form_description } = values;
    const settings = {
      emailRecipients: values.email_recipients,
      emailThreads: values.email_threads,
      honeypotField: values.honeypot_field,
      customSpamWords: values.custom_spam_words,
      spamProtectionService: values.spam_protection_service || "",
      spamProtectionSecret: values.spam_protection_secret,
    };

    if (
      values.spam_protection_service !== "None" &&
      !values.spam_protection_secret
    ) {
      form.setError("spam_protection_secret", {
        type: "manual",
        message: "Spam Protection Secret Key is required",
      });
      return;
    }

    if (!formId) {
      console.error("Form ID is undefined.");
      return;
    }

    try {
      await updateFormSettingsMutation({
        formId: typedFormId,
        name: form_name || "",
        description: form_description || "",
        settings,
      });
      toast({
        variant: "default",
        title: "Updated Form Settings",
        description:
          "Your settings for this form have successfully been updated.",
      });
      reset();
    } catch (err: any) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (err.message.includes("No user identity provided")) {
        errorMessage = "You must be logged in to update settings.";
      } else if (err.message.includes("you do not have access")) {
        errorMessage = "Only admins can update form settings.";
      }
      console.log(err);
      toast({
        variant: "destructive",
        title: "Failed to update settings for this form",
        description: `${errorMessage}`,
      });
    }
  }

  return (
    <section className="container">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="form_name"
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
            name="form_description"
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
            name="email_recipients"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">
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
                    name="email_recipients"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={user.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(user.id || "")}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, user.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== user.id,
                                      ),
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="cursor-pointer font-normal">
                            <span className="mr-1">{user.name}</span>
                            <span className="text-muted-foreground">
                              {"("}
                              {user.email}
                              {")"}
                            </span>
                            {" - "}
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
            name="email_threads"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Email Threads</FormLabel>
                  <FormDescription>
                    {form.watch("email_threads")
                      ? "Enabled: grouping notifications from the same form in one email thread"
                      : "Disabled: creating a separate email thread for each notification"}
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
            name="honeypot_field"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Honeypot Field</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="example: form_honeypot" />
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
            name="custom_spam_words"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Spam Words</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="example: spam, junk" />
                </FormControl>
                <FormDescription>
                  Enter words separated by commas that should be flagged as
                  spam.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
            control={form.control}
            name="spam_protection_service"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Spam Protection Service</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Google reCAPTCHA v2">
                        Google reCAPTCHA v2
                      </SelectItem>
                      <SelectItem value='Botpoison'>Botpoison</SelectItem>
                      <SelectItem value='hCaptcha'>hCaptcha</SelectItem>
                      <SelectItem value='Turnstile'>Turnstile</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {spamProtectionService !== "None" && (
            <FormField
              control={form.control}
              rules={{
                required:
                  spamProtectionService !== "None"
                    ? "Spam Protection Secret Key is required"
                    : false,
              }}
              name="spam_protection_secret"
              render={({ field, fieldState: { error } }) => (
                <FormItem>
                  <FormLabel>Spam Protection Secret Key</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter secret key"
                    />
                  </FormControl>
                  {error && <FormMessage>{error.message}</FormMessage>}
                </FormItem>
              )}
            />
          )} */}

          <div className="flex flex-col gap-4 md:flex-row md:justify-between">
            <DeleteSubmissions formId={formId} />
            <DeleteForm formId={formId} />
            <Button type="submit">
              <SaveIcon className="mr-2" size={18} />
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
