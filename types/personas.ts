// Define persona types for the content rewriter

import { PredefinedPersonaType } from '@/lib/contentRewriter';

export type PersonaType = PredefinedPersonaType | string;

export interface Persona {
  id: PersonaType;
  name: string;
  description: string;
  imageUrl?: string;
}

export interface CustomPersona {
  id: string;
  name: string;
  description: string;
  instructions: string;
}

// List of predefined personas based on style guides in assets folder
export const personas: Persona[] = [
  {
    id: 'bipartisan_reporter',
    name: 'Tulsi Gabbard',
    description: 'Measured delivery with military precision and bipartisan appeal'
  },
  {
    id: 'liberal_reporter',
    name: 'Wolf Blitzer',
    description: 'Serious, authoritative delivery of breaking news with journalistic neutrality'
  },
  {
    id: 'conservative_reporter',
    name: 'Ben Shapiro',
    description: 'Rapid-fire logical arguments with precise language and intellectual framing'
  },
  {
    id: 'celebrity_entertainment_reporter',
    name: 'Entertainment Reporter',
    description: 'Warm, enthusiastic coverage of celebrity news and entertainment'
  },
  {
    id: 'health_reporter_female',
    name: 'Andrea Allen',
    description: 'Accessible health advice for busy women with a focus on simplicity'
  },
  {
    id: 'health_reporter_male',
    name: 'Dr. Mark Hyman',
    description: 'Functional medicine approach with scientific backing and accessibility'
  },
  {
    id: 'financial_reporter',
    name: 'Dave Ramsey',
    description: 'No-nonsense financial advice with folksy delivery and tough love'
  },
  {
    id: 'sports_reporter',
    name: 'Kirk Herbstreit',
    description: 'Insightful sports analysis balancing technical detail with enthusiasm'
  }
];

// Helper functions for custom personas
export function saveCustomPersona(persona: CustomPersona): void {
  if (typeof window === 'undefined') return;
  
  // Get existing custom personas
  const savedCustomPersonas = localStorage.getItem('customPersonas');
  let customPersonas: CustomPersona[] = [];
  
  if (savedCustomPersonas) {
    try {
      customPersonas = JSON.parse(savedCustomPersonas);
    } catch (error) {
      console.error('Failed to parse custom personas', error);
    }
  }
  
  // Check if persona already exists
  const existingIndex = customPersonas.findIndex(p => p.id === persona.id);
  if (existingIndex >= 0) {
    // Update existing persona
    customPersonas[existingIndex] = persona;
  } else {
    // Add new persona
    customPersonas.push(persona);
  }
  
  // Save to localStorage
  localStorage.setItem('customPersonas', JSON.stringify(customPersonas));
}

export function getCustomPersonas(): CustomPersona[] {
  if (typeof window === 'undefined') return [];
  
  const savedCustomPersonas = localStorage.getItem('customPersonas');
  if (!savedCustomPersonas) return [];
  
  try {
    return JSON.parse(savedCustomPersonas);
  } catch (error) {
    console.error('Failed to parse custom personas', error);
    return [];
  }
}

export function getCustomPersonaById(id: string): CustomPersona | null {
  const customPersonas = getCustomPersonas();
  return customPersonas.find(p => p.id === id) || null;
}

export function deleteCustomPersona(id: string): void {
  if (typeof window === 'undefined') return;
  
  const savedCustomPersonas = localStorage.getItem('customPersonas');
  if (!savedCustomPersonas) return;
  
  try {
    const customPersonas = JSON.parse(savedCustomPersonas);
    const updatedPersonas = customPersonas.filter((p: CustomPersona) => p.id !== id);
    localStorage.setItem('customPersonas', JSON.stringify(updatedPersonas));
  } catch (error) {
    console.error('Failed to delete custom persona', error);
  }
}

// Helper to get any persona (predefined or custom) by ID
export function getPersonaById(id: PersonaType): Persona | CustomPersona | null {
  // Check predefined personas first
  const predefined = personas.find(p => p.id === id);
  if (predefined) return predefined;
  
  // Then check custom personas
  return getCustomPersonaById(id as string);
}
