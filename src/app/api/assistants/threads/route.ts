import { openai } from "@/app/openai";
import { createClient } from "@/utils/supabase/server";
import {
  MessageContent,
  TextContentBlock,
} from "openai/resources/beta/threads/messages.mjs";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const assistantId = process.env.NEXT_PUBLIC_OPEN_AI_ASSISTANT_ID;

  try {
    const body = await request.json();

    if (!assistantId) {
      return new Response(
        JSON.stringify({ error: "Missing Assistant ID in environment" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!body?.content) {
      return new Response(
        JSON.stringify({ error: "Missing content in request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const thread = await openai.beta.threads.create();

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: body.content,
    });

    const titleAndDescriptionResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Du är en AI som skapar tilltalande och beskrivande titlar och beskrivningar för olika sökningar. Skapa en unik och inspirerande titel och beskrivning baserat på följande innehåll. Titeln och beskrivningen ska vara kreativa men ändå relevanta och utan ord som "Titel" eller "Beskrivning". Beskrivningen ska ge en kort men fängslande sammanfattning och inte enbart upprepa innehållet.`,
        },
        {
          role: "user",
          content: `Skapa en unik och beskrivande titel och sammanfattning för följande innehåll: ${body.content}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    const responseText =
      titleAndDescriptionResponse.choices[0]?.message?.content || "";

    const lines = responseText.split("\n").filter(Boolean);
    let title = lines[0]?.replace(/^Titel:\s*/, "").trim() || "";
    let description =
      lines[1]?.replace(/^Beskrivning:\s*/, "").trim() || body.content;

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
    });

    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    while (
      runStatus.status === "queued" ||
      runStatus.status === "in_progress"
    ) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    const messages = await openai.beta.threads.messages.list(thread.id);
    const assistantResponse = messages.data.find(
      (msg) => msg.role === "assistant"
    );

    function isTextContentBlock(
      content: MessageContent
    ): content is TextContentBlock {
      return (
        "type" in content &&
        content.type === "text" &&
        "text" in content &&
        content.text !== null &&
        typeof content.text === "object" &&
        "value" in content.text
      );
    }

    let currentQuery = {};

    if (assistantResponse && assistantResponse.content) {
      try {
        const content = assistantResponse.content;
        if (Array.isArray(content)) {
          const textContent = content.find(isTextContentBlock);
          if (textContent && textContent.text.value) {
            currentQuery = JSON.parse(textContent.text.value);
          }
        } else if (isTextContentBlock(content)) {
          const textContent = content as TextContentBlock;
          currentQuery = JSON.parse(textContent.text.value);
        }
      } catch (error) {
        console.error("Error parsing assistant response as JSON:", error);
      }
    }

    const supabase = await createClient();
    const { error: insertError } = await supabase.from("search_logs").insert({
      title,
      description,
      thread_id: thread.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      current_query: currentQuery,
    });

    if (insertError) {
      console.error("Error inserting into database:", insertError);
      return new Response(JSON.stringify({ error: "Failed to save search" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        threadId: thread.id,
        assistantResponse: assistantResponse ? assistantResponse.content : null,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating thread:", error);
    return new Response(JSON.stringify({ error: "Failed to create thread" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
