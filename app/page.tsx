'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/supabase/client';
import { PlusCircle } from 'lucide-react';
import CustomPersonaModal from '@/components/CustomPersonaModal';
import Header from '@/components/header';
import { loadCustomPersonas, saveCustomPersona, deleteCustomPersona, CustomPersona } from '@/lib/customPersonaRewriter';
import { personas } from '@/types/personas';
import { User } from '@supabase/auth-helpers-nextjs';
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";

export default function Home() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [, setIsLoadingUser] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedPersona, setSelectedPersona] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedModel, setSelectedModel] = useState<'gpt' | 'claude'>('claude');
  const [customPersonas, setCustomPersonas] = useState<CustomPersona[]>([]);
  const [isCustomPersonaModalOpen, setIsCustomPersonaModalOpen] = useState(false);
  const [isLoadingPersonas, setIsLoadingPersonas] = useState(true);

  // Get the current user when the component mounts
  useEffect(() => {
    async function getUserData() {
      try {
        setIsLoadingUser(true);
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Error fetching user:", error.message);
          setUser(null);
        } else {
          console.log("User data in home page:", data.user);
          setUser(data.user);
          
          // Show welcome toast when user is logged in
          if (data.user) {
            toast("Welcome back!", {
              description: "Ready to transform your content with AI.",
            });
          }
        }
      } catch (err) {
        console.error("Exception fetching user:", err);
        setUser(null);
      } finally {
        setIsLoadingUser(false);
      }
    }

    getUserData();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      
      if (event === 'SIGNED_IN' && session?.user) {
        toast("Successfully signed in", {
          description: "Welcome to Content Creator!",
        });
      } else if (event === 'SIGNED_OUT') {
        toast("Signed out", {
          description: "You have been successfully signed out.",
        });
      }
    });

    return () => {
      // Clean up the subscription
      authListener?.subscription?.unsubscribe();
    };
  }, [supabase.auth]);

  // Load personas with the user's ID
  useEffect(() => {
    async function fetchPersonas() {
      setIsLoadingPersonas(true);
      try {
        // Only load personas if we have a user
        if (user?.id) {
          console.log("Loading personas for user:", user.id);
          const loadedCustomPersonas = await loadCustomPersonas(user.id);
          setCustomPersonas(loadedCustomPersonas);
          
          if (loadedCustomPersonas.length > 0) {
            toast(`Loaded ${loadedCustomPersonas.length} custom personas`, {
              description: "Your custom writing styles are ready to use.",
            });
          }
        } else {
          console.log("No user ID available, not loading custom personas");
          setCustomPersonas([]);
        }
      } catch (err) {
        console.error('Failed to load personas:', err);
        toast("Failed to load personas", {
          description: "Please try refreshing the page.",
          // variant: "destructive",j
        });
        setError('Failed to load personas. Please refresh the page.');
      } finally {
        setIsLoadingPersonas(false);
      }
    }

    fetchPersonas();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPersona) {
      toast("No persona selected", {
        description: "Please select a writing style before continuing.",
        // variant: "destructive",
      });
      setError('Please select a persona first.');
      return;
    }
    
    if (!content.trim()) {
      toast("Content required", {
        description: "Please enter some content to rewrite.",
        // variant: "destructive",
      });
      setError('Please enter some content to rewrite.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    // Show loading toast
    toast("Rewriting your content", {
      description: "This may take a moment depending on the length...",
    });

    try {
      const response = await fetch('/api/rewrite-direct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          personaId: selectedPersona,
          model: selectedModel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to rewrite content');
      }

      toast("Content rewritten successfully!", {
        description: "Taking you to the preview page.",
      });

      localStorage.setItem(
        'rewrittenContent',
        JSON.stringify({
          title: data.title,
          content: data.content,
          persona: selectedPersona,
        })
      );

      // Navigate after a short delay to see the toast
      setTimeout(() => {
        router.push('/rewrite');
      }, 1000);
    } catch (err) {
      console.error('Error during rewrite:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      
      toast("Rewrite failed", {
        description: errorMessage,
        // variant: "destructive",
      });
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle saving custom persona
  const handleSaveCustomPersona = async (persona: CustomPersona) => {
    try {
      console.log("Saving persona:", persona);

      if (!persona.user_id) {
        throw new Error("Missing user ID in persona");
      }
      
      toast("Saving persona...", {
        description: `Creating "${persona.name}" persona`,
      });

      const saved = await saveCustomPersona(persona);

      if (saved) {
        setCustomPersonas(prev => [...prev.filter(p => p.id !== persona.id), persona]);
        setSelectedPersona(persona.id);
        setIsCustomPersonaModalOpen(false);
        
        toast("Persona saved", {
          description: `"${persona.name}" is ready to use`,
        });
      } else {
        throw new Error('Failed to save persona');
      }
    } catch (err) {
      console.error('Error saving persona:', err);
      toast("Failed to save persona", {
        description: "Please try again later.",
        // variant: "destructive",
      });
      setError('Failed to save custom persona. Please try again.');
    }
  };

  // Handle deleting custom persona
  const handleDeletePersona = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this persona?')) {
      return;
    }

    if (!user?.id) {
      toast("Authentication required", {
        description: "You must be logged in to delete personas.",
        // variant: "destructive",
      });
      setError('You must be logged in to delete personas');
      return;
    }

    // Find persona name for the toast
    const personaToDelete = customPersonas.find(p => p.id === id);
    const personaName = personaToDelete?.name || "Custom persona";
    
    toast("Deleting persona...", {
      description: `Removing "${personaName}"`,
    });

    try {
      console.log("Deleting persona using user ID:", user.id);
      const deleted = await deleteCustomPersona(id, user.id);

      if (deleted) {
        setCustomPersonas(prev => prev.filter(p => p.id !== id));

        if (selectedPersona === id) {
          setSelectedPersona(personas[0]?.id || '');
        }
        
        toast("Persona deleted", {
          description: `"${personaName}" has been removed`,
        });
      } else {
        throw new Error('Failed to delete persona');
      }
    } catch (err) {
      console.error('Error deleting persona:', err);
      toast("Delete failed", {
        description: "There was a problem deleting your persona.",
        // variant: "destructive",
      });
      setError('Failed to delete custom persona. Please try again.');
    }
  };

  // Handle create custom persona button
  const handleCreateCustomPersonaClick = () => {
    if (!user) {
      toast("Authentication required", {
        description: "Please sign in to create custom personas.",
      });
      router.push('/auth/signin?redirect=/');
      return;
    }
    setIsCustomPersonaModalOpen(true);
  };

  // Handle model change
  const handleModelChange = (model: 'gpt' | 'claude') => {
    setSelectedModel(model);
    toast("AI model changed", {
      description: `Now using ${model === 'gpt' ? 'OpenAI GPT' : 'Anthropic Claude'} for rewriting.`,
    });
  };

  return (
    <main className="flex min-h-screen flex-col p-4 md:p-8">
      <Toaster />
      
      <div className="w-full max-w-4xl mx-auto">
        <Header />

        <div className="mb-8 px-4"></div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
            <h2 className="text-xl font-semibold text-blue-800">Rewrite Content</h2>
            <p className="text-sm text-blue-600 mt-1">Transform your content with distinctive voices</p>
          </div>

          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="persona" className="block text-sm font-medium text-gray-700">
                    Select Persona Style
                  </label>
                  <button
                    type="button"
                    onClick={handleCreateCustomPersonaClick}
                    className="text-sm flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Create Custom Persona
                  </button>
                </div>

                <div className="relative">
                  {isLoadingPersonas ? (
                    <div className="w-full h-10 bg-gray-100 animate-pulse rounded-lg"></div>
                  ) : (
                    <select
                      id="persona"
                      value={selectedPersona}
                      onChange={(e) => {
                        setSelectedPersona(e.target.value);
                        
                        if (e.target.value) {
                          const selectedOption = e.target.options[e.target.selectedIndex];
                          const personaName = selectedOption.text.split('-')[0].trim();
                          toast("Persona selected", {
                            description: `Content will be written in the style of "${personaName}"`,
                          });
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition-colors duration-200"
                      required
                    >
                      <option value="" disabled>
                        Select a persona style
                      </option>

                      <optgroup label="Default Personas">
                        {personas.map((persona) => (
                          <option key={persona.id} value={persona.id}>
                            {persona.name} - {persona.description}
                          </option>
                        ))}
                      </optgroup>

                      {customPersonas.length > 0 && (
                        <optgroup label="Your Custom Personas">
                          {customPersonas.map((persona) => (
                            <option key={persona.id} value={persona.id}>
                              {persona.name} - {persona.description || ''}
                            </option>
                          ))}
                        </optgroup>
                      )}
                    </select>
                  )}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                    <svg
                      className="fill-current h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>

                {selectedPersona && selectedPersona.startsWith('custom_') && (
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleDeletePersona(selectedPersona)}
                      className="text-red-600 hover:text-red-800 text-sm flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete this persona
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Enter the title of your content"
                  required
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 min-h-[200px]"
                  placeholder="Enter your content to rewrite"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">AI Model</label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-blue-600"
                      name="model"
                      checked={selectedModel === 'claude'}
                      onChange={() => handleModelChange('claude')}
                    />
                    <span className="ml-2">Claude (Anthropic)</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-blue-600"
                      name="model"
                      checked={selectedModel === 'gpt'}
                      onChange={() => handleModelChange('gpt')}
                    />
                    <span className="ml-2">GPT (OpenAI)</span>
                  </label>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4">
                  <p>{error}</p>
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isLoading ? 'Rewriting...' : 'Rewrite Content'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <CustomPersonaModal
          isOpen={isCustomPersonaModalOpen}
          onClose={() => setIsCustomPersonaModalOpen(false)}
          onSave={handleSaveCustomPersona}
        />
      </div>
    </main>
  );
}