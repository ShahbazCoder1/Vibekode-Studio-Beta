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
        temperature: 0.7,
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
      const template = `# Single-File Web App Architecture Plan Template

## Project Name: [Enter your project name]

## Core User Needs:
<!-- List the primary user needs the application will address (add as many as needed) -->
1. [Enter primary user need]
2. [Enter primary user need]
3. [Enter primary user need]
- Add additional user needs as necessary

## Technical Constraints:
<!-- List any technical constraints for this project -->
* Single HTML file architecture
* Tailwind CSS for styling
* Vanilla JavaScript for functionality
* For icons use "<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">"
* If any images are required, use the Pixabay API (https://pixabay.com/api/) with the API key '50370718-98cd42cb1427f3bcfa222a614'. The API allows you to fetch various types of media including photos, illustrations, and vector graphics. When implementing the image functionality, make sure to properly handle the API response to retrieve the appropriate image URL and credit the source as required by Pixabay's terms of service.
* If any API is required, use free APIs that don't require OAuth or API keys as first priority. If no suitable free API is available, use dummy data.
* [Enter additional technical constraint]
* [Enter additional technical constraint]

## File Structure:

### HTML Structure
<!-- Describe the overall HTML structure of your single-file application -->
* Document Structure:
  * [Specify HTML5 document structure]
  * [List required meta tags]
  * [Specify SEO requirements]

* Component Organization:
  * [Describe how components will be organized]
  * [List major HTML sections]

### CSS Structure
<!-- Describe how CSS will be organized within the single file -->
* [Specify Tailwind CSS configuration approach]
* [List custom CSS requirements]
* [Describe responsive design strategy]
* [Specify theme variables]

### JavaScript Organization
<!-- Describe how JavaScript will be structured within the single file -->
* State Management:
  * [Describe state management approach]
  * [List key state objects]

* Routing System:
  * [Describe routing implementation]
  * [List main routes]

* Component Functions:
  * [List main component functions]
  * [Describe initialization approach]

* Data Services:
  * [Describe API service approach]
  * [List data services]

* Local Storage:
  * [Describe storage strategy]
  * [List items to be stored]

## Page/View Structure:
<!-- List all views/pages the application will contain -->
1. [Enter page/view name]:
   * Purpose: [Describe purpose]
   * Components: [List components]
   * Actions: [List user actions]

2. [Enter page/view name]:
   * Purpose: [Describe purpose]
   * Components: [List components]
   * Actions: [List user actions]

3. [Enter page/view name]:
   * Purpose: [Describe purpose]
   * Components: [List components]
   * Actions: [List user actions]

## Component Architecture:
<!-- Detail key components for the application -->
1. [Enter component name]:
   * Structure:
     * [Describe HTML structure]
     * [List sub-components]
   * Functionality:
     * [List behaviors]
     * [Describe state interactions]

2. [Enter component name]:
   * Structure:
     * [Describe HTML structure]
     * [List sub-components]
   * Functionality:
     * [List behaviors]
     * [Describe state interactions]

3. [Enter component name]:
   * Structure:
     * [Describe HTML structure]
     * [List sub-components]
   * Functionality:
     * [List behaviors]
     * [Describe state interactions]

## Data Models:
<!-- Define data structures for the application -->
1. [Enter model name]:
   * Properties:
     * [Property name]: [Data type] - [Description]
     * [Property name]: [Data type] - [Description]
   * Methods:
     * [Method name] - [Description]

2. [Enter model name]:
   * Properties:
     * [Property name]: [Data type] - [Description]
     * [Property name]: [Data type] - [Description]
   * Methods:
     * [Method name] - [Description]

## Implementation Plan:

### Step 1: Setup Base Structure
<!-- Define tasks for initial setup -->
* [Enter specific task]
* [Enter specific task]
* [Enter specific task]

### Step 2: Core Components
<!-- Define tasks for building core components -->
* [Enter specific task]
* [Enter specific task]
* [Enter specific task]

### Step 3: Routing & Navigation
<!-- Define tasks for implementing navigation -->
* [Enter specific task]
* [Enter specific task]
* [Enter specific task]

### Step 4: Data Management
<!-- Define tasks for data handling -->
* [Enter specific task]
* [Enter specific task]
* [Enter specific task]

### Step 5: UI Refinement
<!-- Define tasks for UI improvement -->
* [Enter specific task]
* [Enter specific task]
* [Enter specific task]

### Step 6: Testing & Optimization
<!-- Define testing strategy -->
* [Enter specific task]
* [Enter specific task]
* [Enter specific task]

## Performance Considerations:
<!-- Describe performance optimization strategies -->
* [Enter performance consideration]
* [Enter performance consideration]
* [Enter performance consideration]

## Browser Compatibility:
<!-- List target browsers and compatibility strategies -->
* Target Browsers:
  * [Enter browser and version]
  * [Enter browser and version]
* Compatibility Strategy:
  * [Enter compatibility approach]
  * [Enter compatibility approach]

## Security Considerations:
<!-- List security measures -->
* [Enter security consideration]
* [Enter security consideration]
* [Enter security consideration]

## Additional Notes:
<!-- Any other important information -->
* [Enter additional information]
* [Enter additional information]

## Suggested Free APIs:
<!-- Select APIs from this list that might be relevant to your application. These APIs do not require OAuth or API keys. -->

### Animals
* Cat Facts
* Cataas
* Dog API
* Dogs
* Foxes
* HTTPCat
* HTTP Dogs
* Meow Facts
* RandomBigCat
* RandomDog
* RandomFox

### Anime
* AnimeNewsNetwork
* AOT quotes
* Jikan
* Mangadex
* Nekosia API

### Art & Design
* Metropolitan Museum of Art

### Books
* British National Bibliography
* Harry Potter API
* Open Library
* Penguin Publishing
* Rig Veda
* Vedic Society

### Business
* Domainsdb.info
* Favicon.im
* markerapi
* Valid Email

### Calendar
* Byabbe
* Church Calendar
* Czech Namedays Calendar
* Hebrew Calendar
* Non-working Days
* Nager.Date
* Namedays Calendar
* Russian Calendar
* TimeZones iCal Library

### Development
* 0ms DNS Accelerator
* 0ms Get IP
* 0ms Mirrors
* 24 Pull Requests
* APIs.guru
* CDNJS
* Corsfix
* ExtendsClass
* FontDownloader
* Form2Channel
* Genderize.io
* HTTP2.Pro
* Image-Charts
* IPify
* jsDelivr
* JSON 2 JSONP
* Public APIs
* QR code
* QuickChart
* ReqRes
* SHOUTCLOUD
* XML to JSON
* Image to Link

### Dictionaries
* Wordnik

### Documents & Productivity
* File.io
* Vector Express

### Food & Drink
* Open Brewery DB
* Open Food Facts
* PunkAPI
* TacoFancy
* TheCocktailDB
* TheMealDB

### Games & Comics
* AmiiboAPI
* Chuck Norris Database
* Blue Archive
* Comic Vine
* Deck of Cards
* Dungeons and Dragons
* Final Fantasy XIV
* Jokes One
* JokeAPI
* Jokes
* Jservice
* Magic The Gathering
* Open Trivia
* Pokéapi
* Pokémon TCG
* Puns
* Random Facts
* Rick and Morty
* Scryfall
* xkcd

### Geocoding
* administrative-divisons-db
* Country
* GeoJS
* IP Location
* Indian Cities
* IP 2 Country
* OpenStreetMap
* REST Countries
* Zippopotam

### Government
* BCLaws
* Census.gov
* Data USA
* Federal Register
* Food Standards Agency
* Open Government (various countries)

### Music
* Freesound
* Genrenator
* iTunes Search
* Lyrics.ovh
* MusicBrainz
* TheAudioDB

### News
* Chronicling America

### Open Data
* Archive.org
* Fruits
* Quandl
* Universities List
* Wikipedia

### Personality
* Advice Slip
* chucknorris.io
* Forismatic
* icanhazdadjoke
* kanye.rest
* Meme
* Programming Quotes
* Quote Garden
* Quotes on Design
* Riddles API
* tronalddump.io

### Photography
* Lorem Picsum
* PlaceKitten

### Science & Math
* NASA
* Newton
* Numbers (Facts about numbers)
* Open Notify
* SpaceX
* Sunrise and Sunset
* USGS Earthquake Hazards Program
* World Bank

### Social
* HackerNews
* Open Collective
* Reddit

### Sports & Fitness
* balldontlie
* City Bikes
* Football-Data.org
* NBA Stats
* NHL Records and Stats

### Test Data
* Bacon Ipsum
* Beeceptor's CRUD APIs
* Dicebear Avatars
* JSONPlaceholder
* Loripsum
* RandomUser
* RoboHash
* This Person Does not Exist
* UI Names
* UUID Generator
* Yes No

### Transportation
* Open Charge Map
* REFUGE Restrooms
* Various city transit APIs

### Video
* An API of Ice And Fire
* Bob's Burgers API
* Breaking Bad Quotes
* Czech Television
* Owen Wilson Wow
* Ron Swanson Quotes
* Shrek Quotes
* South Park Quotes
* TVMaze

### Weather
* 7Timer!
* Meteorologisk Institutt
* ODWeather
* Open-Meteo
* National Weather Service API

---

## Instructions for Technical Team:
1. Fill in all sections marked with [brackets]
2. Remove the comment instructions (lines starting with <!--)
3. Add additional sections as needed for your specific project
4. Be specific with implementation details
5. Include timeline estimates for each step

## Look and Feel:
<!-- Provide a brief 3-4 line description of the application's intended aesthetic and user experience -->
[Describe the overall visual style (e.g., minimalist, bold, playful, corporate)]
[Describe the intended user experience (e.g., intuitive, streamlined, immersive)]
[Describe any specific design principles or patterns to follow]`;

      const config = {
        thinkingConfig: {
          thinkingBudget: -1,
        },
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 32768,
        responseMimeType: "application/json",
      };

      const model = "gemini-2.5-pro";

      const createTemplatePromptConfig = (
        template: string,
        appIdea: string,
        appName: string
      ) => ({
        target: {
          template_document: template,
          application_type: appIdea,
          application_name: appName,
        },
        completion_rules: {
          project_name: {
            action: "set_to",
            value: appName,
            location: "Project Name section",
          },
          placeholder_replacement: {
            pattern: "all text within [brackets]",
            action: "replace_with_specific_details",
            quality: "detailed and contextual",
          },
          comment_removal: {
            pattern: "HTML comments (<!-- -->)",
            action: "remove_completely",
          },
          section_completion: {
            requirement: "fill_all_sections",
            depth: "comprehensive",
            specificity: "tailored_to_app_concept",
          },
        },
        quality_standards: {
          production_readiness: {
            level: "production_grade",
            ui_design: "professional",
            ux_design: "professional",
            code_quality: "industry_standard",
          },
          technical_decisions: {
            apis: "select_appropriate_from_provided_list",
            components: "define_specific_to_app_needs",
            data_models: "create_relevant_structures",
            routing: "design_logical_flow",
          },
          implementation_detail: {
            specificity: "actionable",
            completeness: "ready_for_development",
            clarity: "unambiguous",
          },
        },
        content_requirements: {
          user_needs: {
            count: "3_to_5",
            relevance: "specific_to_app_concept",
            clarity: "clear_and_measurable",
          },
          pages_views: {
            count: "all_necessary_views",
            detail_level: "purpose_components_and_actions",
            coherence: "logical_user_flow",
          },
          components: {
            count: "all_major_components",
            specification: "structure_and_functionality",
            completeness: "ready_for_implementation",
          },
          data_models: {
            requirement: "define_all_necessary_models",
            detail: "properties_types_and_methods",
            alignment: "match_app_requirements",
          },
          implementation_plan: {
            steps: "6_phase_approach",
            detail: "specific_actionable_tasks",
            sequencing: "logical_build_order",
          },
          look_and_feel: {
            length: "3_to_4_lines",
            content: [
              "visual_style_description",
              "user_experience_approach",
              "design_principles",
            ],
          },
        },
        output_format: {
          type: "completed_json",
          structure: "preserve_original_json_structure",
          formatting: "maintain_json_syntax",
          completeness: "no_placeholders_or_comments_remaining",
        },
      });

      const templatePromptConfig = createTemplatePromptConfig(
        template,
        appIdea,
        appName
      );

      const contents = [
        {
          role: "user",
          parts: [
            {
              text: `Using this configuration, complete the architecture template:\n\n${JSON.stringify(
                templatePromptConfig,
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

      let rawResponse = response?.text?.trim() || "";
      // console.log("\n\nRaw AI Response:", rawResponse);

      // Extract JSON from the response
      let architecture = extractJSON(rawResponse);

      // Fallback architecture if generation fails
      if (!architecture || architecture.length < 1000) {
        architecture = `# ${appName} - ${appIdea} Application Architecture

## Project Overview
**Project Name:** ${appName}
**Application Type:** ${appIdea}

## Core Features:
1. User-friendly interface for ${appIdea}
2. Responsive design for all devices
3. Modern, professional styling
4. Local data storage
5. Real-time interactions

## Technical Stack:
- HTML5, CSS3 (Tailwind CSS)
- Vanilla JavaScript (ES6+)
- Font Awesome icons
- Local Storage for data persistence

## Implementation Focus:
- Clean, semantic HTML structure
- Responsive, mobile-first design
- Accessible interface design
- Performance optimization
- Cross-browser compatibility

This application will be built as a single-file, production-ready web application with professional quality code and user experience.`;
      }

      // console.log("\n\nExtracted architecture:", architecture);
      return architecture;
    } catch (error) {
      console.error("Error in generateAppArchitecture:", error);
      throw new Error(
        `Failed to generate app architecture: ${
          error instanceof Error ? error.message : "Unknown error"
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
  additionalRequirements: string = "",
  temperature: number = 0.9,
  maxRetries: number = 3
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
        // console.log(`Code generation attempt ${attempt}/${maxRetries}`);

        // const styleGuidance = await getStyleInspiration(appIdea);

        const config = {
          thinkingConfig: {
            thinkingBudget: -1,
          },
          temperature: temperature + (attempt - 2) * 0.1, // Slightly increase temperature on retries
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 32768,
          responseMimeType: "text/plain",
        };

        const model = "gemini-2.5-pro";

        const codeGenerationConfig = {
          role_context: {
            position: "Senior Full-Stack Developer & UI/UX Designer",
            expertise: [
              "modern_web_development",
              "responsive_design",
              "accessibility_standards",
              "performance_optimization",
              "visual_design",
              "user_experience",
            ],
            experience_level: "expert_10_plus_years",
          },

          input: {
            architecture_blueprint: architecture,
            attempt_number: attempt,
            is_retry: attempt > 1,
          },

          task: {
            primary_objective: "generate_complete_production_ready_html_file",
            scope: "single_file_web_application",
            deliverable_type: "self_contained_html_document",
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

            implementation_completeness: [
              "all_features_from_architecture_fully_implemented",
              "all_components_completely_coded",
              "all_pages_views_functional",
              "all_data_models_implemented",
              "all_routing_logic_working",
              "all_state_management_functional",
              "all_api_integrations_complete",
              "no_placeholder_functions",
              "no_todo_comments",
              "production_ready_code",
            ],
          },

          design_requirements: {
            visual_quality: {
              level: "stunning_and_professional",
              inspiration: "top_rated_websites_in_category",
              trends: "incorporate_latest_2025_web_design_trends",
              aesthetic: "modern_polished_and_cohesive",
            },

            design_elements: {
              color_scheme: {
                requirement: "cohesive_and_purposeful",
                approach: "based_on_architecture_design_system",
                sophistication: "professional_grade",
              },

              typography: {
                hierarchy: "clear_and_readable",
                scale: "harmonious",
                pairing: "professional",
              },

              visual_effects: {
                gradients: "use_modern_gradient_techniques",
                shadows: "implement_depth_and_elevation",
                borders: "thoughtful_use_of_borders_and_dividers",
                spacing: "generous_and_balanced",
              },

              micro_interactions: {
                hover_effects: "subtle_and_engaging",
                transitions: "smooth_and_purposeful",
                animations: "enhance_ux_without_overwhelming",
                feedback: "immediate_visual_feedback_for_actions",
              },
            },

            responsive_design: {
              approach: "mobile_first",
              breakpoints: ["mobile", "tablet", "desktop", "large_desktop"],
              testing: "ensure_works_perfectly_on_all_devices",
              touch_optimization: "optimize_for_touch_interactions",
            },

            user_experience: {
              navigation: "intuitive_and_seamless",
              interactions: "thoughtful_and_predictable",
              loading_states: "implement_where_appropriate",
              error_handling: "graceful_error_messages",
              accessibility: "wcag_2_1_aa_compliant",
            },
          },

          code_quality_standards: {
            organization: {
              structure: "clean_and_logical",
              sections: "clearly_separated_with_comments",
              naming: "descriptive_and_consistent",
            },

            documentation: {
              comments: "explain_complex_logic_and_sections",
              code_clarity: "self_documenting_where_possible",
              inline_docs: "helpful_without_being_excessive",
            },

            best_practices: {
              html: [
                "semantic_html5_elements",
                "proper_nesting_and_structure",
                "accessibility_attributes",
                "seo_friendly_markup",
              ],
              css: [
                "tailwind_utility_classes_properly_used",
                "custom_css_for_unique_styles",
                "responsive_utilities",
                "organized_style_blocks",
              ],
              javascript: [
                "modern_es2022_plus_syntax",
                "clean_function_organization",
                "proper_event_handling",
                "efficient_dom_manipulation",
                "no_memory_leaks",
              ],
            },

            performance: {
              optimization: "optimize_for_fast_loading",
              efficiency: "efficient_javascript_execution",
              assets: "optimize_any_inline_resources",
            },
          },

          retry_handling:
            attempt > 1
              ? {
                  attempt_number: attempt,
                  previous_failures: [
                    "code_was_incomplete_or_truncated",
                    "missing_essential_html_structure",
                    "insufficient_functionality_implementation",
                  ],
                  retry_requirements: [
                    "generate_complete_full_length_html_document",
                    "implement_all_features_from_architecture",
                    "ensure_no_truncation_or_cutoff",
                    "verify_completeness_before_returning",
                  ],
                  critical_instruction:
                    "This is a retry - ensure ABSOLUTE COMPLETENESS",
                }
              : null,

          output_specifications: {
            format: "raw_html_code_only",
            structure: {
              start_with: "<!DOCTYPE html>",
              end_with: "</html>",
              completeness: "entire_document_from_doctype_to_closing_html_tag",
            },

            prohibited_content: [
              "markdown_code_blocks",
              "explanatory_text",
              "introductory_sentences",
              "closing_remarks",
              "code_fence_markers",
              "language_identifiers",
            ],

            required_sections: [
              "complete_head_with_all_meta_tags_and_links",
              "complete_body_with_all_structure",
              "embedded_style_tag_with_custom_css",
              "embedded_script_tag_with_complete_javascript",
              "all_html_structure_for_all_views_and_components",
            ],

            validation_checklist: [
              "can_be_saved_as_html_file_immediately",
              "can_be_opened_in_browser_without_modification",
              "fully_functional_without_additional_files",
              "all_features_working_as_specified_in_architecture",
            ],
          },

          quality_assurance: {
            self_check_before_output: [
              "verify_all_architecture_requirements_implemented",
              "confirm_code_is_complete_not_truncated",
              "ensure_all_functions_are_fully_defined",
              "check_all_components_are_rendered",
              "validate_html_structure_is_complete",
              "confirm_no_placeholder_or_todo_code",
            ],
          },
        };

        const promptText = `You are a Senior Full-Stack Developer and UI/UX Designer with expert-level skills in modern web development.

TASK: Generate a complete, production-ready, single-file HTML web application based on the following architecture blueprint.

ARCHITECTURE BLUEPRINT:
${JSON.stringify(architecture, null, 2)}

GENERATION SPECIFICATIONS:
${JSON.stringify(codeGenerationConfig, null, 2)}

${
  attempt > 1
    ? `
⚠️ RETRY ATTEMPT #${attempt} ⚠️
Previous attempt(s) FAILED due to:
- Incomplete or truncated code
- Missing essential HTML structure  
- Insufficient functionality implementation

YOU MUST generate a COMPLETE, FULL-LENGTH HTML document with ALL features implemented.
DO NOT truncate. DO NOT leave placeholders. COMPLETE IMPLEMENTATION ONLY.
`
    : ""
}

CRITICAL OUTPUT REQUIREMENTS:
1. Start IMMEDIATELY with "<!DOCTYPE html>"
2. End with "</html>"
3. Include COMPLETE implementation of ALL features from architecture
4. NO markdown, NO explanations, NO code blocks - ONLY raw HTML
5. Self-contained: works immediately when saved as .html file
6. All CSS embedded in <style> tags
7. All JavaScript embedded in <script> tags
8. All CDN links in <head>
9. Stunning, professional UI with modern design
10. Fully responsive and accessible

Generate the complete HTML code now:`;

        // console.log("\n\nCode generation prompt:", promptText);
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

        let code = response?.text?.trim() || "";
        // console.log("\n\nGenerated code:", code);
        // console.log(`Generated code length: ${code.length} characters`);

        // Enhanced code extraction and validation
        code = extractAndValidateHTML(code, appName, attempt);

        // If we get here, the code is valid
        // console.log(`✅ Code generation successful on attempt ${attempt}`);
        return code;
      } catch (error) {
        console.error(`❌ Code generation attempt ${attempt} failed:`, error);
        lastError = error as Error;

        // If this isn't the last attempt, continue to retry
        if (attempt < maxRetries) {
          // console.log(
          //   `🔄 Retrying code generation (${attempt + 1}/${maxRetries})...`
          // );
          // Add a small delay before retry
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
          continue;
        }
      }
    }

    // If all retries failed, throw the last error
    throw new Error(
      `Failed to generate complete application code after ${maxRetries} attempts: ${
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
  temperature: number = 0.9,
  maxRetries: number = 2
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
        // console.log(`Code improvement attempt ${attempt}/${maxRetries}`);

        const config = {
          thinkingConfig: {
            thinkingBudget: -1,
          },
          temperature: temperature + (attempt - 1) * 0.1,
          topP: 0.92,
          topK: 30,
          maxOutputTokens: 32768,
          responseMimeType: "text/plain",
        };

        const model = "gemini-2.5-pro";

        // JSON-based structured prompt
        const structuredPrompt = {
          system: {
            role: "Senior Software Engineer",
            experience:
              "60 years of professional software development experience",
            expertise: [
              "Web application development",
              "Code improvement and optimization",
              "Modern web standards",
              "User experience design",
            ],
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
              requirement: "MAINTAIN ALL EXISTING FUNCTIONALITY",
              description: "Keep everything that currently works",
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
                    "No code truncation or incomplete sections",
                    "Maintain all existing functionality",
                  ],
                }
              : null,
          outputFormat: {
            requirements: [
              "Return ONLY the complete, improved HTML code",
              "Start with '<!DOCTYPE html>' and end with '</html>'",
              "Do NOT include explanations or markdown - just the complete HTML file",
            ],
            critical:
              "The returned code must be 100% complete and functional with all improvements implemented",
          },
        };

        // Convert JSON structure to formatted text prompt
        const promptText = `You are a ${structuredPrompt.system.role} with ${
          structuredPrompt.system.experience
        }, improving an existing web application.

**Application Context:**
- App Name: ${structuredPrompt.context.appName}
- App Type: ${structuredPrompt.context.appType}
- Current Status: ${structuredPrompt.context.currentStatus}
- Improvement Attempt: ${structuredPrompt.context.improvementAttempt}/${
          structuredPrompt.context.maxRetries
        }

**Current Application Code:**
"""
${structuredPrompt.inputs.existingCode}
"""

**Improvement Request:**
"${structuredPrompt.inputs.improvementRequest}"

**CRITICAL REQUIREMENTS:**
${structuredPrompt.criticalRequirements
  .map((req, idx) => `${idx + 1}. **${req.requirement}**: ${req.description}`)
  .join("\n")}

**Improvement Guidelines:**
${structuredPrompt.improvementGuidelines
  .map(
    (guide, idx) => `${idx + 1}. **${guide.guideline}**: ${guide.description}`
  )
  .join("\n")}

${
  structuredPrompt.retryInstructions
    ? `
**RETRY INSTRUCTIONS:**
${structuredPrompt.retryInstructions.message}
${structuredPrompt.retryInstructions.requirements
  .map((req) => `- ${req}`)
  .join("\n")}
`
    : ""
}

**OUTPUT FORMAT:**
${structuredPrompt.outputFormat.requirements.join("\n")}

CRITICAL: ${structuredPrompt.outputFormat.critical}`;

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

        // Extract and validate the improved code
        improvedCode = extractAndValidateHTML(improvedCode, appName, attempt);

        // Ensure improvements were actually made (code should be different)
        if (improvedCode === existingCode) {
          throw new Error("No improvements were made to the code");
        }

        // Additional validation for improvements
        if (improvedCode.length < existingCode.length * 0.8) {
          throw new Error(
            "Improved code appears to be significantly shorter than original - possible truncation"
          );
        }

        // console.log(`✅ Code improvement successful on attempt ${attempt}`);
        return improvedCode;
      } catch (error) {
        console.error(`❌ Code improvement attempt ${attempt} failed:`, error);
        lastError = error as Error;

        if (attempt < maxRetries) {
          // console.log(
          //   `🔄 Retrying code improvement (${attempt + 1}/${maxRetries})...`
          // );
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
          continue;
        }
      }
    }

    // If all retries failed, throw the last error
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
      // Not valid JSON, continue to next method
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
