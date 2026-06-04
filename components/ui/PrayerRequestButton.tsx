"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

type Status = "idle" | "loading" | "success" | "error";

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
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, type: "prayer" }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? "Something went wrong");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  function handleClose() {
    setOpen(false);
    setTimeout(() => setStatus("idle"), 300);
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
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal */}
          <div
            className="relative w-full max-w-md bg-navy border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Circle motif */}
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full border border-rosegold/10 pointer-events-none" />
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full border border-rosegold/10 pointer-events-none" />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors p-1"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            {status === "success" ? (
              <div className="flex flex-col items-center text-center gap-4 py-6">
                <div className="w-14 h-14 rounded-full bg-rosegold/20 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-rosegold">
                    <path d="M5 12l5 5L19 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="font-display text-2xl text-white">We&apos;re praying for you</h3>
                <p className="text-white/60 text-sm">Your prayer request has been received. Our team will be lifting you up in prayer.</p>
                <button
                  onClick={handleClose}
                  className="mt-2 text-sm text-rosegold hover:text-rosegold-light transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
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
                    required
                    minLength={2}
                    placeholder="Your name"
                    className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-rosegold transition-colors text-sm"
                  />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Email address"
                    className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-rosegold transition-colors text-sm"
                  />
                  <textarea
                    name="message"
                    required
                    minLength={10}
                    rows={4}
                    placeholder="Share your prayer request…"
                    className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-rosegold transition-colors resize-none text-sm"
                  />

                  {status === "error" && (
                    <p className="text-sm text-red-400">{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full inline-flex items-center justify-center font-medium rounded-full transition-colors bg-rosegold hover:bg-rosegold-light text-white px-6 py-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                  >
                    {status === "loading" ? "Sending…" : "Send prayer request"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
