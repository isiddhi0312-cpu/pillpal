"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Camera, FileText, Loader2, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/lib/app-context";
import { extractMedicineDetailsFromImage } from "@/ai/flows/extract-medicine-details-from-image";

const medicineSchema = z.object({
  name: z.string().min(1, "Medicine name is required."),
  dosage: z.string().optional(),
  instructions: z.string().optional(),
  schedule: z.object({
    frequency: z.enum(["daily", "twice-daily", "weekly"]),
    times: z.array(z.string()).min(1, "At least one time is required."),
    days: z.array(z.number()).optional(),
  }),
});

type MedicineFormValues = z.infer<typeof medicineSchema>;

const timeSlots = Array.from({ length: 24 * 2 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  return `${String(hour).padStart(2, "0")}:${minute}`;
});

const daysOfWeek = [
  { id: 0, label: "Sun" }, { id: 1, label: "Mon" }, { id: 2, label: "Tue" },
  { id: 3, label: "Wed" }, { id: 4, label: "Thu" }, { id: 5, label: "Fri" },
  { id: 6, label: "Sat" }
];


export function AddMedicineDialog() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"options" | "form">("options");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { addMedicine } = useApp();

  const form = useForm<MedicineFormValues>({
    resolver: zodResolver(medicineSchema),
    defaultValues: {
      name: "",
      dosage: "",
      instructions: "",
      schedule: {
        frequency: "daily",
        times: ["09:00"],
        days: [],
      },
    },
  });
  const watchFrequency = form.watch("schedule.frequency");

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const dataUri = reader.result as string;
      startTransition(async () => {
        toast({
          title: "Analyzing Image...",
          description: "The AI is extracting medicine details.",
        });
        try {
          const result = await extractMedicineDetailsFromImage({ photoDataUri: dataUri });
          form.reset({
            name: result.medicineName === 'Unknown' ? '' : result.medicineName,
            dosage: result.dosage === 'Unknown' ? '' : result.dosage,
            instructions: result.instructions === 'Unknown' ? '' : result.instructions,
            schedule: { frequency: "daily", times: ["09:00"], days: [] }
          });
          toast({
            title: "Success!",
            description: "Medicine details extracted. Please review and set a schedule.",
          });
          setView("form");
        } catch (error) {
          console.error("AI extraction failed:", error);
          toast({
            variant: "destructive",
            title: "AI Extraction Failed",
            description: "Could not extract details. Please enter them manually.",
          });
          setView("form"); // Go to form for manual entry
        }
      });
    };
    reader.onerror = (error) => {
      console.error("File reading error:", error);
      toast({
        variant: "destructive",
        title: "File Error",
        description: "Could not read the selected image file.",
      });
    };
  };

  const onSubmit = (data: MedicineFormValues) => {
    addMedicine(data);
    toast({
      title: "Medicine Added",
      description: `${data.name} has been added to your list.`,
    });
    setOpen(false);
    form.reset();
    setView("options");
  };

  const onOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      form.reset();
      setView("options");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2" />
          Add Medicine
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Add New Medicine</DialogTitle>
          <DialogDescription>
            {view === "options" && "Scan your medicine label with AI or enter the details manually."}
            {view === "form" && "Review the details and set a schedule for your reminders."}
          </DialogDescription>
        </DialogHeader>

        {isPending ? (
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-muted-foreground">AI is working its magic...</p>
          </div>
        ) : view === "options" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <label htmlFor="image-upload" className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary hover:bg-secondary transition-colors">
              <Camera className="w-12 h-12 text-primary mb-2" />
              <span className="font-semibold text-center">Upload Photo</span>
              <span className="text-sm text-muted-foreground text-center">Let AI do the work</span>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
              />
            </label>
            <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-6" onClick={() => setView("form")}>
                <FileText className="w-12 h-12 text-primary mb-2" />
                <span className="font-semibold">Enter Manually</span>
                <span className="text-sm text-muted-foreground">Fill in the details yourself</span>
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medicine Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Atorvastatin" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dosage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dosage (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 20mg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="instructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instructions (optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Take one tablet at bedtime." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2 pt-4 border-t">
                 <h3 className="text-lg font-medium font-headline">Schedule</h3>
                 <FormField
                  control={form.control}
                  name="schedule.frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="twice-daily">Twice Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {watchFrequency === 'weekly' && (
                  <FormField
                    control={form.control}
                    name="schedule.days"
                    render={() => (
                      <FormItem>
                        <FormLabel>Day of the week</FormLabel>
                        <div className="flex flex-wrap gap-2">
                           {daysOfWeek.map(day => (
                            <FormField
                              key={day.id}
                              control={form.control}
                              name="schedule.days"
                              render={({ field }) => {
                                return (
                                  <FormItem key={day.id} className="flex items-center space-x-1 space-y-0">
                                    <FormControl>
                                      <Button
                                        type="button"
                                        variant={field.value?.includes(day.id) ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => {
                                          const currentDays = field.value || [];
                                          const newDays = currentDays.includes(day.id)
                                            ? currentDays.filter(d => d !== day.id)
                                            : [...currentDays, day.id];
                                          field.onChange(newDays.sort());
                                        }}
                                      >
                                        {day.label}
                                      </Button>
                                    </FormControl>
                                  </FormItem>
                                );
                              }}
                            />
                           ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <FormField
                  control={form.control}
                  name="schedule.times"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time(s)</FormLabel>
                      <div className="flex flex-col gap-2">
                        {field.value.map((time, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Select
                              value={time}
                              onValueChange={(newTime) => {
                                const newTimes = [...field.value];
                                newTimes[index] = newTime;
                                field.onChange(newTimes);
                              }}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {timeSlots.map(slot => (
                                  <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                             {field.value.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        const newTimes = field.value.filter((_, i) => i !== index);
                                        field.onChange(newTimes);
                                    }}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                             )}
                          </div>
                        ))}
                         <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                             const requiredTimes = watchFrequency === 'twice-daily' ? 2 : 1;
                             if(field.value.length < requiredTimes) {
                                field.onChange([...field.value, "17:00"]);
                             }
                          }}
                           disabled={
                              (watchFrequency === 'twice-daily' && field.value.length >= 2) ||
                              (watchFrequency !== 'twice-daily' && field.value.length >= 1)
                           }
                        >
                          <Plus className="mr-2 h-4 w-4" /> Add time
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>

              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit">Save Medicine</Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
