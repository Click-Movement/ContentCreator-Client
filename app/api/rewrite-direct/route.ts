import { NextRequest, NextResponse } from 'next/server';
import { rewriteContent, AIModelType } from '@/lib/contentRewriter';
import { getCustomPersonaByUsingId } from '@/lib/customPersonaRewriter'; // Fixed import

// Use Edge Runtime for faster response
export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { title, content, personaId, model, customInstructions } = await request.json();
    
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }
    
    if (!personaId) {
      return NextResponse.json(
        { error: 'Persona ID is required' },
        { status: 400 }
      );
    }
    
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
    
    console.log("Starting content rewrite with model:", selectedModel);
    
    // Use environment variables for API keys
    const serverApiKeys = {
      openai: openaiKey || null,
      claude: claudeKey || null
    };
    
    let instructions = undefined;
    
    // If this is a custom persona (not one of the predefined ones)
    if (personaId.startsWith('custom_')) {
      // If no instructions were explicitly provided, try to find the saved custom persona
      if (!customInstructions) {
        const customPersona = await getCustomPersonaByUsingId(personaId);
        
        if (customPersona) {
          instructions = customPersona.instructions;
        } else {
          return NextResponse.json(
            { error: 'Custom persona not found and no instructions were provided' },
            { status: 400 }
          );
        }
      } else {
        instructions = customInstructions;
      }
    }
    
    // Use persona ID to rewrite content
    const rewrittenContent = await rewriteContent(
      title,
      content,
      personaId,
      selectedModel as AIModelType,
      instructions,
      serverApiKeys
    );
    
    return NextResponse.json({
      success: true,
      title: rewrittenContent.title,
      content: rewrittenContent.content,
      persona: personaId
    });
    
  } catch (error) {
    console.error('Error in API route:', error);
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to rewrite content' },
      { status: 500 }
    );
  }
}
