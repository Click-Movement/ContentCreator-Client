'use server'

import { createClient } from '@/supabase/server'
import { revalidatePath } from 'next/cache'
import { v4 as uuidv4 } from 'uuid'

// Updated user profile type to match your ProfileData interface
export interface UserProfile {
  id: string;
  firstName: string; // Changed to camelCase to match component usage
  lastName: string;  // Changed to camelCase to match component usage
  email: string;
  avatarUrl: string; // Changed from profile_picture_url to match component usage
  website: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
}

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
export async function getUserProfile(userId: string) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('users')
      .select('id, first_name, last_name, email, profile_picture_url, website, bio, created_at, updated_at')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching user profile:', error.message)
      return { error: error.message }
    }
    
    // Convert from snake_case to camelCase for component compatibility
    return { 
      profile: {
        id: data.id,
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        email: data.email,
        avatarUrl: data.profile_picture_url || '',
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