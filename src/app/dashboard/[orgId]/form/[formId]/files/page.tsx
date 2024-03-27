"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { formDetailsAtom } from "@/jotai/state";
import { useMutation, useQuery } from "convex/react";
import { formatRelative } from "date-fns";
import { useAtom } from "jotai";
import { EyeIcon, FilesIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { api } from "../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../convex/_generated/dataModel";
type submissionId = Id<"submissions">;
type FileWithUrl = {
  url: string;
  type: "image/jpeg" | "image/png" | "application/pdf";
  storageId: string;
};

export default function FilesPage() {
  const { toast } = useToast();
  const [formDetails] = useAtom(formDetailsAtom);
  const { formId } = formDetails;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] =
    useState<Id<"submissions"> | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const userActive = useQuery(api.users.getMe);
  const isSubActive = useQuery(
    api.utils.checkUserSubscription,
    userActive ? { userId: userActive._id } : "skip",
  );

  const formQueryArg = formId ? { formId: formId as Id<"forms"> } : "skip";
  const submissions = useQuery(
    api.submissions.getSubmissionsByFormId,
    formQueryArg,
  );
  const deleteSubmission = useMutation(api.submissions.deleteSubmissionById);

  const handleDeleteClick = (submissionId: Id<"submissions">) => {
    setSelectedSubmissionId(submissionId);
    setIsDeleteDialogOpen(true);
  };

  const handleDetailsClick = (submissionId: Id<"submissions">) => {
    setSelectedSubmissionId(submissionId);
    setIsDetailsDialogOpen(true);
  };

  const handleDeleteConfirmation = async () => {
    if (selectedSubmissionId) {
      try {
        await deleteSubmission({ submissionId: selectedSubmissionId });
        setIsDeleteDialogOpen(false);
        setSelectedSubmissionId(null);
        toast({ variant: "default", title: "Submission deleted successfully" });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Deleting submission failed, please try again.",
        });
      }
    }
  };

  const selectedSubmission = submissions?.find(
    (sub) => sub._id === selectedSubmissionId,
  );

  const handleDownloadAllFiles = () => {
    console.log("Downloading all files");
    console.log("Selected Submission", selectedSubmission);
    selectedSubmission?.files?.forEach((file) => {
      // @ts-ignore
      window.open(`/download-files?fileId=${file.storageId}`, "_blank");
    });
  };

  const handleSortChange = (value: string) => {
    setSortOrder(value);
  };

  const sortedSubmissions = [...(submissions || [])].sort((a, b) => {
    const dateA = new Date(a._creationTime).getTime();
    const dateB = new Date(b._creationTime).getTime();

    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  const submissionsWithFiles = sortedSubmissions.filter(
    (submission) => submission.files && submission.files.length > 0,
  );

  const showUpgradeImage = !isSubActive && submissionsWithFiles?.length === 0;

  function RenderFile({
    file,
    index,
  }: {
    file: { url: string; type: string };
    index: number;
  }) {
    // Use the 'url' from the file metadata directly
    switch (file.type) {
      case "image/jpeg":
      case "image/png":
      case "image/gif":
        return (
          <img
            src={file.url}
            alt={`File ${index + 1}`}
            className="h-fit w-full object-cover"
          />
        );
      case "application/pdf":
        // For PDFs, using an iframe to embed the PDF content
        return (
          <iframe
            src={file.url}
            title={`PDF File ${index + 1}`}
            width="400"
            height="600"
          ></iframe>
        );
      default:
        // Fallback for unknown or unsupported file types - provide a download link
        return (
          <a href={file.url} download={`File ${index + 1}`}>
            Download File
          </a>
        );
    }
  }

  return (
    <section className="container mx-auto flex flex-1 flex-col p-4">
      {showUpgradeImage && (
        <div className="flex flex-1 flex-col items-center justify-center gap-10">
          <Image alt="upgrade" src="/upgrade.svg" width={200} height={200} />
          <p className="text-center text-base md:text-2xl">
            Upgrade to start receiving file submissions
          </p>
        </div>
      )}
      {submissionsWithFiles && submissionsWithFiles.length > 0 && (
        <>
          <div className="mb-10 flex gap-4 self-end">
            <Button className="max-w-44">Download All Files</Button>
            <Select
              onValueChange={(value) => {
                handleSortChange(value);
              }}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col flex-wrap gap-4 sm:flex-row">
            {submissionsWithFiles.map((submission) => (
              <Card
                key={submission._id}
                className="flex flex-col items-center p-4 sm:w-80"
              >
                <CardHeader className="mb-6 p-0">
                  <CardTitle className="text-xs">
                    ID: {submission._id}
                  </CardTitle>
                </CardHeader>
                <CardContent className="mb-6 flex flex-col items-center p-0">
                  <FilesIcon className="mb-4 h-20 w-20" />
                  <p className="text-sm text-muted-foreground">
                    {formatRelative(submission._creationTime, new Date())}
                  </p>
                </CardContent>
                <CardFooter className="md:flew-row flex w-full flex-col gap-2 p-0">
                  <Button
                    variant="secondary"
                    className="flex w-full items-center gap-2"
                    onClick={() => handleDetailsClick(submission._id)}
                  >
                    <EyeIcon size={18} />
                    View Details
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex w-full items-center gap-2"
                    onClick={() => handleDeleteClick(submission._id)}
                  >
                    <TrashIcon size={18} />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}

      {isSubActive && submissionsWithFiles.length === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center gap-10">
          <Image alt="No files" src="/no_files.svg" width={200} height={200} />
          <p className="text-center text-base md:text-2xl">
            You don&apos;t have any file submissions for this form yet.
          </p>
        </div>
      )}

      {/* MODAL */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this submission & file{"(s)"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              submission and any associated file{"(s)"} from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              // onClick={''}
              className="bg-destructive text-destructive-foreground transition-all duration-150 hover:bg-destructive/80"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="px-10">
          <DialogHeader>
            <DialogTitle>File Details</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {selectedSubmission && (
              <>
                <h4>Submission Info:</h4>
                <ul>
                  {Object.entries(JSON.parse(selectedSubmission.data)).map(
                    ([key, value]) => (
                      <li
                        className="indent-4"
                        key={key}
                      >{`${key}: ${value}`}</li>
                    ),
                  )}
                </ul>
              </>
            )}
          </DialogDescription>
          {selectedSubmission?.files && selectedSubmission.files.length > 0 && (
            <>
              <Carousel>
                <CarouselContent>
                  {selectedSubmission.files.map((file, index) => (
                    <CarouselItem
                      key={index}
                      className="flex flex-col items-center justify-center"
                    >
                      <RenderFile
                        file={file as FileWithUrl}
                        index={index ?? 0}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="ml-3" />
                <CarouselNext className="mr-3" />
              </Carousel>
              <DialogFooter className="mx-auto">
                <div className="mt-4 text-center">
                  <Button onClick={handleDownloadAllFiles}>
                    Download File{"(s)"}
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
