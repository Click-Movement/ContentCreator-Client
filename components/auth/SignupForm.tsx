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
import { CheckCircle, AlertCircle, Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [passwordStrength, setPasswordStrength] = useState(0);
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
    mode: "onChange"
  });

  // Calculate password strength
  useEffect(() => {
    const password = form.watch("password");
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    // Length check
    if (password.length >= 8) strength += 1;
    // Uppercase check
    if (/[A-Z]/.test(password)) strength += 1;
    // Lowercase check
    if (/[a-z]/.test(password)) strength += 1;
    // Number check
    if (/[0-9]/.test(password)) strength += 1;
    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    setPasswordStrength(strength);
  }, [form.watch("password")]);

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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative flex items-center justify-center min-h-screen px-4"
    >
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-black"></div>
        
        {/* Animated orbs */}
        <motion.div 
          animate={{ 
            x: [0, 30, -20, 0],
            y: [0, -50, 20, 0],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            repeatType: "loop"
          }}
          className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"
        ></motion.div>
        <motion.div 
          animate={{ 
            x: [0, -40, 20, 0],
            y: [0, 30, -40, 0],
            scale: [1, 0.9, 1.1, 1]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            repeatType: "loop",
            delay: 1
          }}
          className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"
        ></motion.div>
        <motion.div 
          animate={{ 
            x: [0, 20, -30, 0],
            y: [0, -30, -10, 0],
            scale: [1, 1.1, 0.8, 1]
          }}
          transition={{ 
            duration: 18,
            repeat: Infinity,
            repeatType: "loop",
            delay: 2
          }}
          className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"
        ></motion.div>
      </div>

      {/* Mouse glow effect */}
      <div 
        className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.15), transparent 80%)`,
        }}
      />

      {/* Card content */}
      <Card className="relative z-20 w-full max-w-md border border-indigo-500/10 bg-gray-950/80 text-gray-100 backdrop-blur-md shadow-2xl">
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
        
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-white tracking-tight">Create your account</CardTitle>
          <CardDescription className="text-gray-400">
            Join us and start using our Content Creator tooll
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {signupStatus && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              {signupStatus.success && signupStatus.requiresEmailVerification ? (
                <Alert variant="default" className="bg-green-900/30 border border-green-500/50 text-green-100 backdrop-blur-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertTitle className="text-green-100 font-medium">Verification email sent!</AlertTitle>
                  <AlertDescription className="text-green-200">
                    We have sent a verification email to <strong>{signupStatus.email}</strong>. 
                    Please check your inbox and follow the instructions.
                  </AlertDescription>
                </Alert>
              ) : signupStatus.error ? (
                <Alert variant="destructive" className="bg-red-900/30 border-red-500/50 backdrop-blur-sm">
                  <AlertCircle className="h-4 w-4 text-red-300" />
                  <AlertTitle className="text-red-100 font-medium">Error</AlertTitle>
                  <AlertDescription className="text-red-200">
                    {signupStatus.error}
                  </AlertDescription>
                </Alert>
              ) : null}
            </motion.div>
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
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                          <Input 
                            placeholder="John" 
                            className="pl-10 bg-gray-900/80 border-gray-800 text-gray-100 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all duration-300" 
                            disabled={isLoading} 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
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
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                          <Input 
                            placeholder="Doe" 
                            className="pl-10 bg-gray-900/80 border-gray-800 text-gray-100 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all duration-300" 
                            disabled={isLoading} 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
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
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                        <Input 
                          placeholder="you@example.com" 
                          type="email"
                          className="pl-10 bg-gray-900/80 border-gray-800 text-gray-100 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all duration-300" 
                          disabled={isLoading} 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
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
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                        <Input 
                          placeholder="••••••••" 
                          type="password"
                          className="pl-10 bg-gray-900/80 border-gray-800 text-gray-100 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all duration-300" 
                          disabled={isLoading} 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    
                    {/* Password strength meter */}
                    {field.value && (
                      <div className="mt-1">
                        <div className="flex space-x-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <div 
                              key={i} 
                              className={`h-1.5 w-full rounded-full transition-colors ${
                                i < passwordStrength 
                                  ? passwordStrength < 3 
                                    ? 'bg-red-500' 
                                    : passwordStrength < 5 
                                      ? 'bg-yellow-500' 
                                      : 'bg-green-500'
                                  : 'bg-gray-700'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-400">
                          {passwordStrength < 3 && "Weak password"}
                          {passwordStrength >= 3 && passwordStrength < 5 && "Moderate password"}
                          {passwordStrength === 5 && "Strong password"}
                        </p>
                      </div>
                    )}
                    
                    <FormMessage className="text-red-400 text-xs" />
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
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                        <Input 
                          placeholder="••••••••" 
                          type="password"
                          className="pl-10 bg-gray-900/80 border-gray-800 text-gray-100 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all duration-300" 
                          disabled={isLoading} 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300 group relative overflow-hidden shadow-[0_0_10px_rgba(99,102,241,0.2)]" 
                disabled={isLoading}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-800 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </form>
          </Form>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4 border-t border-gray-800/50 pt-4">
          <div className="text-sm text-gray-400 text-center">
            By creating an account, you agree to our 
            <Link href="/terms" className="text-indigo-400 hover:text-indigo-300 ml-1 transition-colors">
              Terms of Service
            </Link> and 
            <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300 ml-1 transition-colors">
              Privacy Policy
            </Link>
          </div>
          <div className="text-center text-gray-400 text-sm">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
              Sign in →
            </Link>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}