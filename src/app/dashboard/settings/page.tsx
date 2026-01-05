"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application settings.
        </p>
      </div>

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
              <Input id="name" defaultValue="Jane Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="jane.doe@example.com" disabled />
            </div>
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" placeholder="Enter your age" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="chronic-diseases">Chronic Diseases (optional)</Label>
                <Textarea id="chronic-diseases" placeholder="e.g., Hypertension, Diabetes" />
             </div>
          </div>
        </CardContent>
        <CardFooter>
            <Button>Save Changes</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Preferences</CardTitle>
          <CardDescription>
            This section is under development.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Future settings will include notification preferences and data export options.</p>
        </CardContent>
      </Card>
    </div>
  );
}
