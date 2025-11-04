import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

// Enhanced request deduplication cache with TTL
const requestCache = new Map<
  string,
  { promise: Promise<unknown>; timestamp: number; ttl: number }
>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes default TTL

// Helper function to create cache key with better hashing
function createCacheKey(functionName: string, ...params: unknown[]): string {
  const paramsHash = JSON.stringify(params).replace(/\s+/g, "");
  return `${functionName}:${Buffer.from(paramsHash)
    .toString("base64")
    .slice(0, 32)}`;
}

// Enhanced cache cleanup
function cleanupExpiredCache() {
  const now = Date.now();
  for (const [key, value] of requestCache.entries()) {
    if (now - value.timestamp > value.ttl) {
      requestCache.delete(key);
    }
  }
}

// Enhanced deduplication with TTL support
async function executeWithDeduplication<T>(
  cacheKey: string,
  executionFunction: () => Promise<T>,
  ttl: number = CACHE_TTL
): Promise<T> {
  cleanupExpiredCache();

  const cached = requestCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.promise as Promise<T>;
  }

  const requestPromise = executionFunction().finally(() => {
    setTimeout(() => requestCache.delete(cacheKey), ttl);
  });

  requestCache.set(cacheKey, {
    promise: requestPromise,
    timestamp: Date.now(),
    ttl,
  });

  return requestPromise;
}

interface AIConfig {
  temperature: number;
  topK: number;
  topP: number;
  maxOutputTokens: number;
  responseMimeType: string;
}

interface ContentPart {
  text: string;
}

interface Content {
  role: string;
  parts: ContentPart[];
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

      const response = await ai.models.generateContent({
        model,
        config,
        contents,
      });

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

      const response = await ai.models.generateContent({
        model,
        config,
        contents,
      });

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

