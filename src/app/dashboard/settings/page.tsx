"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-context";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

const profileSchema = z.object({
  name: z.string().min(1, "Full name is required."),
  email: z.string().email(),
  age: z.coerce.number().min(0, "Age must be a positive number.").optional(),
  chronicDiseases: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function SettingsPage() {
  const { userProfile, updateUserProfile } = useApp();
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: userProfile,
  });

  useEffect(() => {
    form.reset(userProfile);
  }, [userProfile, form]);

  const onSubmit = (data: ProfileFormValues) => {
    updateUserProfile(data);
    toast({
      title: "Profile Updated",
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application settings.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">User Profile</CardTitle>
            <CardDescription>
              Update your personal information here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field }) => <Input id="name" {...field} />}
                />
                {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                 <Controller
                  name="email"
                  control={form.control}
                  render={({ field }) => <Input id="email" type="email" {...field} disabled />}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Controller
                  name="age"
                  control={form.control}
                  render={({ field }) => <Input id="age" type="number" placeholder="Enter your age" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : e.target.value)} />}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chronic-diseases">Chronic Diseases (optional)</Label>
                 <Controller
                  name="chronicDiseases"
                  control={form.control}
                  render={({ field }) => <Textarea id="chronic-diseases" placeholder="e.g., Hypertension, Diabetes" {...field} />}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Save Changes</Button>
          </CardFooter>
        </Card>
      </form>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Notification Preferences</CardTitle>
          <CardDescription>
            Manage how you receive alerts. Push notifications require configuration and are currently disabled.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts on your mobile device.</p>
                </div>
                <Switch id="push-notifications" disabled />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get summaries and alerts via email.</p>
                </div>
                <Switch id="email-notifications" disabled />
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
