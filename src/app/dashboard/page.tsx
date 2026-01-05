
"use client";

import { useApp } from "@/lib/app-context";
import { format, isToday, parse } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock } from "lucide-react";
import { AdherenceChart } from "@/components/dashboard/adherence-chart";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import type { Medicine } from "@/lib/types";
import Image from "next/image";

export default function DashboardPage() {
  const { medicines, adherenceLogs, logAdherence } = useApp();
  const { toast } = useToast();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const todaySchedules = medicines
    .flatMap(med => {
      const today = new Date();
      const isDueToday =
        med.schedule.frequency === 'daily' ||
        med.schedule.frequency === 'twice-daily' ||
        (med.schedule.frequency === 'weekly' && med.schedule.days?.includes(today.getDay()));

      if (!isDueToday) return [];

      return med.schedule.times.map(time => ({
        medicine: med,
        time,
        dateTime: parse(time, 'HH:mm', today),
      }));
    })
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());

  const isTaken = (medId: string, time: string) => {
    return adherenceLogs.some(
      log => log.medicineId === medId && isToday(log.takenAt) && log.scheduledTime === time
    );
  };
  
  const handleTakeDose = (medId: string, medName: string, scheduledTime: string) => {
    logAdherence({
      medicineId: medId,
      medicineName: medName,
      takenAt: new Date(),
      scheduledTime,
    });
    toast({
      title: "Dose Logged!",
      description: `You've taken your ${medName}.`,
    });
  };

  useEffect(() => {
    const checkSchedules = () => {
      const currentTime = format(now, 'HH:mm');
      todaySchedules.forEach(({ medicine, time }) => {
        if (time === currentTime && !isTaken(medicine.id, time)) {
          toast({
            title: "Time for your medicine!",
            description: (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <Image 
                    src={medicine.imageUrl || "https://picsum.photos/seed/105/400/400"}
                    data-ai-hint={medicine.imageHint || 'medicine'}
                    alt={medicine.name}
                    width={56}
                    height={56}
                    className="rounded-md object-cover"
                  />
                  <div>
                    <p className="font-bold text-lg">{medicine.name}</p>
                    <p>{medicine.dosage}</p>
                  </div>
                </div>
                <Button size="sm" onClick={() => handleTakeDose(medicine.id, medicine.name, time)} className="w-full">
                  Take Dose
                </Button>
              </div>
            ),
            duration: 30000, // Show for 30 seconds
          });
        }
      });
    };

    checkSchedules();
  }, [now, todaySchedules, isTaken, toast, handleTakeDose]);


  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Welcome Back!</h1>
        <p className="text-muted-foreground">Here's your medication summary for today, {format(new Date(), 'EEEE, MMMM do')}.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Today's Schedule</CardTitle>
            <CardDescription>All your medication doses for today.</CardDescription>
          </CardHeader>
          <CardContent>
            {todaySchedules.length > 0 ? (
              <div className="space-y-4">
                {todaySchedules.map(({ medicine, time }, index) => {
                  const taken = isTaken(medicine.id, time);
                  return (
                    <div key={`${medicine.id}-${time}-${index}`} className={`flex items-center justify-between p-3 rounded-lg ${taken ? 'bg-secondary' : 'bg-card'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${taken ? 'bg-green-200' : 'bg-primary/20'}`}>
                          {taken ? <CheckCircle2 className="h-6 w-6 text-green-700"/> : <Clock className="h-6 w-6 text-primary"/>}
                        </div>
                        <div>
                          <p className="font-semibold">{medicine.name} <span className="font-normal text-muted-foreground">{medicine.dosage}</span></p>
                          <p className="text-sm text-muted-foreground">{format(parse(time, 'HH:mm', new Date()), 'p')}</p>
                        </div>
                      </div>
                      {!taken && (
                         <Button size="sm" onClick={() => handleTakeDose(medicine.id, medicine.name, time)}>
                            Take
                         </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No medications scheduled for today.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="col-span-1 space-y-6">
           <AdherenceChart logs={adherenceLogs} medicines={medicines}/>
        </div>
      </div>
    </div>
  );
}

    