"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { login } from "@/actions/actions.auth"
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
import { AlertCircle } from "lucide-react"
import Link from "next/link"

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export function SigninForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [loginError, setLoginError] = useState<string | null>(null);

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
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setLoginError(null);
    try {
      const result = await login(values.email, values.password);
      
      if (!result.success) {
        setLoginError(result.error || "Invalid email or password. Please try again.");
        return;
      }
      
      // Redirect on success
      window.location.href = '/';
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("An unexpected error occurred. Please try again.");
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
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-700 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-700 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-purple-700 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>
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
          <CardTitle className="text-2xl font-bold text-white">Welcome back</CardTitle>
          <CardDescription className="text-gray-400">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loginError && (
            <Alert variant="destructive" className="bg-red-900/80 border-red-800 backdrop-blur-sm mb-6">
              <AlertCircle className="h-4 w-4 text-red-300" />
              <AlertTitle className="text-red-100">Authentication failed</AlertTitle>
              <AlertDescription className="text-red-200">
                {loginError}
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-gray-300">Password</FormLabel>
                      <Link href="/auth/forget-password" className="text-sm text-blue-400 hover:underline">
                        Forgot password?
                      </Link>
                    </div>
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
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t border-gray-800 pt-4">
          <div className="text-center text-gray-400 text-sm">
            Don not have an account?{" "}
            <Link href="/auth/signup" className="text-blue-400 hover:underline">
              Create an account
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