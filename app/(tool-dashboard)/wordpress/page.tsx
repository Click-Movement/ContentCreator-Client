'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { personas } from '@/types/personas';
import Header from '@/components/header';
import { PersonaType } from '@/lib/aiPersonaRewriter';
import { createClient } from '@/supabase/client';

type SavedSite = {
  id: string;
  name: string;
  url: string;
  username: string;
  created_at?: string;
}

export default function WordPressPage() {
  const router = useRouter();
  const supabase = createClient();

  const [wpUrl, setWpUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSites, setIsLoadingSites] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [rewrittenContent, setRewrittenContent] = useState<{
    title: string;
    content: string;
    persona: PersonaType;
  } | null>(null);
  const [savedSites, setSavedSites] = useState<SavedSite[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState('');
  const [siteName, setSiteName] = useState('');
  const [saveSiteDetails, setSaveSiteDetails] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Get the current user
  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    }
    
    getUser();
  }, [supabase.auth]);

  // Load rewritten content and saved sites when component mounts
  useEffect(() => {
    // Load rewritten content from localStorage
    if (typeof window !== 'undefined') {
      const savedContent = localStorage.getItem('rewrittenContent');
      if (savedContent) {
        try {
          const parsedContent = JSON.parse(savedContent);
          setRewrittenContent(parsedContent);
        } catch {
          setError('Failed to load rewritten content. Please go back and rewrite content first.');
        }
      } else {
        setError('No rewritten content found. Please go back and rewrite content first.');
      }
    }
    
    // Load saved sites from Supabase
    async function loadSavedSites() {
      if (!userId) return;
      
      try {
        setIsLoadingSites(true);
        const { data, error } = await supabase
          .from('saved_sites')
          .select('*')
          .eq('user_id', userId)
          .order('name', { ascending: true });
        
        if (error) {
          throw new Error(error.message);
        }
        
        setSavedSites(data || []);
      } catch (err) {
        console.error('Error loading saved sites:', err);
        setError('Failed to load saved sites');
      } finally {
        setIsLoadingSites(false);
      }
    }
    
    if (userId) {
      loadSavedSites();
    } else {
      setIsLoadingSites(false);
    }
  }, [userId, supabase]);

  // Handle selecting a saved site
  const handleSiteSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedSiteId(selectedId);
    
    if (selectedId) {
      const site = savedSites.find(site => site.id === selectedId);
      if (site) {
        setWpUrl(site.url);
        setUsername(site.username);
        setSiteName(site.name);
        // Password is not stored for security reasons
        setPassword('');
      }
    } else {
      // Clear fields if "Select a saved site" is chosen
      setWpUrl('');
      setUsername('');
      setPassword('');
      setSiteName('');
    }
  };

  // Save site to Supabase
  const saveSiteToSupabase = async () => {
    if (!userId) {
      setError('You must be logged in to save site details');
      return false;
    }

    if (!siteName || !wpUrl || !username) {
      setError('Please provide a site name, URL, and username to save the site');
      return false;
    }
    
    try {
      // Check if a site with this URL already exists for this user
      const { data: existingSites } = await supabase
        .from('saved_sites')
        .select('id')
        .eq('user_id', userId)
        .eq('url', wpUrl);
      
      
      if (existingSites && existingSites.length > 0) {
        // Update existing site
        const { error } = await supabase
          .from('saved_sites')
          .update({
            name: siteName,
            username: username,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSites[0].id)
          .select();
        
        if (error) throw new Error(error.message);
        // result = data;
      } else {
        // Insert new site
        const {  error } = await supabase
          .from('saved_sites')
          .insert({
            user_id: userId,
            name: siteName,
            url: wpUrl,
            username: username
          })
          .select();
        
        if (error) throw new Error(error.message);
        // result = data;
      }
      
      // Refresh the sites list
      const { data: refreshedSites, error: refreshError } = await supabase
        .from('saved_sites')
        .select('*')
        .eq('user_id', userId)
        .order('name', { ascending: true });
      
      if (refreshError) throw new Error(refreshError.message);
      setSavedSites(refreshedSites || []);
      
      setSaveSiteDetails(false);
      setSuccess('WordPress site details saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
      
      return true;
    } catch (err) {
      console.error('Error saving site:', err);
      setError(err instanceof Error ? err.message : 'Failed to save site details');
      return false;
    }
  };

  // Handle form submission to publish to WordPress
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!wpUrl || !username || !password) {
      setError('Please fill in all WordPress details');
      return;
    }
    
    if (!rewrittenContent) {
      setError('No rewritten content found. Please go back and rewrite content first.');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');
      
      const response = await fetch('/api/wordpress-publish-direct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: rewrittenContent.title,
          content: rewrittenContent.content,
          wpUrl,
          username,
          password,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to publish to WordPress');
      }
      
      const data = await response.json();
      setSuccess(`Successfully published to WordPress as a draft. Post ID: ${data.postId}`);
      
      // Save site details if checkbox is checked
      if (saveSiteDetails && siteName && wpUrl && username) {
        await saveSiteToSupabase();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Find the persona name if available
  const personaName = rewrittenContent?.persona 
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    ? (personas.find((p:any) => p.id === rewrittenContent.persona)?.name || 'Selected Commentator')
    : 'Selected Commentator';

  return (
    <main className="flex min-h-screen flex-col p-4 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header/>
        
        {/* Step Indicator */}
        <div className="mb-8 px-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className="bg-green-600 text-white rounded-full h-10 w-10 flex items-center justify-center shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="mt-2 text-sm font-medium text-green-800">Input</span>
            </div>
            <div className="flex-1 h-1 mx-2 bg-green-200"></div>
            <div className="flex flex-col items-center">
              <div className="bg-green-600 text-white rounded-full h-10 w-10 flex items-center justify-center shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="mt-2 text-sm font-medium text-green-800">Preview</span>
            </div>
            <div className="flex-1 h-1 mx-2 bg-blue-200"></div>
            <div className="flex flex-col items-center">
              <div className="bg-blue-600 text-white rounded-full h-10 w-10 flex items-center justify-center shadow-md">
                <span className="font-bold">3</span>
              </div>
              <span className="mt-2 text-sm font-medium text-blue-800">Publish</span>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Card Header */}
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
            <h2 className="text-xl font-semibold text-blue-800">Publish to WordPress</h2>
            <p className="text-sm text-blue-600 mt-1">Publish your {personaName} style content to WordPress</p>
          </div>
          
          <div className="p-6 md:p-8">
            {!rewrittenContent ? (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">{error || 'No rewritten content found. Please go back and rewrite content first.'}</p>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <button
                    onClick={() => router.push('/')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* User auth status notice */}
                {!userId && (
                  <div className="bg-amber-50 border-l-4 border-amber-500 text-amber-700 p-4 rounded">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm">You are not logged in. Sign in to save your WordPress sites for future use.</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Saved Sites Dropdown - only show if user is logged in */}
                {userId && (
                  <div>
                    <label htmlFor="savedSite" className="block text-sm font-medium text-gray-700 mb-1">
                      Select a Saved WordPress Site
                    </label>
                    <div className="relative">
                      {isLoadingSites ? (
                        <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-md">
                          <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Loading saved sites...</span>
                        </div>
                      ) : (
                        <>
                          <select
                            id="savedSite"
                            value={selectedSiteId}
                            onChange={handleSiteSelect}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition-colors duration-200"
                          >
                            <option value="">Select a saved site</option>
                            {savedSites.map((site) => (
                              <option key={site.id} value={site.id}>
                                {site.name} ({site.url})
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                            <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          </div>
                        </>
                      )}
                    </div>
                    {savedSites.length === 0 && !isLoadingSites && userId && (
                      <p className="mt-1 text-xs text-gray-500">
                        No saved sites found. You can save your WordPress site details below.
                      </p>
                    )}
                  </div>
                )}
                
                {/* WordPress URL */}
                <div>
                  <label htmlFor="wpUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    WordPress Site URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    id="wpUrl"
                    value={wpUrl}
                    onChange={(e) => setWpUrl(e.target.value)}
                    placeholder="https://yoursite.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter the full URL of your WordPress site (e.g., https://yoursite.com)
                  </p>
                </div>
                
                {/* Username */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Your WordPress username"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    required
                  />
                </div>
                
                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your WordPress password or application password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    For better security, consider using an application password instead of your main account password.
                    <strong> Passwords are never stored.</strong>
                  </p>
                </div>
                
                {/* Save Site Details - only show for logged in users */}
                {userId && (
                  <div>
                    <div className="flex items-center">
                      <input 
                        id="saveSite" 
                        type="checkbox" 
                        checked={saveSiteDetails}
                        onChange={(e) => setSaveSiteDetails(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="saveSite" className="ml-2 block text-sm text-gray-700">
                        Save site details for future use
                      </label>
                    </div>
                  </div>
                )}
                
                {/* Site Name (conditional) */}
                {saveSiteDetails && userId && (
                  <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                    <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
                      Site Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="siteName"
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      placeholder="Enter a name for this site"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      This name will be used to identify the site in your saved sites list.
                    </p>
                  </div>
                )}
                
                {/* Content Preview Summary */}
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-2">Content to be Published:</h3>
                  <p className="text-gray-700"><strong>Title:</strong> {rewrittenContent.title}</p>
                  <p className="text-gray-700 mt-1"><strong>Style:</strong> {personaName}</p>
                  <p className="text-gray-700 mt-1"><strong>Length:</strong> Approximately {rewrittenContent.content.length > 0 ? Math.ceil(rewrittenContent.content.length / 6) : 0} words</p>
                </div>
                
                {/* Error and Success Messages */}
                {error && (
                  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {success && (
                  <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm">{success}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => router.push('/rewrite')}
                    className="order-2 sm:order-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    Back to Preview
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      // Clear stored content and go to home page
                      localStorage.removeItem('rewrittenContent');
                      router.push('/');
                    }}
                    className="order-3 sm:order-2 bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    Write New Article
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="order-1 sm:order-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Publishing...
                      </div>
                    ) : (
                      'Publish as Draft'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
