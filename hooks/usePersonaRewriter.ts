import { useState } from 'react';
import { getCustomPersonaById } from '@/types/personas';

interface RewriteOptions {
  title: string;
  content: string;
  personaId: string;
  model: 'gpt' | 'claude';
}

interface RewriteResult {
  title: string;
  content: string;
  persona: string;
}

export function usePersonaRewriter() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const rewriteContent = async (options: RewriteOptions): Promise<RewriteResult | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { title, content, personaId, model } = options;
      
      // Prepare request payload
      const payload: any = {
        title,
        content, 
        personaId,
        model
      };
      
      // If this is a custom persona, add its instructions
      if (personaId.startsWith('custom_')) {
        const customPersona = getCustomPersonaById(personaId);
        
        if (customPersona) {
          payload.customInstructions = customPersona.instructions;
        } else {
          throw new Error('Custom persona not found');
        }
      }
      
      // Call API
      const response = await fetch('/api/rewrite-direct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      // Handle response
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to rewrite content');
      }
      
      const result = await response.json();
      
      // Save result to localStorage for future use
      if (typeof window !== 'undefined') {
        localStorage.setItem('rewrittenContent', JSON.stringify({
          title: result.title,
          content: result.content,
          persona: personaId
        }));
      }
      
      return {
        title: result.title,
        content: result.content,
        persona: personaId
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    rewriteContent,
    isLoading,
    error
  };
}