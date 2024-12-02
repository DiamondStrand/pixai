import { openai } from "@/app/openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

interface RequestParams {
  params: {
    threadId: string;
  };
}

interface RequestBody {
  content: string;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const { content } = (await request.json()) as RequestBody;
    const assistantId = process.env.NEXT_PUBLIC_OPEN_AI_ASSISTANT_ID;

    if (!assistantId) {
      return new Response("Assistant ID is required", { status: 400 });
    }

    const { threadId } = await params;

    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: content,
    });

    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });

    let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    let attempts = 0;
    const maxAttempts = 60; // 30 seconds maximum wait

    while (attempts < maxAttempts) {
      if (runStatus.status === "completed") {
        const messages = await openai.beta.threads.messages.list(threadId);
        return NextResponse.json({ messages });
      }

      if (
        runStatus.status === "failed" ||
        runStatus.status === "cancelled" ||
        runStatus.status === "expired"
      ) {
        return new Response(`Run failed with status: ${runStatus.status}`, {
          status: 500,
        });
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
      attempts++;
    }

    return new Response("Request timeout", { status: 408 });
  } catch (error) {
    console.error("Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const { threadId } = await params;

    // Hämta och sortera meddelandena från äldsta till nyaste
    const messages = await openai.beta.threads.messages.list(threadId);
    const sortedMessages = messages.data.reverse(); // Sortera för att visa äldsta först

    return Response.json({ messages: sortedMessages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return new Response("Failed to fetch messages", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const { threadId } = await params;

    // Delete from OpenAI
    await openai.beta.threads.del(threadId);

    // Delete from database
    // await db
    //   .delete(searches)
    //   .where(eq(searches.threadId, threadId))
    //   .execute();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting thread:", error);
    return NextResponse.json(
      { error: "Failed to delete thread" },
      { status: 500 }
    );
  }
}
