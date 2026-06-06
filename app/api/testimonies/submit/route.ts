import Anthropic from "@anthropic-ai/sdk";
import nodemailer from "nodemailer";
import { sanityWriteClient } from "@/lib/sanity/client";

const MODERATION_SYSTEM = `You are a content moderation assistant for Liberty Life Perth, a Christian church.
Your only job is to determine whether a submitted testimony is appropriate to forward to the church team for review.

A genuine testimony is any personal story of faith, transformation, answered prayer, or God's work in someone's life — however simply written.

Flag as INVALID only if the submission clearly:
- Contains hate speech, slurs, or targeted abuse toward a person or group
- Is spam, gibberish, or random characters with no meaning
- Contains explicit sexual content
- Is an obvious test or joke with zero genuine intent (e.g. "test 123", "asdfasdf")
- Contains threats of violence toward a real person
- Contains profanity or swearing
- Is clearly unrelated content (advertising, political rants, etc.)

Do NOT flag as invalid:
- Testimonies that are emotionally raw or vulnerable
- Testimonies about difficult life experiences (addiction, grief, illness, trauma)
- Short testimonies (even a few sentences is fine)
- Imperfect writing, grammar, or spelling

Respond ONLY with valid JSON. No preamble, no explanation, no markdown.
Format:
{ "valid": true, "reason": null }
or
{ "valid": false, "reason": "one of: offensive_language | spam_or_gibberish | inappropriate_content | obvious_test | profanity | unrelated_content" }`

async function moderateContent(title: string, body: string): Promise<{ valid: boolean; reason: string | null }> {
  const client = new Anthropic();
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 100,
    system: MODERATION_SYSTEM,
    messages: [
      {
        role: "user",
        content: `Please evaluate this testimony submission:\n\nTitle: "${title}"\n\nTestimony: "${body}"`,
      },
    ],
  });
  const text = response.content[0].type === "text" ? response.content[0].text : "";
  return JSON.parse(text.replace(/```json\n?|```/g, "").trim());
}

