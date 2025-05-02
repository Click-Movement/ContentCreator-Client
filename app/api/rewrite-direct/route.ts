import { NextRequest, NextResponse } from 'next/server';
import { rewriteInPersonaStyle, PersonaType, AIModelType } from '@/lib/aiPersonaRewriter';

// Add this export to use Edge Runtime
export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { title, content, persona, model, customInstructions } = await request.json();
    
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }
    
    // Validate persona type for built-in personas
    const validPersonas = [
      'charlie_kirk',
      'larry_elder', 
      'glenn_beck', 
      'laura_loomer', 
      'tomi_lahren', 
      'rush_limbaugh',
      'ben_shapiro'
    ];
    
    // Check if we have API keys in environment variables
    const openaiKey = process.env.OPENAI_API_KEY;
    const claudeKey = process.env.CLAUDE_API_KEY;
    
    // Validate model selection
    const selectedModel = model === 'gpt' ? 'gpt' : 'claude';
    
    if (selectedModel === 'gpt' && !openaiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured on the server' },
        { status: 500 }
      );
    }
    
    if (selectedModel === 'claude' && !claudeKey) {
      return NextResponse.json(
        { error: 'Claude API key is not configured on the server' },
        { status: 500 }
      );
    }
    
    // Use environment variables for API keys
    const serverApiKeys = {
      openai: openaiKey || null,
      claude: claudeKey || null
    };
    
    // Check if we're using a custom persona (starts with 'custom_')
    const isCustomPersona = typeof persona === 'string' && persona.startsWith('custom_');
    
    // Handle rewriting
    const rewrittenContent = await Promise.race([
      isCustomPersona && customInstructions
        ? rewriteInPersonaStyle(title, content, 'custom' as PersonaType, selectedModel as AIModelType, serverApiKeys, customInstructions)
        : rewriteInPersonaStyle(title, content, persona as PersonaType, selectedModel as AIModelType, serverApiKeys),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('API call timed out')), 45000)
      ) as Promise<never>
    ]);
    
    return NextResponse.json({
      success: true,
      title: rewrittenContent.title,
      content: rewrittenContent.content,
      persona: persona
    });
  } catch (error) {
    console.error('Error in AI rewrite API:', error);
    
    // Check for specific AI-related errors
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to rewrite content';
    
    // Handle rate limiting, quota errors, or timeouts specifically
    const isRateLimitError = errorMessage.toLowerCase().includes('rate limit') || 
                           errorMessage.toLowerCase().includes('quota');
    const isTimeoutError = errorMessage.toLowerCase().includes('timed out');
    
    return NextResponse.json(
      { 
        error: errorMessage,
        isRateLimitError,
        isTimeoutError
      },
      { status: isRateLimitError ? 429 : isTimeoutError ? 504 : 500 }
    );
  }
}
