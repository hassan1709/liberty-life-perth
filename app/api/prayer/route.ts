import Anthropic from "@anthropic-ai/sdk"
import nodemailer from "nodemailer"
import { STAGE1_SYSTEM, STAGE2_SYSTEM, STAGE3_SYSTEM } from "./prompts"
import { FALLBACK_RESPONSE } from "./fallback"
import type { ValidationResult, PrayerResponse, AuditResult, PrayerRequestBody } from "./types"

const client = new Anthropic()

async function callHaiku<T>(systemPrompt: string, userMessage: string, maxTokens: number): Promise<T> {
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  })
  const text = response.content[0].type === "text" ? response.content[0].text : ""
  const cleaned = text.replace(/```json\n?|```/g, "").trim()
  try {
    return JSON.parse(cleaned) as T
  } catch {
    // If the response was truncated, the stop_reason will be "max_tokens"
    throw new Error(`Haiku returned malformed JSON (stop_reason: ${response.stop_reason}): ${cleaned.slice(0, 200)}`)
  }
}

async function validateInput(prayerRequest: string): Promise<ValidationResult> {
  return callHaiku<ValidationResult>(
    STAGE1_SYSTEM,
    `Please evaluate this prayer request submission:\n\n"${prayerRequest}"`,
    100
  )
}

async function generateResponse(prayerRequest: string): Promise<PrayerResponse> {
  return callHaiku<PrayerResponse>(
    STAGE2_SYSTEM,
    `Please respond to this prayer request from someone at our church:\n\n"${prayerRequest}"`,
    1024
  )
}

async function auditOutput(prayerRequest: string, response: PrayerResponse): Promise<AuditResult> {
  return callHaiku<AuditResult>(
    STAGE3_SYSTEM,
    `Original prayer request:\n"${prayerRequest}"\n\nGenerated response to audit:\n${JSON.stringify(response, null, 2)}`,
    200
  )
}

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.CONTACT_EMAIL_FROM,
      pass: process.env.CONTACT_EMAIL_APP_PASSWORD,
    },
  })
}

async function sendChurchEmail(name: string | undefined, email: string | undefined, prayerRequest: string) {
  const gmailUser = process.env.CONTACT_EMAIL_FROM
  const to = process.env.CONTACT_EMAIL_TO
  if (!gmailUser || !to || !process.env.CONTACT_EMAIL_APP_PASSWORD) return

  const perthTime = new Date().toLocaleString("en-AU", {
    timeZone: "Australia/Perth",
    dateStyle: "full",
    timeStyle: "short",
  })

  const transporter = createTransporter()
  await transporter.sendMail({
    from: `"Liberty Life Perth" <${gmailUser}>`,
    to,
    subject: "New prayer request — Liberty Life Perth",
    text: [
      "A new prayer request has been received.",
      "",
      `Name: ${name?.trim() || "Anonymous"}`,
      `Email: ${email?.trim() || "Not provided"}`,
      `Time: ${perthTime}`,
      "",
      "Prayer request:",
      prayerRequest,
    ].join("\n"),
  })
}

async function sendConfirmationEmail(name: string | undefined, email: string, response: PrayerResponse) {
  const gmailUser = process.env.CONTACT_EMAIL_FROM
  if (!gmailUser || !process.env.CONTACT_EMAIL_APP_PASSWORD) return

  const greeting = name?.trim() ? `Hi ${name.trim()},` : "Hi,"

  const versesHtml = response.verses
    .map(
      (v) => `
      <div style="background:rgba(255,255,255,0.05);border-left:3px solid #C9956A;border-radius:8px;padding:16px;margin:16px 0;">
        <p style="color:#C9956A;font-weight:bold;margin:0 0 8px;font-size:14px;">${v.reference}</p>
        <p style="color:rgba(255,255,255,0.85);font-style:italic;margin:0;font-size:14px;line-height:1.6;">"${v.text}"</p>
      </div>`
    )
    .join("")

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:20px;background:#f0f0f0;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#1E1B5E;border-radius:16px;overflow:hidden;">
    <div style="padding:32px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.1);">
      <h1 style="color:#C9956A;font-size:22px;margin:0;letter-spacing:0.5px;">Liberty Life Perth</h1>
      <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:8px 0 0;">A church where you're not a member but you're family</p>
    </div>

    <div style="padding:32px;">
      <p style="color:white;font-size:15px;margin:0 0 16px;">${greeting}</p>
      <p style="color:rgba(255,255,255,0.85);font-size:15px;line-height:1.7;margin:0 0 24px;">${response.message}</p>

      ${versesHtml}

      <p style="color:rgba(255,255,255,0.85);font-size:15px;line-height:1.7;margin:24px 0 0;">${response.closing}</p>

      <hr style="border:none;border-top:1px solid rgba(255,255,255,0.1);margin:28px 0;">

      <p style="color:rgba(255,255,255,0.6);font-size:14px;line-height:1.6;margin:0 0 12px;">
        You're welcome to join us any Sunday — we'd love to meet you in person.
      </p>
      <p style="color:rgba(255,255,255,0.4);font-size:13px;line-height:1.6;margin:0;">
        Unit 1/16 Roxby Ln, Willetton WA 6155<br>
        Sundays at 10:00am
      </p>
    </div>

    <div style="padding:16px 32px;background:rgba(0,0,0,0.2);text-align:center;">
      <p style="color:rgba(255,255,255,0.25);font-size:12px;margin:0;">libertylifeperth.org</p>
    </div>
  </div>
</body>
</html>`

  const transporter = createTransporter()
  await transporter.sendMail({
    from: `"Liberty Life Perth" <${gmailUser}>`,
    to: email.trim(),
    subject: "We're praying for you — Liberty Life Perth",
    html,
  })
}

export async function POST(request: Request) {
  try {
    const body: PrayerRequestBody = await request.json()
    const { name, email, prayerRequest } = body

    if (!prayerRequest || typeof prayerRequest !== "string") {
      return Response.json({ error: "Prayer request is required" }, { status: 400 })
    }
    const trimmed = prayerRequest.trim()
    if (trimmed.length < 10 || trimmed.length > 1000) {
      return Response.json(
        { error: "Prayer request must be between 10 and 1000 characters" },
        { status: 400 }
      )
    }

    // Stage 1 — validate input
    const inputValidation = await validateInput(trimmed)
    if (!inputValidation.valid) {
      return Response.json(
        {
          error: "gentle",
          message: "Please share your prayer request with us and we'll be happy to pray with you.",
        },
        { status: 422 }
      )
    }

    // Stage 2 + 3 — generate and audit, retry once
    let prayerResponse: PrayerResponse
    let audit: AuditResult
    let attempts = 0

    do {
      prayerResponse = await generateResponse(trimmed)
      audit = await auditOutput(trimmed, prayerResponse)
      attempts++
    } while (!audit.valid && attempts < 2)

    const finalResponse = audit.valid ? prayerResponse : FALLBACK_RESPONSE

    // Send emails in parallel, don't block the response on failures
    await Promise.all([
      sendChurchEmail(name, email, trimmed).catch((err) =>
        console.error("Church email failed:", err)
      ),
      email
        ? sendConfirmationEmail(name, email, finalResponse).catch((err) =>
            console.error("Confirmation email failed:", err)
          )
        : Promise.resolve(),
    ])

    return Response.json({ success: true, data: finalResponse })
  } catch (error) {
    console.error("Prayer request error:", error)
    return Response.json({ success: true, data: FALLBACK_RESPONSE })
  }
}
