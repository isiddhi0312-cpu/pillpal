"use client";

import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { subDays, format, isSameDay, getDay } from 'date-fns';
import type { AdherenceLog, Medicine } from "@/lib/types";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface AdherenceChartProps {
  logs: AdherenceLog[];
  medicines: Medicine[];
}

const chartConfig = {
  taken: {
    label: "Taken",
    color: "hsl(var(--chart-1))",
  },
  scheduled: {
    label: "Scheduled",
    color: "hsl(var(--chart-2))",
  },
};

export function AdherenceChart({ logs, medicines }: AdherenceChartProps) {
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();

    return last7Days.map(day => {
      const dayOfWeek = format(day, 'EEE');

      const scheduledDoses = medicines.reduce((count, med) => {
        const dayIndex = getDay(day);
        if (med.schedule.frequency === 'daily') {
          return count + med.schedule.times.length;
        }
        if (med.schedule.frequency === 'twice-daily') {
          return count + med.schedule.times.length;
        }
        if (med.schedule.frequency === 'weekly' && med.schedule.days?.includes(dayIndex)) {
          return count + med.schedule.times.length;
        }
        return count;
      }, 0);

      const takenDoses = logs.filter(log => isSameDay(log.takenAt, day)).length;

      return {
        date: dayOfWeek,
        taken: takenDoses,
        scheduled: scheduledDoses,
      };
    });
  }, [logs, medicines]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Weekly Adherence</CardTitle>
        <CardDescription>Doses taken vs. scheduled for the last 7 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              allowDecimals={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="taken" fill="var(--color-taken)" radius={4} />
            <Bar dataKey="scheduled" fill="var(--color-scheduled)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

    