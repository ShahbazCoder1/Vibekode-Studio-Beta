
"use server";

import { getPaidClient, getNormalClient } from "./ai";

export async function getClientForModel(model: string) {
  const paidModels = ["gemini-3-pro", "gemini-3-pro-preview"];

  return paidModels.includes(model)
    ? await getPaidClient()
    : await getNormalClient();
}
