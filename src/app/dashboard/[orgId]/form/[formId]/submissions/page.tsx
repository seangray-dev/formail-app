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
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useOrgUserDetails } from "@/hooks/useOrgUserDetails";
import { formDetailsAtom } from "@/jotai/state";
import { exportToCsv, exportToJson } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { formatRelative } from "date-fns";
import { useAtom } from "jotai";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  FileDownIcon,
  MailIcon,
  ShieldAlertIcon,
  TrashIcon,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../convex/_generated/dataModel";
type submissionId = Id<"submissions">;
type SubmissionData = {
  [key: string]: string;
};

export default function SubmissionsPage() {
  const { isLoading, user } = useOrgUserDetails();
  const [formDetails] = useAtom(formDetailsAtom);
  const { formId } = formDetails;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSubmissionIds, setSelectedSubmissionIds] = useState<
    submissionId[]
  >([]);
  const [checkedSubmissions, setcheckedSubmissions] = useState(
    new Set<submissionId>(),
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const submissions = useQuery(
    api.submissions.getSubmissionsByFormId,
    formId ? { formId: formId as Id<"forms"> } : "skip",
  );

  const filteredSubmissions =
    submissions?.filter((submission) => {
      const submissionData = JSON.parse(submission.data);
      return Object.values(submissionData).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }) || [];

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSubmissions.length / rowsPerPage),
  );
  const indexOfLastSubmission = Math.min(
    currentPage * rowsPerPage,
    filteredSubmissions.length,
  );
  const indexOfFirstSubmission = (currentPage - 1) * rowsPerPage;
  const currentSubmissions = filteredSubmissions.slice(
    indexOfFirstSubmission,
    indexOfLastSubmission,
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(parseInt(value, 10));
    setCurrentPage(1);
  };

  const deleteSubmission = useMutation(api.submissions.deleteSubmissionById);

  const onDeleteSingle = (submissionId: submissionId) => {
    handleDeleteClick([submissionId]);
  };

  const onDeleteMultiple = () => {
    handleDeleteClick(Array.from(checkedSubmissions));
  };

  const handleDeleteClick = (submissionIds: submissionId[]) => {
    setSelectedSubmissionIds(submissionIds);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirmation = async () => {
    for (const submissionId of selectedSubmissionIds) {
      try {
        await deleteSubmission({ submissionId });
        setcheckedSubmissions((prev) => {
          const newSet = new Set(prev);
          newSet.delete(submissionId);
          return newSet;
        });
      } catch (error) {
        toast.error("Error deleting submission", {
          description: `Could not delete submission with ID ${submissionId}.`,
        });
      }
    }
    setIsDeleteDialogOpen(false);
    setSelectedSubmissionIds([]);
    toast.success("Selected submission(s) deleted successfully");
  };

  // Handle individual checkbox change
  const handleCheckboxChange = (submissionId: submissionId) => {
    setcheckedSubmissions((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(submissionId)) {
        newSelected.delete(submissionId);
      } else {
        newSelected.add(submissionId);
      }
      return newSelected;
    });
  };

  // Handle select all checkboxes
  const handleSelectAllChange = () => {
    if (checkedSubmissions.size === submissions?.length) {
      setcheckedSubmissions(new Set());
    } else {
      const allSubmissionIds = new Set(submissions?.map((sub) => sub._id));
      setcheckedSubmissions(allSubmissionIds);
    }
  };

  const selectedData: SubmissionData[] =
    submissions
      ?.filter((submission) => checkedSubmissions.has(submission._id))
      .map((submission) => JSON.parse(submission.data)) || [];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  if (isLoading || !user.isSignedIn) return <div>loading...</div>;

  return (
    <section className="container flex flex-1 flex-col">
      {submissions && submissions.length > 0 ? (
        <>
          <div className="mb-4 flex items-center justify-between bg-muted px-4 py-2">
            <div>Selected: {checkedSubmissions.size}</div>
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={"outline"}
                    disabled={checkedSubmissions.size === 0}
                    className="flex items-center gap-2 hover:border-white hover:bg-transparent"
                  >
                    <FileDownIcon size={18} />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => exportToJson(selectedData)}>
                    JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportToCsv(selectedData)}>
                    CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                aria-label="Delete selected submissions"
                size={"icon"}
                variant={"destructive"}
                onClick={onDeleteMultiple}
                disabled={checkedSubmissions.size === 0}
              >
                <TrashIcon size={18} />
              </Button>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-4 bg-muted px-4 py-2 md:flex-row md:items-center">
            <div>
              <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="text-center md:text-left">
              Showing {currentSubmissions?.length} /{" "}
              {filteredSubmissions.length} result
              {"(s)"}
            </div>
            <div className="item-center flex gap-2">
              <div className="mx-auto flex items-center gap-4 md:mx-0">
                <Button
                  aria-label="Go to previous page"
                  onClick={() => {
                    handlePreviousPage();
                  }}
                  variant={"outline"}
                  size={"icon"}
                  className="hover:border-white hover:bg-transparent"
                  disabled={currentPage === 1}
                >
                  <ArrowLeftIcon size={18} />
                </Button>
                <span className="text-sm">
                  Page {currentPage} / {totalPages}
                </span>
                <Button
                  aria-label="Go to next page"
                  onClick={() => {
                    handleNextPage();
                  }}
                  variant={"outline"}
                  size={"icon"}
                  className="hover:border-white hover:bg-transparent"
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <ArrowRightIcon size={18} />
                </Button>
              </div>
            </div>
          </div>
          <Table className="w-full border">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] border-r">
                  <Checkbox
                    aria-label="Select all submissions"
                    checked={checkedSubmissions.size === submissions?.length}
                    onClick={handleSelectAllChange}
                  />
                </TableHead>
                <TableHead className="border-r">Date</TableHead>
                <TableHead className="border-r">Data</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentSubmissions?.map((submission, index) => (
                <TableRow
                  key={index}
                  className={`${
                    checkedSubmissions.has(submission._id) ? "bg-muted" : ""
                  }`}
                >
                  <TableCell className="border-r font-medium">
                    <Checkbox
                      aria-label="Select submission"
                      checked={checkedSubmissions.has(submission._id)}
                      onClick={() => handleCheckboxChange(submission._id)}
                    />
                  </TableCell>
                  <TableCell className="border-r">
                    <div className="flex flex-col gap-2">
                      {formatRelative(submission._creationTime, new Date())}
                    </div>
                  </TableCell>
                  <TableCell className="border-r">
                    <div className="flex flex-col gap-2">
                      {Object.entries(
                        JSON.parse(submission.data) as Record<string, string>,
                      ).map(([key, value]) => (
                        <div key={key} className="flex gap-2">
                          <span className="font-medium">{key}:</span>
                          <span className="text-muted-foreground">{value}</span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* TODO: implement email to submitter */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger aria-label="Email to submitter">
                            <MailIcon
                              className="text-muted-foreground transition-all duration-150 hover:text-white"
                              size={20}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Email</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      {/* TODO: implement mark as spam + determine logic for handling this  */}
                      {/* <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger aria-label="Mark submission as spam">
                            <ShieldAlertIcon
                              className="text-muted-foreground transition-all duration-150 hover:text-white"
                              size={20}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Mark as spam</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider> */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger
                            aria-label="Delete submission"
                            onClick={() => onDeleteSingle(submission._id)}
                          >
                            <TrashIcon
                              className="text-muted-foreground transition-all duration-150 hover:text-destructive"
                              size={20}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete Submission</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between gap-2 bg-muted px-4 py-2">
            <div className="mx-auto flex items-center gap-4 md:mx-0">
              <Button
                aria-label="Go to previous page"
                onClick={() => {
                  handlePreviousPage();
                }}
                variant={"outline"}
                size={"icon"}
                className="hover:border-white hover:bg-transparent"
                disabled={currentPage === 1}
              >
                <ArrowLeftIcon size={18} />
              </Button>
              <span className="text-sm">
                Page {Math.min(currentPage, totalPages)} / {totalPages}
              </span>
              <Button
                aria-label="Go to next page"
                onClick={() => {
                  handleNextPage();
                }}
                variant={"outline"}
                size={"icon"}
                className="hover:border-white hover:bg-transparent"
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ArrowRightIcon size={18} />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Label>Rows per page</Label>
              <Select
                onValueChange={handleRowsPerPageChange}
                value={rowsPerPage.toLocaleString()}
              >
                <SelectTrigger
                  className="w-[70px]"
                  aria-label="Select rows per page"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                  <SelectItem value="40">40</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-10">
          <Image alt="" width={200} height={200} src="/no_submissions.svg" />
          <div className="text-center text-base md:text-2xl">
            You don&apos;t have any submissions for this form yet.
          </div>
        </div>
      )}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedSubmissionIds.length > 1
                ? "Are you sure you want to delete these submissions?"
                : "Are you sure you want to delete this submission?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              submission and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirmation}
              className="bg-destructive text-destructive-foreground transition-all duration-150 hover:bg-destructive/80"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
