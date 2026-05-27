import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { getSermonBySlug, getAllSermons } from "@/lib/sanity/queries";
import Button from "@/components/ui/Button";

export const revalidate = 86400;

export async function generateStaticParams() {
  try {
    const sermons = await getAllSermons();
    return sermons.map((s: { slug: { current: string } }) => ({
      slug: s.slug.current,
    }));
  } catch {
    return [];
  }
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : null;
}

export default async function SermonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sermon = await getSermonBySlug(slug);

  if (!sermon) notFound();

  const videoId = getYouTubeId(sermon.youtubeUrl);
  const formattedDate = new Date(sermon.date).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/sermons"
            className="text-sm text-white/50 hover:text-white transition-colors"
          >
            ← Back to sermons
          </Link>
        </div>

        {videoId && (
          <div className="aspect-video rounded-2xl overflow-hidden bg-black mb-8">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={sermon.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        )}

        <div className="flex flex-col gap-4 mb-10">
          {sermon.series && (
            <span className="text-xs font-medium uppercase tracking-widest text-rosegold">
              {sermon.series.title}
            </span>
          )}
          <h1 className="font-display text-4xl md:text-5xl font-medium text-white">
            {sermon.title}
          </h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/60">
            {sermon.speaker && <span>{sermon.speaker.name}</span>}
            <span>{formattedDate}</span>
            {sermon.scripture && (
              <span className="text-rosegold-light">{sermon.scripture}</span>
            )}
          </div>
          {sermon.audioUrl && (
            <div className="mt-2">
              <Button href={sermon.audioUrl} variant="outline" external size="sm">
                Download audio
              </Button>
            </div>
          )}
        </div>

        {sermon.notes && (
          <div className="prose prose-invert max-w-none mb-12 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-white [&_p]:text-white/70 [&_li]:text-white/70">
            <h2 className="font-display text-2xl text-white mb-4">Sermon notes</h2>
            <PortableText value={sermon.notes} />
          </div>
        )}

        {sermon.series?._relatedSermons?.length > 0 && (
          <div className="border-t border-white/10 pt-10">
            <h3 className="font-display text-2xl text-white mb-6">
              More from this series
            </h3>
            <div className="flex flex-col gap-3">
              {sermon.series._relatedSermons
                .filter((r: { _id: string }) => r._id !== sermon._id)
                .map((related: { _id: string; title: string; slug: { current: string }; date: string }) => (
                  <Link
                    key={related._id}
                    href={`/sermons/${related.slug.current}`}
                    className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl px-5 py-4 hover:bg-white/8 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{related.title}</p>
                      <p className="text-sm text-white/50 mt-0.5">
                        {new Date(related.date).toLocaleDateString("en-AU", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <span className="text-rosegold flex-shrink-0">→</span>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
