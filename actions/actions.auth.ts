'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/supabase/server'

export async function login(email: string, password: string) {
  const supabase = await createClient()

  const data = { email, password }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(data: { email: string; password: string }) {
  const supabase = await createClient()
  console.log("Signup attempt for:", data.email)

  const result = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    }
  })
  
  const { data: signUpData, error } = result
  
  console.log("Full signup response:", JSON.stringify(result, null, 2))

  if (error) {
    console.error("Signup error:", error.message)
    return { success: false, error: error.message }
  }

  // If user is null or identityConfirmed is false, email verification is required
  if (!signUpData.user || 
      (signUpData.user.identities && 
       signUpData.user.identities.length > 0 && 
       !signUpData.user.identities[0].identity_data?.email_verified)) {
    
    console.log("Email verification required. Verification email sent to:", data.email)
    // Return success with verification needed instead of redirect
    return { 
      success: true, 
      requiresEmailVerification: true, 
      email: data.email 
    }
  }

  // If we get here, the user was auto-confirmed
  console.log("User was auto-confirmed:", signUpData.user?.id)
  
  // Immediately sign the user in
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password
  })

  if (signInError) {
    console.error("Auto-login error:", signInError)
    return { success: false, error: signInError.message }
  }
  
  revalidatePath('/', 'layout')
  return { success: true, requiresEmailVerification: false }
}