import { openai } from "@/app/openai";
import { createUser } from "@/app/api/db/createUser";
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/types/supabase";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface UserData {
  message: string;
  firstname: string | null;
  lastname: string | null;
  phone: string | null;
  email: string | null;
  termsAccepted: string | null; // Change to string to store date
}

const REGISTRATION_SCHEMA = {
  name: "registration_schema",
  schema: {
    type: "object",
    properties: {
      message: {
        type: "string",
        description:
          "Ett markdown-formaterat meddelande till användaren. Stöder rubriker (#), fet text (**), listor (- eller 1.), länkar ([text](url)), etc.",
      },
      firstname: {
        type: "string",
        description: "Användarens förnamn",
      },
      lastname: {
        type: "string",
        description: "Användarens efternamn",
      },
      phone: {
        type: "string",
        description:
          "Mobilnummer i format 07XXXXXXXX, måste vara exakt 10 siffror och börja med 07",
      },
      email: {
        type: "string",
        description: "Giltig e-postadress",
      },
      termsAccepted: {
        type: "string", // Change type to string
        description: "Datum när användaren godkände villkoren",
      },
    },
    required: ["message"],
    additionalProperties: false,
  },
};

const SYSTEM_PROMPT = `Du är en registreringsassistent som heter Maia. Samla in användaruppgifter enligt följande regler:

Använd markdown-formatering i dina svar för bättre läsbarhet:
- Använd ## för underrubriker
- Använd **fet text** för viktiga delar
- Använd - eller 1. för punktlistor
- Använd > för att markera viktiga meddelanden
- Använd [länktext](url) för länkar

1. Fråga efter information i denna ordning:
   - Förnamn och efternamn
     *Vi behöver ditt namn för att kunna identifiera dig och personalisera din upplevelse på plattformen.*
   - Mobilnummer (måste vara i format 07XXXXXXXX)
     *Vi använder ditt mobilnummer endast för att skicka viktiga meddelanden om ditt konto, såsom bekräftelse när det är aktiverat. Vi ringer inte och delar inte numret med tredje part. Inga reklamutskick kommer att göras.*
   - E-postadress
     *Din e-postadress används för kontoidentifiering och för att skicka viktiga meddelanden om din användning av tjänsten. Vi skickar inte reklam och delar inte din e-post med andra.*
   - Godkännande av villkor (MÅSTE alltid frågas explicit)
     *Vi behöver ditt godkännande för att säkerställa att du förstår hur vår tjänst fungerar och dina rättigheter som användare.*

Om användaren frågar varför vi behöver någon specifik uppgift, förklara med fokus på:
- Hur informationen används
- Säkerhet och integritet
- Att vi inte delar information med tredje part
- Att vi inte använder uppgifterna för reklam eller marknadsföring

2. Validera mobilnummer:
   - Måste börja med "07"
   - Måste innehålla exakt 10 siffror
   - Exempel: 0735123456
   - KRITISKT: Visa ALLTID hela mobilnumret i oförändrad form

3. Validera e-postadress:
   - VIKTIGT: Kontrollera ENDAST att formatet är korrekt - INTE om domänen existerar
   - En e-postadress är giltig om den följer detta format: text@text.text
   - Det enda som krävs är:
     * Minst en tecken före @
     * Ett @ tecken
     * Minst en tecken mellan @ och punkt
     * Minst en punkt efter @
     * Minst en tecken efter sista punkten
   - Stavfel i domännamn (t.ex. eample.com, gmial.com) ska INTE ses som fel
   - Det är INTE din uppgift att kontrollera om domänen existerar
   - Exempel på adresser som MÅSTE accepteras:
     * peter@eample.com (Notera stavfelet - det ska accepteras!)
     * user@gmial.com (Notera stavfelet - det ska accepteras!)
     * test@domän.se
     * namn.efternamn@företag.com
     * user_name@sub.domain.net

4. Villkor (OBLIGATORISKT):
   - Du MÅSTE alltid fråga om godkännande av villkor innan registrering
   - Användaren MÅSTE explicit svara "ja" för att godkänna
   - Om användaren inte godkänner, kan registreringen inte fortsätta
   - Fråga ALLTID om villkor även om andra uppgifter behöver korrigeras
   - Inkludera ALLTID dessa länkar när du frågar om villkor:
     * [Användarvillkor](/terms)
     * [Code of Conduct](/code-of-conduct)
     * [Cookie Policy](/cookies)

5. När alla uppgifter är insamlade OCH villkor är godkända, använd EXAKT detta format för sammanfattningen:

## Sammanfattning

**Namn:** {firstname} {lastname}
**Mobilnummer:** {phone}
**E-post:** {email}
**Villkor:** {termsAccepted ? 'Ja' : 'Nej'} // Update to reflect date acceptance

> Vi har nu registrerat dig och kommer skicka ett SMS när ditt konto är godkänt och aktiverat.

VIKTIGT: 
- Formateringen av **Namn:** måste vara EXAKT som ovan för att frontend ska kunna hitta namnet
- Mellanslag och radbrytningar måste vara exakt som i exemplet
- Ändra INTE formateringen av sammanfattningen
`;

