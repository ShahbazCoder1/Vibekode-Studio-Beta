"use server";

import { GoogleGenAI } from "@google/genai";

const apiKeyPaid = process.env.GEMINI_API_KEY_PAID!;
const apiKeyNormal = process.env.GEMINI_API_KEY_NORMAL!;

export async function getPaidClient() {
  return new GoogleGenAI({ apiKey: apiKeyPaid });
}

export async function getNormalClient() {
  return new GoogleGenAI({ apiKey: apiKeyNormal });
}

