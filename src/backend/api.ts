"use server";
import { createCacheKey, executeWithDeduplication } from "./cache";
import { extractAndValidateHTML } from "./utils";
import OpenAI from "openai";

const XAI_API_KEY = process.env.NEXT_PUBLIC_XAI_API_KEY;

export async function generateAppName(prompt: string): Promise<string> {
  const cacheKey = createCacheKey("generateAppName", prompt);

  return executeWithDeduplication(cacheKey, async () => {
    try {
      const client = new OpenAI({
        apiKey: XAI_API_KEY,
        baseURL: "https://api.x.ai/v1",
        timeout: 360000,
      });

      const structuredPrompt = {
        instruction: "Generate a brandable app name",
        context: {
          user_description: prompt,
          task_type: "creative_naming",
        },
        constraints: {
          length: { min: 1, max: 2, unit: "words" },
          characteristics: [
            "brandable",
            "unique",
            "memorable",
            "professional",
            "modern",
          ],
          domain_availability: "prioritize",
          exclude_patterns: ["*manager", "*tracker", "*tool", "*app"],
        },
        style_guide: {
          inspiration_types: [
            { type: "neologism", examples: ["Figma", "Notion", "Stripe"] },
            {
              type: "portmanteau",
              examples: ["Instagram", "LinkedIn", "YouTube"],
            },
            {
              type: "suffix_based",
              suffixes: [
                "-ly",
                "-fy",
                "-io",
                "-co",
                "-ai",
                "-hub",
                "-lab",
                "-verse",
              ],
            },
          ],
          reference_names: {
            project_management: ["Asana", "Trello", "Monday"],
            design: ["Figma", "Canva", "Sketch"],
            communication: ["Slack", "Discord", "Zoom"],
          },
        },
        output: {
          format: "plain_text",
          include: ["name_only"],
          exclude: ["quotes", "explanation", "alternatives"],
        },
      };

      const completion = await client.chat.completions.create({
        model: "grok-4-1-fast-non-reasoning",
        messages: [
          {
            role: "system",
            content:
              "You are a creative branding expert specializing in generating unique and memorable app names based on user descriptions and specific constraints.",
          },
          {
            role: "user",
            content: `Using this configuration, generate an app name:\n\n${JSON.stringify(
              structuredPrompt,
              null,
              2
            )}`,
          },
        ],
      });

      let appName = completion.choices[0]?.message?.content?.trim() || "";

      appName = appName.replace(/^["']|["']$/g, "");
      appName = appName.split(/[\n\r]/)[0].trim();
      appName = appName.replace(/^(Name|App Name|Best Option):\s*/i, "");
      appName = appName.replace(/^\d+\.\s*/, "");

      if (!appName || appName.length < 2) {
        const fallback = ["Nexus", "Flux", "Spark", "Zenith", "Prism"];
        appName = fallback[Math.floor(Math.random() * fallback.length)];
      }

      return appName;
    } catch (error) {
      console.error("Error in generateAppName:", error);
      return `App${Date.now().toString().slice(-4)}`;
    }
  });
}

export async function generateMessage(
  prompt: string,
  appName = "your app",
  isImprovement = false
) {
  const cacheKey = createCacheKey(
    "generateMessage",
    prompt,
    appName,
    isImprovement
  );

  return executeWithDeduplication(cacheKey, async () => {
    try {
      const client = new OpenAI({
        apiKey: XAI_API_KEY,
        baseURL: "https://api.x.ai/v1",
        timeout: 360000,
      });

      const structuredResponsePrompt = {
        instruction: "Generate a conversational response",
        context: {
          scenario: isImprovement
            ? "user_requests_improvements"
            : "user_requests_new_app",
          user_input: prompt,
        },
        response_parameters: {
          tone_profile: {
            warmth: "high",
            enthusiasm: "high",
            formality: "low",
            personality: "encouraging and genuine",
          },
          content_structure: isImprovement
            ? {
                acknowledge: "specific improvements mentioned by user",
                express: "enthusiasm",
                commit: "to implementing requested changes",
              }
            : {
                acknowledge: "the specific app idea",
                express: "enthusiasm",
                commit: "to building the web application",
                include: "one specific detail",
              },
          constraints: {
            length: { min_sentences: 2, max_sentences: 4 },
            banned_phrases: ["I understand", "As an AI", "I'm an AI"],
          },
        },
      };

      const completion = await client.chat.completions.create({
        model: "grok-4-1-fast-non-reasoning",
        messages: [
          {
            role: "system",
            content:
              "You are a friendly and enthusiastic AI assistant that crafts engaging and personalized messages based on user requests for new app ideas or improvements to existing apps.",
          },
          {
            role: "user",
            content: `Using this configuration, generate an app name:\n\n${JSON.stringify(
              structuredResponsePrompt,
              null,
              2
            )}`,
          },
        ],
      });

      let message = completion.choices[0]?.message?.content?.trim() || "";
      if (!message) {
        message = isImprovement
          ? `Perfect! I'm improving ${appName}.`
          : `Great idea! Let's start building ${appName}.`;
      }

      return message;
    } catch (error) {
      console.error("Error in generateMessage:", error);
      return "Something went wrong.";
    }
  });
}

export async function generateAppArchitecture(
  appIdea: string,
  appName: string,
  additionalRequirements = ""
) {
  const cacheKey = createCacheKey(
    "generateAppArchitecture",
    appIdea,
    appName,
    additionalRequirements
  );

  return executeWithDeduplication(cacheKey, async () => {
    try {
      const template = `# Single-File Web App Architecture Plan

      ## Project Name: [Enter project name]

      ## Core User Needs:
      1. [Enter user need]
      2. [Enter user need]
      3. [Enter user need]

      ## Technical Constraints:
      * Single HTML file (no frameworks)
      * Tailwind CSS for styling
      * Vanilla JS for logic
      * Font Awesome for icons
      * Pixabay API (key: 50370718-98cd42cb1427f3bcfa222a614)
      * The Pixabay API format "https://pixabay.com/api/?key={ KEY }&q=yellow+flowers&image_type=photo"
      * Prefer free, no-auth APIs

      ## Structure:
      ### HTML
      - Sections and meta setup
      ### CSS
      - Tailwind + minimal custom classes
      ### JS
      - State handling, DOM updates, API calls

      ## Pages / Views:
      1. [Page name] – [Purpose]
      2. [Page name] – [Purpose]

      ## Components:
      1. [Component name] – structure, behavior
      2. [Component name] – structure, behavior

      ## Data Models:
      1. [Model name]: [fields and purpose]

      ## Implementation Steps:
      1. Setup base HTML/CSS
      2. Build core JS logic
      3. Add routing (if any)
      4. Integrate APIs
      5. Optimize and test
      6. Use pics which are relatable don't pic random

      ## Look & Feel:
      [Describe intended style and UX]`;

      const client = new OpenAI({
        apiKey: XAI_API_KEY,
        baseURL: "https://api.x.ai/v1",
        timeout: 360000,
      });

      const prompt = `
You are an expert web architect.
Fill the following architecture template *completely and professionally*
for the app described below.

App Name: ${appName}
App Idea: ${appIdea}
${template ? `Extra: ${template}` : ""}

Output must be detailed, structured, and formatted in Markdown, with all placeholders replaced.`;

      const completion = await client.chat.completions.create({
        model: "grok-4-1-fast-reasoning",
        messages: [
          {
            role: "system",
            content:
              "You are a world-class software architect specializing in single-file web applications. Provide detailed, structured architecture plans based on user requirements.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const raw = completion.choices[0].message.content || "";
      // console.log("Architecture Raw Output:", raw);
      return raw.length > 500 ? raw : `# ${appName} - ${appIdea}\n\nFailed.`;
    } catch (err) {
      throw new Error(`Architecture generation failed: ${err}`);
    }
  });
}

export async function generateCode(
  appIdea: string,
  appName: string,
  architecture: string,
  additionalRequirements = "",
  temperature = 0.2,
  maxRetries = 3
) {
  const cacheKey = createCacheKey(
    "generateCode",
    appIdea,
    appName,
    architecture,
    additionalRequirements,
    temperature
  );

  return executeWithDeduplication(cacheKey, async () => {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const client = new OpenAI({
          apiKey: XAI_API_KEY,
          baseURL: "https://api.x.ai/v1",
          timeout: 360000,
        });

        const promptText = `You are a Senior Full-Stack Developer & UI/UX Designer with decades of experience shipping production-ready web apps.
You maintain perfect memory of the conversation, scraped content, and previously generated code.

🎯 PRIMARY OBJECTIVE
Generate a **complete, production-ready, single-file HTML web app** that opens directly in any modern browser with zero dependencies.

APP IDEA
"${appIdea}"

ARCHITECTURE BLUEPRINT
${architecture}

🔁 RETRY CONTEXT
Attempt ${attempt}/${maxRetries}
${
  attempt > 1
    ? "Previous output was truncated or incomplete—emit the **entire** HTML file this time."
    : ""
}

---

⚙️ TECHNICAL REQUIREMENTS
- Markup: HTML5
- Styling: TailwindCSS (latest CDN)
- Icons: Font Awesome 6.7.2 (CDN)
- Scripting: Modern vanilla JavaScript (ES2022+)
- Build tools: NONE — must be standalone single HTML file

📐 STRUCTURE RULES
1. File must start with <!DOCTYPE html> and end with </html>
2. All CSS inside <style> tags
3. All JS inside <script> tags
4. Only CDN links allowed — no imports, no bundlers
5. Entire app works when double-clicked in the browser

---

🚨 CRITICAL CODING RULES — VIOLATE = FAILURE
1. **DO EXACTLY WHAT IS ASKED — NOTHING MORE, NOTHING LESS**
   - Do not add features not implied by the architecture
   - Do not “improve” unrelated parts
2. **TAILWIND CLASSES ONLY**
   - ✅ CORRECT: bg-white text-black bg-blue-500
   - ❌ WRONG: bg-background text-foreground border-border
3. **NO CUSTOM CSS EXCEPT INSIDE <style>**
   - Never use inline style="" or style={{}}
   - No CSS-in-JS, no <style jsx>, no external .css files
4. **NO EMOJIS ANYWHERE** — code or UI text
5. **ESCAPE APOSTROPHES & QUOTES**
   - Use straight quotes only (' ")
   - Apostrophe: "you're" or you\'re — never curly quotes
6. **KEEP SEMANTIC HTML & ACCESSIBILITY**
   - Proper headings, aria-labels, keyboard-navigable controls
7. **RESPONSIVE & MOBILE-FIRST**
   - Use sm:, md:, lg:, xl: prefixes
   - Never hardcode px widths — use Tailwind spacing scale
8. **KEEP JS MODERN BUT BROWSER-SAFE**
   - ES2022+ syntax is fine (const, arrow, optional chaining)
   - No TypeScript, no JSX, no imports

---

🧩 COMPONENT INTELLIGENCE (apply to page sections)
- Navigation / Header: top bar with logo + links
- Hero: main landing area above the fold
- Features / Services / Products: mid-page value props
- Footer: links, copyright, social icons
- All sections live inside the **same single HTML file**

---

🎨 DESIGN & UX GUIDELINES
- Clean, modern, high contrast
- Consistent spacing (use Tailwind scale: p-4, p-6, p-8…)
- Smooth transitions: transition-all duration-200
- Hover states: hover:scale-105 hover:shadow-lg
- Dark mode support optional unless requested
- Full-width sections by default; constrain content only when readability demands (max-w-4xl mx-auto)

---

📤 OUTPUT FORMAT
- Return **ONLY** the complete HTML document
- No markdown fences, no commentary, no apologies
- File must be copy-paste-ready and runnable instantly

CRITICAL: Generate the **entire** file in one response—never truncate or use placeholders.`; // not rewriting it to save space, but you keep your exact version

        const completion = await client.chat.completions.create({
          model: "grok-4-1-fast-reasoning",
          messages: [
            {
              role: "system",
              content:
                "You are a world-class senior full-stack developer and UI/UX designer specializing in single-file web applications. Your task is to generate complete, production-ready HTML files based on detailed user requirements, adhering strictly to technical and structural guidelines.",
            },
            {
              role: "user",
              content: promptText,
            },
          ],
        });

        const code = completion.choices[0]?.message?.content?.trim() || "";
        return extractAndValidateHTML(code, appName, attempt);
      } catch (error) {
        lastError = error as Error;
      }
    }

    throw new Error(`Failed after ${maxRetries} attempts: ${lastError}`);
  });
}

export async function generateImproveCode(
  existingCode: string,
  improvementPrompt: string,
  appName: string,
  appIdea: string,
  maxRetries: number = 3
): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const client = new OpenAI({
        apiKey: XAI_API_KEY,
        baseURL: "https://api.x.ai/v1",
        timeout: 360000,
      });

      const structuredPrompt = {
        system: {
          role: "Senior Software Engineer",
          experience:
            "60 years of professional software development experience",
        },
        context: {
          appName: appName,
          appType: appIdea,
          currentStatus: "Existing functional application",
          improvementAttempt: attempt,
          maxRetries: maxRetries,
        },
        inputs: {
          existingCode: existingCode,
          improvementRequest: improvementPrompt,
        },
        criticalRequirements: [
          {
            requirement: "COMPLETE HTML DOCUMENT",
            description: "Return the entire HTML document, not just changes",
          },
          {
            requirement: "ADD NEW FEATURES",
            description: "Implement the requested improvements fully",
          },
          {
            requirement: "NO TRUNCATION",
            description: "Generate the complete improved application",
          },
          {
            requirement: "PROPER STRUCTURE",
            description:
              "Maintain the existing HTML structure and organization",
          },
        ],
        improvementGuidelines: [
          {
            guideline: "Maintain Context",
            description: "Keep all existing functionality that works well",
          },
          {
            guideline: "Enhance, Don't Replace",
            description: "Build upon the existing foundation",
          },
          {
            guideline: "Complete Implementation",
            description: "Every improvement must be fully functional",
          },
          {
            guideline: "Consistency",
            description:
              "Maintain the app's existing design language and patterns",
          },
          {
            guideline: "User Experience",
            description:
              "Focus on making the app more intuitive and pleasant to use",
          },
          {
            guideline: "Performance",
            description: "Optimize any inefficient code",
          },
          {
            guideline: "Modern Standards",
            description: "Apply current web development best practices",
          },
          {
            guideline: "Error Handling",
            description: "Add robust error handling for new features",
          },
          {
            guideline: "Accessibility",
            description: "Ensure all improvements are accessible",
          },
          {
            guideline: "Mobile Responsiveness",
            description: "Ensure improvements work on all devices",
          },
        ],
        retryInstructions:
          attempt > 1
            ? {
                message: `This is retry attempt ${attempt}. The previous attempt failed.`,
                requirements: [
                  "Return the COMPLETE improved HTML document",
                  "All improvements are fully implemented",
                  "Maintain all existing functionality",
                ],
              }
            : null,
        outputFormat: {
          critical:
            "The returned code must be 100% complete and functional with all improvements implemented",
        },
      };

      const promptText = `
You are an expert senior software engineer performing a surgical, context-aware code modification. Your primary directive is PRECISION and PRESERVATION.

---

## USER REQUEST
"${structuredPrompt.inputs.improvementRequest}"

---

## EXISTING CODE
\`\`\`html
${structuredPrompt.inputs.existingCode}
\`\`\`

---

## CRITICAL REQUIREMENTS
${structuredPrompt.criticalRequirements
  .map((r, i) => `${i + 1}. ${r.requirement} — ${r.description}`)
  .join("\n")}

---

## IMPROVEMENT GUIDELINES
${structuredPrompt.improvementGuidelines
  .map((g, i) => `${i + 1}. ${g.guideline} — ${g.description}`)
  .join("\n")}

---

## OUTPUT RULES
- Make the smallest possible, **surgical** edits that satisfy the request.
- **Preserve** all existing logic, structure, and styling.
- The output must be a **complete, runnable HTML document**.
- Do **not** include explanations, markdown, or comments.
- Start with \`<!DOCTYPE html>\` and end with \`</html>\`.

---

Follow the above carefully. Output only the full improved code file (no explanations).
`;

      const completion = await client.chat.completions.create({
        model: "grok-4-1-fast-reasoning",
        messages: [
          {
            role: "user",
            content: promptText,
          },
        ],
      });

      let improvedCode = completion.choices[0]?.message?.content?.trim() || "";
      improvedCode = extractAndValidateHTML(improvedCode, appName, attempt);

      if (improvedCode === existingCode) {
        throw new Error("No improvements were made to the code");
      }

      if (improvedCode.length < existingCode.length * 0.8) {
        throw new Error(
          "Improved code appears to be significantly shorter than original - possible truncation"
        );
      }

      return improvedCode;
    } catch (error) {
      console.error(`❌ Code improvement attempt ${attempt} failed:`, error);
      lastError = error as Error;

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        continue;
      }
    }
  }

  throw new Error(
    `Failed to improve application code after ${maxRetries} attempts: ${
      lastError?.message || "Unknown error"
    }`
  );
}
