"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

// Form schema
const formSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be less than 50 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type UpdatePasswordFormProps = {
  code: string | null
}

export default function UpdatePasswordForm({ code }: UpdatePasswordFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formStatus, setFormStatus] = useState<{
    success?: boolean;
    error?: string;
  } | null>(null)
  
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        password: "",
        confirmPassword: "",
      },
    })

  // If there's no code, we can't update the password
  if (!code) {
    return (
      <Card className="w-full max-w-md border-gray-800 bg-gray-950/90 text-gray-100 shadow-xl mx-4">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-white">Invalid Reset Link</CardTitle>
          <CardDescription className="text-gray-400">
            This password reset link is invalid or has expired.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="bg-red-900/80 border-red-800 backdrop-blur-sm">
            <AlertCircle className="h-4 w-4 text-red-300" />
            <AlertTitle className="text-red-50">Invalid Link</AlertTitle>
            <AlertDescription className="text-red-100">
              Please request a new password reset link.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full bg-gray-900 border-gray-700 text-gray-100 hover:bg-gray-800 hover:text-gray-50"
            onClick={() => router.push('/auth/signin')}
          >
            Back to Sign In
          </Button>
        </CardFooter>
      </Card>
    )
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setFormStatus(null)
    
    try {
      const supabase = createClientComponentClient()
      const { error } = await supabase.auth.updateUser({ 
        password: values.password 
      })
      
      if (error) {
        setFormStatus({
          success: false,
          error: error.message
        })
      } else {
        setFormStatus({
          success: true
        })
        
        // Redirect after a delay
        setTimeout(() => {
          router.push('/auth/signin')
        }, 2000)
      }
    } catch {
      setFormStatus({
        success: false,
        error: "An unexpected error occurred. Please try again."
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-gray-800 bg-gray-950/90 text-gray-100 shadow-xl mx-4">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-white">Update Password</CardTitle>
        <CardDescription className="text-gray-400">
          Set a new password for your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {formStatus && (
          <div className="mb-6">
            {formStatus.success ? (
              <Alert variant="default" className="bg-green-900/80 border-green-800 text-green-100 backdrop-blur-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertTitle className="text-green-100">Password updated!</AlertTitle>
                <AlertDescription className="text-green-200">
                  Your password has been successfully updated. You will be redirected to the login page shortly.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive" className="bg-red-900/80 border-red-800 backdrop-blur-sm">
                <AlertCircle className="h-4 w-4 text-red-300" />
                <AlertTitle className="text-red-50">Error</AlertTitle>
                <AlertDescription className="text-red-100">
                  {formStatus.error}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password"
                      placeholder="•••••••••••" 
                      className="bg-gray-900 text-gray-100 border-gray-700 focus-visible:ring-blue-500"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription className="text-gray-400 text-xs">
                    Create a strong password with at least 8 characters.
                  </FormDescription>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Confirm Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password"
                      placeholder="•••••••••••" 
                      className="bg-gray-900 text-gray-100 border-gray-700 focus-visible:ring-blue-500"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              disabled={isLoading || formStatus?.success}
            >
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-gray-400 text-center w-full">
          <Link href="/auth/signin" className="text-blue-400 hover:text-blue-300">
            Back to Sign In
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}