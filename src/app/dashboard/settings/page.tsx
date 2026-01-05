"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { NoSsr } from "@/components/ui/no-ssr";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application settings.
        </p>
      </div>
        <NoSsr>
          <>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Preferences</CardTitle>
                <CardDescription>
                  Choose your preferred language and notification settings for the application.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2 w-full md:w-1/2">
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue="en" disabled>
                      <SelectTrigger id="language">
                          <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">Hindi</SelectItem>
                          <SelectItem value="hinglish">Hinglish</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                      </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-2">Language selection is not yet implemented.</p>
                </div>
              </CardContent>
            </Card>
            
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
          </>
        </NoSsr>
    </div>
  );
}
