import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity/image";
import type { TestimonyDocument } from "@/lib/sanity/queries";

export default function TestimonyCard({ testimony }: { testimony: TestimonyDocument }) {
  const { title, slug, authorName, body, image, youtubeUrl, submittedAt } = testimony;

  const formattedDate = new Date(submittedAt).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const imageUrl = image ? urlFor(image).width(600).url() : null;

  return (
    <article className="bg-navy-dark border border-white/10 rounded-2xl overflow-hidden flex flex-col h-full">
      {imageUrl && (
        <div className="relative h-40 shrink-0 overflow-hidden bg-navy-dark">
          <Image src={imageUrl} alt={title} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-contain" />
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <div className="h-px w-4 bg-rosegold shrink-0" />
          <span className="text-xs text-rosegold uppercase tracking-widest">{authorName}</span>
          <span className="text-white/20 text-xs">·</span>
          <span className="text-xs text-white/40">{formattedDate}</span>
        </div>

        <h3 className="font-display text-xl text-white mb-2">{title}</h3>
        <p className="text-white/60 text-sm leading-relaxed line-clamp-4 flex-1">{body}</p>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
          {youtubeUrl ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-rosegold">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.5A3 3 0 00.5 6.2 31.6 31.6 0 000 12a31.6 31.6 0 00.5 5.8 3 3 0 002.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 002.1-2.1A31.6 31.6 0 0024 12a31.6 31.6 0 00-.5-5.8zM9.75 15.5v-7l6.25 3.5-6.25 3.5z" />
              </svg>
              Video included
            </span>
          ) : (
            <span />
          )}
          <Link
            href={`/testimonies/${slug.current}`}
            className="text-sm font-medium text-rosegold hover:text-rosegold-light transition-colors"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}
