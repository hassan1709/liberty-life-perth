import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import type { PCEvent } from "@/lib/planningcenter/types";

function formatEventDate(startsAt: string): string {
  return new Date(startsAt).toLocaleDateString("en-AU", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatEventTime(startsAt: string): string {
  return new Date(startsAt).toLocaleTimeString("en-AU", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function UpcomingEvents({ events }: { events: PCEvent[] }) {
  if (!events.length) return null;

  return (
    <section className="py-20 md:py-28 bg-navy">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeader
            eyebrow="What's on"
            title="Upcoming events"
            subtitle="Come along and get connected."
          />
          <Button href="/events" variant="outline">
            All events
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-white/8 transition-colors"
            >
              <div className="flex-shrink-0 text-center sm:w-20">
                <div className="text-2xl font-display font-medium text-rosegold">
                  {new Date(event.attributes.starts_at).getDate()}
                </div>
                <div className="text-xs text-white/50 uppercase tracking-wide">
                  {new Date(event.attributes.starts_at).toLocaleDateString("en-AU", { month: "short" })}
                </div>
              </div>

              <div className="hidden sm:block h-10 w-px bg-white/10 flex-shrink-0" />

              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-white truncate">{event.attributes.name}</h4>
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-white/50">
                  <span>{formatEventDate(event.attributes.starts_at)} · {formatEventTime(event.attributes.starts_at)}</span>
                  {event.attributes.location && <span>{event.attributes.location}</span>}
                </div>
              </div>

              {event.attributes.registration_url && (
                <a
                  href={event.attributes.registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 text-sm font-medium text-rosegold hover:text-rosegold-light transition-colors"
                >
                  Register →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
