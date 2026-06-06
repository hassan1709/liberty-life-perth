import TestimonySubmitForm from "./TestimonySubmitForm";
import Link from "next/link";

export default function SubmitTestimonyPage() {
  return (
    <div className="min-h-screen bg-navy py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/testimonies"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-10"
        >
          ← Back to testimonies
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px w-6 bg-rosegold" />
            <span className="text-xs font-medium uppercase tracking-widest text-rosegold">Testimonies</span>
          </div>
          <h1 className="font-display text-4xl text-white mb-2">Share your testimony</h1>
          <p className="text-white/50 text-sm">
            Your story of faith encourages others. We&apos;d love to hear it.
          </p>
        </div>

        <TestimonySubmitForm />
      </div>
    </div>
  );
}
