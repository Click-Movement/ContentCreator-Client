"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import DOMPurify from 'isomorphic-dompurify';
import Header from '@/components/header';
// import Header from '@/components/Header';

// Type for rewritten content
type RewrittenContent = {
  title: string;
  content: string;
  persona: string;
};

// Type for custom personas
type CustomPersona = {
  id: string;
  name: string;
  description: string;
  instructions: string;
};

export default function RewritePage() {
  const [rewrittenContent, setRewrittenContent] = useState<RewrittenContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [htmlMode, setHtmlMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedContent = localStorage.getItem('rewrittenContent');
      
      if (savedContent) {
        try {
          const parsedContent = JSON.parse(savedContent);
          setRewrittenContent(parsedContent);
        } catch  {
          setError('Failed to parse saved content.');
        }
      } else {
        setError('No rewritten content found. Please go back and rewrite content first.');
      }
      setIsLoading(false);
    }
  }, []);

  const handleProceedToWordPress = () => {
    router.push('/wordpress');
  };

  // Find the persona name if available
  const getPersonaName = () => {
    if (!rewrittenContent?.persona) return 'Custom Commentator';
    
    // Load custom personas from localStorage
    if (typeof window !== 'undefined') {
      const savedCustomPersonas = localStorage.getItem('customPersonas');
      if (savedCustomPersonas) {
        try {
          const customPersonas: CustomPersona[] = JSON.parse(savedCustomPersonas);
          const persona = customPersonas.find(p => p.id === rewrittenContent.persona);
          if (persona) {
            return persona.name;
          }
        } catch (err) {
          console.error('Failed to parse custom personas', err);
        }
      }
    }
    
    // Fallback - extract name from persona ID
    if (rewrittenContent.persona.startsWith('custom_')) {
      const customName = rewrittenContent.persona.replace('custom_', '')
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      return customName;
    }
    
    return 'Custom Commentator';
  };

  const personaName = getPersonaName();

  return (
    <main className="flex min-h-screen flex-col p-4 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        {/* Enhanced Header with Gradient Background */}
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
              <div className="bg-blue-600 text-white rounded-full h-10 w-10 flex items-center justify-center shadow-md">
                <span className="font-bold">2</span>
              </div>
              <span className="mt-2 text-sm font-medium text-blue-800">Preview</span>
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
        
        {/* Main Content */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-lg p-8 flex justify-center items-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6 mb-3"></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-red-700 text-base">{error}</p>
                  <div className="mt-4">
                    <button
                      onClick={() => router.push('/')}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-all duration-200"
                    >
                      Go Back to Home
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Content presentation */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 md:p-8">
                {/* Header info */}
                <div className="mb-6 border-b pb-4">
                  <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">{rewrittenContent?.title}</h1>
                    <div>
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800">
                        {personaName}s Style
                      </span>
                    </div>
                  </div>
                </div>

                {/* Display mode toggle */}
                <div className="mb-6 flex justify-end">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">View mode:</span>
                    <div className="bg-gray-100 rounded-lg p-1 flex">
                      <button
                        className={`px-3 py-1 rounded-md text-sm ${!htmlMode ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}
                        onClick={() => setHtmlMode(false)}
                      >
                        Preview
                      </button>
                      <button
                        className={`px-3 py-1 rounded-md text-sm ${htmlMode ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}
                        onClick={() => setHtmlMode(true)}
                      >
                        HTML
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Content display */}
                {htmlMode ? (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
                    <SyntaxHighlighter
                      language="html"
                      style={vscDarkPlus}
                      customStyle={{ margin: 0, borderRadius: '0.375rem' }}
                      wrapLongLines={true}
                    >
                      {rewrittenContent?.content || ''}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <div 
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(rewrittenContent?.content || '') }}
                  ></div>
                )}
                
                {/* Actions */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
                  <button
                    onClick={() => router.push('/')}
                    className="flex-1 py-2 px-4 border border-blue-300 text-blue-700 hover:bg-blue-50 font-medium rounded-lg transition-colors"
                  >
                    Create New Rewrite
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(rewrittenContent?.content || '')}
                    className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
                  >
                    Copy HTML
                  </button>
                  <button
                    onClick={handleProceedToWordPress}
                    className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors"
                  >
                    Publish to wordpress
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
