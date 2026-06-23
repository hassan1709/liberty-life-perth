import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import EventItem from "@/components/events/EventItem";
import type { PCEvent } from "@/lib/planningcenter/types";

export default function UpcomingEvents({ events }: { events: PCEvent[] }) {
  if (!events.length) return null;

  return (
    <section className="py-20 md:py-28 bg-navy">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <EventItem key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
