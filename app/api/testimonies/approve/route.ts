import { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { sanityWriteClient } from "@/lib/sanity/client";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const secret = request.nextUrl.searchParams.get("secret");

  if (!secret || secret !== process.env.TESTIMONY_APPROVE_SECRET) {
    return new Response(htmlPage("Unauthorized", "Invalid or missing secret."), {
      status: 401,
      headers: { "Content-Type": "text/html" },
    });
  }

  if (!id) {
    return new Response(htmlPage("Missing ID", "No testimony ID provided."), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  try {
    await sanityWriteClient.patch(id).set({ status: "published" }).commit();
    revalidateTag("testimony", { expire: 0 });

    return new Response(
      htmlPage(
        "Testimony published",
        "The testimony is now live on the website.",
        `${process.env.NEXT_PUBLIC_SITE_URL}/testimonies`,
        "View testimonies"
      ),
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (error) {
    console.error("Approve testimony error:", error);
    return new Response(
      htmlPage("Something went wrong", "Failed to approve. Try publishing via Sanity Studio."),
      { status: 500, headers: { "Content-Type": "text/html" } }
    );
  }
}

function htmlPage(heading: string, body: string, linkHref?: string, linkLabel?: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${heading}</title></head>
<body style="margin:0;padding:40px;background:#1E1B5E;font-family:Arial,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;">
  <div style="text-align:center;max-width:400px;">
    <h1 style="color:white;font-size:24px;margin:0 0 10px;">${heading}</h1>
    <p style="color:rgba(255,255,255,0.5);font-size:14px;margin:0 0 24px;">${body}</p>
    ${
      linkHref
        ? `<a href="${linkHref}" style="display:inline-block;background:#C9956A;color:white;text-decoration:none;padding:12px 24px;border-radius:999px;font-size:14px;font-weight:500;">${linkLabel}</a>`
        : ""
    }
  </div>
</body>
</html>`;
}
