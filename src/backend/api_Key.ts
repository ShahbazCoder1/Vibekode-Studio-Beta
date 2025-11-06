let apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

export async function getApiKey(): Promise<string> {
  if (!apiKey) {
    await rotateApiKey();
  }
  return apiKey;
}

export async function rotateApiKey(): Promise<void> {
  try {
    const response = await fetch(
      "https://keypulse-8238.onrender.com/next"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch API key");
    }
    const data = await response.json();
    apiKey = data.api_key;
  } catch (error) {
    console.error("Failed to rotate API key:", error);
    throw error;
  }
}
