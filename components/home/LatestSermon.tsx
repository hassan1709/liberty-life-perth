import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";

type Sermon = {
  _id: string;
  title: string;
  slug: { current: string };
  date: string;
  scripture?: string;
  speaker?: { name: string; role: string };
  series?: { title: string };
  youtubeUrl: string;
};

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : null;
}

export default function LatestSermon({ sermon }: { sermon: Sermon | null }) {
  if (!sermon) {
    return null;
  }

  const videoId = getYouTubeId(sermon.youtubeUrl);
  const formattedDate = new Date(sermon.date).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="py-20 md:py-28 bg-navy-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <SectionHeader eyebrow="Latest message" title="Watch or listen" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {videoId && (
            <div className="aspect-video rounded-2xl overflow-hidden bg-black/20">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title={sermon.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          )}

          <div className="flex flex-col gap-5">
            {sermon.series && (
              <span className="text-xs font-medium uppercase tracking-widest text-rosegold">
                {sermon.series.title}
              </span>
            )}
            <h3 className="font-display text-3xl md:text-4xl font-medium text-white">
              {sermon.title}
            </h3>
            <div className="flex flex-col gap-1 text-sm text-white/60">
              {sermon.speaker && <span>{sermon.speaker.name}</span>}
              <span>{formattedDate}</span>
              {sermon.scripture && <span className="text-rosegold-light">{sermon.scripture}</span>}
            </div>
            <div className="flex gap-3 mt-2">
              <Button href={`/sermons/${sermon.slug.current}`} variant="outline">
                Sermon notes
              </Button>
              <Button href="/sermons">All sermons</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
