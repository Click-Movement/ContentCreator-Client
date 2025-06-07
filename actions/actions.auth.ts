'use server'

import { createClient } from '@/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
// import { createClient } from '@/supabase/server'

export async function login(email: string, password: string) {
  const supabase = await createClient()

  // Sign in with email and password
  const { data, error } = await supabase.auth.signInWithPassword({
    email, 
    password
  })

  // Handle sign-in errors
  if (error) {
    console.error("Login error:", error.message)
    return { success: false, error: error.message }
  }

  console.log("Login successful, session established:", data.session ? "Yes" : "No")
  
  // If sign-in was successful, fetch the user's role from the users table
  if (data.session && data.user) {
    try {
      // Get user's role from public.users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single()
      
      if (userError) {
        console.error("Error fetching user role:", userError.message)
        // Continue with sign-in even if role fetch fails
      } else {
        // Successfully fetched role, include it in the response
        console.log(`User role: ${userData.role}`)
        
        // Revalidate all pages to reflect new login state
        revalidatePath('/', 'layout')
        
        return { 
          success: true, 
          session: data.session, 
          user: {
            ...data.user,
            role: userData.role || 'user' // Default to 'user' if role is null
          }
        }
      }
    } catch (err) {
      console.error("Unexpected error fetching user role:", err)
      // Continue with sign-in even if role fetch fails
    }
  }
  
  // Fallback return if role fetch fails but login succeeds
  revalidatePath('/', 'layout')
  return { 
    success: true, 
    session: data.session,
    user: data.user
  }
}

export async function signup(data: { 
  email: string; 
  password: string;
  firstName?: string;
  lastName?: string;
}) {
  const supabase = await createClient()
  console.log("Signup attempt for:", data.email)

  // Include user metadata if provided
  const userData = {
    email: data.email,
    password: data.password,
    options: {
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        role: "user",
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/signin`,
    }
  }

  const result = await supabase.auth.signUp(userData)
  
  const { data: signUpData, error } = result
  
  console.log("Full signup response:", JSON.stringify(result, null, 2))

  if (error) {
    console.error("Signup error:", error.message)
    return { success: false, error: error.message }
  }

  // Check if email verification is required
  const emailVerificationRequired = !signUpData.session || 
    (signUpData.user?.identities && 
     signUpData.user.identities.length > 0 && 
     !signUpData.user.identities[0].identity_data?.email_verified);

  if (emailVerificationRequired) {
    console.log("Email verification required. Verification email sent to:", data.email)
    // Return success with verification needed instead of redirect
    return { 
      success: true, 
      requiresEmailVerification: true, 
      email: data.email 
    }
  }

  // If we get here, the user was auto-confirmed and we have a session
  console.log("User was auto-confirmed:", signUpData.user?.id)
  console.log("Session established:", signUpData.session?.access_token ? "Yes" : "No")
  
  revalidatePath('/', 'layout')
  return { 
    success: true, 
    requiresEmailVerification: false,
    session: signUpData.session // Return the session
  }
}