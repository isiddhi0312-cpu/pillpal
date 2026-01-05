"use client";

import { useMemo } from 'react';
import { useApp } from "@/lib/app-context";
import { AdherenceChart } from "@/components/dashboard/adherence-chart";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { isAfter, subDays } from 'date-fns';

export default function ReportsPage() {
  const { medicines, adherenceLogs } = useApp();

  const weeklyStats = useMemo(() => {
    const sevenDaysAgo = subDays(new Date(), 7);
    const relevantLogs = adherenceLogs.filter(log => isAfter(log.takenAt, sevenDaysAgo));
    
    const totalScheduled = medicines.reduce((total, med) => {
        let count = 0;
        for (let i = 0; i < 7; i++) {
            const day = subDays(new Date(), i);
            const dayIndex = day.getDay();
            if (med.schedule.frequency === 'daily' || med.schedule.frequency === 'twice-daily') {
                count += med.schedule.times.length;
            } else if (med.schedule.frequency === 'weekly' && med.schedule.days?.includes(dayIndex)) {
                count += med.schedule.times.length;
            }
        }
        return total + count;
    }, 0);

    const totalTaken = relevantLogs.length;
    const adherenceRate = totalScheduled > 0 ? Math.round((totalTaken / totalScheduled) * 100) : 0;

    return { totalTaken, totalScheduled, adherenceRate };
  }, [medicines, adherenceLogs]);


  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Adherence Report</h1>
        <p className="text-muted-foreground">
          Review your medication adherence over the past week.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
            <AdherenceChart logs={adherenceLogs} medicines={medicines} />
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className='font-headline'>Weekly Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className='text-center'>
                    <p className="text-5xl font-bold">{weeklyStats.adherenceRate}%</p>
                    <p className="text-muted-foreground">Adherence Rate</p>
                </div>
                <div>
                  <Progress value={weeklyStats.adherenceRate} className="w-full" />
                </div>
                <div className="flex justify-between text-sm">
                    <div className="text-center">
                        <p className="font-bold text-lg">{weeklyStats.totalTaken}</p>
                        <p className="text-muted-foreground">Doses Taken</p>
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-lg">{weeklyStats.totalScheduled}</p>
                        <p className="text-muted-foreground">Doses Scheduled</p>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

    