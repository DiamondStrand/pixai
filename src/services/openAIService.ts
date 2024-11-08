import OpenAI from "openai";

interface SuggestedQuery {
    query?: string; // Kan vara undefined om det är en irrelevant eller olämplig sökning
    orientation?: string;
    size?: string;
    color?: string;
    isInappropriate?: boolean; // Boolean flagga för olämpligt innehåll
    isIrrelevant?: boolean; // Boolean flagga för irrelevant sökning
}

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPEN_AI_API_KEY,
});

// Funktion för att försöka rensa och tolka JSON-innehållet
function cleanAndParseJSON(jsonString: string): SuggestedQuery {
    try {
        // Försök att direkt tolka JSON
        return JSON.parse(jsonString);
    } catch (e) {
        console.error('Initial JSON parsing failed. Attempting cleanup...');

        // Rensa eventuella oönskade tecken som kan orsaka problem
        jsonString = jsonString
            .replace(/^[^{]+/, '') // Ta bort allt innan första `{`
            .replace(/[^}]+$/, ''); // Ta bort allt efter sista `}`

        try {
            return JSON.parse(jsonString);
        } catch (error) {
            console.error('Failed to parse cleaned JSON:', error);
            throw new Error('Cleaned JSON parsing failed.');
        }
    }
}

export async function generateSearchTerm(description: string): Promise<SuggestedQuery> {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are an image assistant generating search parameters for a variety of content types, including events, articles, products, and services.
                    Your goal is to produce a relevant image search query for the Pexels API, based on a given description. Your response must be in valid JSON format:
                    {
                        "query": "specific keywords that describe the visual representation accurately",
                        "orientation": "landscape, portrait, or square",
                        "size": "small, medium, or large",
                        "color": "suggest a color palette that fits the mood or setting described",
                        "isInappropriate": true/false, // Boolean indicating if the content is inappropriate (e.g., sexually explicit, violent, hateful, or contains other sensitive topics)
                        "isIrrelevant": true/false // Boolean indicating if the content is irrelevant for an image search (e.g., technical discussions, philosophical questions, etc.)
                    }
                    Focus on including elements that visually represent the specific activities, settings, artifacts, and the audience described in the content.
                    Be descriptive but concise, ensuring that the generated keywords are accurate and suitable for the type of event, product, or service described.

                    Additionally, consider the platform or intended use:
                    - If the description includes "Instagram" or "social media post", prioritize "portrait" or "square" orientation.
                    - For "YouTube thumbnails" or "video banners", prioritize "landscape".
                    - Adjust the image attributes to best fit the intended platform to improve visual impact.

                    For inappropriate content, make sure to flag it clearly with "isInappropriate": true.
                    For descriptions that are irrelevant to visual content (e.g., general questions, abstract concepts without a visual representation), set "isIrrelevant": true.`
                },
                {
                    role: "user",
                    content: `Generate the best search parameters for the following description: ${description}`,
                },
            ],
            temperature: 0.2,
            max_tokens: 200,
        });

        // Använd vår cleanAndParseJSON-funktion för att tolka resultatet
        const content = completion.choices[0]?.message?.content?.trim();
        if (!content) {
            throw new Error('No content received from OpenAI');
        }
        const parsedResponse = cleanAndParseJSON(content);

        // Returnera resultatet med de nya boolean flaggorna
        return parsedResponse as SuggestedQuery;
    } catch (error) {
        console.error('Error generating search term:', error);
        throw new Error('Failed to generate search term');
    }
}
