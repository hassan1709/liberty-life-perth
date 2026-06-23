import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Anthropic from "@anthropic-ai/sdk";

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

  const { name, email, message, type } = body as { name: string; email: string; message: string; type?: string };

  if (
    typeof name !== "string" || name.trim().length < 1 ||
    typeof email !== "string" || !email.includes("@") ||
    typeof message !== "string" || message.trim().length < 1
  ) {
    return NextResponse.json({ error: "Invalid field values" }, { status: 400 });
  }

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const check = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 10,
        system: `You are a content moderator for a church contact form. Respond with only "pass" or "fail".
Fail if the message is spam, abusive, offensive, or clearly not a genuine contact attempt.
Pass everything else, including complaints, criticism, or unusual requests — real people deserve a response.`,
        messages: [{ role: "user", content: `Name: ${name.trim()}\nMessage: ${message.trim()}` }],
      });
      const verdict = (check.content[0] as { text: string }).text.trim().toLowerCase();
      if (verdict === "fail") {
        return NextResponse.json({ error: "Your message could not be sent. Please try again or contact us directly." }, { status: 400 });
      }
    } catch {
      // If AI check fails, allow the message through
    }
  }

  const gmailUser = process.env.CONTACT_EMAIL_FROM;
  const gmailPass = process.env.CONTACT_EMAIL_APP_PASSWORD;
  const to = process.env.CONTACT_EMAIL_TO;

  if (!gmailUser || !gmailPass || !to) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: gmailUser, pass: gmailPass },
  });

  try {
    await transporter.sendMail({
      from: `"Liberty Life Perth" <${gmailUser}>`,
      to,
      replyTo: email.trim(),
      subject: type === "prayer"
        ? `New prayer request from ${name.trim()}`
        : `New message from ${name.trim()} via libertylifeperth.org`,
      text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\nMessage:\n${message.trim()}`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to send email";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
