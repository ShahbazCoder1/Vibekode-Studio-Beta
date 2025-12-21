"use server";

export async function generateMagicPrompt(): Promise<string> {
  const XAI_API_KEY = process.env.NEXT_PUBLIC_XAI_API_KEY;
  if (!XAI_API_KEY) {
    throw new Error("Missing XAI API Key");
  }

  const response = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${XAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "grok-4-1-fast-non-reasoning",
      stream: false,
      messages: [
        {
          role: "system",
          content: "You are a creative app idea generator. Your task is to come up with unique and innovative app concepts that solve real-world problems or enhance user experiences. Focus on originality, practicality, and user engagement in your ideas.",
        },
        {
          role: "user",
          content:
            "Generate a single, innovative, and concise app idea. Describe it in one continuous, conversational paragraph (100-150 words) without any special formatting. Naturally include a creative name for the app within the description.",
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content ?? "";
}
