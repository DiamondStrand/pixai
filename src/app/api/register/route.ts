import { createUser } from "@/app/api/db/createUser";
import { CreateUserData } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const userData: CreateUserData = await request.json();

    const result = await createUser({
      firstname: userData.firstname,
      lastname: userData.lastname,
      email: userData.email,
    });

    if (!result.success) {
      return new Response(
        JSON.stringify({
          message:
            result.error?.code === "EMAIL_EXISTS"
              ? "Denna e-postadress är redan registrerad. Vänligen använd en annan e-postadress."
              : "Ett fel uppstod vid registreringen. Vänligen försök igen.",
          error: true,
        }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Registrering lyckades!",
      }),
      { status: 200 }
    );
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
