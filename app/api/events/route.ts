import { NextResponse } from "next/server";
import { pcFetch } from "@/lib/planningcenter/client";
import type { PCEventsResponse } from "@/lib/planningcenter/types";

export const revalidate = 3600;

export async function GET() {
  try {
    const data: PCEventsResponse = await pcFetch(
      "/calendar/v2/events?filter=upcoming&per_page=20&order=starts_at",
      3600
    );
    return NextResponse.json(data.data ?? []);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch events";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
