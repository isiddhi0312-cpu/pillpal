import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export default function BillingPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and payment details.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <CreditCard className="w-8 h-8 text-primary" />
          <div>
            <CardTitle className="font-headline">Current Plan</CardTitle>
            <CardDescription>
              You are currently on the <span className="font-semibold text-primary">PillPal Free</span> plan.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
           <div className="p-8 text-center border-2 border-dashed rounded-lg">
                <h3 className="text-lg font-semibold">Billing Management Not Available</h3>
                <p className="text-muted-foreground">This is a demo application. Billing features are not implemented.</p>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
