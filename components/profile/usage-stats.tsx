import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CreditCard, Zap, BarChart3, ArrowUpCircle } from "lucide-react";
import Link from "next/link";

interface UsageStatsProps {
  currentPlan: {
    name: string;
    maxCredits: number;
    price: string;
    renewalDate?: string;
  };
  creditsUsed: number;
  creditsRemaining: number;
  usageHistory: Array<{
    date: string;
    used: number;
  }>;
}

export function UsageStats({ 
  currentPlan, 
  creditsUsed, 
  creditsRemaining,
  usageHistory 
}: UsageStatsProps) {
  const totalCredits = currentPlan.maxCredits;
  const usagePercentage = Math.round((creditsUsed / totalCredits) * 100);
  
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
            Current Plan
          </CardTitle>
          <CardDescription>
            Your subscription and usage information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h4 className="font-semibold text-base">{currentPlan.name}</h4>
              <p className="text-sm text-gray-500">
                {currentPlan.price}/month 
                {currentPlan.renewalDate && ` · Renews on ${currentPlan.renewalDate}`}
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/pricing">
                <ArrowUpCircle className="h-4 w-4 mr-1" />
                Upgrade Plan
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Zap className="h-5 w-5 mr-2 text-blue-600" />
            Credits Usage
          </CardTitle>
          <CardDescription>
            Your monthly credits usage and remaining balance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-medium">{creditsRemaining.toLocaleString()}</div>
                <p className="text-sm text-gray-500">Credits remaining</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-medium">{creditsUsed.toLocaleString()}</div>
                <p className="text-sm text-gray-500">Credits used</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Usage</span>
                <span className={usagePercentage > 80 ? "text-orange-600 font-medium" : "text-gray-500"}>
                  {usagePercentage}%
                </span>
              </div>
              <Progress value={usagePercentage} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
            Usage History
          </CardTitle>
          <CardDescription>
            Recent usage activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {usageHistory.length > 0 ? (
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs uppercase text-gray-500 border-b">
                    <tr>
                      <th className="px-1 py-2 text-left">Date</th>
                      <th className="px-1 py-2 text-right">Credits Used</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usageHistory.map((item, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="px-1 py-2.5 whitespace-nowrap">{item.date}</td>
                        <td className="px-1 py-2.5 text-right">{item.used.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500 py-2">No recent usage data available.</p>
            )}
            
            <div className="pt-2">
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 p-0">
                View complete history →
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}