export async function POST(request: Request) {
  try {
    const { messages }: { messages: ChatMessage[] } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      response_format: {
        type: "json_schema",
        json_schema: REGISTRATION_SCHEMA,
      },
      temperature: 0.4,
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        let buffer = "";
        let userRegistered = false;

        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              buffer += content;

              // Try to find complete JSON objects
              if (buffer.includes("}")) {
                try {
                  const jsonStr = buffer.substring(
                    buffer.lastIndexOf("{"),
                    buffer.lastIndexOf("}") + 1
                  );
                  const userData: UserData = JSON.parse(jsonStr);

                  // Update termsAccepted to current date
                  if (userData.termsAccepted) {
                    userData.termsAccepted = new Date().toISOString();
                  }

                  // Send the full userData object instead of just the message
                  controller.enqueue(
                    new TextEncoder().encode(
                      JSON.stringify({
                        message: userData.message,
                        firstname: userData.firstname,
                        lastname: userData.lastname,
                        phone: userData.phone,
                        email: userData.email,
                        termsAccepted: userData.termsAccepted,
                      })
                    )
                  );

                  if (
                    userData.termsAccepted &&
                    !userRegistered &&
                    userData.firstname &&
                    userData.lastname &&
                    userData.phone &&
                    userData.email
                  ) {
                    const result = await createUser({
                      firstname: userData.firstname,
                      lastname: userData.lastname,
                      phone: userData.phone,
                      email: userData.email,
                    });

                    if (!result.success) {
                      controller.enqueue(
                        new TextEncoder().encode(
                          JSON.stringify({
                            message:
                              result.error?.code === "EMAIL_EXISTS"
                                ? "Denna e-postadress är redan registrerad. Vänligen använd en annan e-postadress."
                                : result.error?.code === "PHONE_EXISTS"
                                ? "Detta telefonnummer är redan registrerat. Vänligen använd ett annat nummer."
                                : "Ett fel uppstod vid registreringen. Vänligen försök igen.",
                            error: true,
                          })
                        )
                      );
                      return;
                    }
                    userRegistered = true;
                  }

                  // Clear processed content from buffer
                  buffer = buffer.substring(buffer.lastIndexOf("}") + 1);
                } catch (e) {
                  // Incomplete JSON, continue collecting
                }
              }
            }
          }
        } catch (error) {
          console.error("❌ Stream error:", error);
          controller.enqueue(
            new TextEncoder().encode(
              JSON.stringify({
                message:
                  "Ett fel uppstod vid registreringen. Vänligen försök igen.",
                error: true,
              })
            )
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream);
  } catch (error) {
    console.error("❌ Error in registration API:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({
        error: "Failed to process registration",
        details: errorMessage,
        message: "Ett fel uppstod vid registreringen. Vänligen försök igen.",
      }),
      { status: 500 }
    );
  }
}
