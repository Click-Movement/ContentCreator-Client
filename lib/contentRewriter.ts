import { OpenAI } from 'openai';
import { Anthropic } from '@anthropic-ai/sdk';

// Define types for personas and rewrite results
export interface RewrittenContent {
  title: string;
  htmlContent?: string;
  metaDescription?: string;
  content: string;
}
export type AIModelType = 'gpt' | 'claude';
// Define SEO options interface for backward compatibility
export interface SeoOptions {
  maintainLength?: boolean;
  seoKeywords?: string[];
  targetWordCount?: number;
  readabilityLevel?: 'simple' | 'standard' | 'advanced';
  tone?: string;
}

// Define the persona types based on the available style guides
export type PredefinedPersonaType = 
  | 'bipartisan_reporter' 
  | 'celebrity_entertainment_reporter'
  | 'health_reporter_female'
  | 'health_reporter_male'
  | 'financial_reporter'
  | 'sports_reporter'
  | 'liberal_reporter'      // Added Wolf Blitzer style
  | 'conservative_reporter' // Added Ben Shapiro style
  | 'custom';

// Style guide instruction snippets
const STYLE_GUIDE_SNIPPETS = {
  bipartisan_reporter: `
Tulsi Gabbard Writing Style Guide:
- Uses measured delivery with strategic intensity (deliberate pace, controlled emotion)
- Employs direct confrontational approach when challenging ideas (specific critiques, principled framing)
- Uses military-influenced structure (clear organization, mission-oriented framing)
- Positions herself as an outsider (anti-establishment framing, independent stance)
- Establishes credibility through personal experience references
- Balances moral clarity with policy nuance
- Uses "Gabbard Challenge" sequence: acknowledgment, concern, critique, moral implication
- Employs contrast structures ("not this, but that")
- Provides specific details and examples
- Uses strategic repetition and key phrases
- Vocabulary includes military terminology, constitutional language, Hawaiian references
- Varies sentence structure with balanced contrasts
  `,
  celebrity_entertainment_reporter: `
Celebrity Entertainment Reporter Writing Style Guide:
- Warm & friendly tone that's enthusiastic and upbeat
- Conversational style that feels accessible to readers
- Uses entertainment industry terminology naturally
- Balances celebrity admiration with journalistic credibility
- Employs "exclusive" framing and insider perspective
- Incorporates "get-to-know" narrative approaches
- Uses visual and descriptive language
- Sentence structure varies between short, punchy statements and more detailed descriptions
- Vocabulary includes entertainment industry terms, emotional descriptors, and celebrity references
- Tone is warm, enthusiastic, polished, empathetic and engaging
  `,
  health_reporter_female: `
Andrea Allen (Health Reporter - Female) Writing Style Guide:
- Focuses on simplification of complex health topics for busy women/mothers
- Emphasizes realism for everyday moms (practical, accessible, time-sensitive solutions)
- Uses empowerment and positive mindset framing
- Creates a welcoming and supportive community tone
- Takes a holistic health approach
- Uses "myth-busting" to challenge health misconceptions
- Provides clear action steps and practical applications
- Uses relatable personal anecdotes
- Simple, accessible vocabulary with "mom life" terminology
- Conversational sentence structure with frequent questions
- Friendly, empathetic, encouraging, realistic and confident tone
  `,
  health_reporter_male: `
Dr. Hyman (Health Reporter - Male) Writing Style Guide:
- Centers content on functional medicine approach (root causes, systems thinking)
- Emphasizes "food as medicine" philosophy
- Focuses on reader empowerment and agency in health decisions
- Balances scientific backing with accessible explanations
- Takes a holistic viewpoint of health (mind-body connection)
- Uses "connecting the dots" explanations for complex topics
- Challenges conventional wisdom with evidence
- Simplifies complex health concepts with analogies
- Vocabulary includes functional medicine terms, food-centric language, and scientific terminology
- Authoritative, passionate, empathetic, direct and accessible tone
  `,
  financial_reporter: `
Dave Ramsey (Financial Reporter) Writing Style Guide:
- Uses direct, no-nonsense financial advice
- Employs tough love motivation with hope and encouragement
- Offers simplified frameworks for complex financial topics
- Expresses strong opinions presented as common sense
- Uses personal storytelling and caller narratives
- Incorporates folksy, relatable language and analogies
- Frequently uses rhetorical questions
- Employs common sayings and biblical references
- Vocabulary is simple, direct, action-oriented and includes Ramsey-specific terminology
- Sentences are short, punchy and often imperative
- Tone is authoritative, passionate, fatherly, humorous and confident
  `,
  sports_reporter: `
Kirk Herbstreit (Sports Reporter) Writing Style Guide:
- Shows deep preparation and insight into sports topics
- Balances technical analysis with narrative/emotional elements
- Focuses on key matchups and situational factors
- Emphasizes execution and fundamentals
- Strives for objectivity while showing passion for the sport
- Incorporates player's perspective and on-field experience
- Uses "setting the stage" narrative techniques
- Employs comparative analysis between teams/players
- Vocabulary includes technical football terms, analytical language, and conversational elements
- Sentence structure balances detailed analysis with punchy conclusions
- Tone is knowledgeable, enthusiastic, respectful, conversational and authoritative
  `,
  liberal_reporter: `
Wolf Blitzer (Liberal Reporter) Writing Style Guide:
- Projects authority and gravitas through a serious, formal tone
- Maintains confidence and directness, avoiding hedging or uncertainty
- Centers writing on the importance and factual basis of information
- Emphasizes breaking news and immediacy with phrases like "happening now," "breaking news," "just in"
- Prioritizes the latest, most critical information in inverted pyramid style
- Clearly signals when information is new or developing
- Sticks closely to verifiable facts and clear attribution to sources
- Presents information directly and economically
- Uses neutral language, avoiding loaded terms, biased phrasing, or emotional appeals
- Presents different viewpoints fairly without favoring one side
- Avoids injecting personal beliefs or commentary
- Uses clear, unambiguous language and straightforward sentence structures
- Organizes information logically with clear transitions
- Repeats key information for emphasis and clarity
- Employs recurring phrases for alerts and transitions (e.g., "We want to welcome our viewers...")
- Guides the audience with phrases like "Here's what we know right now..."
- Uses simple, direct transitions ("Let's turn now to...", "Meanwhile...")
- Contextualizes stories by briefly explaining their significance
- Maintains a formal, professional vocabulary with urgency terms
- Uses primarily simple and compound sentences that are declarative and direct
- Writing conveys a serious, authoritative, measured, and objective tone
  `,
  conservative_reporter: `
Ben Shapiro (Conservative Reporter) Writing Style Guide:
- Uses rapid-fire delivery with compressed information density and minimal pausing
- Packs maximum content into minimum space with a rhythmic cadence
- Presents arguments in highly structured, logical format using syllogistic reasoning
- Employs premise-conclusion format with hierarchical organization and numbered lists
- Establishes definitional precision before proceeding with arguments
- References academic sources, historical context, legal principles, and philosophical concepts
- Uses confrontational debate techniques with rapid questioning and demands for specifics
- Employs rhetorical devices like reductio ad absurdum, false dichotomies, and appeals to common sense
- Maintains emotional restraint by emphasizing reason over feeling
- Uses a calculated indignant tone and sarcastic humor when appropriate
- Incorporates catchphrases like "Facts don't care about your feelings" and "Let's say"
- Uses academic terminology from law, philosophy, and economics
- Begins with definitional openings before building arguments step by step
- Preemptively addresses potential counterarguments
- Appeals to first principles, tradition, authority, consistency, and consequences
- Focuses on constitutional originalism, free market economics, and traditional values
- Criticizes identity politics, highlights media bias, and advocates for free speech
- Uses direct, declarative statements with minimal hedging
- Employs rhetorical questions to guide readers through reasoning
- Creates clear contrasts between positions and opposing viewpoints
  `
};

