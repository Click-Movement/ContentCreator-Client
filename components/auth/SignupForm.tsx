"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { signup } from "@/actions/actions.auth"
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
import { CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [signupStatus, setSignupStatus] = useState<{
    success: boolean;
    email?: string;
    requiresEmailVerification?: boolean;
    error?: string;
  } | null>(null);

  // Track mouse position for glow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await signup({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
      });
      setSignupStatus(result);
      
      // Only redirect if server-side didn't handle it and no verification is needed
      if (result.success && !result.requiresEmailVerification) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error("Signup error:", error);
      setSignupStatus({ 
        success: false, 
        error: "An unexpected error occurred. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        
        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-700 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-700 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-indigo-700 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>
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
          <CardTitle className="text-2xl font-bold text-white">Create an account</CardTitle>
          <CardDescription className="text-gray-400">
            Enter your information to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          {signupStatus && (
            <div className="mb-6">
              {signupStatus.success && signupStatus.requiresEmailVerification ? (
                <Alert variant="default" className="bg-green-900/80 border-green-800 text-green-100 backdrop-blur-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertTitle className="text-green-100">Verification email sent!</AlertTitle>
                  <AlertDescription className="text-green-200">
                    We have sent a verification email to <strong>{signupStatus.email}</strong>. 
                    Please check your inbox and follow the instructions to verify your account.
                  </AlertDescription>
                </Alert>
              ) : signupStatus.error ? (
                <Alert variant="destructive" className="bg-red-900/80 border-red-800 backdrop-blur-sm">
                  <AlertCircle className="h-4 w-4 text-red-300" />
                  <AlertTitle className="text-red-100">Error</AlertTitle>
                  <AlertDescription className="text-red-200">
                    {signupStatus.error}
                  </AlertDescription>
                </Alert>
              ) : null}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">First Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="John" 
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
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Last Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Doe" 
                          className="bg-gray-900/70 border-gray-700 text-gray-100 focus-visible:ring-blue-600 transition-all duration-300 hover:bg-gray-800 hover:border-blue-500 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]" 
                          disabled={isLoading} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="you@example.com" 
                        type="email"
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Password</FormLabel>
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
                    <FormLabel className="text-gray-300">Confirm Password</FormLabel>
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
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t border-gray-800 pt-4">
          <div className="text-sm text-gray-400 text-center">
            By creating an account, you agree to our 
            <Link href="/terms" className="text-blue-400 hover:underline ml-1">
              Terms of Service
            </Link> and 
            <Link href="/privacy" className="text-blue-400 hover:underline ml-1">
              Privacy Policy
            </Link>
          </div>
          <div className="text-center text-gray-400 text-sm">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-blue-400 hover:underline">
              Sign in
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