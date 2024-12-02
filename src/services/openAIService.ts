import OpenAI from "openai";

interface SuggestedQuery {
  query?: string;
  orientation?: string;
  size?: string;
  color?: string;
  isInappropriate?: boolean;
  isIrrelevant?: boolean;
}

const apiKey = process.env.NEXT_PUBLIC_OPEN_AI_API_KEY;
const assistantId = process.env.NEXT_PUBLIC_OPEN_AI_ASSISTENT_ID;

if (!apiKey || !assistantId) {
  throw new Error("Missing OpenAI API key or Assistant ID.");
}

const openai = new OpenAI({
  apiKey,
});

async function main() {
  try {
    if (!assistantId) {
      throw new Error("Assistant ID is undefined.");
    }
    const pixaiAssistent = await openai.beta.assistants.retrieve(assistantId);
    console.log(pixaiAssistent);
  } catch (error) {
    console.error("Failed to retrieve assistant:", error);
  }
}

main();

function cleanAndParseJSON(jsonString: string): SuggestedQuery {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error("Initial JSON parsing failed. Attempting cleanup...");
    jsonString = jsonString.replace(/^[^{]+/, "").replace(/[^}]+$/, "");
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Failed to parse cleaned JSON:", error);
      throw new Error("Cleaned JSON parsing failed.");
    }
  }
}

export async function generateSearchTerm(
  description: string
): Promise<SuggestedQuery> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant specializing in generating image search parameters for events, articles, products, and services. Respond in JSON format:
                    {
                        "query": "keywords for image representation",
                        "orientation": "landscape, portrait or ",
                        "size": "small, medium, or large",
                        "color": "suggested color palette",
                        "isInappropriate": true/false,
                        "isIrrelevant": true/false
                    }
                    Focus on the description's visual aspects and platform requirements (e.g., portrait for Instagram, landscape for YouTube thumbnails). Flag inappropriate or irrelevant content as needed. leave orientation blank if no orientation can be applied.`,
        },
        {
          role: "user",
          content: `Generate search parameters for the following description: ${description}`,
        },
      ],
      temperature: 0.2,
      max_tokens: 200,
    });

    const content = completion.choices[0]?.message?.content?.trim();
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    const parsedResponse = cleanAndParseJSON(content);
    return parsedResponse as SuggestedQuery;
  } catch (error) {
    console.error("Error generating search term:", error);
    throw new Error("Failed to generate search term");
  }
}
