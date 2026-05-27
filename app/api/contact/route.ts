import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("name" in body) ||
    !("email" in body) ||
    !("message" in body)
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { name, email, message } = body as { name: string; email: string; message: string };

  if (
    typeof name !== "string" || name.trim().length < 1 ||
    typeof email !== "string" || !email.includes("@") ||
    typeof message !== "string" || message.trim().length < 1
  ) {
    return NextResponse.json({ error: "Invalid field values" }, { status: 400 });
  }

  const to = process.env.CONTACT_EMAIL_TO;
  const apiKey = process.env.RESEND_API_KEY;
  if (!to || !apiKey) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from: "Liberty Life Perth <noreply@libertylifeperth.church>",
      to,
      replyTo: email.trim(),
      subject: `New message from ${name.trim()} via libertylifeperth.church`,
      text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to send email";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
