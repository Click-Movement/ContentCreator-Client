import { Metadata } from "next";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing Plans | Content Creator",
  description: "Choose the right plan for your content creation needs",
};

// Define plan feature types
interface PlanFeature {
  name: string;
  included: boolean;
}

// Define plan types
interface Plan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: string;
    annual: string;
  };
  creditLimit: number;
  popular?: boolean;
  features: PlanFeature[];
}

// Plan features and data
const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    description: "Basic features for individuals just getting started",
    price: {
      monthly: "$0",
      annual: "$0",
    },
    creditLimit: 1000,
    features: [
      { name: "1,000 AI Credits per month", included: true },
      { name: "10 Standard Personas", included: true },
      { name: "Basic content rewriting", included: true },
      { name: "Export to plain text", included: true },
      { name: "Community support", included: true },
      { name: "Custom personas", included: false },
      { name: "Advanced formatting options", included: false },
      { name: "WordPress integration", included: false },
      { name: "Priority support", included: false },
      { name: "Team collaboration", included: false },
    ],
  },
  {
    id: "basic",
    name: "Basic",
    description: "Everything you need for small-scale content creation",
    price: {
      monthly: "$14.99",
      annual: "$149.99",
    },
    creditLimit: 5000,
    features: [
      { name: "5,000 AI Credits per month", included: true },
      { name: "All standard personas", included: true },
      { name: "Advanced content rewriting", included: true },
      { name: "Export to plain text and HTML", included: true },
      { name: "Email support", included: true },
      { name: "Up to 3 custom personas", included: true },
      { name: "Advanced formatting options", included: true },
      { name: "WordPress integration", included: false },
      { name: "Priority support", included: false },
      { name: "Team collaboration", included: false },
    ],
  },
  {
    id: "professional",
    name: "Professional",
    description: "Ideal for content marketers and professional writers",
    price: {
      monthly: "$29.99",
      annual: "$299.99",
    },
    creditLimit: 10000,
    popular: true,
    features: [
      { name: "10,000 AI Credits per month", included: true },
      { name: "All standard personas", included: true },
      { name: "Advanced content rewriting", included: true },
      { name: "Export to multiple formats", included: true },
      { name: "Priority email support", included: true },
      { name: "Unlimited custom personas", included: true },
      { name: "Advanced formatting options", included: true },
      { name: "WordPress integration", included: true },
      { name: "Priority support", included: true },
      { name: "Team collaboration", included: false },
    ],
  },
  {
    id: "business",
    name: "Business",
    description: "For teams and businesses with high-volume needs",
    price: {
      monthly: "$59.99",
      annual: "$599.99",
    },
    creditLimit: 25000,
    features: [
      { name: "25,000 AI Credits per month", included: true },
      { name: "All standard personas", included: true },
      { name: "Advanced content rewriting", included: true },
      { name: "Export to multiple formats", included: true },
      { name: "Dedicated support", included: true },
      { name: "Unlimited custom personas", included: true },
      { name: "Advanced formatting options", included: true },
      { name: "WordPress integration", included: true },
      { name: "Priority support", included: true },
      { name: "Team collaboration", included: true },
    ],
  },
];

export default function PricingPage() {
  return (
    <main className="flex min-h-screen flex-col p-4 md:p-8 bg-slate-50">
      <div className="w-[80vw] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Choose the Right Plan for You
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Select a plan that fits your content creation needs, from individual writers to enterprise teams.
          </p>
        </div>

        {/* Billing Toggle - IMPORTANT CHANGE: Remove max-w-md to allow full width */}
        <div className="mb-10">
          <Tabs defaultValue="monthly" className="w-full mx-auto">
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="monthly">Monthly Billing</TabsTrigger>
                <TabsTrigger value="annual">
                  Annual Billing
                  <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    Save 15%
                  </span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Updated container for plan cards */}
            <TabsContent value="monthly" className="mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                {plans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    billingCycle="monthly"
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="annual" className="mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                {plans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    billingCycle="annual"
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-white rounded-xl shadow-sm p-8 border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
            <div>
              <h3 className="font-medium text-lg text-slate-900 mb-2">
                What are AI Credits?
              </h3>
              <p className="text-slate-600">
                AI Credits are consumed when you use our AI features to rewrite content. Each plan comes with a monthly allocation of credits that refresh at the start of your billing cycle.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-lg text-slate-900 mb-2">
                What happens if I run out of credits?
              </h3>
              <p className="text-slate-600">
                If you run out of credits, you can purchase additional credit packs or upgrade to a higher plan. Your account will not be charged automatically.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-lg text-slate-900 mb-2">
                Can I change my plan later?
              </h3>
              <p className="text-slate-600">
                Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, changes will take effect on your next billing cycle.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-lg text-slate-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-slate-600">
                We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. For Business plan customers, we also offer invoice-based payments.
              </p>
            </div>
          </div>
        </div>
        
        {/* Guarantee Note */}
        <div className="mt-10 text-center">
          <p className="flex items-center justify-center text-slate-600 font-medium">
            <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
            14-day money-back guarantee for all paid plans
          </p>
        </div>
      </div>
    </main>
  );
}

interface PlanCardProps {
  plan: Plan;
  billingCycle: 'monthly' | 'annual';
}

function PlanCard({ plan, billingCycle }: PlanCardProps) {
  const price = plan.price[billingCycle];
  const isPopular = plan.popular;
  
  // Check if authenticated and current user's plan matches this one
  const isCurrentPlan = false; // In a real app, check the user's current plan
  
  // Calculate credits display
  const creditsDisplay = billingCycle === 'monthly' 
    ? `${plan.creditLimit.toLocaleString()} credits per month`
    : `${(plan.creditLimit * 12).toLocaleString()} credits per year`;
  
  return (
    <Card className={`flex flex-col h-full relative ${isPopular ? 'border-blue-600 shadow-lg' : 'border-slate-200'}`}>
      {isPopular && (
        <div className="absolute -top-3 left-0 right-0 flex justify-center">
          <span className="bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}
      
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
        <CardDescription className="pt-1 line-clamp-2 min-h-[40px]">{plan.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="mb-4">
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">{price}</span>
            <span className="ml-2 text-slate-600 text-sm">
              /{billingCycle === 'monthly' ? 'mo' : 'yr'}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {creditsDisplay}
          </p>
        </div>
        
        <div className="space-y-2.5">
          {plan.features.map((feature, i) => (
            <div key={i} className="flex items-start">
              {feature.included ? (
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 mr-2 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-slate-300 mt-0.5 mr-2 shrink-0" />
              )}
              <span className={`text-sm ${feature.included ? 'text-slate-700' : 'text-slate-400'}`}>
                {feature.name}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="pt-4">
        {isCurrentPlan ? (
          <Button className="w-full bg-slate-100 text-slate-800 hover:bg-slate-200" disabled>
            Current Plan
          </Button>
        ) : plan.id === 'free' ? (
          <Button asChild className="w-full">
            <Link href="/auth/signup">
              Sign up for free
            </Link>
          </Button>
        ) : (
          <Button asChild variant={isPopular ? "default" : "outline"} className="w-full">
            <Link href={`/pricing/upgrade?plan=${plan.id}&billing=${billingCycle}`}>
              {isPopular ? "Upgrade to " + plan.name : "Select " + plan.name}
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}