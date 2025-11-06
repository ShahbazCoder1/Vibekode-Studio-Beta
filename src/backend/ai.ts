import { GoogleGenAI } from "@google/genai";

export function getAi(apiKey: string) {
  return new GoogleGenAI({
    apiKey: apiKey,
  });
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
