'use server'

import { createClient } from '@/supabase/server'
import { UserProfile } from '@/types/types';
import { revalidatePath } from 'next/cache'
import { v4 as uuidv4 } from 'uuid'

// Updated user profile type to match your ProfileData interface


// Adjusted to match the profile form
export interface ProfileFormData {
  firstName?: string;
  lastName?: string;
  website?: string;
  bio?: string;
}

/**
 * Get user profile data
 */

/**
 * Get user profile data
 */
export async function getUserProfile(userId: string) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('users')
      .select('id, first_name, last_name, email, avatarUrl, website, bio, created_at, updated_at')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching user profile:', error.message)
      return { error: error.message }
    }
    
    // Convert to camelCase for component compatibility
    return { 
      profile: {
        id: data.id,
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        email: data.email,
        avatarUrl: data.avatarUrl || '',  // Note: avatarUrl is already camelCase in DB
        website: data.website || '',
        bio: data.bio || '',
        createdAt: data.created_at,
        updatedAt: data.updated_at
      } as UserProfile
    }
  } catch (err) {
    console.error('Unexpected error fetching user profile:', err)
    return { error: 'An unexpected error occurred' }
  }
}
/**
 * Update user profile data
 */

/**
 * Update user profile data
 */
export async function updateUserProfile(userId: string, formData: ProfileFormData) {
  try {
    const supabase = await createClient()
    
    // Convert from camelCase to snake_case for database compatibility
    const { error } = await supabase
      .from('users')
      .update({
        first_name: formData.firstName,
        last_name: formData.lastName,
        website: formData.website,
        bio: formData.bio
      })
      .eq('id', userId)
    
    if (error) {
      return { error: error.message }
    }
    
    // Revalidate the profile page to show updated data
    revalidatePath(`/profile/${userId}`)
    
    return { success: true }
  } catch (err) {
    console.error('Error updating profile:', err)
    return { error: 'Failed to update profile' }
  }
}

/**
 * Update user profile picture
 */
export async function updateProfilePicture(userId: string, file: Blob) {
  try {
    const supabase = await createClient()
    
    // Validate file
    if (!(file instanceof Blob)) {
      return { error: 'Invalid file format' }
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      return { error: 'Image must be smaller than 5MB' }
    }
    
    // Create a unique file name
    const fileName = `${userId}_${uuidv4()}.jpg` // Using jpg as default for cropped images
    const filePath = `${fileName}`
    
    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase
      .storage
      .from('profile-images')
      .upload(filePath, file, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      })
    
    if (uploadError) {
      return { error: uploadError.message }
    }
    
    // Get the public URL
    const { data: urlData } = supabase
      .storage
      .from('profile-images')
      .getPublicUrl(filePath)
    
    const publicUrl = urlData.publicUrl
    
    // Update user record with profile picture URL
    const { error: updateError } = await supabase
      .from('users')
      .update({ profile_picture_url: publicUrl })
      .eq('id', userId)
    
    if (updateError) {
      return { error: updateError.message }
    }
    
    revalidatePath(`/profile/${userId}`)
    
    return { 
      success: true, 
      avatarUrl: publicUrl  // Changed to match component naming
    }
  } catch (err) {
    console.error('Error uploading profile picture:', err)
    return { error: 'Failed to upload profile picture' }
  }
}

/**
 * Remove user profile picture
 */
export async function removeProfilePicture(userId: string) {
  try {
    const supabase = await createClient()
    
    // Get current profile URL first
    const { data: userData } = await supabase
      .from('users')
      .select('profile_picture_url')
      .eq('id', userId)
      .single()
    
    // Update profile to remove picture URL
    const { error: updateError } = await supabase
      .from('users')
      .update({ profile_picture_url: null })
      .eq('id', userId)
    
    if (updateError) {
      return { error: updateError.message }
    }
    
    // If we have an existing picture, try to delete it
    if (userData?.profile_picture_url) {
      try {
        // Extract filename from URL
        const urlParts = userData.profile_picture_url.split('/')
        const fileName = urlParts[urlParts.length - 1]
        
        // Delete the file
        await supabase
          .storage
          .from('profile-images')
          .remove([fileName])
      } catch (err) {
        console.warn('Could not delete profile image file:', err)
      }
    }
    
    revalidatePath(`/profile/${userId}`)
    
    return { success: true }
  } catch (err) {
    console.error('Error removing profile picture:', err)
    return { error: 'Failed to remove profile picture' }
  }
}

