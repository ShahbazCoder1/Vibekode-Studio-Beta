"use server";
import { createCacheKey, executeWithDeduplication } from "./cache";
import { extractAndValidateHTML } from "./utils";
import OpenAI from "openai";
import {
  GENERATE_APP_NAME_PROMPT,
  GENERATE_MESSAGE_PROMPT,
  GENERATE_APP_ARCHITECTURE_PROMPT,
  GENERATE_CODE_PROMPT,
  GENERATE_IMPROVE_CODE_PROMPT,
  GENERATE_APP_IDEA_PROMPT,
} from "./prompts";

const XAI_API_KEY = process.env.NEXT_PUBLIC_XAI_API_KEY;

export async function generateAppIdea(): Promise<string> {
  const cacheKey = createCacheKey("generateAppIdea");

  return executeWithDeduplication(cacheKey, async () => {
    const client = new OpenAI({
      apiKey: XAI_API_KEY,
      baseURL: "https://api.x.ai/v1",
      timeout: 360000,
    });

    const completion = await client.chat.completions.create({
      model: "grok-4-1-fast-non-reasoning",
      messages: [
        {
          role: "system",
          content: GENERATE_APP_IDEA_PROMPT.system,
        },
        {
          role: "user",
          content: GENERATE_APP_IDEA_PROMPT.user,
        },
      ],
    });

    return completion.choices[0]?.message?.content?.trim() || "";
  });
}

export async function generateAppName(prompt: string): Promise<string> {
  const cacheKey = createCacheKey("generateAppName", prompt);

  return executeWithDeduplication(cacheKey, async () => {
    try {
      const client = new OpenAI({
        apiKey: XAI_API_KEY,
        baseURL: "https://api.x.ai/v1",
        timeout: 360000,
      });

      const structuredPrompt = GENERATE_APP_NAME_PROMPT(prompt);

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

      const structuredResponsePrompt = GENERATE_MESSAGE_PROMPT(
        prompt,
        isImprovement
      );

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
  appName: string
) {
  const cacheKey = createCacheKey("generateAppArchitecture", appIdea, appName);

  return executeWithDeduplication(cacheKey, async () => {
    try {
      const client = new OpenAI({
        apiKey: XAI_API_KEY,
        baseURL: "https://api.x.ai/v1",
        timeout: 360000,
      });

      const prompt = GENERATE_APP_ARCHITECTURE_PROMPT(appName, appIdea);

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
  maxRetries = 3
) {
  const cacheKey = createCacheKey(
    "generateCode",
    appIdea,
    appName,
    architecture
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

        const promptText = GENERATE_CODE_PROMPT(
          appIdea,
          architecture,
          attempt,
          maxRetries
        );

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

      const promptText = GENERATE_IMPROVE_CODE_PROMPT(
        existingCode,
        improvementPrompt,
        appName,
        appIdea,
        attempt,
        maxRetries
      );

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
