// api/threads/[threadsid]/actions/route.ts
import { openai } from "@/app/openai";
import { ToolCallOutput } from "@/lib/types";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  context: { params: Record<string, string | string[]> }
) {
  const { params } = context;
  const threadId = params.threadId as string; // Säkerställ att det är en string

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

    return new Response(stream.toReadableStream());
  } catch (error) {
    console.error("Error submitting tool outputs:", error);
    return new Response("Failed to submit tool outputs", { status: 500 });
  }
}
