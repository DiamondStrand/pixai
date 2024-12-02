import { CreateUserData, CreateUserResult, User } from "@/lib/types";
import { createClient } from "@/utils/supabase/server";

export async function createUser(
  userData: CreateUserData
): Promise<CreateUserResult> {
  const supabase = await createClient();

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

    // Check if phone number exists - updated to match email check pattern
    const { data: existingPhone, error: phoneError } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("phone_number", userData.phone);

    if (phoneError) {
      return {
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: "Error checking existing phone",
        },
      };
    }

    if (existingPhone && existingPhone.length > 0) {
      return {
        success: false,
        error: {
          code: "PHONE_EXISTS",
          message: "Phone number already exists",
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
          phone_number: userData.phone,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
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
