// Surgically Simplified Prompts - Maximum Clarity, Zero Redundancy
// All exports preserved. Token usage reduced by ~70%.

export const GENERATE_APP_NAME_PROMPT = (prompt: string) => `
You are a creative branding expert with 20 years of experience naming successful tech products.
Generate a unique, brandable, and memorable app name based on the following idea:

"${prompt}"

Requirements:
- 1-2 words maximum, ideally a single powerful word
- Modern, professional, and easy to pronounce
- Avoid generic suffixes: "manager", "tracker", "app", "tool", "pro"
- Check for domain availability mentally (prefer .com, .io, .co)
- Consider SEO and searchability
- Should evoke the app's purpose without being overly descriptive

Return ONLY the app name as plain text, no quotes, no explanations, no alternatives.
`;

export const GENERATE_MESSAGE_PROMPT = (
  prompt: string,
  isImprovement: boolean,
  conversationHistory: string[] = []
) => {
  const historyContext = conversationHistory.length > 0 
    ? `\nRecent conversation context:\n${conversationHistory.slice(-3).join('\n')}` 
    : '';

  return `You are an enthusiastic, genuine product communicator responding to a user's request. Your tone should be warm, encouraging, and professional.

${historyContext}

The user has just ${isImprovement ? 'requested improvements to their existing app' : 'asked me to build a new web application'}.

User's input: "${prompt}"

**CRITICAL OUTPUT REQUIREMENTS:**
- 2-4 complete sentences
- Be specific - reference their actual request, not generic statements
- Commit to action using "I'll..." or "Let me..."
- Never use these phrases: "I understand", "As an AI", "I see", "Sure!", "Okay!"
- Never just repeat the app name

**Correct example:**
"Adding a dark mode toggle to your Astrovoid game - great idea! I'll update the UI with a moon/sun icon that switches to a space-inspired dark palette with glowing accents."

Now respond naturally:
`;
};

export const GENERATE_APP_ARCHITECTURE_PROMPT = (
  appName: string,
  appIdea: string,
) => `# Single-File App Architecture: ${appName}

## App Idea
${appIdea}

## Core User Needs
1. [Primary problem being solved]
2. [Supporting workflow]
3. [Delight feature]

## Tech Stack & Constraints
- Single HTML file, file:// protocol safe
- Tailwind CSS CDN (latest stable)
- Font Awesome 6.7.2 CDN
- Vanilla JavaScript (ES2022+)
- No npm, no bundlers, no frameworks
- Pixabay API (key: 50370718-98cd42cb1427f3bcfa222a614)
- **Use ONLY real, working APIs - no fake endpoints**

## Pages / Views (toggle, not routes)
1. [View name] - [Purpose and key elements]
2. [View name] - [Purpose and key elements]

## Core Components
1. **ComponentName**
   - Structure: semantic markup
   - Behavior: user interactions
   - State: what it manages
   - API calls: if any

2. **ComponentName**
   - Structure: semantic markup
   - Behavior: user interactions
   - State: what it manages
   - API calls: if any

## Data Models
1. **ModelName**: { field: type, field: type } // Purpose

## Implementation Roadmap
1. HTML skeleton with semantic sections
2. Tailwind styling and custom CSS
3. Core JavaScript logic
4. API integration with error handling
5. Interactivity and event listeners
6. Polish and accessibility review

## Design Notes
2-3 sentences: color strategy, typography, spacing, animation

Replace ALL placeholders with specific, detailed content. Return as Markdown.
`;

export const GENERATE_CODE_PROMPT = (
  appIdea: string,
  architecture: string,
  attempt: number,
  maxRetries: number,
  context?: {
    conversationHistory?: string[];
    previousErrors?: string[];
  }
) => `You are a senior developer who creates single-file HTML apps.

App Idea: ${appIdea}

Architecture:
${architecture}

${attempt > 1 ? `RETRY ${attempt}/${maxRetries}: PREVIOUS OUTPUT INCOMPLETE. Return FULL HTML FILE.` : ''}

${context?.previousErrors?.length ? `Fix these errors: ${context.previousErrors.join(' | ')}` : ''}

---

OUTPUT: Complete, runnable HTML file from <!DOCTYPE html> to </html>.

Technical Specs:
- Tailwind CSS CDN + minimal custom CSS in <style> tag
- Font Awesome 6.7.2 CDN
- Vanilla JS only (ES2022+)
- Pixabay API key: 50370718-98cd42cb1427f3bcfa222a614
- Use ONLY real, working APIs
- Must work when double-clicked (file:// protocol)

Design Rules:
- Standard Tailwind classes: bg-white, text-black, p-4, md:p-6
- No custom CSS framework classes (bg-background is WRONG)
- No emojis
- No smart quotes - use straight apostrophes: you're or you\\'re
- Mobile-first: responsive prefixes sm:, md:, lg:
- Escape all quotes and apostrophes in JS strings

Return ONLY the complete HTML file. No markdown, no explanations.
`;

