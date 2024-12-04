import { CreateUserData, CreateUserResult, User } from "@/lib/types";
import { createClient } from "@/utils/supabase/server";
import { sendDiscordNotification } from "@/utils/discord";

export async function createUser(
  userData: CreateUserData
): Promise<CreateUserResult> {
  // Add Gmail validation
  if (!userData.email.toLowerCase().endsWith("@gmail.com")) {
    return {
      success: false,
      error: {
        code: "INVALID_EMAIL",
        message: "Only Gmail addresses are accepted",
      },
    };
  }

  const supabase = await createClient();

  // Get current time with timezone information
  const now = new Date().toISOString();

  try {
    // Check if email exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("email", userData.email);

    if (checkError) {
      return {
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: "Error checking existing user",
        },
      };
    }

    if (existingUser && existingUser.length > 0) {
      return {
        success: false,
        error: {
          code: "EMAIL_EXISTS",
          message: "Email already exists",
        },
      };
    }

    // Create user
    const { data: user, error: userError } = await supabase
      .from("users")
      .insert([
        {
          email: userData.email,
          status: "pending",
          terms_accepted_at: now, // Use the timezone-aware timestamp
        },
      ])
      .select<"*", User>()
      .single();

    if (userError) {
      console.error("Error creating user:", userError);
      throw userError;
    }

    if (!user) {
      throw new Error("No user data returned after insert");
    }

    // Create user profile
    const { error: profileError } = await supabase
      .from("user_profiles")
      .insert([
        {
          id: user.id,
          first_name: userData.firstname,
          last_name: userData.lastname,
          created_at: now, // Use the same timestamp
          updated_at: now, // Use the same timestamp
        },
      ]);

    if (profileError) {
      console.error("Error creating profile:", profileError);
      // Clean up user if profile creation fails
      await supabase.from("users").delete().eq("id", user.id);

      if (profileError.code === "23505") {
        // Postgres unique constraint violation
        throw new Error("PHONE_EXISTS");
      }
      throw profileError;
    }

    // After successful user creation, send Discord notification
    await sendDiscordNotification(
      `🎉 Ny användare registrerad!\nNamn: ${userData.firstname} ${userData.lastname}\nEmail: ${userData.email}`
    );

    return {
      success: true,
      user,
    };
  } catch (error) {
    console.error("Error in createUser:", error);
    return {
      success: false,
      error: {
        code:
          error instanceof Error && error.message === "PHONE_EXISTS"
            ? "PHONE_EXISTS"
            : "DATABASE_ERROR",
        message: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
}
