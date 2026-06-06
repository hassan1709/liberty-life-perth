import { getTestimonyBySlug } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : null;
}

export default async function TestimonyPage({ params }: Props) {
  const { slug } = await params;
  const testimony = await getTestimonyBySlug(slug);

  if (!testimony) notFound();

  const { title, authorName, body, image, youtubeUrl, submittedAt } = testimony;

  const formattedDate = new Date(submittedAt).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const imageUrl = image ? urlFor(image).width(1200).url() : null;
  const videoId = youtubeUrl ? getYouTubeId(youtubeUrl) : null;

  return (
    <div className="min-h-screen bg-navy">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Link
          href="/testimonies"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-10"
        >
          ← Back to testimonies
        </Link>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <div className="h-px w-6 bg-rosegold shrink-0" />
          <span className="text-xs font-medium uppercase tracking-widest text-rosegold">{authorName}</span>
          <span className="text-white/20">·</span>
          <span className="text-xs text-white/40">{formattedDate}</span>
        </div>

        <h1 className="font-display text-4xl md:text-5xl text-white mb-8 leading-tight">{title}</h1>

        {imageUrl && (
          <img src={imageUrl} alt={title} className="w-full h-auto rounded-2xl mb-8" />
        )}

        <p className="text-white/80 text-base leading-relaxed whitespace-pre-wrap mb-10">{body}</p>

        {videoId && (
          <div className="aspect-video rounded-2xl overflow-hidden bg-black/20 mb-10">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        )}

        <div className="border-t border-white/10 pt-8">
          <p className="text-white/50 text-sm mb-4">Has God done something amazing in your life too?</p>
          <Button href="/testimonies/submit">Share your testimony</Button>
        </div>
      </div>
    </div>
  );
}
