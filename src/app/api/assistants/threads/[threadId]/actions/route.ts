import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/app/openai";
import { ToolCallOutput } from "@/lib/types";

export async function POST(
  request: NextRequest,
  context: { params: { threadId?: string } }
) {
  const { params } = context;
  const threadId = params.threadId;

  if (!threadId) {
    return NextResponse.json(
      { error: "Thread ID is missing" },
      { status: 400 }
    );
  }

  const {
    toolCallOutputs,
    runId,
  }: { toolCallOutputs: Omit<ToolCallOutput, "output">[]; runId: string } =
    await request.json();

  try {
    const transformedToolCallOutputs = toolCallOutputs.map((output) => ({
      ...output,
      output: output.toString(),
    }));

    const stream = openai.beta.threads.runs.submitToolOutputsStream(
      threadId,
      runId,
      { tool_outputs: transformedToolCallOutputs }
    );

    // Använd `.toReadableStream()` om stream stöder det
    const readableStream = stream.toReadableStream();

    // Returnera som en respons
    return new Response(readableStream, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error submitting tool outputs:", error);
    return NextResponse.json(
      { error: "Failed to submit tool outputs" },
      { status: 500 }
    );
  }
}
