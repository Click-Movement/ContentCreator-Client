import { createClient } from "@/supabase/client";

export type SavedSite = {
  id?: string;
  user_id: string;
  name: string;
  url: string;
  username: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Load all saved sites for a user from Supabase
 */
export async function loadSavedSites(userId: string): Promise<SavedSite[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('saved_sites')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error loading saved sites:", error);
    throw new Error(`Failed to load sites: ${error.message}`);
  }
  
  return data || [];
}

/**
 * Save a site to Supabase (create or update)
 */
export async function saveSite(site: SavedSite): Promise<SavedSite> {
  const supabase = createClient();
  
  // Check if site already exists by URL for this user
  const { data: existingSites } = await supabase
    .from('saved_sites')
    .select('id')
    .eq('user_id', site.user_id)
    .eq('url', site.url);
  
  let result;
  
  if (existingSites && existingSites.length > 0) {
    // Update existing site
    const { data, error } = await supabase
      .from('saved_sites')
      .update({
        name: site.name,
        username: site.username,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingSites[0].id)
      .select();
    
    if (error) {
      console.error("Error updating site:", error);
      throw new Error(`Failed to update site: ${error.message}`);
    }
    
    result = data?.[0];
  } else {
    // Insert new site
    const { data, error } = await supabase
      .from('saved_sites')
      .insert({
        user_id: site.user_id,
        name: site.name,
        url: site.url,
        username: site.username
      })
      .select();
    
    if (error) {
      console.error("Error creating site:", error);
      throw new Error(`Failed to save site: ${error.message}`);
    }
    
    result = data?.[0];
  }
  
  if (!result) {
    throw new Error('Failed to save site: No result returned');
  }
  
  return result;
}

/**
 * Delete a site from Supabase
 */
export async function deleteSite(siteId: string, userId: string): Promise<boolean> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('saved_sites')
    .delete()
    .eq('id', siteId)
    .eq('user_id', userId);
  
  if (error) {
    console.error("Error deleting site:", error);
    throw new Error(`Failed to delete site: ${error.message}`);
  }
  
  return true;
}