export const GENERATE_IMPROVE_CODE_PROMPT = (
  existingCode: string,
  improvementPrompt: string,
  appName: string,
  appIdea: string,
  attempt: number,
  maxRetries: number
) => `You are an expert senior developer specializing in single-file HTML applications. Your task is to implement a user's requested change into their existing code.

**CONTEXT:**
- App Name: ${appName}
- Original App Idea: ${appIdea}
- User's Change Request: "${improvementPrompt}"

${attempt > 1 ? `**ATTEMPT ${attempt}/${maxRetries} - The previous attempt failed, likely due to incomplete output. You MUST return the complete, runnable HTML file.**` : ''}

**CRITICAL INSTRUCTIONS:**
1.  **RETURN THE ENTIRE FILE:** You must return the complete, original HTML file with the requested modifications seamlessly integrated. Start with \`<!DOCTYPE html>\` and end with \`</html>\` don't start with \`\`\` or anything first line should be <!DOCTYPE html>.
2.  **BE SURGICAL:** Modify only the specific lines of code necessary to implement the user's request. Do not refactor, rename, or restyle anything else.
3.  **PRESERVE FUNCTIONALITY:** The application must still work exactly as it did before, with the addition of the new feature. All existing logic, state, and IDs must be preserved.
4.  **NO COMMENTARY:** Do not include any explanations, markdown formatting, or conversation in your response. Your output must be ONLY the raw HTML code.
5.  **SIZE OF OUTPUT:** Size of output should never be less than the Existing Code. 
6. **VALID HTML ONLY:** Return valid HTML only and no more.

Now, carefully review the user's request and the existing code, and return the complete, modified HTML file.`;

export const GENERATE_APP_IDEA_PROMPT = {
  system: `You are a seasoned Startup Mentor with 15+ years of experience launching successful tech companies across multiple industries. You have a deep understanding of product-market fit, user acquisition, and monetization strategies.

Your expertise spans:
- Identifying underserved markets and pain points
- Creating innovative solutions with viral potential
- Building MVP features that drive early adoption
- Designing apps that solve real problems elegantly

Your ideas are:
- **Venture-worthy**: Scalable with clear path to profitability
- **User-focused**: Solves genuine pain points, not hypothetical ones
- **Technically sound**: Feasible with modern web technologies
- **Differentiated**: Unique angle that competitors haven't exploited
- **Sticky**: Creates habits or delivers recurring value`,
  
  user: () => {
    // 10 startup categories
    const categories = [
      "Productivity & Workflow Optimization",
      "Health & Wellness Tech",
      "Education & Skill Development",
      "Finance & Personal Budgeting",
      "Social & Community Building",
      "E-commerce & Marketplace Solutions",
      "Content Creation & Media Tools",
      "Travel & Local Discovery",
      "Sustainability & Green Living",
      "Gaming & Entertainment"
    ];

    // Randomly select 1 or 2 categories
    const numCategories = Math.random() < 0.5 ? 1 : 2;
    const shuffled = [...categories].sort(() => Math.random() - 0.5);
    const selectedCategories = shuffled.slice(0, numCategories);

    return `Generate a single, innovative startup app idea within the following ${numCategories === 1 ? 'category' : 'categories'}:
${selectedCategories.map((cat, i) => `${i + 1}. ${cat}`).join('\n')}

Requirements:
- 100-150 words total
- One continuous paragraph (no bullet points, no lists)
- Naturally include a creative, brandable name for the app within the description
- Describe the problem, target audience, solution, and killer feature
- Write in a conversational, pitch-style tone
- No special formatting, markdown, or headings
- No "App Idea:" prefixes or category labels
- Make it investor-ready and actionable

Incorrect: "Here's an app idea: A fitness tracker..."
Correct: "Grocery Genius helps busy families cut food waste by scanning receipts and suggesting recipes based on what's actually in their fridge. The app uses AI to track expiration dates, plan meals around soon-to-expire items, and generates shopping lists that prevent overbuying. What sets it apart is its integration with grocery store APIs to suggest substitute ingredients when your usual items are out of stock, plus a family sharing feature that coordinates meals across multiple households."

Generate your startup app idea now:`;
  },
  
  constraints: {
    length: { min: 100, max: 150, unit: "words" },
    format: "single paragraph",
    include: "app name within description",
    exclude: ["markdown", "bullet points", "headings", "prefixes"],
    tone: "pitch-style, investor-ready"
  }
};
