import { OpenAI } from 'openai';
import { Anthropic } from '@anthropic-ai/sdk';

export interface RewrittenContent {
  title: string;
  content: string;
}

// Update PersonaType to only have 'custom'
export type PersonaType = 'custom';

export type AIModelType = 'gpt' | 'claude';

/**
 * Rewrite content using the custom persona instructions provided
 * @param title Original title
 * @param content Original content to rewrite
 * @param persona Will always be 'custom'
 * @param model The AI model to use (claude or gpt)
 * @param serverKeys Server-provided API keys for OpenAI and Claude
 * @param customInstructions Custom persona instructions
 * @returns Rewritten content with HTML formatting
 */
export async function rewriteInPersonaStyle(
  title: string,
  content: string,
  persona: PersonaType,
  model: AIModelType = 'claude',
  serverKeys?: { openai?: string | null; claude?: string | null },
  customInstructions?: string
): Promise<RewrittenContent> {
  try {
    // Create prompt based on the custom instructions
    const prompt = createCustomPersonaPrompt(title, content, customInstructions || '');

    // Use the selected AI model to rewrite content
    if (model === 'claude') {
      return await rewriteWithClaude(prompt, persona, content, serverKeys?.claude);
    } else {
      return await rewriteWithGPT(prompt, persona, content, serverKeys?.openai);
    }
  } catch (error) {
    console.error(`Error in rewriteInPersonaStyle: ${error}`);
    throw error;
  }
}

