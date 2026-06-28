import Image from "next/image";
import type { PCEvent } from "@/lib/planningcenter/types";

const KNOWN_EMBLEMS = new Set([
  "sunday_service",
  "saturday-spanish-service",
  "praying-night",
  "church-outreach",
]);

const TAG_LABELS: Record<string, string> = {
  sunday_service: "Sunday Service",
  "saturday-spanish-service": "Spanish Service",
  "praying-night": "Prayer Night",
  "church-outreach": "Church Outreach",
};

export default function EventItem({ event, tags = [] }: { event: PCEvent; tags?: string[] }) {
  const { attributes: a } = event;
  const start = new Date(a.starts_at);
  const end = a.ends_at ? new Date(a.ends_at) : null;

  const dateLabel = start.toLocaleDateString("en-AU", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const timeLabel = start.toLocaleTimeString("en-AU", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const endTimeLabel = end
    ? end.toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit", hour12: true })
    : null;

  const emblemTag = tags.find((t) => KNOWN_EMBLEMS.has(t));

  return (
    <article className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row gap-6">
      {/* Date badge — on mobile also contains the emblem opposite */}
      <div className="flex-shrink-0 flex flex-row sm:flex-col items-center justify-between sm:justify-start sm:w-16 sm:text-center gap-3 sm:gap-0">
        <div className="flex flex-row sm:flex-col items-center gap-3 sm:gap-0">
          <div className="text-3xl font-display font-medium text-rosegold sm:text-4xl">
            {start.getDate()}
          </div>
          <div className="text-xs text-white/50 uppercase tracking-wide">
            {start.toLocaleDateString("en-AU", { month: "short" })}
          </div>
        </div>
        {emblemTag && (
          <div className="sm:hidden">
            <Image
              src={`/emblems/${emblemTag}.png`}
              alt={TAG_LABELS[emblemTag] ?? emblemTag}
              width={60}
              height={60}
              className="opacity-90"
            />
          </div>
        )}
      </div>

      <div className="hidden sm:block w-px bg-white/10 self-stretch flex-shrink-0" />

      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <h3 className="font-display text-2xl font-medium text-white">{a.name}</h3>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/60">
          <span>
            {dateLabel} · {timeLabel}
            {endTimeLabel && ` – ${endTimeLabel}`}
          </span>
          {a.location && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-rosegold transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 12 12" fill="none" className="text-rosegold flex-shrink-0">
                <path
                  d="M6 1C4.067 1 2.5 2.567 2.5 4.5c0 2.813 3.5 6.5 3.5 6.5S9.5 7.313 9.5 4.5C9.5 2.567 7.933 1 6 1z"
                  stroke="currentColor" strokeWidth="1.2"
                />
                <circle cx="6" cy="4.5" r="1.2" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              {a.location}
            </a>
          )}
        </div>

        {a.description && (
          <p className="text-sm text-white/60 leading-relaxed mt-1 line-clamp-3">
            {a.description}
          </p>
        )}

        {a.registration_url && (
          <div className="mt-3">
            <a
              href={a.registration_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-rosegold hover:text-rosegold-light transition-colors"
            >
              Register for this event →
            </a>
          </div>
        )}
      </div>

      {emblemTag && (
        <div className="hidden sm:flex flex-shrink-0 items-center self-center">
          <Image
            src={`/emblems/${emblemTag}.png`}
            alt={TAG_LABELS[emblemTag] ?? emblemTag}
            width={60}
            height={60}
            className="opacity-90"
          />
        </div>
      )}
    </article>
  );
}
