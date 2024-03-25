'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { formDetailsAtom } from '@/jotai/state';
import { exportToCsv, exportToJson } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from 'convex/react';
import { endOfDay, format, subDays } from 'date-fns';
import { useAtom } from 'jotai';
import { Calendar as CalendarIcon } from 'lucide-react';
import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { api } from '../../../../../../../convex/_generated/api';
import { Id } from '../../../../../../../convex/_generated/dataModel';

const FormSchema = z.object({
  timeRange: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
  }),
  fileFormat: z.string({
    required_error: 'Please select a format to export.',
  }),
});

export default function ExportPage() {
  const [formDetails] = useAtom(formDetailsAtom);
  const { formId, formName } = formDetails;
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const disableFutureDates = (date: Date) => {
    return endOfDay(date) > endOfDay(new Date());
  };
  const fromDate = dateRange?.from?.getTime() || 0;
  const toDate = dateRange?.to?.getTime() || Date.now();

  const submissions = useQuery(api.submissions.getSubmissionsByDateRange, {
    formId: formId as Id<'forms'>,
    fromDate,
    toDate,
  });

  console.log(submissions);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { fileFormat } = data;

    try {
      if (!submissions || submissions.length === 0) {
        toast({
          title: 'No data to export.',
          description: 'No submissions found in the selected date range.',
          variant: 'destructive',
        });
        return;
      }

      // Create a custom filename based on form name and date range
      const formattedFromDate = format(fromDate, 'yyyy-MM-dd');
      const formattedToDate = format(toDate, 'yyyy-MM-dd');

      if (fileFormat === 'json') {
        const exportFileName = `${formName}_${formattedFromDate}_to_${formattedToDate}.json`;
        exportToJson(submissions, exportFileName);
      } else if (fileFormat === 'csv') {
        const exportFileName = `${formName}_${formattedFromDate}_to_${formattedToDate}.csv`;
        exportToCsv(submissions, exportFileName);
      }

      toast({
        title: 'Export created successfully!',
        description: `Your data has been exported as a ${fileFormat.toUpperCase()} file.`,
      });
    } catch (error) {
      console.error('Error exporting submissions:', error);
      toast({
        title: 'Failed to create export.',
        description:
          'There was an error exporting your data. Please try again.',
        variant: 'destructive',
      });
    }
  }

  return (
    <section className='container flex-1 flex flex-col'>
      <div className='mb-10'>
        <div className='mb-6 font-semibold text-lg'>Create Export</div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-8 max-w-72'>
            <FormField
              control={form.control}
              name='fileFormat'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Format</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a format to export' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='json'>JSON</SelectItem>
                      <SelectItem value='csv'>CSV</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='timeRange'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Period Start to Period End</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className='justify-start text-left font-normal'
                        onClick={() => field.onChange(dateRange)}>
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        {dateRange?.from
                          ? dateRange.to
                            ? `${format(
                                dateRange.from,
                                'LLL dd, yyyy'
                              )} - ${format(dateRange.to, 'LLL dd, yyyy')}`
                            : format(dateRange.from, 'LLL dd, yyyy')
                          : 'Pick a date range'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        initialFocus
                        mode='range'
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                        disabled={disableFutureDates}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit'>Create Export</Button>
          </form>
        </Form>
      </div>
    </section>
  );
}