      const model = "gemini-2.5-pro";
      const config = {
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

      const response = await ai.models.generateContent({
        model,
        config,
        contents: [{ role: "user", parts: [{ text: `${prompt}\n\n${template}` }] }],
      });

      const raw = response?.text?.trim() || "";
      return raw.length > 500 ? raw : `# ${appName} - ${appIdea}\n\nFailed to expand architecture.`;
    } catch (err) {
      throw new Error(
        `Architecture generation failed: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  });
}


// Enhanced style inspiration with better trend analysis
// export async function getStyleInspiration(appIdea: string): Promise<string> {
//   const cacheKey = createCacheKey("getStyleInspiration", appIdea);

//   return executeWithDeduplication(cacheKey, async () => {
//     try {
//       // Fetch most popular UI design from Unsplash
//       const designImageUrl = await fetchPopularUIDesign(appIdea);

//       // Generate style guide using the design image
//       const tools = [{ googleSearch: {} }];
//       const config = {
//         thinkingConfig: {
//           thinkingBudget: -1,
//         },
//         tools,
//         temperature: 0.8,
//         maxOutputTokens: 4096,
//         responseMimeType: "text/plain",
//       };
//       const model = "gemini-2.5-flash";

//       const contents = [
//         {
//           role: "user",
//           parts: [
//             {
//               text: `Analyze this high-quality UI design image and create detailed style guidance for a modern ${appIdea} website.

// Use this image as primary inspiration along with your knowledge of current design trends to create a comprehensive style guide.

// Include specifics about:
// - Color palette (exact hex codes) extracted from the design and current trends
// - Typography (font families, sizes, weights) that match this aesthetic
// - Component styles (buttons, cards, navigation) inspired by the design
// - Layout principles from the design and modern standards
// - Animation suggestions that would enhance this style
// - Visual motifs and design elements from the image

// Format as a concise but detailed style guide for an AI code generator.`,
//             },
//             {
//               inlineData: {
//                 mimeType: "image/jpeg",
//                 data: await getImageAsBase64(designImageUrl),
//               },
//             },
//           ],
//         },
//       ];

//       const response = await ai.models.generateContent({
//         model,
//         config,
//         contents,
//       });

//       return (
//         response?.text?.trim() ||
//         `Modern design system for ${appIdea} with clean typography, accessible colors, and professional styling.`
//       );
//     } catch (error) {
//       console.error("Error in getStyleInspiration:", error);
//       return `Modern, professional design system for ${appIdea} application with clean styling and excellent user experience.`;
//     }
//   });
// }

// Significantly enhanced code generation with better error handling and retry logic

export async function generateCode(
  appIdea: string,
  appName: string,
  architecture: string,
  additionalRequirements = "",
  temperature = 1.0,
  maxRetries = 11
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
          thinkingConfig: { thinkingBudget: -1 },
          temperature: temperature + (attempt - 2) * 0.1,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 65536,
          responseMimeType: "text/plain",
        };

        const model = "gemini-2.5-pro";

        const codeGenerationConfig = {
          input: { architecture_blueprint: architecture, attempt_number: attempt, is_retry: attempt > 1 },
          task: {
            primary_objective: "generate_complete_production_ready_html_file",
            scope: "single_file_web_application",
          },
          technical_requirements: {
            core_technologies: {
              markup: "HTML5",
              styling: "TailwindCSS_via_cdn",
              scripting: "modern_javascript_es2022_plus",
              icons: "font_awesome_6_7_2",
            },
            architecture_constraints: {
              file_structure: "single_html_file",
              css_approach: "embedded_in_style_tags",
              javascript_approach: "embedded_in_script_tags",
              external_dependencies: "cdn_only",
              build_tools: "none_required",
            },
          },
          retry_handling:
            attempt > 1
              ? {
                  attempt_number: attempt,
                  retry_requirements: [
                    "generate_complete_html_document",
                    "implement_all_features",
                    "ensure_no_truncation",
                  ],
                }
              : null,
          output_specifications: {
            format: "raw_html_code_only",
            structure: { start_with: "<!DOCTYPE html>", end_with: "</html>" },
          },
        };
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
${attempt > 1 ? 'Previous output was truncated or incomplete—emit the **entire** HTML file this time.' : ''}

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


        const response = await ai.models.generateContent({
          model,
          config,
          contents: [{ role: "user", parts: [{ text: promptText }] }],
        });

        let code = response?.text?.trim() || "";
        code = extractAndValidateHTML(code, appName, attempt);
        return code;
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxRetries) await new Promise((r) => setTimeout(r, 1000 * attempt));
      }
    }

    throw new Error(`Failed after ${maxRetries} attempts: ${lastError?.message || "Unknown error"}`);
  });
}
// Enhanced code improvement with retry logic

