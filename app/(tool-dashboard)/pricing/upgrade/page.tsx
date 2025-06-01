"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CreditCard, CheckCircle2, Lock, Shield, Zap, Star, Sparkles } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
// import { createClient } from "@/supabase/client";

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

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const slideIn = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function UpgradePlanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const planId = searchParams?.get("plan") || "professional";
  const billingCycle = searchParams?.get("billing") || "monthly";
  
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<UserDetails | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [useSavedCard, setUseSavedCard] = useState(false);
  
  // Prevent hydration errors with SSR
  useEffect(() => {
    setIsClient(true);
  }, []);
  
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
      <motion.div 
        className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-lg border border-red-200">
          <CardHeader className="bg-red-50">
            <CardTitle className="text-red-700">Plan Not Found</CardTitle>
            <CardDescription>The selected plan does not exist.</CardDescription>
          </CardHeader>
          <CardFooter className="pt-6">
            <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
              <Link href="/pricing">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Return to Plans
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
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
  
  // Get icon based on plan ID
  const getPlanIcon = () => {
    switch(planId) {
      case "professional": return <Star className="h-5 w-5 text-amber-500" />;
      case "business": return <Shield className="h-5 w-5 text-purple-600" />;
      case "basic": return <Zap className="h-5 w-5 text-blue-500" />;
      default: return <Sparkles className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Get background gradient based on plan ID
  const getPlanGradient = () => {
    switch(planId) {
      case "professional": return "bg-gradient-to-r from-blue-600 to-blue-700";
      case "business": return "bg-gradient-to-r from-purple-600 to-purple-700";
      case "basic": return "bg-gradient-to-r from-blue-500 to-sky-500";
      default: return "bg-gradient-to-r from-gray-600 to-gray-700";
    }
  };
  
  if (!isClient) {
    return null; // Prevent rendering before hydration
  }
  
  return (
    <main className="flex min-h-screen flex-col p-4 md:p-8 bg-gradient-to-b from-slate-50 to-slate-100">
      <motion.div 
        className="w-full max-w-3xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <motion.div 
          className="flex items-center mb-8"
          variants={slideIn}
        >
          <Link 
            href="/pricing" 
            className="text-blue-600 hover:text-blue-800 flex items-center group transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-1 group-hover:translate-x-[-3px] transition-transform duration-300" />
            Back to Plans
          </Link>
        </motion.div>
        
        {user && (
          <motion.div 
            className="mb-8"
            variants={fadeIn}
          >
            <div className="flex items-center gap-2 mb-2">
              {getPlanIcon()}
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Upgrade to {selectedPlan.name}
              </h1>
            </div>
            <div className="pl-7">
              <p className="text-slate-600">
                Hi {user.firstName || user.email.split('@')[0]}, you are upgrading from 
                <span className="font-medium"> {user.currentPlan?.toUpperCase() || "FREE"}</span> to 
                <span className="font-medium"> {selectedPlan.name.toUpperCase()}</span>
              </p>
            </div>
          </motion.div>
        )}
        
        <motion.div 
          className="grid md:grid-cols-5 gap-6"
          variants={staggerContainer}
        >
          {/* Left Column - Order Summary */}
          <motion.div 
            className="md:col-span-2"
            variants={fadeIn}
          >
            <Card className="sticky top-6 shadow-md overflow-hidden border-slate-200">
              <CardHeader className={`${getPlanGradient()} text-white`}>
                <CardTitle className="text-lg flex items-center gap-2">
                  {getPlanIcon()}
                  Order Summary
                </CardTitle>
                <CardDescription className="text-white/80">
                  {selectedPlan.name} Plan ({billingCycle === "annual" ? "Annual" : "Monthly"})
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">
                      {selectedPlan.name} ({billingCycle === "annual" ? "Annual" : "Monthly"})
                    </span>
                    <span className="font-medium">${price}</span>
                  </div>
                  
                  {billingCycle === "annual" && (
                    <motion.div 
                      className="flex justify-between items-center text-green-600 text-sm bg-green-50 p-2 rounded-md"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-1.5" />
                        Annual discount
                      </span>
                      <span>-${(selectedPlan.monthly.price * 12 - selectedPlan.annual.price).toFixed(2)}</span>
                    </motion.div>
                  )}
                  
                  <Separator className="bg-slate-200" />
                  
                  <div className="flex justify-between items-center font-medium">
                    <span>Total</span>
                    <motion.span 
                      className="text-xl font-bold text-blue-600"
                      animate={{ scale: [1, 1.03, 1] }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      ${price}
                    </motion.span>
                  </div>
                  
                  <div className="text-sm text-slate-500">
                    {billingCycle === "annual" 
                      ? "Billed annually" 
                      : "Billed monthly"}
                  </div>
                </div>
                
                <motion.div 
                  className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100"
                  variants={fadeIn}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center">
                    <Zap className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-sm font-semibold text-blue-800">
                      {credits.toLocaleString()} credits
                      {billingCycle === "annual" ? " per year" : " per month"}
                    </span>
                  </div>
                  
                  <motion.div 
                    className="mt-2 space-y-1.5"
                    variants={staggerContainer}
                  >
                    {features.slice(0, 3).map((feature, index) => (
                      <motion.div 
                        key={index} 
                        className="flex items-center"
                        variants={fadeIn}
                        custom={index}
                        transition={{ delay: 0.15 + index * 0.1 }}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 mr-2 shrink-0" />
                        <span className="text-xs text-blue-800">{feature}</span>
                      </motion.div>
                    ))}
                    
                    <motion.div 
                      className="flex items-center pt-1"
                      variants={fadeIn}
                      transition={{ delay: 0.6 }}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600 mr-2 shrink-0" />
                      <span className="text-xs text-green-800 font-medium">
                        14-day money-back guarantee
                      </span>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </CardContent>
              
              <CardFooter className="bg-slate-50 border-t border-slate-200 py-3 px-6">
                <motion.div 
                  className="text-xs text-slate-500 flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Shield className="h-3 w-3 mr-1 text-slate-400" />
                  Secure payment processing by Stripe
                </motion.div>
              </CardFooter>
            </Card>
          </motion.div>
          
          {/* Right Column - Payment Form */}
          <motion.div 
            className="md:col-span-3"
            variants={slideIn}
            custom={1}
          >
            <Card className="shadow-lg border-slate-200">
              <CardHeader className="space-y-1.5">
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                  Payment Details
                </CardTitle>
                <CardDescription>
                  Complete your purchase securely to upgrade your plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Saved Payment Methods - Only show when we have saved methods */}
                  {savedPaymentMethods.length > 0 && (
                    <motion.div 
                      className="space-y-2 mb-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Label className="text-blue-800">Saved payment methods</Label>
                      <motion.div 
                        className={`border rounded-md p-3.5 flex justify-between items-center cursor-pointer transition-all duration-300 ${
                          useSavedCard ? 
                          'border-blue-400 bg-blue-50 shadow-sm' : 
                          'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                        }`}
                        whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(59, 130, 246, 0.1)" }}
                        onClick={() => setUseSavedCard(!useSavedCard)}
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center rounded mr-3 text-white">
                            <span className="text-xs font-semibold">VISA</span>
                          </div>
                          <div>
                            <div className="font-medium text-sm">•••• 4242</div>
                            <div className="text-xs text-slate-500">Expires 12/2024</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {useSavedCard ? (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="h-5 w-5 bg-blue-600 rounded-full flex items-center justify-center"
                            >
                              <CheckCircle2 className="h-4 w-4 text-white" />
                            </motion.div>
                          ) : (
                            <div className="h-5 w-5 border-2 border-slate-300 rounded-full"></div>
                          )}
                        </div>
                      </motion.div>
                      
                      <AnimatePresence>
                        {!useSavedCard && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <Separator className="my-4 bg-slate-200" />
                            <p className="text-sm text-slate-500">Enter new payment details</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                  
                  <AnimatePresence>
                    {!useSavedCard && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                      >
                        <motion.div 
                          className="space-y-2"
                          variants={fadeIn}
                        >
                          <Label htmlFor="card-name" className="text-slate-700">Name on card</Label>
                          <Input 
                            id="card-name" 
                            placeholder="John Doe" 
                            required 
                            defaultValue={user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : ""} 
                            className="border-slate-300 focus:border-blue-400 focus:ring-blue-400/20"
                          />
                        </motion.div>
                        
                        <motion.div 
                          className="space-y-2"
                          variants={fadeIn}
                        >
                          <Label htmlFor="card-number" className="text-slate-700">Card number</Label>
                          <Input 
                            id="card-number" 
                            placeholder="1234 5678 9012 3456" 
                            required 
                            className="border-slate-300 focus:border-blue-400 focus:ring-blue-400/20"
                          />
                        </motion.div>
                        
                        <motion.div 
                          className="grid grid-cols-2 gap-4"
                          variants={fadeIn}
                        >
                          <div className="space-y-2">
                            <Label htmlFor="expiry" className="text-slate-700">Expiry date</Label>
                            <Input 
                              id="expiry" 
                              placeholder="MM/YY" 
                              required 
                              className="border-slate-300 focus:border-blue-400 focus:ring-blue-400/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvc" className="text-slate-700">CVC</Label>
                            <Input 
                              id="cvc" 
                              placeholder="123" 
                              required 
                              className="border-slate-300 focus:border-blue-400 focus:ring-blue-400/20"
                            />
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          className="space-y-2 pt-2"
                          variants={fadeIn}
                        >
                          <Label htmlFor="billing-address" className="text-slate-700">Billing address</Label>
                          <Input 
                            id="billing-address" 
                            placeholder="123 Main St." 
                            required 
                            className="border-slate-300 focus:border-blue-400 focus:ring-blue-400/20"
                          />
                        </motion.div>
                        
                        <motion.div 
                          className="grid grid-cols-2 gap-4"
                          variants={fadeIn}
                        >
                          <div className="space-y-2">
                            <Label htmlFor="city" className="text-slate-700">City</Label>
                            <Input 
                              id="city" 
                              placeholder="New York" 
                              required 
                              className="border-slate-300 focus:border-blue-400 focus:ring-blue-400/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="zip" className="text-slate-700">ZIP / Postal code</Label>
                            <Input 
                              id="zip" 
                              placeholder="10001" 
                              required 
                              className="border-slate-300 focus:border-blue-400 focus:ring-blue-400/20"
                            />
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <motion.div 
                    className="flex items-center pt-4"
                    variants={fadeIn}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="p-2 bg-blue-50 rounded-full">
                      <Lock className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="ml-2 text-xs text-slate-500">Your payment information is secure. We use SSL encryption.</span>
                  </motion.div>
                  
                  <motion.div
                    variants={fadeIn}
                    transition={{ delay: 0.7 }}
                  >
                    <Button 
                      type="submit" 
                      className={`w-full ${getPlanGradient()} hover:opacity-90 transition-all duration-300 py-6`} 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </div>
                      ) : (
                        <span className="flex items-center">
                          Pay ${price} and Upgrade 
                          <ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
                        </span>
                      )}
                    </Button>
                    
                    <p className="text-xs text-center text-slate-500 pt-3">
                      By clicking Pay , you agree to our <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
                    </p>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
            
            <motion.div 
              className="mt-5 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-sm text-slate-500">
                Need help? <Link href="/support" className="text-blue-600 hover:underline">Contact support</Link>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </main>
  );
}