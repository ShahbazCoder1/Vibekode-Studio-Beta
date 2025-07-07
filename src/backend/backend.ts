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

      const model = "gemini-2.0-flash-lite";
      const contents: Content[] = [
        {
          role: "user",
          parts: [
            {
              text: `Create a highly brandable, memorable, and professional app name for: "${prompt}"

Requirements for the app name:
- Must be brandable and unique (not generic descriptive words)
- Should be 1-2 words maximum
- Easy to pronounce and remember
- Available as a domain name (avoid common words)
- Professional and modern sounding
- Could work as a startup/company name
- Consider using:
  * Made-up words that sound tech-savvy (like "Figma", "Notion", "Stripe")
  * Combining relevant word parts (like "Instagram", "LinkedIn", "YouTube")
  * Using modern suffixes: -ly, -fy, -io, -co, -ai, -hub, -lab, -verse
  * Avoid generic terms like "manager", "tracker", "tool", "app"

Examples of good brandable names:
- For project management: "Asana", "Trello", "Monday"
- For design: "Figma", "Canva", "Sketch"
- For communication: "Slack", "Discord", "Zoom"

Return just the name without quotes or explanation.`,
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
      console.log("\n\nGenerated app name:", appName);
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

      const model = "gemini-2.0-flash-lite";
      const responsePrompt = isImprovement
        ? `Create a friendly, conversational response to a user who has asked for improvements to their app.
    The user wants: "${prompt}"
    
    The response should:
    - Acknowledge the specific improvements they've asked for
    - Be conversational and encouraging
    - Express enthusiasm about enhancing their project
    - Mention that you'll work on implementing the requested changes
    - Keep it concise (2-4 sentences)
    - Don't use generic phrases like "I understand" or "I'll help you"
    - Don't mention that you're an AI
    
    Just provide the response text without quotation marks.`
        : `Create a friendly, conversational response to a user who has asked you to build a web application.
    The user wants: "${prompt}"
    
    The response should:
    - Acknowledge their specific app idea
    - Be conversational and enthusiastic
    - Mention that you'll create a fully functional web application based on their request
    - Include a specific detail about what makes this type of app useful or valuable
    - Keep it concise (2-4 sentences)
    - Don't use generic phrases like "I understand" or "I'll help you"
    - Don't mention that you're an AI
    
    Just provide the response text without quotation marks.`;

      const contents: Content[] = [
        {
          role: "user",
          parts: [{ text: responsePrompt }],
        },
      ];

      const response = await ai.models.generateContent({
        model,
        config,
        contents,
      });

      let message = response?.text?.trim() || "";
      console.log("\n\nGenerated message:", message);

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

// Significantly enhanced app architecture generation
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
* If any API is required, use free APIs that don't require OAuth or API keys as first priority. If no suitable free API is available, use Gemini API (https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?key="GEMINI_API_KEY") with the key "AIzaSyCmF1X0i6cIcXSeext5MwuIPiN4-oRahvI" as second priority. Only use dummy data as last resort if neither free APIs nor Gemini API are suitable for the use case.
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
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
      };

      const model = "gemini-2.5-flash";
      const contents = [
        {
          role: "user",
          parts: [
            {
              text: `"${template}" ,  I want to make a ${appIdea}. 
    The app name should be "${appName}". Fill the above template with the details for making this ${appIdea} app.
    Make sure the Project Name is set to "${appName}" in the template.
    The app will be production ready and with professional UI/UX design.`,
            },
          ],
        },
      ];

      const response = await ai.models.generateContent({
        model,
        config,
        contents,
      });

      let architecture = response?.text?.trim() || "";
      console.log("\n\nGenerated architecture:", architecture);

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
export async function getStyleInspiration(appIdea: string): Promise<string> {
  const cacheKey = createCacheKey("getStyleInspiration", appIdea);

  return executeWithDeduplication(cacheKey, async () => {
    try {
      // Fetch most popular UI design from Unsplash
      const designImageUrl = await fetchPopularUIDesign(appIdea);

      // Generate style guide using the design image
      const tools = [{ googleSearch: {} }];
      const config = {
        thinkingConfig: {
          thinkingBudget: -1,
        },
        tools,
        temperature: 0.8,
        maxOutputTokens: 4096,
        responseMimeType: "text/plain",
      };
      const model = "gemini-2.5-flash";

      const contents = [
        {
          role: "user",
          parts: [
            {
              text: `Analyze this high-quality UI design image and create detailed style guidance for a modern ${appIdea} website.

Use this image as primary inspiration along with your knowledge of current design trends to create a comprehensive style guide.

Include specifics about:
- Color palette (exact hex codes) extracted from the design and current trends
- Typography (font families, sizes, weights) that match this aesthetic
- Component styles (buttons, cards, navigation) inspired by the design
- Layout principles from the design and modern standards
- Animation suggestions that would enhance this style
- Visual motifs and design elements from the image

Format as a concise but detailed style guide for an AI code generator.`,
            },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: await getImageAsBase64(designImageUrl),
              },
            },
          ],
        },
      ];

      const response = await ai.models.generateContent({
        model,
        config,
        contents,
      });

      return (
        response?.text?.trim() ||
        `Modern design system for ${appIdea} with clean typography, accessible colors, and professional styling.`
      );
    } catch (error) {
      console.error("Error in getStyleInspiration:", error);
      return `Modern, professional design system for ${appIdea} application with clean styling and excellent user experience.`;
    }
  });
}

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
        console.log(`Code generation attempt ${attempt}/${maxRetries}`);

        const styleGuidance = await getStyleInspiration(appIdea);

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

        const model = "gemini-2.5-flash";

        // Enhanced prompt with more specific instructions for complete code
        const promptText = `Create a stunning, production-ready website based on this template: 
      "${architecture}"
      
      ${styleGuidance}Requirements:
      - Use HTML5, TailwindCSS, and modern JavaScript
      - Create a visually striking, professional UI with excellent UX
      - Implement thoughtful micro-interactions and transitions
      - Use gradients, shadows, and modern design elements
      - Ensure responsive design for all devices
      - Include animations where appropriate
      - Use semantic HTML and optimize for accessibility
      - Implement a cohesive color scheme
      - Organize code cleanly with proper comments
      - Research latest web design trends and incorporate them
      - Find inspiration from top-rated websites in this category
      
      Return ONLY the complete, working HTML code with embedded CSS and JavaScript.${
        attempt > 1
          ? `
          **RETRY INSTRUCTIONS:**
          This is retry attempt ${attempt}. The previous attempt(s) failed because:
          - Code was incomplete or truncated
          - Missing essential HTML structure
          - Insufficient functionality implementation

          Please ensure this attempt generates a COMPLETE, FULL-LENGTH HTML document with ALL features implemented.
`
          : ""
      }

        **OUTPUT FORMAT:**
        Return ONLY the complete HTML code. Start immediately with "<!DOCTYPE html>" and end with "</html>". 
        Do NOT include any explanations, markdown formatting, or code blocks - just the raw HTML code.

        CRITICAL: The response must be a complete, self-contained HTML file that can be saved and opened in a browser immediately.`;

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
        console.log("\n\nGenerated code:", code);
        console.log(`Generated code length: ${code.length} characters`);

        // Enhanced code extraction and validation
        code = extractAndValidateHTML(code, appName, attempt);

        // If we get here, the code is valid
        console.log(`✅ Code generation successful on attempt ${attempt}`);
        return code;
      } catch (error) {
        console.error(`❌ Code generation attempt ${attempt} failed:`, error);
        lastError = error as Error;

        // If this isn't the last attempt, continue to retry
        if (attempt < maxRetries) {
          console.log(
            `🔄 Retrying code generation (${attempt + 1}/${maxRetries})...`
          );
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
        console.log(`Code improvement attempt ${attempt}/${maxRetries}`);

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

        const model = "gemini-2.5-flash";

        const promptText = `You are improving an existing web application. Here's the context:

**Application Context:**
- App Name: ${appName}
- App Type: ${appIdea}
- Current Status: Existing functional application
- Improvement Attempt: ${attempt}/${maxRetries}

**Current Application Code:**
"""
${existingCode}
"""

**Improvement Request:**
"${improvementPrompt}"

**CRITICAL REQUIREMENTS:**
1. **COMPLETE HTML DOCUMENT**: Return the entire HTML document, not just changes
2. **MAINTAIN ALL EXISTING FUNCTIONALITY**: Keep everything that currently works
3. **ADD NEW FEATURES**: Implement the requested improvements fully
4. **NO TRUNCATION**: Generate the complete improved application
5. **PROPER STRUCTURE**: Maintain the existing HTML structure and organization

**Improvement Guidelines:**
1. **Maintain Context**: Keep all existing functionality that works well
2. **Enhance, Don't Replace**: Build upon the existing foundation
3. **Complete Implementation**: Every improvement must be fully functional
4. **Consistency**: Maintain the app's existing design language and patterns
5. **User Experience**: Focus on making the app more intuitive and pleasant to use
6. **Performance**: Optimize any inefficient code
7. **Modern Standards**: Apply current web development best practices
8. **Error Handling**: Add robust error handling for new features
9. **Accessibility**: Ensure all improvements are accessible
10. **Mobile Responsiveness**: Ensure improvements work on all devices

${
  attempt > 1
    ? `
**RETRY INSTRUCTIONS:**
This is retry attempt ${attempt}. The previous attempt failed. Please ensure:
- Return the COMPLETE improved HTML document
- All improvements are fully implemented
- No code truncation or incomplete sections
- Maintain all existing functionality
`
    : ""
}

**OUTPUT FORMAT:**
Return ONLY the complete, improved HTML code. Start with "<!DOCTYPE html>" and end with "</html>".
Do NOT include explanations or markdown - just the complete HTML file.

CRITICAL: The returned code must be 100% complete and functional with all improvements implemented.`;

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

        console.log(`✅ Code improvement successful on attempt ${attempt}`);
        return improvedCode;
      } catch (error) {
        console.error(`❌ Code improvement attempt ${attempt} failed:`, error);
        lastError = error as Error;

        if (attempt < maxRetries) {
          console.log(
            `🔄 Retrying code improvement (${attempt + 1}/${maxRetries})...`
          );
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

async function fetchPopularUIDesign(appIdea: string): Promise<string> {
  const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

  if (!UNSPLASH_ACCESS_KEY) {
    throw new Error("Unsplash access key not found in environment variables");
  }

  // Create search query for UI designs
  const searchQuery = `${appIdea} ui design interface dashboard website mockup`;

  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
      searchQuery
    )}&orientation=landscape&order_by=popular&per_page=1`,
    {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Unsplash API failed: ${response.statusText}`);
  }

  const data = await response.json();
  const topDesign = data.results?.[0];

  if (!topDesign?.urls) {
    throw new Error("No design images found");
  }

  // Use the highest quality image available
  return topDesign.urls.regular || topDesign.urls.small;
}

async function getImageAsBase64(imageUrl: string): Promise<string> {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  return base64;
}

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
