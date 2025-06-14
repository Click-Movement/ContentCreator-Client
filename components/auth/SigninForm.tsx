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
import { AlertCircle, Mail, Lock, ArrowRight, Loader2, GithubIcon } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export function SigninForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

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

      // Check user role and redirect accordingly
      if (result.user?.role === 'admin') {
        console.log('Admin user signed in')
        router.push('/admin/dashboard')
      } else {
        console.log('Regular user signed in')
        router.push('/content')
      }

    } catch (error) {
      console.error("Login error:", error);
      setLoginError("An unexpected error occurred. Please try again.");
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
          className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"
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
          className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"
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
          className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"
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
          <CardTitle className="text-2xl font-bold text-white tracking-tight">Welcome back</CardTitle>
          <CardDescription className="text-gray-400">
            Sign in to access Content Creator
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {loginError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Alert variant="destructive" className="bg-red-900/30 border border-red-500/50 backdrop-blur-sm mb-6">
                <AlertCircle className="h-4 w-4 text-red-300" />
                <AlertTitle className="text-red-100 font-medium">Authentication failed</AlertTitle>
                <AlertDescription className="text-red-200">
                  {loginError}
                </AlertDescription>
              </Alert>
            </motion.div>
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
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-gray-300">Password</FormLabel>
                      <Link href="/auth/forget-password" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                        Forgot password?
                      </Link>
                    </div>
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
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 rounded border-gray-700 bg-gray-900 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-gray-900"
                />
                <label htmlFor="remember-me" className="text-sm text-gray-400">
                  Remember me for 30 days
                </label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300 group relative overflow-hidden shadow-[0_0_10px_rgba(99,102,241,0.2)]" 
                disabled={isLoading}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-800 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
              
              <div className="relative flex items-center justify-center my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-800"></div>
                </div>
                <div className="relative px-4 bg-gray-950/80 text-xs text-gray-400">or continue with</div>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="bg-gray-900/50 border-gray-800 text-gray-300 hover:bg-gray-800 hover:text-gray-100 transition-all duration-300"
                >
                  <GithubIcon className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4 border-t border-gray-800/50 pt-4">
          <div className="text-center text-gray-400 text-sm">
            Dont have an account?{" "}
            <Link href="/auth/signup" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
              Create an oaccount →
            </Link>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}