import { GoogleGenAI } from "@google/genai";
import { getApiKey } from "./api_Key";

let ai: GoogleGenAI;

async function initializeAI(mode: "pro" | "flash" = "flash") {
  const key = await getApiKey();
  ai = new GoogleGenAI({
    apiKey: key,
  });
}

initializeAI();

export { ai };

export async function rotateAIKey(mode: "pro" | "flash" = "flash") {
  await initializeAI(mode);
}
export interface AIConfig {
  temperature: number;
  topK: number;
  topP: number;
  maxOutputTokens: number;
  responseMimeType: string;
}

export interface ContentPart {
  text: string;
}

export interface Content {
  role: string;
  parts: ContentPart[];
}
