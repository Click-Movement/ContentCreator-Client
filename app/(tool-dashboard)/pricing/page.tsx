"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Sparkles, Zap, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

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
  icon?: React.ReactNode;
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
    icon: <Sparkles className="h-5 w-5 text-gray-500" />,
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
    icon: <Zap className="h-5 w-5 text-blue-500" />,
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
    icon: <Star className="h-5 w-5 text-amber-500" />,
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
    icon: <Shield className="h-5 w-5 text-purple-600" />,
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

// Animation variants for elements
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const pulseAnimation = {
  pulse: {
    scale: [1, 1.03, 1],
    transition: { 
      duration: 1.5,
      repeat: Infinity, 
      repeatType: "reverse" as const
    }
  }
};

export default function PricingPage() {
  const [activeBilling, setActiveBilling] = useState<'monthly' | 'annual'>('monthly');
  const [isClient, setIsClient] = useState(false);

  // This is needed to prevent hydration errors with SSR
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <main className="flex min-h-screen flex-col p-4 md:p-8 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="w-[80vw] mx-auto">
        {/* Header with animation */}
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <motion.div 
            className="inline-block mb-4"
            animate={{ rotate: [0, 5, 0, -5, 0], transition: { duration: 5, repeat: Infinity } }}
          >
            <span className="inline-block p-2 rounded-full bg-blue-100 text-blue-600">
              <Sparkles className="h-6 w-6" />
            </span>
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Choose the Right Plan for You
          </h1>
          <motion.p 
            className="text-slate-600 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Select a plan that fits your content creation needs, from individual writers to enterprise teams.
          </motion.p>
        </motion.div>

        {/* Billing Toggle with transitions */}
        <motion.div 
          className="mb-14"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
        >
          {isClient && (
            <Tabs 
              defaultValue="monthly" 
              className="w-full mx-auto"
              onValueChange={(value) => setActiveBilling(value as 'monthly' | 'annual')}
            >
              <div className="flex justify-center mb-10">
                <motion.div
                  className="bg-white shadow-md rounded-lg p-1.5 border border-slate-200"
                  whileHover={{ boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)" }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsList className="grid w-full max-w-md grid-cols-2 bg-slate-100">
                    <TabsTrigger 
                      value="monthly"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300"
                    >
                      Monthly Billing
                    </TabsTrigger>
                    <TabsTrigger 
                      value="annual"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300"
                    >
                      Annual Billing
                      <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                        Save 15%
                      </span>
                    </TabsTrigger>
                  </TabsList>
                </motion.div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeBilling}
                  initial={{ opacity: 0, x: activeBilling === "monthly" ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: activeBilling === "monthly" ? 20 : -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="monthly" className="mt-0">
                    <motion.div 
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      {plans.map((plan) => (
                        <PlanCard
                          key={plan.id}
                          plan={plan}
                          billingCycle="monthly"
                        />
                      ))}
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="annual" className="mt-0">
                    <motion.div 
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      {plans.map((plan) => (
                        <PlanCard
                          key={plan.id}
                          plan={plan}
                          billingCycle="annual"
                        />
                      ))}
                    </motion.div>
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>
          )}
        </motion.div>

        {/* FAQ Section with animations */}
        <motion.div 
          className="mt-16 bg-white rounded-xl shadow-lg p-8 border border-slate-200 backdrop-blur-sm bg-white/80"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { 
              opacity: 1, 
              y: 0, 
              transition: { duration: 0.5, delay: 0.2 } 
            }
          }}
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Frequently Asked Questions
            </span>
          </h2>
          <motion.div 
            className="grid md:grid-cols-2 gap-x-12 gap-y-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={fadeIn}>
              <h3 className="font-medium text-lg text-slate-900 mb-2">
                What are AI Credits?
              </h3>
              <p className="text-slate-600">
                AI Credits are consumed when you use our AI features to rewrite content. Each plan comes with a monthly allocation of credits that refresh at the start of your billing cycle.
              </p>
            </motion.div>
            <motion.div variants={fadeIn}>
              <h3 className="font-medium text-lg text-slate-900 mb-2">
                What happens if I run out of credits?
              </h3>
              <p className="text-slate-600">
                If you run out of credits, you can purchase additional credit packs or upgrade to a higher plan. Your account will not be charged automatically.
              </p>
            </motion.div>
            <motion.div variants={fadeIn}>
              <h3 className="font-medium text-lg text-slate-900 mb-2">
                Can I change my plan later?
              </h3>
              <p className="text-slate-600">
                Yes, you can upgrade or downgrade your plan at any time. When upgrading, you will be charged the prorated difference. When downgrading, changes will take effect on your next billing cycle.
              </p>
            </motion.div>
            <motion.div variants={fadeIn}>
              <h3 className="font-medium text-lg text-slate-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-slate-600">
                We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. For Business plan customers, we also offer invoice-based payments.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Guarantee Note with subtle animation */}
        <motion.div 
          className="mt-10 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <motion.div
            className="inline-flex items-center justify-center p-4 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100"
            variants={pulseAnimation}
            animate="pulse"
          >
            <p className="flex items-center justify-center text-slate-700 font-medium">
              <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
              14-day money-back guarantee for all paid plans
            </p>
          </motion.div>
        </motion.div>
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
  const [isHovered, setIsHovered] = useState(false);
  
  // Check if authenticated and current user's plan matches this one
  const isCurrentPlan = false; // In a real app, check the user's current plan
  
  // Calculate credits display
  const creditsDisplay = billingCycle === 'monthly' 
    ? `${plan.creditLimit.toLocaleString()} credits per month`
    : `${(plan.creditLimit * 12).toLocaleString()} credits per year`;
  
  // Get gradient styles based on plan type
  const getGradientStyles = () => {
    switch(plan.id) {
      case 'professional':
        return 'bg-gradient-to-b from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200';
      case 'business':
        return 'bg-gradient-to-b from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200';
      case 'basic':
        return 'bg-gradient-to-b from-sky-50 to-sky-100 hover:from-sky-100 hover:to-sky-200';
      default:
        return 'bg-white hover:bg-slate-50';
    }
  };
  
  return (
    <motion.div
      variants={fadeIn}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.3 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card 
        className={`flex flex-col h-full relative overflow-hidden transition-all duration-300
          ${isPopular ? 'border-blue-600 shadow-lg shadow-blue-100' : 'border-slate-200 shadow-sm'} 
          ${getGradientStyles()}`}
      >
        {isPopular && (
          <div className="absolute -top-1 -right-12 transform rotate-45">
            <div className="bg-blue-600 text-white py-1 px-12 text-xs font-medium">
              Most Popular
            </div>
          </div>
        )}
        
        <CardHeader className={`pb-4 ${isPopular ? 'pt-8' : 'pt-6'}`}>
          <div className="flex items-center gap-2 mb-1">
            {plan.icon}
            <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
          </div>
          <CardDescription className="pt-1 line-clamp-2 min-h-[40px]">{plan.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="flex-grow">
          <div className="mb-6">
            <div className="flex items-baseline">
              <motion.span 
                className="text-3xl font-bold"
                animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {price}
              </motion.span>
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
              <motion.div 
                key={i} 
                className="flex items-start"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {feature.included ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 mr-2 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-slate-300 mt-0.5 mr-2 shrink-0" />
                )}
                <span className={`text-sm ${feature.included ? 'text-slate-700' : 'text-slate-400'}`}>
                  {feature.name}
                </span>
              </motion.div>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="pt-4">
          {isCurrentPlan ? (
            <Button className="w-full bg-slate-100 text-slate-800 hover:bg-slate-200" disabled>
              Current Plan
            </Button>
          ) : plan.id === 'free' ? (
            <Button 
              asChild 
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
              variant="default"
            >
              <Link href="/auth/signup">
                Sign up for free
              </Link>
            </Button>
          ) : (
            <Button 
              asChild 
              variant={isPopular ? "default" : "outline"} 
              className={`w-full transition-all duration-300 ${isPopular ? 
                'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' : 
                'hover:bg-blue-50'}`}
            >
              <Link href={`/pricing/upgrade?plan=${plan.id}&billing=${billingCycle}`}>
                {isPopular ? "Upgrade to " + plan.name : "Select " + plan.name}
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}