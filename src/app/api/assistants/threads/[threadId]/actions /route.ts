// api/threads/[threadsid]/actions/route.ts
import { openai } from "@/app/openai";
import { RequestBody, RequestParams } from "@/lib/types";

export async function POST(
  request: Request,
  { params: { threadId } }: RequestParams
) {
  const { toolCallOutputs, runId }: RequestBody = await request.json();

  try {
    const stream = openai.beta.threads.runs.submitToolOutputsStream(
      threadId,
      runId,
      toolCallOutputs
    );

    return new Response(stream.toReadableStream());
  } catch (error) {
    console.error("Error submitting tool outputs:", error);
    return new Response("Failed to submit tool outputs", { status: 500 });
  }
}
