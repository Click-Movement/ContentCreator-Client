'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Persona, PersonaType, personas as defaultPersonas } from '@/types/personas';
import { PlusCircle } from 'lucide-react';
import CustomPersonaModal from '@/components/CustomPersonaModal';
import Header from '@/components/header';

// Define the extended persona type which includes custom personas
type ExtendedPersonaType = PersonaType | string;

// Type for custom personas saved by the user
type CustomPersona = {
  id: string;
  name: string;
  description: string;
  instructions: string;
};

export default function Home() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedPersona, setSelectedPersona] = useState<ExtendedPersonaType>('rush_limbaugh');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedModel, setSelectedModel] = useState<'gpt' | 'claude'>('claude');
  const [customPersonas, setCustomPersonas] = useState<CustomPersona[]>([]);
  const [isCustomPersonaModalOpen, setIsCustomPersonaModalOpen] = useState(false);
  const router = useRouter();

  // Merged personas include both default and custom personas
  const mergedPersonas = [...defaultPersonas, ...customPersonas];

  // Load custom personas from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCustomPersonas = localStorage.getItem('customPersonas');
      if (savedCustomPersonas) {
        try {
          const parsedPersonas = JSON.parse(savedCustomPersonas);
          setCustomPersonas(parsedPersonas);
        } catch (error) {
          console.error('Failed to parse custom personas:', error);
        }
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError('');

      // Find the selected persona's instructions if it's a custom one
      const selectedPersonaData = mergedPersonas.find(p => p.id === selectedPersona);
      const customInstructions = selectedPersonaData && 'instructions' in selectedPersonaData 
        ? selectedPersonaData.instructions 
        : undefined;

      const response = await fetch('/api/rewrite-direct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          persona: selectedPersona,
          model: selectedModel,
          customInstructions
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to rewrite content');
      }

      const data = await response.json();

      // Save rewritten content to localStorage for next page
      localStorage.setItem('rewrittenContent', JSON.stringify({
        title: data.title,
        content: data.content,
        persona: selectedPersona
      }));

      // Navigate to rewrite page to show results
      router.push('/rewrite');
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
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('customPersonas', JSON.stringify(updatedPersonas));
    }
    
    // Auto-select the newly created persona
    setSelectedPersona(persona.id);
  };

  // Find the currently selected persona
  const currentPersona = mergedPersonas.find((p: any) => p.id === selectedPersona) || mergedPersonas[0];

  return (
    <main className="flex min-h-screen flex-col p-4 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        
        {/* Step Indicator */}
        <div className="mb-8 px-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className="bg-blue-600 text-white rounded-full h-10 w-10 flex items-center justify-center shadow-md">
                <span className="font-bold">1</span>
              </div>
              <span className="mt-2 text-sm font-medium text-blue-800">Input</span>
            </div>
            <div className="flex-1 h-1 mx-2 bg-gray-200"></div>
            <div className="flex flex-col items-center">
              <div className="bg-gray-200 text-gray-600 rounded-full h-10 w-10 flex items-center justify-center">
                <span className="font-bold">2</span>
              </div>
              <span className="mt-2 text-sm font-medium text-gray-600">Preview</span>
            </div>
            <div className="flex-1 h-1 mx-2 bg-gray-200"></div>
            <div className="flex flex-col items-center">
              <div className="bg-gray-200 text-gray-600 rounded-full h-10 w-10 flex items-center justify-center">
                <span className="font-bold">3</span>
              </div>
              <span className="mt-2 text-sm font-medium text-gray-600">Publish</span>
            </div>
          </div>
        </div>
        
        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="persona" className="block text-sm font-medium text-gray-700">
                    Select Commentator Style
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCustomPersonaModalOpen(true)}
                    className="text-sm flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Create Custom
                  </button>
                </div>
                
                <div className="relative">
                  <select
                    id="persona"
                    value={selectedPersona}
                    onChange={(e) => setSelectedPersona(e.target.value as ExtendedPersonaType)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition-colors duration-200"
                  >
                    <optgroup label="Default Commentators">
                      {defaultPersonas.map((persona: Persona) => (
                        <option key={persona.id} value={persona.id}>
                          {persona.name} - {persona.description}
                        </option>
                      ))}
                    </optgroup>
                    
                    {customPersonas.length > 0 && (
                      <optgroup label="Custom Commentators">
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
                  Paste the full article content to be rewritten in {currentPersona.name}
                  &#39;s style.
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
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
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
                    `Rewrite in ${currentPersona.name}'s Style`
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
          <p>Conservative Content Rewriter &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </main>
  );
}
