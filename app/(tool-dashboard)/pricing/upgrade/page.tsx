"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CreditCard, CheckCircle2, Lock, Shield, Zap } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { createClient } from "@/supabase/client";

// Define TypeScript interfaces
interface UserDetails {
  id: string;
  email: string;
  currentPlan?: string;
  firstName?: string;
  lastName?: string;
}

interface PlanPrice {
  price: number;
  credits: number;
  features?: string[];
}

interface Plan {
  name: string;
  monthly: PlanPrice;
  annual: PlanPrice;
}

interface PlansCollection {
  [key: string]: Plan;
}

export default function UpgradePlanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const planId = searchParams?.get("plan") || "professional";
  const billingCycle = searchParams?.get("billing") || "monthly";
  
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<UserDetails | null>(null);
  
  // Dummy user data - replace with actual fetch in production
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // For now, just use dummy data instead of fetching
        const dummyUser: UserDetails = {
          id: "user-1",
          email: "john.doe@example.com",
          firstName: "John",
          lastName: "Doe",
          currentPlan: "free"
        };
        
        setUser(dummyUser);
        
        // Comment out real auth code for now
        /*
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUser({
            id: user.id,
            email: user.email || "",
          });
        } else {
          // Not logged in - redirect to login
          toast.error("Please sign in to upgrade your plan");
          router.push("/auth/signin?redirect=/pricing/upgrade");
        }
        */
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to load user data");
      }
    };
    
    fetchUser();
  }, []);
  
  // Enhanced plan details with more features
  const plans: PlansCollection = {
    "basic": {
      name: "Basic",
      monthly: {
        price: 14.99,
        credits: 5000,
        features: [
          "5,000 AI Credits",
          "All standard personas",
          "Advanced content rewriting",
          "Export to plain text and HTML",
          "Email support"
        ]
      },
      annual: {
        price: 149.99,
        credits: 5000 * 12,
        features: [
          "60,000 AI Credits (5,000 monthly)",
          "All standard personas",
          "Advanced content rewriting",
          "Export to plain text and HTML",
          "Email support",
          "2 months free compared to monthly"
        ]
      }
    },
    "professional": {
      name: "Professional",
      monthly: {
        price: 29.99,
        credits: 10000,
        features: [
          "10,000 AI Credits",
          "All standard personas",
          "Advanced content rewriting",
          "Export to multiple formats",
          "Priority email support",
          "Unlimited custom personas",
          "WordPress integration"
        ]
      },
      annual: {
        price: 299.99,
        credits: 10000 * 12,
        features: [
          "120,000 AI Credits (10,000 monthly)",
          "All standard personas",
          "Advanced content rewriting",
          "Export to multiple formats",
          "Priority email support",
          "Unlimited custom personas",
          "WordPress integration",
          "2 months free compared to monthly"
        ]
      }
    },
    "business": {
      name: "Business",
      monthly: {
        price: 59.99,
        credits: 25000,
        features: [
          "25,000 AI Credits",
          "All premium features",
          "Dedicated support",
          "Team collaboration",
          "Advanced analytics",
          "API access"
        ]
      },
      annual: {
        price: 599.99,
        credits: 25000 * 12,
        features: [
          "300,000 AI Credits (25,000 monthly)",
          "All premium features",
          "Dedicated support",
          "Team collaboration",
          "Advanced analytics",
          "API access",
          "2 months free compared to monthly"
        ]
      }
    }
  };
  
  // Payment methods - dummy data
  const savedPaymentMethods = [
    {
      id: "card-1",
      type: "card",
      brand: "visa",
      last4: "4242",
      expMonth: 12,
      expYear: 2024,
      name: "John Doe"
    }
  ];
  
  const selectedPlan = plans[planId as keyof PlansCollection];
  
  if (!selectedPlan) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Plan Not Found</CardTitle>
            <CardDescription>The selected plan does not exist.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/pricing">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Return to Plans
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  const price = billingCycle === "annual" 
    ? selectedPlan.annual.price 
    : selectedPlan.monthly.price;
  
  const credits = billingCycle === "annual"
    ? selectedPlan.annual.credits
    : selectedPlan.monthly.credits;
    
  const features = billingCycle === "annual"
    ? selectedPlan.annual.features || []
    : selectedPlan.monthly.features || [];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real app, you would handle the payment processing here
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success("Plan upgraded successfully!", {
        description: `You have been upgraded to the ${selectedPlan.name} plan.`,
      });
      
      // Redirect to profile page after successful upgrade
      router.push("/profile/user-1");
    } catch (error) {
      console.error("Error upgrading plan:", error);
      toast.error("Failed to upgrade plan");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <main className="flex min-h-screen flex-col p-4 md:p-8 bg-slate-50">
      <div className="w-full max-w-3xl mx-auto">
        <div className="flex items-center mb-8">
          <Link 
            href="/pricing" 
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Plans
          </Link>
        </div>
        
        {user && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Upgrade to {selectedPlan.name}</h1>
            <p className="text-slate-600">
              Hi {user.firstName || user.email.split('@')[0]}, you're upgrading from 
              <span className="font-medium"> {user.currentPlan?.toUpperCase() || "FREE"}</span> to 
              <span className="font-medium"> {selectedPlan.name.toUpperCase()}</span>
            </p>
          </div>
        )}
        
        <div className="grid md:grid-cols-5 gap-6">
          {/* Left Column - Order Summary */}
          <div className="md:col-span-2">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
                <CardDescription>
                  {selectedPlan.name} Plan ({billingCycle === "annual" ? "Annual" : "Monthly"})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">
                      {selectedPlan.name} ({billingCycle === "annual" ? "Annual" : "Monthly"})
                    </span>
                    <span className="font-medium">${price}</span>
                  </div>
                  
                  {billingCycle === "annual" && (
                    <div className="flex justify-between items-center text-green-600 text-sm">
                      <span>Annual discount</span>
                      <span>-${(selectedPlan.monthly.price * 12 - selectedPlan.annual.price).toFixed(2)}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center font-medium">
                    <span>Total</span>
                    <span className="text-lg">${price}</span>
                  </div>
                  
                  <div className="text-sm text-slate-500">
                    {billingCycle === "annual" 
                      ? "Billed annually" 
                      : "Billed monthly"}
                  </div>
                </div>
                
                <div className="mt-6 bg-blue-50 p-3 rounded-md">
                  <div className="flex items-center">
                    <Zap className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-sm text-blue-800">
                      {credits.toLocaleString()} credits
                      {billingCycle === "annual" ? " per year" : " per month"}
                    </span>
                  </div>
                  
                  {features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center mt-1">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 mr-2 shrink-0" />
                      <span className="text-xs text-blue-800">{feature}</span>
                    </div>
                  ))}
                  
                  <div className="flex items-center mt-1">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-xs text-blue-800">
                      14-day money-back guarantee
                    </span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <div className="text-xs text-slate-500 flex items-center">
                  <Shield className="h-3 w-3 mr-1 text-slate-400" />
                  Secure payment processing by Stripe
                </div>
              </CardFooter>
            </Card>
          </div>
          
          {/* Right Column - Payment Form */}
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Details
                </CardTitle>
                <CardDescription>
                  Complete your purchase securely
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Saved Payment Methods - Only show when we have saved methods */}
                  {savedPaymentMethods.length > 0 && (
                    <div className="space-y-2 mb-4">
                      <Label>Saved payment methods</Label>
                      <div className="border border-slate-200 rounded-md p-3 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-10 h-8 bg-slate-100 flex items-center justify-center rounded mr-3">
                            <span className="text-xs font-semibold text-slate-800">VISA</span>
                          </div>
                          <div>
                            <div className="font-medium text-sm">•••• 4242</div>
                            <div className="text-xs text-slate-500">Expires 12/2024</div>
                          </div>
                        </div>
                        <Button type="button" variant="ghost" size="sm">Use</Button>
                      </div>
                      
                      <Separator className="my-4" />
                      <p className="text-sm text-slate-500">Or enter new payment details</p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="card-name">Name on card</Label>
                    <Input id="card-name" placeholder="John Doe" required defaultValue={user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : ""} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card number</Label>
                    <Input id="card-number" placeholder="1234 5678 9012 3456" required />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry date</Label>
                      <Input id="expiry" placeholder="MM/YY" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="billing-address">Billing address</Label>
                    <Input id="billing-address" placeholder="123 Main St." required />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="New York" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP / Postal code</Label>
                      <Input id="zip" placeholder="10001" required />
                    </div>
                  </div>
                  
                  <div className="flex items-center pt-4">
                    <Lock className="h-4 w-4 text-slate-500 mr-2" />
                    <span className="text-xs text-slate-500">Your payment is secure. We use SSL encryption.</span>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Processing...' : `Pay $${price} and Upgrade`}
                  </Button>
                  
                  <p className="text-xs text-center text-slate-500 pt-2">
                    By clicking "Pay", you agree to our <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}