"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import VerseCard from "@/components/prayer/VerseCard";
import type { PrayerResponse } from "@/app/api/prayer/types";

type ModalStatus = "idle" | "loading" | "success" | "error";

type Props = {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "outline";
  className?: string;
};

const sizeClasses = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

const variantClasses = {
  primary: "bg-rosegold hover:bg-rosegold-light text-white",
  outline: "border border-white/40 hover:border-white text-white hover:bg-white/10",
};

export default function PrayerRequestButton({ size = "md", variant = "primary", className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<ModalStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [prayerData, setPrayerData] = useState<PrayerResponse | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const prayerRequest = (form.elements.namedItem("prayerRequest") as HTMLTextAreaElement).value;

    try {
      const res = await fetch("/api/prayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || undefined,
          email: email || undefined,
          prayerRequest,
        }),
      });

      const json = await res.json();

      if (json.error === "gentle" && json.message) {
        setErrorMsg(json.message);
        setStatus("error");
        return;
      }

      if (!res.ok || !json.success) {
        setErrorMsg("Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setPrayerData(json.data);
      setStatus("success");
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  function handleClose() {
    setOpen(false);
    setTimeout(() => {
      setStatus("idle");
      setErrorMsg("");
      setPrayerData(null);
    }, 300);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex items-center justify-center font-medium rounded-full transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      >
        Prayer request
      </button>

      {open && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <div
            className="relative w-full max-w-md bg-navy border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Circle motifs */}
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full border border-rosegold/10 pointer-events-none" />
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full border border-rosegold/10 pointer-events-none" />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors p-1 z-10"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            {/* ── Idle: form ── */}
            {status === "idle" && (
              <div className="p-8">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-px w-6 bg-rosegold" />
                    <span className="text-xs font-medium uppercase tracking-widest text-rosegold">Prayer</span>
                  </div>
                  <h2 className="font-display text-3xl text-white">Share your request</h2>
                  <p className="text-white/50 text-sm mt-1">We&apos;d love to pray with you.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <input
                    name="name"
                    type="text"
                    placeholder="Your name (optional)"
                    className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-rosegold transition-colors text-sm"
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email (optional) — we'll send you these verses"
                    className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-rosegold transition-colors text-sm"
                  />
                  <textarea
                    name="prayerRequest"
                    required
                    minLength={10}
                    maxLength={1000}
                    rows={4}
                    placeholder="Share what's on your heart..."
                    className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-rosegold transition-colors resize-none text-sm"
                  />
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center font-medium rounded-full transition-colors bg-rosegold hover:bg-rosegold-light text-white px-6 py-3 text-sm mt-1"
                  >
                    Send prayer request
                  </button>
                </form>
              </div>
            )}

            {/* ── Loading ── */}
            {status === "loading" && (
              <div className="flex flex-col items-center justify-center text-center gap-4 py-16 px-8">
                <div className="w-12 h-12 rounded-full border-2 border-rosegold/30 border-t-rosegold animate-spin" />
                <p className="text-white/70 text-sm">Sending your prayer request...</p>
              </div>
            )}

            {/* ── Success: AI response ── */}
            {status === "success" && prayerData && (
              <div className="p-8 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px w-6 bg-rosegold" />
                  <span className="text-xs font-medium uppercase tracking-widest text-rosegold">We&apos;re praying for you</span>
                </div>

                <p className="text-white/90 text-sm leading-relaxed mb-5">{prayerData.message}</p>

                <div className="flex flex-col gap-3 mb-5">
                  {prayerData.verses.map((verse) => (
                    <VerseCard key={verse.reference} reference={verse.reference} text={verse.text} />
                  ))}
                </div>

                <p className="text-white/70 text-sm leading-relaxed italic mb-6">{prayerData.closing}</p>

                <button
                  onClick={handleClose}
                  className="w-full inline-flex items-center justify-center font-medium rounded-full border border-white/20 hover:border-white/40 text-white/70 hover:text-white px-6 py-3 text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            )}

            {/* ── Error ── */}
            {status === "error" && (
              <div className="flex flex-col items-center text-center gap-4 py-12 px-8">
                <p className="text-white/70 text-sm leading-relaxed">{errorMsg}</p>
                <button
                  onClick={() => setStatus("idle")}
                  className="inline-flex items-center justify-center font-medium rounded-full bg-rosegold hover:bg-rosegold-light text-white px-6 py-3 text-sm transition-colors"
                >
                  Try again
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
