import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const { threadId } = await params;
  console.log("Fetching title and current_query for threadId:", threadId);

  if (!threadId) {
    console.warn("Thread ID saknas i params");
    return NextResponse.json({ error: "Thread ID saknas" }, { status: 400 });
  }

  try {
    const supabase = await createClient();

    const { data: searchResult, error } = await supabase
      .from("search_logs") // Changed from 'pixai_searches' to 'search_logs'
      .select("title, current_query")
      .eq("thread_id", threadId)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch search" },
        { status: 500 }
      );
    }

    if (!searchResult) {
      console.warn(`No search found for threadId: ${threadId}`);
      return NextResponse.json({ error: "Search not found" }, { status: 404 });
    }

    const { title, current_query } = searchResult;
    const queryData = current_query || {}; // Handle if current_query is null or undefined

    console.log("Found search title and current_query:", title, queryData);
    return NextResponse.json(
      { title, current_query: queryData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching search title and current_query:", error);
    return NextResponse.json(
      { error: "Failed to fetch search title and current_query" },
      { status: 500 }
    );
  }
}
