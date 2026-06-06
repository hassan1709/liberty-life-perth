import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");

  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const type = (body as { _type?: string })?._type;

  const tagMap: Record<string, string[]> = {
    sermon: ["sermon"],
    sermonSeries: ["sermonSeries"],
    staff: ["staff"],
    page: ["page"],
    siteSettings: ["siteSettings"],
    announcement: ["announcement"],
    testimony: ["testimony"],
  };

  const tags = type ? (tagMap[type] ?? ["page"]) : Object.values(tagMap).flat();

  for (const tag of tags) {
    revalidateTag(tag, { expire: 0 });
  }

  return NextResponse.json({ revalidated: true, tags });
}
