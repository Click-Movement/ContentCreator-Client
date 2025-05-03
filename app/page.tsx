'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle } from 'lucide-react';
import CustomPersonaModal from '@/components/CustomPersonaModal';
import Header from '@/components/header';
import { personas, CustomPersona, getCustomPersonas } from '@/types/personas';
import { usePersonaRewriter } from '@/hooks/usePersonaRewriter';

export default function Home() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedPersona, setSelectedPersona] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedModel, setSelectedModel] = useState<'gpt' | 'claude'>('claude');
  const [customPersonas, setCustomPersonas] = useState<CustomPersona[]>([]);
  const [isCustomPersonaModalOpen, setIsCustomPersonaModalOpen] = useState(false);
  const router = useRouter();
  
  const { rewriteContent, error: rewriteError } = usePersonaRewriter();

  // Load predefined and custom personas from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCustomPersonas = getCustomPersonas();
      setCustomPersonas(savedCustomPersonas);
      
      // Set the first persona as selected if available (first predefined, then custom)
      if (personas.length > 0) {
        setSelectedPersona(personas[0].id);
      } else if (savedCustomPersonas.length > 0) {
        setSelectedPersona(savedCustomPersonas[0].id);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validation - make sure we have a selected persona
      if (!selectedPersona) {
        setError('Please select a persona first.');
        return;
      }
      
      setIsLoading(true);
      setError('');

      // Use the rewriter hook to handle the actual rewriting
      const result = await rewriteContent({
        title,
        content,
        personaId: selectedPersona,
        model: selectedModel
      });
      
      if (result) {
        // Navigate to rewrite page to show results
        router.push('/rewrite');
      } else if (rewriteError) {
        setError(rewriteError);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle saving new custom persona
  const handleSaveCustomPersona = (persona: CustomPersona) => {
    const updatedPersonas = [...customPersonas, persona];
    setCustomPersonas(updatedPersonas);
    
    // Auto-select the newly created persona
    setSelectedPersona(persona.id);
    
    // Close the modal
    setIsCustomPersonaModalOpen(false);
  };
  
  // Handle deleting a custom persona
  const handleDeletePersona = (personaId: string) => {
    const updatedPersonas = customPersonas.filter(p => p.id !== personaId);
    setCustomPersonas(updatedPersonas);
    
    // If we deleted the selected persona, select the first available one
    if (selectedPersona === personaId) {
      if (personas.length > 0) {
        setSelectedPersona(personas[0].id);
      } else if (updatedPersonas.length > 0) {
        setSelectedPersona(updatedPersonas[0].id);
      } else {
        setSelectedPersona('');
      }
    }
  };

  // Find the currently selected persona (predefined or custom)
  const currentPersona = 
    personas.find(p => p.id === selectedPersona) || 
    customPersonas.find(p => p.id === selectedPersona);

  return (
    <main className="flex min-h-screen flex-col p-4 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        
        {/* Step Indicator */}
        <div className="mb-8 px-4">
          {/* Your step indicator component */}
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Card Header */}
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
                    onClick={() => setIsCustomPersonaModalOpen(true)}
                    className="text-sm flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Create Custom Persona
                  </button>
                </div>
                
                <div className="relative">
                  <select
                    id="persona"
                    value={selectedPersona}
                    onChange={(e) => setSelectedPersona(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition-colors duration-200"
                    required
                  >
                    <optgroup label="Predefined Personas">
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
                            {persona.name} - {persona.description}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                    <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
                
                {/* Delete button for custom personas */}
                {selectedPersona && selectedPersona.startsWith('custom_') && (
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this persona?')) {
                          handleDeletePersona(selectedPersona);
                        }
                      }}
                      className="text-red-600 hover:text-red-800 text-sm flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete this persona
                    </button>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select AI Model
                </label>
                <div className="flex gap-6 items-center">
                  <div className="flex items-center">
                    <input
                      id="claude"
                      type="radio"
                      value="claude"
                      name="model"
                      checked={selectedModel === 'claude'}
                      onChange={() => setSelectedModel('claude')}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="claude" className="ml-2 block text-sm text-gray-700">
                      Claude (Anthropic)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="gpt"
                      type="radio"
                      value="gpt"
                      name="model"
                      checked={selectedModel === 'gpt'}
                      onChange={() => setSelectedModel('gpt')}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="gpt" className="ml-2 block text-sm text-gray-700">
                      GPT (OpenAI)
                    </label>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Choose which AI model to use for rewriting your content.
                </p>
              </div>
              
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Article Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter the article title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Article Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste the article content here"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 h-64"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  {currentPersona 
                    ? `Paste the full article content to be rewritten in ${currentPersona.name}'s style.`
                    : 'Paste the full article content to be rewritten.'}
                </p>
              </div>
              
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
              
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isLoading || !selectedPersona}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Rewriting...
                    </div>
                  ) : (
                    currentPersona 
                      ? `Rewrite in ${currentPersona.name}'s Style` 
                      : 'Select a Persona First'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Custom Persona Modal */}
        <CustomPersonaModal 
          isOpen={isCustomPersonaModalOpen}
          onClose={() => setIsCustomPersonaModalOpen(false)}
          onSave={handleSaveCustomPersona}
        />
        
        {/* Footer */}
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>Content Rewriter &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </main>
  );
}
