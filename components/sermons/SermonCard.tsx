import Link from "next/link";
import Image from "next/image";

type SermonCardProps = {
  sermon: {
    _id: string;
    title: string;
    slug: { current: string };
    date: string;
    scripture?: string;
    speaker?: { name: string; role: string };
    series?: { title: string; slug: { current: string }; artwork?: object };
    youtubeUrl: string;
  };
};

function getYouTubeThumb(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg` : null;
}

export default function SermonCard({ sermon }: SermonCardProps) {
  const thumb = getYouTubeThumb(sermon.youtubeUrl);
  const formattedDate = new Date(sermon.date).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link
      href={`/sermons/${sermon.slug.current}`}
      className="group flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/8 hover:border-white/20 transition-all"
    >
      <div className="aspect-video bg-navy-dark relative overflow-hidden">
        {thumb && (
          <Image
            src={thumb}
            alt={sermon.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
          <div className="w-12 h-12 rounded-full bg-rosegold/90 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
              <path d="M4 2.5l10 5.5-10 5.5V2.5z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-5">
        {sermon.series && (
          <span className="text-xs font-medium uppercase tracking-widest text-rosegold">
            {sermon.series.title}
          </span>
        )}
        <h3 className="font-display text-xl font-medium text-white leading-snug group-hover:text-rosegold-light transition-colors">
          {sermon.title}
        </h3>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/50 mt-1">
          {sermon.speaker && <span>{sermon.speaker.name}</span>}
          <span>{formattedDate}</span>
          {sermon.scripture && <span className="text-rosegold-light">{sermon.scripture}</span>}
        </div>
      </div>
    </Link>
  );
}
