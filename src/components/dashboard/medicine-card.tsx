"use client";

import Image from "next/image";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  MoreVertical,
  Pill,
  Trash2,
  Edit,
} from "lucide-react";
import { format, isToday } from 'date-fns';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Medicine } from "@/lib/types";
import { useApp } from "@/lib/app-context";
import { useToast } from "@/hooks/use-toast";

interface MedicineCardProps {
  medicine: Medicine;
}

const getNextDose = (medicine: Medicine) => {
    // This is a simplified logic. A real app would need a more robust scheduling library.
    const now = new Date();
    if (!medicine.schedule.times || medicine.schedule.times.length === 0) {
        return 'No time set';
    }
    const [hour, minute] = medicine.schedule.times[0].split(':').map(Number);
    const todayDoseTime = new Date();
    todayDoseTime.setHours(hour, minute, 0, 0);

    if (isToday(todayDoseTime) && now < todayDoseTime) {
        return `Today at ${format(todayDoseTime, 'p')}`;
    }
    return `Tomorrow at ${format(todayDoseTime, 'p')}`;
}

export function MedicineCard({ medicine }: MedicineCardProps) {
  const { logAdherence, deleteMedicine } = useApp();
  const { toast } = useToast();

  const handleTakeDose = (scheduledTime: string) => {
    logAdherence({
      medicineId: medicine.id,
      medicineName: medicine.name,
      takenAt: new Date(),
      scheduledTime,
    });
    toast({
      title: "Dose Logged!",
      description: `You've taken your ${medicine.name}.`,
    });
  };

  const handleDelete = () => {
     deleteMedicine(medicine.id);
     toast({
        title: "Medicine Deleted",
        description: `${medicine.name} has been removed.`,
        variant: "destructive"
     });
  }

  const scheduleText =
    medicine.schedule.frequency === 'daily' ? `Daily at ${medicine.schedule.times.join(', ')}`
    : medicine.schedule.frequency === 'twice-daily' ? `Twice daily at ${medicine.schedule.times.join(' & ')}`
    : `Weekly on ${medicine.schedule.days?.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ')} at ${medicine.schedule.times.join(', ')}`;


  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-start gap-4">
        <div className="relative flex-shrink-0">
          <Image
            src={medicine.imageUrl || "https://picsum.photos/seed/105/400/400"}
            data-ai-hint={medicine.imageHint || 'medicine'}
            alt={medicine.name}
            width={80}
            height={80}
            className="rounded-lg object-cover aspect-square"
          />
        </div>
        <div className="flex-grow">
          <CardTitle className="font-headline text-xl">{medicine.name}</CardTitle>
          <CardDescription>{medicine.dosage}</CardDescription>
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                    <MoreVertical className="h-4 w-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem disabled>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        {medicine.instructions && (
          <div className="text-sm text-muted-foreground flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{medicine.instructions}</span>
          </div>
        )}
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <Calendar className="h-4 w-4 flex-shrink-0" />
          <span>{scheduleText}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center gap-2">
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="h-3 w-3"/>
          <span>Next: {getNextDose(medicine)}</span>
        </div>
        <Button size="sm" onClick={() => handleTakeDose(medicine.schedule.times[0])}>
            <CheckCircle2 className="mr-2"/>
            Take Dose
        </Button>
      </CardFooter>
    </Card>
  );
}
