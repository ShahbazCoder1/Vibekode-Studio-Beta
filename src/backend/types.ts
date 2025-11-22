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