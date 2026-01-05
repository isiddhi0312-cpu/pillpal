"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

// SVGs for cartoon characters
const OlderMan = () => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 animate-pulse">
      <circle cx="50" cy="50" r="40" fill="#E0F2FE" />
      <circle cx="50" cy="45" r="30" fill="#F3E8D8" />
      <path d="M 35 60 Q 50 75 65 60" stroke="#5C3D2E" strokeWidth="3" fill="none" />
      <circle cx="40" cy="45" r="3" fill="#5C3D2E" />
      <circle cx="60" cy="45" r="3" fill="#5C3D2E" />
      <path d="M 30 30 Q 50 20 70 30" stroke="#A9A9A9" strokeWidth="4" fill="none" />
      <rect x="35" y="50" width="30" height="3" fill="#A9A9A9" />
    </svg>
);

const OlderWoman = () => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-28 h-28 animate-pulse">
       <circle cx="50" cy="50" r="40" fill="#FEF3C7" />
      <circle cx="50" cy="45" r="30" fill="#F3E8D8" />
      <path d="M 35 62 Q 50 72 65 62" stroke="#5C3D2E" strokeWidth="3" fill="none" />
      <circle cx="42" cy="48" r="3" fill="#5C3D2E" />
      <circle cx="58" cy="48" r="3" fill="#5C3D2E" />
      <path d="M 30 25 C 20 40, 80 40, 70 25" stroke="#D1D5DB" strokeWidth="4" fill="none" />
      <path d="M 40 45 Q 35 40 30 45" stroke="#A9A9A9" strokeWidth="2" fill="none" />
      <path d="M 60 45 Q 65 40 70 45" stroke="#A9A9A9" strokeWidth="2" fill="none" />
    </svg>
);

const Child = () => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 animate-pulse">
      <circle cx="50" cy="50" r="35" fill="#D1FAE5" />
      <circle cx="50" cy="50" r="25" fill="#F3E8D8" />
      <path d="M 40 60 Q 50 70 60 60" stroke="#5C3D2E" strokeWidth="3" fill="none" />
      <circle cx="43" cy="50" r="4" fill="#5C3D2E" />
      <circle cx="57" cy="50" r="4" fill="#5C3D2E" />
      <path d="M 40 40 L 60 40" stroke="#6B46C1" strokeWidth="3" fill="none" />
    </svg>
);

const MedicineBottle = () => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 animate-pulse">
        <rect x="30" y="20" width="40" height="10" rx="2" fill="#F472B6"/>
        <rect x="25" y="30" width="50" height="50" rx="5" fill="#FCCEEB"/>
        <rect x="35" y="40" width="30" height="30" rx="3" fill="white" />
        <path d="M 40 50 h 20" stroke="#F472B6" strokeWidth="4" strokeLinecap="round" />
        <path d="M 50 40 v 20" stroke="#F472B6" strokeWidth="4" strokeLinecap="round" />
    </svg>
);

const Syringe = () => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 -rotate-45 animate-pulse">
        <rect x="10" y="45" width="60" height="10" rx="3" fill="#A5B4FC"/>
        <polygon points="65,40 75,45 75,55 65,60" fill="#A5B4FC" />
        <line x1="75" y1="50" x2="90" y2="50" stroke="#818CF8" strokeWidth="3" />
        <rect x="5" y="40" width="10" height="20" rx="2" fill="#818CF8"/>
        <rect x="15" y="47" width="40" height="6" rx="2" fill="#4338CA" />
    </svg>
);

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 overflow-hidden">
      <div className="relative w-full max-w-sm">
        {/* Floating Characters & Icons */}
        <div className="absolute -top-16 -left-20">
          <OlderMan />
        </div>
        <div className="absolute -top-24 right-0">
          <OlderWoman />
        </div>
        <div className="absolute bottom-8 -left-24">
          <Child />
        </div>
        <div className="absolute top-1/2 -right-20">
          <MedicineBottle />
        </div>
        <div className="absolute bottom-0 -right-10">
          <Syringe />
        </div>

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

        {authMode === "login" ? (
          <LoginForm setAuthMode={setAuthMode} />
        ) : (
          <SignUpForm setAuthMode={setAuthMode} />
        )}
      </div>
    </main>
  );
}


function LoginForm({ setAuthMode }: { setAuthMode: (mode: "login" | "signup") => void }) {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "password" || password === "") {
      router.push("/dashboard");
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "The password you entered is incorrect.",
      });
    }
  };

  return (
    <form onSubmit={handleSignIn}>
      <Card className="shadow-2xl rounded-xl z-10">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                href="#"
                onClick={(e) => { e.preventDefault(); toast({ title: "Forgot Password", description: "This feature is not yet implemented." })}}
                className="ml-auto inline-block text-sm underline"
              >
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" type="submit">
            Sign In
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="#" onClick={(e) => { e.preventDefault(); setAuthMode("signup"); }} className="underline">
              Sign up
            </Link>
          </p>
          <p className="text-center text-sm text-muted-foreground">
            This is a demo. Use any email and `password` or leave it blank to sign in.
          </p>
        </CardFooter>
      </Card>
    </form>
  );
}

function SignUpForm({ setAuthMode }: { setAuthMode: (mode: "login" | "signup") => void }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [diseases, setDiseases] = useState('');

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    const userProfile = {
      name,
      email,
      age: age ? parseInt(age, 10) : undefined,
      chronicDiseases: diseases
    };
    // In a real app, you'd save this to a backend. Here, we save to sessionStorage.
    sessionStorage.setItem('userProfile', JSON.stringify(userProfile));
    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleSignUp}>
      <Card className="shadow-2xl rounded-xl z-10">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Create Account</CardTitle>
          <CardDescription>
            Join PillPal today to start managing your health.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" required value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email-signup">Email</Label>
            <Input id="email-signup" type="email" placeholder="name@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
           <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" placeholder="35" value={age} onChange={e => setAge(e.target.value)} />
            </div>
             <div className="grid gap-2">
              <Label htmlFor="password-signup">Password</Label>
              <Input id="password-signup" type="password" required />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="diseases">Chronic Diseases (optional)</Label>
            <Textarea id="diseases" placeholder="e.g., Hypertension, Diabetes" value={diseases} onChange={e => setDiseases(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" type="submit">
            Create Account
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="#" onClick={(e) => { e.preventDefault(); setAuthMode("login"); }} className="underline">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </form>
  );
}
