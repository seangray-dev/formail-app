"use client";
import CreateFormDialog from "@/components/layout/navigation/create-new-form-dialog";
import RemaingSubmissions from "@/components/layout/shared/remaining-submissions";
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
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useOrgUserDetails } from "@/hooks/useOrgUserDetails";
import { useMutation, useQuery } from "convex/react";
import { BarChart2Icon, CogIcon, Loader2, TrashIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
type FormId = Id<"forms">;

export default function DashboardHomePage() {
  const { orgId, orgName, isLoading } = useOrgUserDetails();

  const forms = useQuery(api.forms.getForms, orgId ? { orgId } : "skip");
  const deleteForm = useMutation(api.forms.deleteForm);

  async function handleDeleteForm(formId: FormId) {
    try {
      await deleteForm({ formId: formId });
      toast.success("Form Deleted", {
        description: "Your Form has been successfully deleted.",
      });
    } catch (error) {
      toast.error("Deletion Failed", {
        description:
          "There was a problem deleting your form. Please try again.",
      });
    }
  }

  return (
    <main className="container flex flex-1 flex-col py-10">
      <div className="mb-8 flex items-start justify-between">
        <div className="font-medium md:text-3xl">{orgName} Forms</div>
        <CreateFormDialog />
      </div>
      <div className="mb-10 flex justify-between">
        <RemaingSubmissions />
      </div>
      {isLoading && (
        <div className="flex flex-1 flex-col items-center justify-center gap-10">
          <Loader2 className="h-10 w-10 animate-spin" />
          <div className="text-xl">Loading forms...</div>
        </div>
      )}
      {!isLoading && forms?.length === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center gap-10">
          <Image alt="" width={200} height={200} src="/no_forms.svg" />
          <div className="text-center text-base md:text-2xl">
            You have no forms. Create one to get started!
          </div>
          <CreateFormDialog />
        </div>
      )}
      <ul className="flex flex-col">
        {forms?.map((form) => {
          return (
            <li
              className="flex justify-between border-b p-4 transition-all duration-150 hover:bg-secondary"
              key={form._id}
            >
              <Link
                className="hover:underline"
                href={`/dashboard/${orgId}/form/${form._id}/submissions`}
              >
                {form.name}
              </Link>
              <div className="flex items-center gap-4">
                <div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={`/dashboard/${orgId}/form/${form._id}/settings`}
                          aria-label={`Settings for ${form.name}`}
                        >
                          <CogIcon className="h-5 w-5 text-muted-foreground transition-all duration-150 hover:text-white" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm font-normal text-muted-foreground">
                          Go to <span className="text-white">{form.name}</span>{" "}
                          settings
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={`/dashboard/${orgId}/form/${form._id}/analytics`}
                          aria-label={`Analytics for ${form.name}`}
                        >
                          <BarChart2Icon className="h-5 w-5 text-muted-foreground transition-all duration-150 hover:text-white" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm font-normal text-muted-foreground">
                          Go to <span className="text-white">{form.name}</span>{" "}
                          analytics
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger aria-label={`Delete ${form.name} form`}>
                    <TrashIcon className="h-5 w-5 text-destructive hover:text-destructive/80" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to delete the {form.name} form?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your form and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteForm(form._id)}
                        className="bg-destructive text-destructive-foreground transition-all duration-150 hover:bg-destructive/80"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
