
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
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
import { CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function ForgetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [resetStatus, setResetStatus] = useState<{
    success?: boolean;
    email?: string;
    error?: string;
  } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const supabase = createClientComponentClient();
      
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      
      if (error) {
        console.error("Password reset error:", error.message);
        setResetStatus({ 
          success: false, 
          error: error.message 
        });
      } else {
        setResetStatus({ 
          success: true,
          email: values.email 
        });
        form.reset();
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setResetStatus({ 
        success: false, 
        error: "An unexpected error occurred. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <Card className="w-full max-w-md border-gray-800 bg-gray-950/90 text-gray-100 shadow-xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center">
            <Link href="/auth/signin" className="text-gray-400 hover:text-white mr-4 flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
            <CardTitle className="text-2xl font-bold text-white">Reset Password</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Enter your email to receive a password reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          {resetStatus && (
            <div className="mb-6">
              {resetStatus.success ? (
                <Alert variant="default" className="bg-green-900/80 border-green-800 text-green-100">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertTitle className="text-green-100">Check your email</AlertTitle>
                  <AlertDescription className="text-green-200">
                    We have sent a password reset link to <strong>{resetStatus.email}</strong>. 
                    Please check your inbox and follow the instructions to reset your password.
                  </AlertDescription>
                </Alert>
              ) : resetStatus.error ? (
                <Alert variant="destructive" className="bg-red-900/80 border-red-800">
                  <AlertCircle className="h-4 w-4 text-red-300" />
                  <AlertTitle className="text-red-100">Error</AlertTitle>
                  <AlertDescription className="text-red-200">
                    {resetStatus.error}
                  </AlertDescription>
                </Alert>
              ) : null}
            </div>
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
                        className="bg-gray-900/70 border-gray-700 text-gray-100 focus-visible:ring-blue-600 transition-all duration-300 hover:bg-gray-800" 
                        disabled={isLoading || resetStatus?.success} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300" 
                disabled={isLoading || resetStatus?.success}
              >
                {isLoading ? "Sending..." : resetStatus?.success ? "Email Sent" : "Send Reset Link"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t border-gray-800 pt-4">
          <div className="text-center text-gray-400 text-sm">
            Remember your password?{" "}
            <Link href="/auth/signin" className="text-blue-400 hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}