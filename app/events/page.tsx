import SectionHeader from "@/components/ui/SectionHeader";
import EventItem from "@/components/events/EventItem";
import { pcFetch } from "@/lib/planningcenter/client";
import type { PCEvent, PCEventsResponse } from "@/lib/planningcenter/types";

export const dynamic = "force-dynamic";

async function getEvents(): Promise<PCEvent[]> {
  try {
    const data: PCEventsResponse = await pcFetch(
      "/calendar/v2/events?filter=upcoming&per_page=20&order=starts_at",
      0
    );
    return data.data ?? [];
  } catch {
    return [];
  }
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <SectionHeader
            eyebrow="Calendar"
            title="Upcoming events"
            subtitle="Stay connected with what's happening at Liberty Life Perth."
          />
        </div>

        {events.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/50 text-lg">No upcoming events at the moment.</p>
            <p className="text-white/30 text-sm mt-2">Check back soon!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {events.map((event) => (
              <EventItem key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
