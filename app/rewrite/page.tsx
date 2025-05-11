"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import { ArrowLeft, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import { SkeletonRewriteResult } from '@/components/ui/skeleton';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';

// Type for rewritten content
type RewrittenContent = {
  title: string;
  content: string;
  persona: string;
};

export default function RewritePage() {
  const [rewrittenContent, setRewrittenContent] = useState<RewrittenContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [htmlMode, setHtmlMode] = useState(false);
  const [personaName,] = useState('Custom Commentator');
  const router = useRouter();
  
  useEffect(() => {
    // Load rewritten content from localStorage
    try {
      const savedContent = localStorage.getItem('rewrittenContent');
      if (savedContent) {
        setRewrittenContent(JSON.parse(savedContent));
        
        // Show success toast when content loads
        toast("Content rewritten successfully", {
          description: "Your content has been transformed with the selected style.",
          icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
        });
      } else {
        setError('No rewritten content found. Please go back and rewrite content first.');
        
        // Show error toast
        toast("No content found", {
          description: "Please go back and rewrite content first.",
          icon: <AlertCircle className="h-4 w-4 text-red-500" />,
          className: "destructive",
        });
      }
    } catch (err) {
      console.error('Error loading rewritten content:', err);
      setError('Failed to load rewritten content');
      
      // Show error toast
      toast("Failed to load content", {
        description: "There was a problem loading your rewritten content.",
        icon: <AlertCircle className="h-4 w-4 text-red-500" />,
        className: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Toggle HTML mode with toast notification
  const toggleHtmlMode = () => {
    setHtmlMode(!htmlMode);
    
    toast(htmlMode ? "Switched to rendered view" : "Switched to HTML source view", {
      description: htmlMode ? "Viewing content as it will appear" : "Viewing the HTML markup",
    });
  };

  // Handle navigation to publish page
  const handleProceedToPublish = () => {
    // Store the current content in localStorage for the publish page
    const contentToSave = localStorage.getItem('rewrittenContent') || '{}';
    localStorage.setItem('contentToPublish', contentToSave);
    
    toast.promise(
      // Simulate an async operation
      new Promise((resolve) => setTimeout(resolve, 800)),
      {
        loading: "Preparing to publish...",
        success: () => {
          setTimeout(() => {
            router.push('/wordpress');
          }, 300);
          return "Ready for publishing!";
        },
        error: "Failed to prepare for publishing",
      }
    );
  };

  // Handle back button with toast
  const handleBackToEditor = () => {
    toast("Returning to editor", {
      description: "Taking you back to the content editor",
    });
    
    setTimeout(() => {
      router.push('/');
    }, 500);
  };

  return (
    <main className="flex min-h-screen flex-col p-4 md:p-8">
      <Toaster />
      
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        
        {/* Step indicator */}
        <div className="mb-8 px-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className="bg-blue-500 text-white rounded-full h-10 w-10 flex items-center justify-center shadow-md">
                <span className="font-bold">1</span>
              </div>
              <span className="mt-2 text-sm font-medium text-blue-800">Create</span>
            </div>
            <div className="flex-1 h-1 mx-2 bg-blue-500"></div>
            <div className="flex flex-col items-center">
              <div className="bg-blue-600 text-white rounded-full h-10 w-10 flex items-center justify-center shadow-md">
                <span className="font-bold">2</span>
              </div>
              <span className="mt-2 text-sm font-medium text-blue-800">Preview</span>
            </div>
            <div className="flex-1 h-1 mx-2 bg-blue-200"></div>
            <div className="flex flex-col items-center">
              <div className="bg-gray-300 text-gray-600 rounded-full h-10 w-10 flex items-center justify-center">
                <span className="font-bold">3</span>
              </div>
              <span className="mt-2 text-sm font-medium text-gray-600">Publish</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
            <h2 className="text-xl font-semibold text-blue-800">Rewritten Content</h2>
            <p className="text-sm text-blue-600 mt-1">
              Your content has been rewritten{personaName ? ` in the style of ${personaName}` : ''}
            </p>
          </div>
          
          <div className="p-6 md:p-8">
            {isLoading ? (
              <SkeletonRewriteResult />
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4">
                <p>{error}</p>
                <button
                  onClick={handleBackToEditor}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Go Back Home
                </button>
              </div>
            ) : rewrittenContent ? (
              <div className="space-y-8">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Rewritten Title</p>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {rewrittenContent.title}
                  </h1>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-500">Rewritten Content</p>
                    <button
                      onClick={toggleHtmlMode}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      {htmlMode ? 'View Rendered Content' : 'View HTML Source'}
                    </button>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4 overflow-auto max-h-[500px] bg-gray-50">
                    {htmlMode ? (
                      <pre className="text-sm font-mono whitespace-pre-wrap">
                        {rewrittenContent.content}
                      </pre>
                    ) : (
                      <div 
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: rewrittenContent.content }} 
                      />
                    )}
                  </div>
                </div>
                
                {/* Navigation buttons - Back and Proceed to Publish */}
                <div className="flex flex-wrap justify-between gap-4 pt-4">
                  <button
                    onClick={handleBackToEditor}
                    className="flex items-center px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Editor
                  </button>
                  
                  <button
                    onClick={handleProceedToPublish}
                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Proceed to Publish
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
