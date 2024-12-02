import { openai } from "@/app/openai";

export const runtime = "nodejs";

// Skapa en ny assistent
export async function POST() {
  const assistant = await openai.beta.assistants.create({
    instructions: "You are an AI assistant specializing in generating image search parameters for events, articles, products, and services.",
    name: "PixAI Assistent 4o-mini",
    model: "gpt-4o-mini",
    tools: [], // Lägg till verktyg här om du vill
  });
  return Response.json({ assistantId: assistant.id });
}
