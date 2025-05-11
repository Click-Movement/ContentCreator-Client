import { loadCustomPersonas, CustomPersona, getCustomPersonaByUsingId } from '@/lib/customPersonaRewriter';

// Default persona types (don't modify these)
export type DefaultPersonaType = 
  'sports_reporter' |
  'liberal_reporter' |
  'health_reporter_male' |
  'health_reporter_female' |
  'financial_reporter' |
  'conservative_reporter' |
  'celebrity_entertainment_reporter' |
  'bipartisan_reporter';

// Define predefined personas
export const personas = [
  {
    id: 'sports_reporter',
    name: 'Sports Reporter',
    description: 'Dynamic sports commentary with technical analysis',
  },
  {
    id: 'liberal_reporter',
    name: 'Liberal Reporter',
    description: 'Breaking news reporting with liberal perspective',
  },
  {
    id: 'health_reporter_male',
    name: 'Health Reporter (Male)',
    description: 'Health and nutrition content with functional medicine approach',
  },
  {
    id: 'health_reporter_female',
    name: 'Health Reporter (Female)',
    description: 'Practical fitness advice for busy individuals',
  },
  {
    id: 'financial_reporter',
    name: 'Financial Reporter',
    description: 'No-nonsense financial advice with debt-free focus',
  },
  {
    id: 'conservative_reporter',
    name: 'Conservative Reporter',
    description: 'Logical commentary with conservative viewpoint',
  },
  {
    id: 'celebrity_entertainment_reporter',
    name: 'Entertainment Reporter',
    description: 'Enthusiastic celebrity and entertainment coverage',
  },
  {
    id: 'bipartisan_reporter',
    name: 'Bipartisan Reporter',
    description: 'Balanced political analysis beyond partisan divides',
  },
];

// Re-export CustomPersona type

// Helper function to retrieve custom personas from Supabase
export async function getCustomPersonas(userId?: string): Promise<CustomPersona[]> {
  return await loadCustomPersonas(userId);
}

// Helper function to get a custom persona by ID
export async function getCustomPersonaById(personaId: string): Promise<CustomPersona | null> {
  if (!personaId.startsWith('custom_')) {
    return null;
  }
  
  return await getCustomPersonaByUsingId(personaId);
}

// Check if a persona is a default persona
export function isDefaultPersona(personaId: string): boolean {
  return personas.some(p => p.id === personaId);
}
