"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formDetailsAtom } from "@/jotai/state";
import { exportToCsv, exportToJson } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useConvex } from "convex/react";
import { endOfDay, format, subDays } from "date-fns";
import { useAtom } from "jotai";
import { Calendar as CalendarIcon } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../convex/_generated/dataModel";

const FormSchema = z.object({
  timeRange: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
  }),
  fileFormat: z.string({
    required_error: "Please select a format to export.",
  }),
});

export default function ExportPage() {
  const convex = useConvex();
  const posthog = usePostHog();
  const [formDetails] = useAtom(formDetailsAtom);
  const { formId, formName } = formDetails;
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const disableFutureDates = (date: Date) => {
    return endOfDay(date) > endOfDay(new Date());
  };

  const handleDateChange = (newRange?: DateRange) => {
    if (
      newRange &&
      (newRange.from?.getTime() !== dateRange.from?.getTime() ||
        newRange.to?.getTime() !== dateRange.to?.getTime())
    ) {
      setDateRange(newRange);
      form.setValue("timeRange", newRange, { shouldValidate: true });
    }
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { fileFormat, timeRange } = data;
    if (!timeRange.from || !timeRange.to) {
      toast.error("Please select a complete date range.");
      return;
    }

    try {
      const fromDate = timeRange.from.getTime();
      const toDate = timeRange.to.getTime();

      const submissions = await convex.query(
        api.submissions.getSubmissionsByDateRange,
        {
          formId: formId as Id<"forms">,
          fromDate,
          toDate,
        },
      );
      if (!submissions || submissions.length === 0) {
        toast.error("No data to export.", {
          description: "No submissions found in the selected date range.",
        });
        return;
      }

      if (fileFormat === "json") {
        exportToJson(submissions, formName);
        toast.success("Check your downloads for your file");
        posthog.capture("submission data: exported");
      }

      if (fileFormat === "csv") {
        exportToCsv(submissions, formName);
        toast.success("Check your downloads for your file");
        posthog.capture("submission data: exported");
      }
    } catch (error) {
      console.error("Error exporting submissions:", error);
      posthog.capture("submission data: error exporting");
      toast.error("Failed to create export.", {
        description:
          "There was an error exporting your data. Please try again.",
      });
    }
  }

  return (
    <section className="container flex flex-1 flex-col">
      <div className="mb-10">
        <div className="mb-6 text-lg font-semibold">Create Export</div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-72 space-y-8"
          >
            <FormField
              control={form.control}
              name="fileFormat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Format</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a format to export" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timeRange"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Period Start to Period End</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="justify-start text-left font-normal"
                        onClick={() => field.onChange(dateRange)}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from
                          ? dateRange.to
                            ? `${format(
                                dateRange.from,
                                "LLL dd, yyyy",
                              )} - ${format(dateRange.to, "LLL dd, yyyy")}`
                            : format(dateRange.from, "LLL dd, yyyy")
                          : "Pick a date range"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={handleDateChange}
                        numberOfMonths={2}
                        disabled={disableFutureDates}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Create Export</Button>
          </form>
        </Form>
      </div>
    </section>
  );
}
