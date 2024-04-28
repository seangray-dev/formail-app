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
import { Button } from "@/components/ui/button";
import { formDetailsAtom } from "@/jotai/state";
import { useMutation } from "convex/react";
import { useAtom } from "jotai";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "../../../convex/_generated/api";

export function DeleteSubmissions({ formId }: any) {
  const deleteSubmissions = useMutation(api.forms.deleteSubmissionsForForm);
  async function handleDeleteSubmissions(formId: any) {
    try {
      await deleteSubmissions({ formId: formId });
      toast.success("Form Deleted", {
        description: "Your form has been succesxsfully deleted.",
      });
    } catch (error) {
      toast.error("Deletion Failed", {
        description:
          "There was a problem deleting your form. Please try again.",
      });
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant={"destructive"}>
          <TrashIcon className="mr-2" size={18} />
          Delete All Submissions
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently submissions for
            this form and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDeleteSubmissions(formId)}
            className="bg-destructive text-destructive-foreground transition-all duration-150 hover:bg-destructive/80"
          >
            Delete Submissions
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function DeleteForm({ formId }: any) {
  const [, setFormDetails] = useAtom(formDetailsAtom);
  const router = useRouter();
  const deleteForm = useMutation(api.forms.deleteForm);

  async function handleDeleteForm(formId: any) {
    try {
      setFormDetails((prev) => ({
        ...prev,
        formId: undefined,
        formName: undefined,
        formDescription: undefined,
      }));
      router.push("/dashboard");
      await deleteForm({ formId: formId });
      toast.success("Form Deleted", {
        description: "Your form has been successfully deleted.",
      });
    } catch (error) {
      toast.error("Deletion Failed", {
        description:
          "There was a problem deleting your form. Please try again.",
      });
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant={"destructive"}>
          <TrashIcon className="mr-2" size={18} />
          Delete Form
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your form
            and all associated submissions from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDeleteForm(formId)}
            className="bg-destructive text-destructive-foreground transition-all duration-150 hover:bg-destructive/80"
          >
            Delete Form
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
