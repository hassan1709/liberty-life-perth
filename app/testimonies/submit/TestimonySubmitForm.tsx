"use client";

import { useState, useRef } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function TestimonySubmitForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData();
    formData.append("name", (form.elements.namedItem("name") as HTMLInputElement).value);
    formData.append("email", (form.elements.namedItem("email") as HTMLInputElement).value);
    formData.append("title", (form.elements.namedItem("title") as HTMLInputElement).value);
    formData.append("body", (form.elements.namedItem("body") as HTMLTextAreaElement).value);
    formData.append("youtubeUrl", (form.elements.namedItem("youtubeUrl") as HTMLInputElement).value);

    const imageInput = form.elements.namedItem("image") as HTMLInputElement;
    if (imageInput.files?.[0]) {
      formData.append("image", imageInput.files[0]);
    }

    try {
      const res = await fetch("/api/testimonies/submit", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (json.error === "gentle") {
        setErrorMsg(json.message);
        setStatus("error");
        return;
      }

      if (!res.ok || !json.success) {
        setErrorMsg("Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  }

  if (status === "success") {
    return (
      <div className="bg-navy-dark border border-white/10 rounded-3xl p-10 text-center">
        <div className="w-14 h-14 rounded-full bg-rosegold/20 flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-rosegold">
            <path d="M5 12l5 5L19 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="font-display text-2xl text-white mb-2">Thank you!</h2>
        <p className="text-white/60 text-sm leading-relaxed max-w-xs mx-auto">
          Your testimony has been submitted. Our team will review it and publish it shortly.
        </p>
      </div>
    );
  }

  return (
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
        placeholder="Email (optional)"
        className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-rosegold transition-colors text-sm"
      />
      <input
        name="title"
        type="text"
        required
        minLength={3}
        placeholder="Title of your testimony"
        className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-rosegold transition-colors text-sm"
      />
      <textarea
        name="body"
        required
        minLength={50}
        maxLength={20000}
        rows={8}
        placeholder="Share your story..."
        className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-rosegold transition-colors resize-none text-sm"
      />
      <input
        name="youtubeUrl"
        type="url"
        placeholder="YouTube video URL (optional)"
        className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-rosegold transition-colors text-sm"
      />

      <div>
        <label className="block text-xs text-white/40 mb-2">Image (optional)</label>
        <input
          ref={imageInputRef}
          name="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-rosegold/20 file:text-rosegold hover:file:bg-rosegold/30 file:cursor-pointer"
        />
        {imagePreview && (
          <div className="mt-3 relative h-40 w-full rounded-xl overflow-hidden group">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => {
                setImagePreview(null);
                if (imageInputRef.current) imageInputRef.current.value = "";
              }}
              className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
              aria-label="Remove image"
            >
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {status === "error" && (
        <p className="text-sm text-red-400">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full inline-flex items-center justify-center font-medium rounded-full bg-rosegold hover:bg-rosegold-light text-white px-6 py-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-1"
      >
        {status === "loading" ? "Submitting..." : "Submit testimony"}
      </button>
    </form>
  );
}
