import { ai, AIConfig, Content, rotateAIKey } from "./ai";
import { createCacheKey, executeWithDeduplication } from "./cache";
import { extractAndValidateHTML } from "./utils";
import { ThinkingLevel } from "@google/genai";

async function withApiKeyRotation<T>(
  action: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: unknown = null;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await action();
    } catch (error: unknown) {
      lastError = error;
      if (
        error instanceof Error &&
        (error.message.includes("API key not valid") ||
          error.message.includes("API key expired"))
      ) {
        await rotateAIKey();
      } else {
        throw error;
      }
    }
  }

  const message =
    lastError instanceof Error ? lastError.message : "Unknown error";

  throw new Error(`Action failed after ${maxRetries} attempts: ${message}`);
}

// Enhanced app name generation with better branding
export async function generateAppName(prompt: string): Promise<string> {
  const cacheKey = createCacheKey("generateAppName", prompt);

  return executeWithDeduplication(cacheKey, async () => {
    try {
      const config: AIConfig = {
        temperature: 1.0,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 50,
        responseMimeType: "text/plain",
      };

      const model = "gemini-flash-lite-latest";

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

      const contents: Content[] = [
        {
          role: "user",
          parts: [
            {
              text: `Using this configuration, generate an app name:\n\n${JSON.stringify(
                structuredPrompt,
                null,
                2
              )}`,
            },
          ],
        },
      ];

      const response = await withApiKeyRotation(() =>
        ai.models.generateContent({
          model,
          config,
          contents,
        })
      );

      let appName = response?.text?.trim() || "";
      // console.log("\n\nGenerated app name:", appName);
      // Enhanced cleanup
      appName = appName.replace(/^["']|["']$/g, "");
      appName = appName.split(/[\n\r]/)[0].trim();
      appName = appName.replace(/^(Name|App Name|Best Option):\s*/i, "");
      appName = appName.replace(/^\d+\.\s*/, ""); // Remove numbered list format

      // Fallback if generation fails
      if (!appName || appName.length < 2) {
        const fallbacks = [
          "Nexus",
          "Prism",
          "Flux",
          "Orbit",
          "Spark",
          "Zenith",
          "Lumina",
          "Vortex",
        ];
        appName = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      }

      return appName;
    } catch (error) {
      console.error("Error in generateAppName:", error);
      // Better fallback system
      const timestamp = Date.now().toString().slice(-4);
      return `App${timestamp}`;
    }
  });
}

// Enhanced message generation with better user experience
export async function generateMessage(
  prompt: string,
  appName: string = "your app",
  isImprovement: boolean = false
): Promise<string> {
  const cacheKey = createCacheKey(
    "generateMessage",
    prompt,
    appName,
    isImprovement
  );

  return executeWithDeduplication(cacheKey, async () => {
    try {
      const config: AIConfig = {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 200,
        responseMimeType: "text/plain",
      };

      const model = "gemini-flash-lite-latest";

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
                express: "enthusiasm about enhancing the project",
                commit: "to implementing the requested changes",
              }
            : {
                acknowledge: "the specific app idea",
                express: "enthusiasm about building it",
                commit: "to creating a fully functional web application",
                include: "one specific detail about the app's value/usefulness",
              },
          constraints: {
            length: { min_sentences: 2, max_sentences: 4 },
            banned_phrases: [
              "I understand",
              "I'll help you",
              "As an AI",
              "I'm an AI",
              "Let me assist",
            ],
            writing_style: {
              avoid: ["robotic language", "generic templates", "AI mentions"],
              prefer: [
                "natural speech",
                "specific details",
                "genuine excitement",
              ],
            },
          },
        },
        output_specification: {
          format: "raw_text",
          no_formatting: ["quotes", "markdown", "preamble"],
          deliver: "response_only",
        },
      };

      const contents: Content[] = [
        {
          role: "user",
          parts: [
            {
              text: `Follow this specification to generate a response:\n\n${JSON.stringify(
                structuredResponsePrompt,
                null,
                2
              )}\n\nGenerate the response now.`,
            },
          ],
        },
      ];

      const response = await withApiKeyRotation(() =>
        ai.models.generateContent({
          model,
          config,
          contents,
        })
      );

      let message = response?.text?.trim() || "";
      // console.log("\n\nGenerated message:", message);

      // Fallback messages if generation fails
      if (!message) {
        message = isImprovement
          ? `Perfect! I'm implementing those improvements to make ${appName} even better. The new features will enhance both functionality and user experience! 🚀`
          : `Fantastic idea! I'm creating ${appName} with all the features you need, plus a modern, professional design that users will love. This is going to be amazing! ✨`;
      }
      return message;
    } catch (error) {
      console.error("Error in generateMessage:", error);
      const fallbackMessage = isImprovement
        ? "Great improvements! I'm working on implementing those changes to make your app even better."
        : "Excellent app idea! I'm building a professional, fully-featured application for you.";
      return fallbackMessage;
    }
  });
}

