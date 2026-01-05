"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Language</CardTitle>
          <CardDescription>
            Choose your preferred language for the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full md:w-1/2">
             <Label htmlFor="language">Language</Label>
             <Select defaultValue="en" disabled>
                <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
             </Select>
             <p className="text-sm text-muted-foreground mt-2">Language selection is not yet implemented.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
