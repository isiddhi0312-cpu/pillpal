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
import { Pill } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center justify-center gap-4 mb-8">
          <div className="bg-primary text-primary-foreground p-4 rounded-full shadow-md">
            <Pill className="w-10 h-10" />
          </div>
          <h1 className="text-5xl font-headline font-bold text-foreground">
            PillPal
          </h1>
          <p className="text-muted-foreground text-center">
            Your AI-powered assistant to manage your medication.
          </p>
        </div>
        <Card className="shadow-2xl rounded-xl">
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

    