export async function generateImproveCode(
  existingCode: string,
  improvementPrompt: string,
  appName: string,
  appIdea: string,
  temperature: number = 1.2,
  maxRetries: number = 11
): Promise<string> {
  const cacheKey = createCacheKey(
    "generateImproveCode",
    existingCode,
    improvementPrompt,
    appName,
    appIdea,
    temperature
  );

  return executeWithDeduplication(cacheKey, async () => {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const config = {
          thinkingConfig: {
            thinkingBudget: -1,
          },
          temperature: temperature + (attempt - 1) * 0.1,
          topP: 0.92,
          topK: 30,
          maxOutputTokens: 65536,
          responseMimeType: "text/plain",
        };

        const model = "gemini-2.5-pro";

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
  .map(
    (r, i) => `${i + 1}. ${r.requirement} — ${r.description}`
  )
  .join("\n")}

---

## IMPROVEMENT GUIDELINES
${structuredPrompt.improvementGuidelines
  .map(
    (g, i) => `${i + 1}. ${g.guideline} — ${g.description}`
  )
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

        const response = await ai.models.generateContent({
          model,
          config,
          contents,
        });

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
  });
}
function extractJSON(text: string): string {
  // Method 1: Try to extract JSON from markdown code blocks
  const markdownJsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (markdownJsonMatch) {
    return markdownJsonMatch[1].trim();
  }

  // Method 2: Try to extract JSON from generic code blocks
  const codeBlockMatch = text.match(/```\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) {
    const content = codeBlockMatch[1].trim();
    // Check if it's valid JSON
    if (content.startsWith("{") || content.startsWith("[")) {
      return content;
    }
  }

  // Method 3: Find JSON object by looking for the first { and last }
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const potentialJson = text.substring(firstBrace, lastBrace + 1);

    // Validate it's actual JSON
    try {
      JSON.parse(potentialJson);
      return potentialJson;
    } catch (e) {
      console.warn("Extracted text is not valid JSON:", e);
    }
  }

  // Method 4: Return original text if no JSON found (fallback will handle it)
  return text;
}

// async function fetchPopularUIDesign(appIdea: string): Promise<string> {
//   const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

//   if (!UNSPLASH_ACCESS_KEY) {
//     throw new Error("Unsplash access key not found in environment variables");
//   }

//   // Create search query for UI designs
//   const searchQuery = `${appIdea} ui design interface dashboard website mockup`;

//   const response = await fetch(
//     `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
//       searchQuery
//     )}&orientation=landscape&order_by=popular&per_page=1`,
//     {
//       headers: {
//         Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
//       },
//     }
//   );

//   if (!response.ok) {
//     throw new Error(`Unsplash API failed: ${response.statusText}`);
//   }

//   const data = await response.json();
//   const topDesign = data.results?.[0];

//   if (!topDesign?.urls) {
//     throw new Error("No design images found");
//   }

//   // Use the highest quality image available
//   return topDesign.urls.regular || topDesign.urls.small;
// }

// async function getImageAsBase64(imageUrl: string): Promise<string> {
//   const response = await fetch(imageUrl);
//   if (!response.ok) {
//     throw new Error(`Failed to fetch image: ${response.statusText}`);
//   }

//   const arrayBuffer = await response.arrayBuffer();
//   const base64 = Buffer.from(arrayBuffer).toString("base64");

//   return base64;
// }

// Helper function to extract and validate HTML code
function extractAndValidateHTML(
  rawCode: string,
  appName: string,
  attempt: number
): string {
  let code = rawCode.trim();

  // Remove any markdown code blocks if present
  const codeBlockMatch = code.match(/```html\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch) {
    code = codeBlockMatch[1].trim();
  }

  // Look for HTML document within the response
  const htmlMatch = code.match(/<!DOCTYPE html>[\s\S]*<\/html>/i);
  if (htmlMatch) {
    code = htmlMatch[0];
  }

  // Simplified validation - only check essential structure
  const validationErrors: string[] = [];

  // Check if it starts with DOCTYPE
  if (!code.includes("<!DOCTYPE html>")) {
    validationErrors.push("Missing DOCTYPE declaration");
  }

  // Check if it has opening and closing HTML tags
  if (!code.includes("<html") || !code.includes("</html>")) {
    validationErrors.push("Missing HTML tags");
  }

  // Check if it ends with </html>
  if (!code.trimEnd().endsWith("</html>")) {
    validationErrors.push(
      "Code appears to be truncated - doesn't end with </html>"
    );
  }

  // Check for minimum reasonable length (less strict)
  if (code.length < 1000) {
    validationErrors.push(
      `Code too short (${code.length} chars) - likely incomplete`
    );
  }

  // If validation fails, throw error for retry
  if (validationErrors.length > 0) {
    throw new Error(
      `Generated code validation failed (attempt ${attempt}): ${validationErrors.join(
        ", "
      )}`
    );
  }

  // Ensure the code includes the app name in title if missing
  if (!code.toLowerCase().includes(appName.toLowerCase())) {
    code = code.replace(/(<title[^>]*>)[^<]*(<\/title>)/i, `$1${appName}$2`);
  }

  return code;
}

// Export all functions for use in other modules
export { cleanupExpiredCache, createCacheKey, executeWithDeduplication };