async function rewriteWithClaude(
  prompt: string, 
  persona: PersonaType,
  originalContent: string,
  apiKey?: string | null
): Promise<RewrittenContent> {
  try {
    // Use the API key from environment in server or from params if provided
    const usedApiKey = apiKey || process.env.CLAUDE_API_KEY;
    
    if (!usedApiKey) {
      throw new Error('Claude API key is required');
    }
    
    // Initialize Claude client with the API key
    const claude = new Anthropic({
      apiKey: usedApiKey
    });
    
    // Calculate appropriate length for response
    const wordCount = originalContent.split(/\s+/).length;
    const targetTokens = Math.max(1000, Math.round(wordCount * 1.5)); // Simple calculation
    
    console.log("Calling Claude API with prompt length:", prompt.length);
    
    // Call Claude API
    const response = await claude.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: targetTokens,
      system: "You are an expert content rewriter who specializes in adopting specific voice styles.",
      messages: [
        { role: "user", content: prompt }
      ],
    });
    
    // Extract the text from the response
    const output = response.content[0].type === 'text' ? response.content[0].text : '';
    console.log("Claude response received, length:", output.length);
    
    // Extract title and content using simple string operations
    const result = extractContentSimple(output, originalContent);
    
    return result;
  } catch (error) {
    console.error(`Error in rewriteWithClaude:`, error);
    throw new Error(`Claude API error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function rewriteWithGPT(
  prompt: string, 
  persona: PersonaType,
  originalContent: string,
  apiKey?: string | null
): Promise<RewrittenContent> {
  try {
    // Use the API key from environment in server or from params if provided  
    const usedApiKey = apiKey || process.env.OPENAI_API_KEY;
    
    if (!usedApiKey) {
      throw new Error('OpenAI API key is required');
    }
    
    // Initialize OpenAI client with the API key
    const openai = new OpenAI({
      apiKey: usedApiKey,
      dangerouslyAllowBrowser: true
    });
    
    // Calculate appropriate length for response
    const wordCount = originalContent.split(/\s+/).length;
    const targetTokens = Math.max(1000, Math.round(wordCount * 1.5)); // Simple calculation
    
    console.log("Calling GPT API with prompt length:", prompt.length);
    
    // Call GPT API
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system", 
          content: "You are an expert content rewriter who specializes in adopting specific voice styles."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: targetTokens
    });
    
    const output = response.choices[0].message.content || '';
    console.log("GPT response received, length:", output.length);
    
    // Extract title and content using simple string operations
    const result = extractContentSimple(output, originalContent);
    
    return result;
  } catch (error) {
    console.error(`Error in rewriteWithGPT:`, error);
    throw new Error(`OpenAI API error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Add this utility function to provide better fallbacks
function extractUsableContent(output: string, originalTitle: string): RewrittenContent {
  // Default fallbacks
  let title = originalTitle || "Rewritten Article";
  let content = "<p>Content could not be properly generated.</p>";
  
  // If we have output, try to use it even if improperly formatted
  if (output && output.trim() !== "") {
    const lines = output.split(/\n|\r|\r\n/).filter(line => line.trim() !== "");
    
    // Use the first non-empty line as the title if we don't have one
    if (lines.length > 0) {
      title = lines[0].trim();
      
      // Remove markers if they exist
      title = title.replace(/^REWRITTEN_TITLE:?\s*/i, "");
      
      // Limit title length
      if (title.length > 120) {
        title = title.substring(0, 117) + "...";
      }
    }
    
    // Use the rest as content
    if (lines.length > 1) {
      const contentLines = lines.slice(1).filter(line => 
        !line.trim().toLowerCase().startsWith("rewritten_title:") && 
        !line.trim().toLowerCase().startsWith("rewritten_content:")
      );
      
      if (contentLines.length > 0) {
        content = contentLines.join("\n\n");
        
        // Add HTML paragraphs if needed
        if (!content.includes("<p>")) {
          content = content.split(/\n\n+/).map(p => `<p>${p.trim()}</p>`).join("");
        }
      }
    } else {
      // If there's only one line, use it as content
      content = `<p>${output.trim()}</p>`;
    }
  }
  
  // Remove any HTML from title
  title = title.replace(/<\/?[^>]+(>|$)/g, "");
  
  return { title, content };
}

// Improve HTML formatting function with better error handling
function ensureHtmlFormatting(content: string): string {
  try {
    // Remove any markdown style formatting that might be present
    let processedContent = content
      .replace(/^\s*```html\s*/, '') // Remove opening HTML code block markers
      .replace(/\s*```\s*$/, '');   // Remove closing code block markers
    
    // Check if content already has HTML structure
    const hasHtmlTags = /<\/?[a-z][\s\S]*>/i.test(processedContent);
    
    // If it already has paragraph tags, just return it
    if (processedContent.includes('<p>') && processedContent.includes('</p>')) {
      return processedContent;
    }
    
    // If it has other HTML tags but no paragraph tags
    if (hasHtmlTags) {
      // Check if it's missing a wrapping paragraph
      if (!/<\/?p[\s>]/i.test(processedContent)) {
        processedContent = `<p>${processedContent}</p>`;
      }
      return processedContent;
    }
    
    // No HTML - split by double newlines and wrap paragraphs
    const paragraphs = processedContent.split(/\n\n+/);
    return paragraphs
      .filter(p => p.trim() !== '') // Remove empty paragraphs
      .map(p => `<p>${p.trim()}</p>`)
      .join('\n');
  } catch (error) {
    console.error('Error formatting HTML:', error);
    // Fallback - wrap the whole content in paragraph tags
    return `<p>${content}</p>`;
  }
}

// Function to calculate target length
function calculateTargetLength(originalContent: string): number {
  // Count words in original content
  const wordCount = originalContent.split(/\s+/).length;
  
  // Add natural variation with these rules:
  // - Very short content (< 100 words): Allow 10-30% expansion
  // - Short content (100-300 words): Allow 5-20% variation
  // - Medium content (300-800 words): Allow 0-15% variation
  // - Long content (800+ words): Aim for slight compression (0-10% reduction)
  
  let minMultiplier = 1.0;
  let maxMultiplier = 1.0;
  
  if (wordCount < 100) {
    minMultiplier = 1.1;
    maxMultiplier = 1.3;
  } else if (wordCount < 300) {
    minMultiplier = 0.95;
    maxMultiplier = 1.2;
  } else if (wordCount < 800) {
    minMultiplier = 0.90;
    maxMultiplier = 1.15;
  } else {
    minMultiplier = 0.90;
    maxMultiplier = 1.0;
  }
  
  // Apply random variation within our determined range
  const multiplier = minMultiplier + Math.random() * (maxMultiplier - minMultiplier);
  
  // Calculate target tokens (approximately 0.75 tokens per word)
  const targetWords = Math.round(wordCount * multiplier);
  const targetTokens = Math.round(targetWords / 0.75);
  
  return targetTokens;
}

// Function to create custom persona prompts
function createCustomPersonaPrompt(title: string, content: string, customInstructions: string): string {
  return `
You are tasked with rewriting the following article in a specific style described below.

ORIGINAL TITLE: ${title}

ORIGINAL CONTENT: 
${content}

STYLE INSTRUCTIONS:
${customInstructions}

YOUR TASK:
Rewrite the article in the specified style while keeping the main facts and substance of the original content. Make sure to:
1. Create a new title that reflects the style
2. Format the rewritten content using HTML paragraph tags (<p>...</p>)
3. Maintain the article's core message but change its voice completely

FORMAT YOUR RESPONSE EXACTLY AS FOLLOWS:

REWRITTEN_TITLE: [New Title Here]

REWRITTEN_CONTENT:
<p>[First paragraph of content here]</p>
<p>[Second paragraph of content here]</p>
[And so on...]
`;
}

// Add this utility function for simple extraction
function extractContentSimple(output: string, originalContent: string): RewrittenContent {
  console.log("Extracting content from AI response...");
  
  // Default values
  let title = "";
  let content = "";
  
  try {
    // Simple string-based extraction using the markers
    if (output.includes("REWRITTEN_TITLE:") && output.includes("REWRITTEN_CONTENT:")) {
      // Get parts between the markers
      const titleMarkerPos = output.indexOf("REWRITTEN_TITLE:");
      const contentMarkerPos = output.indexOf("REWRITTEN_CONTENT:");
      
      // Extract title - from after marker to next newline
      if (titleMarkerPos >= 0) {
        const titleStart = titleMarkerPos + "REWRITTEN_TITLE:".length;
        const titleEnd = contentMarkerPos > titleMarkerPos ? 
          output.indexOf("\n", titleMarkerPos) : output.length;
        
        if (titleEnd > titleStart) {
          title = output.substring(titleStart, titleEnd).trim();
        }
      }
      
      // Extract content - everything after the content marker
      if (contentMarkerPos >= 0) {
        const contentStart = contentMarkerPos + "REWRITTEN_CONTENT:".length;
        content = output.substring(contentStart).trim();
      }
      
      console.log("Successfully extracted title and content using markers");
    } else {
      console.log("Could not find expected markers in AI output");
      
      // Fallback: first line is title, rest is content
      const lines = output.trim().split("\n");
      if (lines.length > 0) {
        title = lines[0].trim();
        content = lines.slice(1).join("\n").trim();
        console.log("Used fallback extraction method");
      }
    }
    
    // If still no content, use the entire output
    if (!content && output.trim()) {
      content = output.trim();
      console.log("Using entire output as content");
    }
    
    // Ensure content has HTML paragraph tags
    if (content && !content.includes("<p>")) {
      content = content.split(/\n\n+/)
        .filter(p => p.trim() !== '')
        .map(p => `<p>${p.trim()}</p>`)
        .join("\n");
      console.log("Added HTML paragraph tags to content");
    }
    
    // If we still don't have a title, use the original title
    if (!title) {
      const originalTitle = typeof originalContent === 'string' && originalContent.trim().split("\n")[0];
      title = originalTitle || "Rewritten Article";
      console.log("Using fallback title:", title);
    }
    
    // Clean any potential HTML from title
    title = title.replace(/<\/?[^>]+(>|$)/g, "");
    
    // Limit title length
    if (title.length > 100) {
      title = title.substring(0, 97) + "...";
    }
    
    console.log("Final extraction - Title length:", title.length, "Content length:", content.length);
    return { title, content };
    
  } catch (error) {
    console.error("Error during content extraction:", error);
    
    // Last resort fallback
    return { 
      title: "Rewritten Article", 
      content: `<p>The AI attempted to rewrite your content but encountered an issue processing the response.</p>
                <p>Please try again with different instructions or content.</p>`
    };
  }
}