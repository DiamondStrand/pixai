import { openai } from "@/app/openai";
import { createClient } from "@/utils/supabase/server";
import { AssistantMessageContent, ThreadMessage } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const assistantId = process.env.NEXT_PUBLIC_OPEN_AI_ASSISTANT_ID;

  try {
    const body = await request.json();

    if (!assistantId) {
      return Response.json(
        { error: "Missing Assistant ID in environment" },
        { status: 400 }
      );
    }

    if (!body?.content) {
      return Response.json(
        { error: "Missing content in request body" },
        { status: 400 }
      );
    }

    const thread = await openai.beta.threads.create();

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: body.content,
    });

    // Generera en titel och beskrivning från OpenAI baserat på användarens innehåll
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

    // Extrahera och rensa svar från OpenAI
    const responseText =
      titleAndDescriptionResponse.choices[0]?.message?.content || "";

    // Separera resultat och ta bort potentiella metadata-ord som "Titel" om de förekommer
    const lines = responseText.split("\n").filter(Boolean);
    let title = "";
    let description = "";

    if (lines.length > 0) {
      title = lines[0].replace(/^Titel:\s*/, "").trim();
      description = lines[1]
        ? lines[1].replace(/^Beskrivning:\s*/, "").trim()
        : body.content;
    }

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

    // Hämta AI-svar med sökparametrar och extrahera "query" JSON
    const messages = await openai.beta.threads.messages.list(thread.id);
    const assistantResponse = messages.data.find(
      (msg) => msg.role === "assistant"
    );

    let currentQuery = {};
    if (assistantResponse && assistantResponse.content) {
      try {
        const responseContent = Array.isArray(assistantResponse.content)
          ? (assistantResponse.content as AssistantMessageContent[])[0].text
              .value
          : (assistantResponse.content as AssistantMessageContent).text.value;

        currentQuery = JSON.parse(responseContent); // Parse the JSON string to an object
      } catch (error) {
        console.error("Error parsing assistant response as JSON:", error);
      }
    }

    // Replace database insert with Supabase
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
      return Response.json({ error: "Failed to save search" }, { status: 500 });
    }

    return Response.json({
      threadId: thread.id,
      assistantResponse: assistantResponse ? assistantResponse.content : null,
    });
  } catch (error) {
    console.error("Error creating thread:", error);
    return Response.json({ error: "Failed to create thread" }, { status: 500 });
  }
}
