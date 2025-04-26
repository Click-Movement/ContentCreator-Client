"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, KeyRound } from "lucide-react"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const formSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function UpdatePasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [status, setStatus] = useState<{
    success?: boolean;
    error?: string;
    verifying?: boolean;
  }>({ verifying: true });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Initialize client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle authentication code on page load
  useEffect(() => {
    const handleAuthCode = async () => {
      try {
        const supabase = createClientComponentClient();
        const code = searchParams.get('code');
        
        if (!code) {
          // Check if user is already authenticated
          const { data } = await supabase.auth.getSession();
          
          if (data.session) {
            // User is authenticated, allow password update
            setStatus({ verifying: false });
          } else {
            // No code and no session, show error
            setStatus({
              error: "Missing reset code. Please use the link from your email.",
              verifying: false
            });
          }
          return;
        }
        
        // Instead of exchangeCodeForSession, we should check if we already have a session
        // The code in the URL should have been automatically processed by Supabase's Auth listeners
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          // We have a session, allow password update
          setStatus({ verifying: false });
        } else {
          // No session despite having a code - possibly expired or invalid
          setStatus({
            error: "Invalid or expired password reset link. Please request a new one.",
            verifying: false
          });
        }
      } catch (err) {
        console.error("Auth verification error:", err);
        setStatus({
          error: "An error occurred during authentication. Please try again.",
          verifying: false
        });
      }
    };
    
    if (isClient) {
      handleAuthCode();
    }
  }, [isClient, searchParams]);

  // Track mouse position for glow effect
  useEffect(() => {
    if (!isClient) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isClient]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    try {
      const supabase = createClientComponentClient();
      
      // Update the user's password
      const { error } = await supabase.auth.updateUser({
        password: values.password
      });
      
      if (error) {
        console.error("Update password error:", error.message);
        setStatus({ 
          error: error.message,
          verifying: false 
        });
      } else {
        setStatus({ success: true, verifying: false });
        
        // Redirect after successful password update
        setTimeout(() => {
          router.push('/auth/signin');
        }, 3000);
      }
    } catch (error) {
      console.error("Update password exception:", error);
      setStatus({ 
        error: "An unexpected error occurred. Please try again.",
        verifying: false 
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Don't render anything during SSR
  if (!isClient) return null;

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        
        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-teal-700 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-emerald-700 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-blue-700 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Mouse glow effect */}
      <div 
        className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(79, 70, 229, 0.10), transparent)`,
        }}
      />

      {/* Card content */}
      <Card className="relative z-20 w-full max-w-md border-gray-800 bg-gray-950/90 text-gray-100 backdrop-blur-sm shadow-xl mx-4">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <KeyRound className="h-10 w-10 text-blue-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-white text-center">
            {status.verifying 
              ? "Verifying Your Link" 
              : status.success 
                ? "Password Updated" 
                : "Create New Password"}
          </CardTitle>
          <CardDescription className="text-gray-400 text-center">
            {status.verifying 
              ? "Please wait while we verify your reset link..." 
              : status.success 
                ? "Your password has been successfully updated" 
                : "Choose a new, strong password for your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status.verifying ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 rounded-full border-4 border-t-blue-500 border-blue-500/30 animate-spin"></div>
            </div>
          ) : status.error ? (
            <Alert variant="destructive" className="bg-red-900/80 border-red-800 backdrop-blur-sm mb-6">
              <AlertCircle className="h-4 w-4 text-red-300" />
              <AlertTitle className="text-red-100">Error</AlertTitle>
              <AlertDescription className="text-red-200">
                {status.error}
              </AlertDescription>
            </Alert>
          ) : status.success ? (
            <Alert variant="default" className="bg-green-900/80 border-green-800 text-green-100 backdrop-blur-sm mb-6">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-100">Success!</AlertTitle>
              <AlertDescription className="text-green-200">
                Your password has been successfully updated. You'll be redirected to the sign-in page shortly.
              </AlertDescription>
            </Alert>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">New Password</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="••••••••" 
                          type="password"
                          className="bg-gray-900/70 border-gray-700 text-gray-100 focus-visible:ring-blue-600 transition-all duration-300 hover:bg-gray-800 hover:border-blue-500 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]" 
                          disabled={isLoading} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Confirm New Password</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="••••••••" 
                          type="password"
                          className="bg-gray-900/70 border-gray-700 text-gray-100 focus-visible:ring-blue-600 transition-all duration-300 hover:bg-gray-800 hover:border-blue-500 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]" 
                          disabled={isLoading} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t border-gray-800 pt-4">
          {status.error && status.error.includes("expired") && (
            <Button
              variant="outline"
              className="hover:bg-gray-800 text-blue-400 border-gray-700"
              onClick={() => router.push('/auth/forget-password')}
            >
              Request New Reset Link
            </Button>
          )}
          
          <div className="text-center text-gray-400 text-sm">
            <Link href="/auth/signin" className="text-blue-400 hover:underline">
              Back to Sign In
            </Link>
          </div>
        </CardFooter>
      </Card>

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}