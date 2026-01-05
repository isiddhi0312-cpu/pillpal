import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pill, HeartPulse, Stethoscope, Syringe, Activity } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 overflow-hidden">
      <div className="relative w-full max-w-sm">

        {/* Floating Icons */}
        <HeartPulse className="absolute -top-16 -left-16 w-16 h-16 text-primary/30 animate-pulse" />
        <Stethoscope className="absolute -top-24 right-0 w-20 h-20 text-accent/30 animate-pulse delay-500" />
        <Syringe className="absolute bottom-24 -right-24 w-16 h-16 text-primary/20 animate-pulse delay-1000" />
        <Activity className="absolute bottom-8 -left-20 w-12 h-12 text-accent/20 animate-pulse delay-700" />


        <div className="flex flex-col items-center justify-center gap-4 mb-8">
          <div className="bg-primary text-primary-foreground p-4 rounded-full shadow-md z-10">
            <Pill className="w-10 h-10" />
          </div>
          <h1 className="text-5xl font-headline font-bold text-foreground z-10">
            PillPal
          </h1>
          <p className="text-muted-foreground text-center z-10">
            Your AI-powered assistant to manage your medication.
          </p>
        </div>
        <Card className="shadow-2xl rounded-xl z-10">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" asChild>
              <Link href="/dashboard">Sign In</Link>
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              This is a demo. Click "Sign In" to continue.
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
