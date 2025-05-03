import { NextRequest, NextResponse } from 'next/server';
import { rewriteContent, AIModelType } from '@/lib/contentRewriter';
import { getCustomPersonaById } from '@/types/personas';

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
    
    // Handle different persona types (predefined or custom)
    let instructions: string | undefined = undefined;
    
    // If this is a custom persona (not one of the predefined ones)
    if (personaId.startsWith('custom_')) {
      // For custom personas, we need custom instructions
      if (!customInstructions) {
        // If no instructions were explicitly provided, try to find the saved custom persona
        const customPersona = await getCustomPersonaById(personaId);
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
    
    // Use persona ID to rewrite content with a timeout
    let rewrittenContent;
    try {
      rewrittenContent = await Promise.race([
        rewriteContent(
          title,
          content,
          personaId,
          selectedModel as AIModelType,
          instructions,
          serverApiKeys
        ),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('API call timed out')), 60000)
        ) as Promise<never>
      ]);
    } catch (error) {
      console.error("Error during rewrite:", error);
      
      // Provide a fallback response instead of erroring
      rewrittenContent = {
        title: title || "Rewrite Attempt",
        content: `<p>We encountered an issue while trying to rewrite your content.</p>
                  <p>The AI service responded with: "${error instanceof Error ? error.message : 'Unknown error'}"</p>
                  <p>Please try again with different content or instructions.</p>`
      };
    }
    
    // Always ensure we have some sort of title and content
    const responseTitle = rewrittenContent?.title || title || "Rewritten Article";
    const responseContent = rewrittenContent?.content || 
      `<p>No content was generated. Please try again with different instructions.</p>`;
    
    console.log("Rewrite complete - sending response");
    
    return NextResponse.json({
      success: true,
      title: responseTitle,
      content: responseContent,
      persona: personaId
    });
    
  } catch (error) {
    console.error('Error in API route:', error);
    
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
