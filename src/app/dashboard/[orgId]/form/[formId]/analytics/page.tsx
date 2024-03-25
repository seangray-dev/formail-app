'use client';

import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formDetailsAtom } from '@/jotai/state';
import { useQuery } from 'convex/react';
import { eachDayOfInterval, format, startOfWeek, subDays } from 'date-fns';
import { useAtom } from 'jotai';
import { InfinityIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { api } from '../../../../../../../convex/_generated/api';
import { Id } from '../../../../../../../convex/_generated/dataModel';

type Submission = {
  _creationTime: number;
};

type GroupedData = {
  name: string;
  total: number;
};

export default function FormAnalyticsPage() {
  const [timeFrame, setTimeFrame] = useState<'day' | 'week' | 'month'>('day');
  const [chartData, setChartData] = useState<GroupedData[]>([]);
  const [formDetails] = useAtom(formDetailsAtom);
  const { formId } = formDetails;
  const user = useQuery(api.users.getMe);
  const remainingSubmissions = user?.remainingSubmissions || 0;
  const progressValue = (remainingSubmissions / 500) * 100;
  const isSubActive = useQuery(
    api.utils.checkUserSubscription,
    user ? { userId: user._id } : 'skip'
  );
  const submissions = useQuery(
    api.submissions.getSubmissionsByFormId,
    formId ? { formId: formId as Id<'forms'> } : 'skip'
  );
  const submissionCount = submissions?.length;

  useEffect(() => {
    if (submissions) {
      const processedData = groupSubmissionsByTimeFrame(submissions, timeFrame);
      setChartData(processedData);
    }
  }, [submissions, timeFrame]);

  const groupSubmissionsByTimeFrame = (
    submissions: Submission[],
    timeFrame: 'day' | 'week' | 'month'
  ) => {
    const endDate = new Date();

    const startDate =
      timeFrame === 'day' ? subDays(endDate, 30) : subDays(endDate, 365);

    const dateList =
      timeFrame === 'month'
        ? eachDayOfInterval({ start: startDate, end: endDate }).filter(
            (date) => date.getDate() === 1
          )
        : timeFrame === 'week'
        ? eachDayOfInterval({ start: startDate, end: endDate }).filter(
            (date) => date.getDay() === 0
          )
        : eachDayOfInterval({ start: startDate, end: endDate });

    const groupedSubmissions = submissions.reduce(
      (acc: Record<string, number>, submission: Submission) => {
        const date = new Date(submission._creationTime);
        const key =
          timeFrame === 'day'
            ? format(date, 'yyyy-MM-dd')
            : timeFrame === 'week'
            ? format(startOfWeek(date, { weekStartsOn: 0 }), 'yyyy-MM-dd')
            : format(date, 'yyyy-MM');
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {}
    );

    // create chart data
    const chartData = dateList.map((date) => {
      const key =
        timeFrame === 'day'
          ? format(date, 'yyyy-MM-dd')
          : timeFrame === 'week'
          ? format(startOfWeek(date, { weekStartsOn: 0 }), 'yyyy-MM-dd')
          : format(date, 'yyyy-MM');
      return { name: key, total: groupedSubmissions[key] || 0 };
    });

    return chartData;
  };

  return (
    <div className='flex-1 flex flex-col items-center gap-10 container'>
      <div className='w-full flex justify-between text-muted-foreground mb-20'>
        <div className='flex flex-col gap-4'>
          <p>Total Form Submissions</p>
          <p className='text-lg font-bold text-primary'>{submissionCount}</p>
        </div>
        <div className='flex flex-col gap-4'>
          <p>Remaining Account Submissions</p>
          <Progress value={progressValue} />
          <p className='text-lg font-bold text-primary'>
            {isSubActive ? (
              <InfinityIcon />
            ) : (
              <div>{remainingSubmissions} / 500</div>
            )}
          </p>
        </div>
      </div>
      <div className='self-end'>
        <div className='ml-2'>Submissions by:</div>
        <Select
          value={timeFrame}
          onValueChange={(value) =>
            setTimeFrame(value as 'day' | 'week' | 'month')
          }>
          <SelectTrigger className='w-[180px]'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='day'>{'Last 30 Days'}</SelectItem>
            <SelectItem value='week'>Week</SelectItem>
            <SelectItem value='month'>Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ResponsiveContainer width='100%' height={350}>
        <BarChart data={chartData}>
          <XAxis
            dataKey='name'
            stroke='#888888'
            fontSize={12}
            tickLine={false}
            axisLine={true}
          />
          <YAxis
            stroke='#888888'
            fontSize={12}
            tickLine={false}
            axisLine={true}
            tickFormatter={(value) => `${Math.round(value)}`}
          />
          <Tooltip
            cursor={{ fill: '#888888' }}
            content={({ payload, label }) => {
              if (payload && payload.length > 0) {
                return (
                  <div className='bg-muted p-4 border-border rounded-lg'>
                    <p>{label}</p>
                    <p>{`Submissions: ${payload[0].value}`}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey='total' fill='#ffffff' />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