async function sendTeamEmail(
  docId: string,
  name: string,
  email: string | null,
  title: string,
  body: string,
  youtubeUrl: string | null,
  hasImage: boolean
) {
  const gmailUser = process.env.CONTACT_EMAIL_FROM;
  const gmailPass = process.env.CONTACT_EMAIL_APP_PASSWORD;
  const to = process.env.CONTACT_EMAIL_TO;
  if (!gmailUser || !gmailPass || !to) return;

  const perthTime = new Date().toLocaleString("en-AU", {
    timeZone: "Australia/Perth",
    dateStyle: "full",
    timeStyle: "short",
  });

  const studioUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/studio`;

  const extras = [
    youtubeUrl ? `<p style="margin:0 0 6px;"><strong style="color:rgba(255,255,255,0.5);font-size:12px;text-transform:uppercase;letter-spacing:1px;">YouTube</strong><br><a href="${youtubeUrl}" style="color:#C9956A;">${youtubeUrl}</a></p>` : "",
    hasImage ? `<p style="margin:0;color:rgba(255,255,255,0.5);font-size:13px;">Image attached — review in Sanity Studio</p>` : "",
  ].filter(Boolean).join("");

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:20px;background:#f0f0f0;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#1E1B5E;border-radius:16px;overflow:hidden;">
    <div style="padding:28px 32px;border-bottom:1px solid rgba(255,255,255,0.1);">
      <p style="margin:0;color:rgba(255,255,255,0.5);font-size:12px;text-transform:uppercase;letter-spacing:1px;">Liberty Life Perth</p>
      <h1 style="margin:6px 0 0;color:white;font-size:20px;">New testimony pending review</h1>
    </div>

    <div style="padding:28px 32px;">
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr><td style="padding:4px 0;color:rgba(255,255,255,0.4);font-size:12px;width:60px;">Name</td><td style="padding:4px 0;color:white;font-size:14px;">${name}</td></tr>
        <tr><td style="padding:4px 0;color:rgba(255,255,255,0.4);font-size:12px;">Email</td><td style="padding:4px 0;color:white;font-size:14px;">${email || "Not provided"}</td></tr>
        <tr><td style="padding:4px 0;color:rgba(255,255,255,0.4);font-size:12px;">Time</td><td style="padding:4px 0;color:white;font-size:14px;">${perthTime}</td></tr>
      </table>

      <p style="margin:0 0 6px;color:rgba(255,255,255,0.4);font-size:12px;text-transform:uppercase;letter-spacing:1px;">Title</p>
      <p style="margin:0 0 20px;color:#C9956A;font-size:16px;font-weight:bold;">${title}</p>

      <p style="margin:0 0 6px;color:rgba(255,255,255,0.4);font-size:12px;text-transform:uppercase;letter-spacing:1px;">Testimony</p>
      <p style="margin:0 0 20px;color:rgba(255,255,255,0.85);font-size:14px;line-height:1.7;white-space:pre-wrap;">${body}</p>

      ${extras}
    </div>

    <div style="padding:24px 32px;background:rgba(0,0,0,0.2);text-align:center;">
      <a href="${studioUrl}" style="display:inline-block;background:#C9956A;color:white;text-decoration:none;padding:14px 32px;border-radius:999px;font-size:15px;font-weight:600;letter-spacing:0.3px;">Review in Studio →</a>
      <p style="margin:16px 0 0;color:rgba(255,255,255,0.3);font-size:12px;">Find the testimony, review the image, then set Status to <strong style="color:rgba(255,255,255,0.5);">published</strong></p>
    </div>
  </div>
</body>
</html>`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: gmailUser, pass: gmailPass },
  });

  await transporter.sendMail({
    from: `"Liberty Life Perth" <${gmailUser}>`,
    to,
    subject: "New testimony pending review — Liberty Life Perth",
    html,
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = (formData.get("name") as string)?.trim();
    const email = (formData.get("email") as string)?.trim() || null;
    const title = (formData.get("title") as string)?.trim();
    const body = (formData.get("body") as string)?.trim();
    const youtubeUrl = (formData.get("youtubeUrl") as string)?.trim() || null;
    const imageFile = formData.get("image") as File | null;

    if (!name || name.length < 2) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }
    if (!title || title.length < 3) {
      return Response.json({ error: "Title is required" }, { status: 400 });
    }
    if (!body || body.length < 50) {
      return Response.json({ error: "Testimony must be at least 50 characters" }, { status: 400 });
    }
    if (body.length > 20000) {
      return Response.json({ error: "Testimony must be under 20,000 characters" }, { status: 400 });
    }

    // LLM moderation
    const moderation = await moderateContent(title, body);
    if (!moderation.valid) {
      return Response.json(
        {
          error: "gentle",
          message: "Thank you for sharing. Please ensure your testimony is appropriate for our community.",
        },
        { status: 422 }
      );
    }

    // Upload image to Sanity if present (raw fetch — avoids SDK asset upload quirks)
    let imageAsset: { _id: string } | null = null;
    if (imageFile && imageFile.size > 0) {
      const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "placeholder";
      const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const uploadRes = await fetch(
        `https://${projectId}.api.sanity.io/v2024-01-01/assets/images/${dataset}?filename=${encodeURIComponent(imageFile.name || "testimony-image")}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.SANITY_WRITE_TOKEN}`,
            "Content-Type": imageFile.type || "image/jpeg",
          },
          body: buffer,
        }
      );
      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        throw new Error(`Image upload failed: ${JSON.stringify(err)}`);
      }
      const uploadData = await uploadRes.json();
      imageAsset = { _id: uploadData.document._id };
    }

    // Generate slug
    const slugBase = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60);
    const slug = `${slugBase}-${Date.now()}`;

    // Create Sanity document
    const doc = await sanityWriteClient.create({
      _type: "testimony",
      title,
      slug: { _type: "slug", current: slug },
      authorName: name,
      authorEmail: email,
      body,
      youtubeUrl: youtubeUrl || undefined,
      image: imageAsset
        ? { _type: "image", asset: { _type: "reference", _ref: imageAsset._id } }
        : undefined,
      status: "pending",
      source: "public",
      submittedAt: new Date().toISOString(),
    });

    await sendTeamEmail(doc._id, name, email, title, body, youtubeUrl, imageAsset !== null);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Testimony submission error:", error);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
