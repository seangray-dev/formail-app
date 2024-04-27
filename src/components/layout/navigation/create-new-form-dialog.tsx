import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useOrganization, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { Loader2, PlusIcon } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../../../../convex/_generated/api";
import { Button } from "../../ui/button";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(50),
});

export default function CreateFormDialog() {
  const posthog = usePostHog();
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
      name: "",
      description: "",
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
      posthog.capture("form created");
      form.reset();
      setIsFormOpen(false);
      toast({
        variant: "default",
        title: "Form Created",
        description: "You can now start collecting submissions!",
      });
    } catch (err) {
      let errorMessage = "Your form was not created, please try again.";
      if (err instanceof ConvexError) {
        errorMessage = err.data;
        posthog.capture("form failed to create - not subscribed");
      } else {
        posthog.capture("form failed to create - unknown error");
      }
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: errorMessage,
      });
    }
  }

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogTrigger asChild>
        <div className="flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm transition-all duration-150 hover:bg-secondary">
          <PlusIcon className="h-4 w-4" />
          <span>Create New Form</span>
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
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
              name="description"
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
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create
            </Button>
          </form>
        </Form>
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Cancel
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