/**
 * Get user usage data including plan information and credit usage
 */
export async function getUserUsageData(userId: string) {
  try {
    const supabase = await createClient()
    
    // Fetch the user data with credits and plan information
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, credits, plan, created_at')
      .eq('id', userId)
      .single()
    
    if (userError) {
      console.error('Error fetching user data:', userError.message)
      return { error: userError.message }
    }
    
    // Define plan details based on the user's current plan
    const planDetails = getPlanDetails(userData.plan)
    
    // Calculate credits used and remaining
    const creditsUsed = planDetails.maxCredits - userData.credits
    
    // Fetch usage history (if you have a separate table for this)
    // For now, we'll create a placeholder with recent months
    const usageHistory = generateUsageHistory(userData.created_at, creditsUsed)
    
    // Return the structured data required by the ProfileView component
    return { 
      usageData: {
        currentPlan: {
          name: capitalize(userData.plan),
          maxCredits: planDetails.maxCredits,
          price: planDetails.price,
          renewalDate: getRenewalDate(userData.created_at),
        },
        creditsUsed: creditsUsed,
        creditsRemaining: userData.credits,
        usageHistory: usageHistory
      }
    }
  } catch (err) {
    console.error('Unexpected error fetching user usage data:', err)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Get details for a specific subscription plan
 */
function getPlanDetails(planName: string) {
  switch (planName.toLowerCase()) {
    case 'professional':
      return { maxCredits: 5000, price: '$19.99' }
    case 'business':
      return { maxCredits: 20000, price: '$49.99' }
    case 'free':
    default:
      return { maxCredits: 1000, price: '$0.00' }
  }
}

/**
 * Calculate renewal date based on account creation date
 * Assumes monthly subscription renewal
 */
function getRenewalDate(createdAt: string) {
  const date = new Date(createdAt)
  const currentDate = new Date()
  
  // Set to same day of month but current month/year
  const renewalDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    date.getDate()
  )
  
  // If the day has already passed this month, move to next month
  if (renewalDate.getTime() < currentDate.getTime()) {
    renewalDate.setMonth(renewalDate.getMonth() + 1)
  }
  
  return renewalDate.toISOString()
}

/**
 * Generate sample usage history based on account age
 */
function generateUsageHistory(createdAt: string, totalCreditsUsed: number) {
  const history = []
  const creationDate = new Date(createdAt)
  const currentDate = new Date()
  
  // Calculate number of months since account creation
  const monthsSinceCreation = 
    (currentDate.getFullYear() - creationDate.getFullYear()) * 12 + 
    (currentDate.getMonth() - creationDate.getMonth())
  
  // Create an entry for each month, with decreasing usage
  // to simulate historical data
  for (let i = 0; i <= Math.min(monthsSinceCreation, 5); i++) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    
    const month = date.toLocaleString('default', { month: 'long' })
    const year = date.getFullYear()
    
    // Decrease usage as we go back in time (just for demonstration)
    const creditsForMonth = Math.round(totalCreditsUsed / (i + 1) * Math.random())
    
    history.push({
      date: `${month} ${year}`,
      used: creditsForMonth
    })
  }
  
  return history
}

/**
 * Capitalize first letter of a string
 */
function capitalize(str: string) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Update user credit count (for when credits are used)
 */
export async function updateUserCredits(userId: string, creditsToDeduct: number) {
  try {
    const supabase = await createClient()
    
    // First get current credit count
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single()
      
    if (fetchError) {
      return { error: fetchError.message }
    }
    
    // Calculate new credit balance
    const newCreditBalance = Math.max(0, userData.credits - creditsToDeduct)
    
    // Update the user's credits
    const { error: updateError } = await supabase
      .from('users')
      .update({ credits: newCreditBalance })
      .eq('id', userId)
    
    if (updateError) {
      return { error: updateError.message }
    }
    
    // Revalidate the profile page to show updated data
    revalidatePath(`/profile/${userId}`)
    
    return { 
      success: true,
      creditsRemaining: newCreditBalance
    }
  } catch (err) {
    console.error('Error updating user credits:', err)
    return { error: 'Failed to update user credits' }
  }
}