export async function generateAppArchitecture(
  appIdea: string,
  appName: string,
  additionalRequirements: string = ""
): Promise<string> {
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

      const model = "gemini-3-pro-preview";
      const config = {
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH,
        },
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 32768,
      };

      const prompt = `
You are an expert web architect.
Fill the following architecture template *completely and professionally*
for the app described below.

App Name: ${appName}
App Idea: ${appIdea}
${additionalRequirements ? `Extra: ${additionalRequirements}` : ""}

Output must be detailed, structured, and formatted in Markdown, with all placeholders replaced.`;

      const response = await withApiKeyRotation(() =>
        ai.models.generateContent({
          model,
          config,
          contents: [
            { role: "user", parts: [{ text: `${prompt}\n\n${template}` }] },
          ],
        })
      );

      const raw = response?.text?.trim() || "";
      return raw.length > 500
        ? raw
        : `# ${appName} - ${appIdea}\n\nFailed to expand architecture.`;
    } catch (err) {
      throw new Error(
        `Architecture generation failed: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  });
}

export async function generateCode(
  appIdea: string,
  appName: string,
  architecture: string,
  additionalRequirements = "",
  temperature = 1.2,
  maxRetries = 3
): Promise<string> {
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
        const config = {
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
          temperature: temperature + (attempt - 2) * 0.1,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 65536,
          responseMimeType: "text/plain",
        };

        const model = "gemini-3-pro-preview";

        const promptText = `
You are a Senior Full-Stack Developer & UI/UX Designer with decades of experience shipping production-ready web apps.
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

CRITICAL: Generate the **entire** file in one response—never truncate or use placeholders.
`;

        const response = await withApiKeyRotation(() =>
          ai.models.generateContent({
            model,
            config,
            contents: [{ role: "user", parts: [{ text: promptText }] }],
          })
        );

        let code = response?.text?.trim() || "";
        code = extractAndValidateHTML(code, appName, attempt);
        return code;
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxRetries)
          await new Promise((r) => setTimeout(r, 1000 * attempt));
      }
    }

    throw new Error(
      `Failed after ${maxRetries} attempts: ${
        lastError?.message || "Unknown error"
      }`
    );
  });
}
// Enhanced code improvement with retry logic

export async function generateImproveCode(
  existingCode: string,
  improvementPrompt: string,
  appName: string,
  appIdea: string,
  temperature: number = 1.2,
  maxRetries: number = 3
): Promise<string> {
  /*const cacheKey = createCacheKey(
    "generateImproveCode",
    existingCode,
    improvementPrompt,
    appName,
    appIdea,
    temperature
  );

  return executeWithDeduplication(cacheKey, async () => {*/
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const config = {
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH,
        },
        temperature: temperature + (attempt - 1) * 0.1,
        topP: 0.92,
        topK: 30,
        maxOutputTokens: 65536,
        responseMimeType: "text/plain",
      };

      const model = "gemini-3-pro-preview";

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

      const contents = [
        {
          role: "user",
          parts: [{ text: promptText }],
        },
      ];

      const response = await withApiKeyRotation(() =>
        ai.models.generateContent({
          model,
          config,
          contents,
        })
      );

      let improvedCode = response?.text?.trim() || "";
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
  //});
}
