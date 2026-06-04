import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

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