/**
 * Rewrite content according to a specified persona style or SEO parameters
 * 
 * This function has two overloads to maintain backward compatibility:
 * 1. Persona-style rewriting using persona type and AI model
 * 2. Traditional content rewriting with SEO options
 */
export async function rewriteContent(
  title: string,
  content: string,
  personaOrMeta: PredefinedPersonaType | string = '',
  modelOrUrl: AIModelType | string = 'claude',
  customInstructionsOrSeoOptions?: string | SeoOptions,
  apiKeys?: { openai?: string | null; claude?: string | null }
): Promise<RewrittenContent> {
  try {
    // Determine which overload is being used
    if (typeof customInstructionsOrSeoOptions === 'object' && customInstructionsOrSeoOptions !== null) {
      // This is the SEO rewrite path (legacy/backward compatibility)
      console.log("Using SEO rewrite mode");
      return legacyRewriteWithSEO(title, content, personaOrMeta as string, modelOrUrl as string, customInstructionsOrSeoOptions);
    } else {
      // This is the persona-style rewriting path
      console.log("Using persona rewrite mode");
      
      // Create the appropriate prompt based on persona type
      let prompt: string;
      const personaType = personaOrMeta;
      const model = modelOrUrl as AIModelType;
      const customInstructions = customInstructionsOrSeoOptions as string | undefined;
      
      if (personaType === 'custom' && customInstructions) {
        // For custom personas, use the provided instructions
        prompt = createCustomPersonaPrompt(title, content, customInstructions);
      } else if (typeof personaType === 'string' && personaType.startsWith('custom_') && customInstructions) {
        // For saved custom personas, use the provided instructions
        prompt = createCustomPersonaPrompt(title, content, customInstructions);
      } else if (personaType) {
        // For predefined personas, use the standard style guide
        const styleGuide = getStyleGuideForPersona(personaType as PredefinedPersonaType);
        prompt = createPredefinedPersonaPrompt(title, content, styleGuide);
      } else {
        // Default to simple content rewriting if no persona is specified
        prompt = createDefaultRewritePrompt(title, content);
      }

      // Select the appropriate AI model based on the parameter
      let result;
      if (model === 'claude') {
        result = await rewriteWithClaude(prompt, content, apiKeys?.claude);
      } else {
        result = await rewriteWithGPT(prompt, content, apiKeys?.openai);
      }
      
      // Ensure backward compatibility by adding htmlContent and metaDescription
      result.htmlContent = result.content;
      result.metaDescription = generateMetaDescription(result.content);
      
      return result;
    }
  } catch (error) {
    console.error('Error in rewriteContent:', error);
    throw new Error(`Failed to rewrite content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Legacy function for SEO-focused content rewriting
 */
async function legacyRewriteWithSEO(
  title: string, 
  content: string, 
  metaDescription: string, 
  url: string, 
  seoOptions: SeoOptions
): Promise<RewrittenContent> {
  // Create a default prompt for SEO-focused rewriting
  const prompt = createSeoRewritePrompt(title, content, metaDescription, url, seoOptions);
  
  // Default to Claude for legacy rewriting (this could be made configurable)
  const result = await rewriteWithClaude(prompt, content);
  
  // Add the necessary fields for backward compatibility
  result.htmlContent = result.content;
  result.metaDescription = metaDescription || generateMetaDescription(result.content);
  
  return result;
}

/**
 * Create a prompt for SEO-focused rewriting
 */
function createSeoRewritePrompt(
  title: string,
  content: string,
  metaDescription: string,
  url: string,
  options: SeoOptions
): string {
  const { maintainLength, seoKeywords = [], targetWordCount, readabilityLevel = 'standard', tone = 'professional' } = options;
  
  const keywordsText = seoKeywords.length > 0 
    ? `Target keywords to include: ${seoKeywords.join(', ')}\n` 
    : '';
  
  const lengthText = maintainLength
    ? `Maintain approximately the same length as the original content.\n`
    : targetWordCount 
      ? `Target approximately ${targetWordCount} words in the rewritten content.\n`
      : '';
  
  return `
You are an expert content rewriter specializing in SEO optimization.

ORIGINAL TITLE: ${title}

ORIGINAL CONTENT: 
${content}

${metaDescription ? `META DESCRIPTION: ${metaDescription}\n` : ''}
${url ? `SOURCE URL: ${url}\n` : ''}

REWRITING INSTRUCTIONS:
1. Rewrite the content to improve readability and engagement while maintaining the original meaning.
2. ${lengthText}
3. Use a ${readabilityLevel} readability level and a ${tone} tone.
4. ${keywordsText}
5. Format the rewritten content using HTML paragraph tags (<p>...</p>)
6. Create an improved, SEO-friendly title.
7. Do not include any disclaimers or explanations about the rewriting process.

FORMAT YOUR RESPONSE EXACTLY AS FOLLOWS:

REWRITTEN_TITLE: [Your rewritten title here]

REWRITTEN_CONTENT:
<p>[First paragraph of content here]</p>
<p>[Second paragraph of content here]</p>
[And so on...]
`;
}

/**
 * Create a default prompt for simple content rewriting when no specific persona is provided
 */
function createDefaultRewritePrompt(title: string, content: string): string {
  return `
You are an expert content rewriter tasked with improving an article.

ORIGINAL TITLE: ${title}

ORIGINAL CONTENT: 
${content}

YOUR TASK:
Rewrite the article to improve clarity, engagement, and readability while preserving the core message and facts. You must:
1. Create an improved, engaging title
2. Format the rewritten content using HTML paragraph tags (<p>...</p>)
3. Maintain the article's core message and facts
4. Do not include any disclaimers or explanations about the rewriting process

FORMAT YOUR RESPONSE EXACTLY AS FOLLOWS:

REWRITTEN_TITLE: [Your rewritten title here]

REWRITTEN_CONTENT:
<p>[First paragraph of content here]</p>
<p>[Second paragraph of content here]</p>
[And so on...]
`;
}

/**
 * Get the style guide for a predefined persona
 */
function getStyleGuideForPersona(personaType: PredefinedPersonaType | string): string {
  return STYLE_GUIDE_SNIPPETS[personaType as keyof typeof STYLE_GUIDE_SNIPPETS] || '';
}

/**
 * Create a prompt for predefined persona styles
 */
function createPredefinedPersonaPrompt(
  title: string, 
  content: string, 
  styleGuide: string
): string {
  return `
You are an expert content rewriter tasked with rewriting an article in a specific style.

ORIGINAL TITLE: ${title}

ORIGINAL CONTENT: 
${content}

STYLE GUIDE:
${styleGuide}

YOUR TASK:
Rewrite the article to match the style described above while preserving the core message and facts. You must:
1. Create a new title that reflects this distinctive style
2. Format the rewritten content using HTML paragraph tags (<p>...</p>)
3. Transform the voice completely while maintaining the article's core message and facts
4. Do not include any disclaimers or explanations about the rewriting process

FORMAT YOUR RESPONSE EXACTLY AS FOLLOWS:

REWRITTEN_TITLE: [Your rewritten title here]

REWRITTEN_CONTENT:
<p>[First paragraph of content here]</p>
<p>[Second paragraph of content here]</p>
[And so on...]
`;
}

/**
 * Create a prompt for custom persona styles
 */
function createCustomPersonaPrompt(
  title: string, 
  content: string, 
  customInstructions: string
): string {
  return `
You are an expert content rewriter tasked with rewriting an article in a specific style.

ORIGINAL TITLE: ${title}

ORIGINAL CONTENT: 
${content}

STYLE INSTRUCTIONS:
${customInstructions}

YOUR TASK:
Rewrite the article to match the style described above while preserving the core message and facts. You must:
1. Create a new title that reflects this distinctive style
2. Format the rewritten content using HTML paragraph tags (<p>...</p>)
3. Transform the voice completely while maintaining the article's core message and facts
4. Do not include any disclaimers or explanations about the rewriting process

FORMAT YOUR RESPONSE EXACTLY AS FOLLOWS:

REWRITTEN_TITLE: [Your rewritten title here]

REWRITTEN_CONTENT:
<p>[First paragraph of content here]</p>
<p>[Second paragraph of content here]</p>
[And so on...]
`;
}

/**
 * Rewrite content using the Claude API
 */
async function rewriteWithClaude(
  prompt: string,
  originalContent: string,
  apiKey?: string | null
): Promise<RewrittenContent> {
  try {
    const usedApiKey = apiKey || process.env.CLAUDE_API_KEY;
    
    if (!usedApiKey) {
      throw new Error('Claude API key is required');
    }
    
    // Initialize Claude client
    const claude = new Anthropic({
      apiKey: usedApiKey
    });
    
    // Calculate appropriate length for response based on original content
    const wordCount = originalContent.split(/\s+/).length;
    const targetTokens = Math.max(1000, Math.round(wordCount * 1.5));
    
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
    
    // Get response text
    const output = response.content[0].type === 'text' ? response.content[0].text : '';
    console.log("Claude response received, length:", output.length);
    
    // Extract content from response
    return extractContentFromResponse(output, originalContent);
  } catch (error) {
    console.error('Error in rewriteWithClaude:', error);
    throw new Error(`Claude API error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Rewrite content using the OpenAI GPT API
 */
async function rewriteWithGPT(
  prompt: string,
  originalContent: string,
  apiKey?: string | null
): Promise<RewrittenContent> {
  try {
    const usedApiKey = apiKey || process.env.OPENAI_API_KEY;
    
    if (!usedApiKey) {
      throw new Error('OpenAI API key is required');
    }
    
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: usedApiKey,
      dangerouslyAllowBrowser: true
    });
    
    // Calculate appropriate length for response
    const wordCount = originalContent.split(/\s+/).length;
    const targetTokens = Math.max(1000, Math.round(wordCount * 1.5));
    
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
    
    // Extract content from response
    return extractContentFromResponse(output, originalContent);
  } catch (error) {
    console.error('Error in rewriteWithGPT:', error);
    throw new Error(`OpenAI API error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Extract title and content from AI response
 */
function extractContentFromResponse(output: string, originalContent: string): RewrittenContent {
  console.log("Extracting content from AI response...");
  
  // Default values
  let title = "";
  let content = "";
  
  try {
    // Check if the response follows the expected format with markers
    if (output.includes("REWRITTEN_TITLE:") && output.includes("REWRITTEN_CONTENT:")) {
      // Extract title between markers
      const titleMarkerPos = output.indexOf("REWRITTEN_TITLE:");
      const contentMarkerPos = output.indexOf("REWRITTEN_CONTENT:");
      
      if (titleMarkerPos >= 0) {
        const titleStart = titleMarkerPos + "REWRITTEN_TITLE:".length;
        const titleEnd = contentMarkerPos > titleMarkerPos ? 
          output.indexOf("\n", titleMarkerPos) : output.length;
        
        if (titleEnd > titleStart) {
          title = output.substring(titleStart, titleEnd).trim();
        }
      }
      
      // Extract content after content marker
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
    
    // If no content was extracted, use the entire output
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
    
    // If no title was extracted, use original title
    if (!title) {
      const originalTitle = typeof originalContent === 'string' ? 
        originalContent.trim().split("\n")[0] : "Rewritten Article";
      title = originalTitle || "Rewritten Article";
      console.log("Using fallback title:", title);
    }
    
    // Clean any HTML from title
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

/**
 * Helper function to generate a meta description from content
 */
function generateMetaDescription(content: string): string {
  // Remove HTML tags
  const plainContent = content.replace(/<\/?[^>]+(>|$)/g, '');
  
  // Extract the first 1-2 sentences (up to ~160 characters)
  const sentences = plainContent.split(/[.!?]+/);
  let metaDescription = sentences[0].trim();
  
  if (metaDescription.length < 100 && sentences.length > 1) {
    metaDescription += '. ' + sentences[1].trim();
  }
  
  // Truncate if too long
  if (metaDescription.length > 160) {
    metaDescription = metaDescription.substring(0, 157) + '...';
  }
  
  return metaDescription;
}
