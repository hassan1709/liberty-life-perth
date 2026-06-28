import EventItem from "@/components/events/EventItem";
import PageBanner from "@/components/ui/PageBanner";
import { pcFetch } from "@/lib/planningcenter/client";
import { getSiteSettings } from "@/lib/sanity/queries";
import type { PCEventsResponse, PCEventWithTags, PCTag } from "@/lib/planningcenter/types";

export const dynamic = "force-dynamic";

async function getEvents(): Promise<PCEventWithTags[]> {
  try {
    const data: PCEventsResponse = await pcFetch(
      "/calendar/v2/event_instances?filter=upcoming&per_page=10&order=starts_at&include=tags",
      0
    );
    const tagMap = new Map((data.included ?? []).map((t: PCTag) => [t.id, t.attributes.name]));
    return (data.data ?? []).map((e) => ({
      ...e,
      tags: (e.relationships?.tags?.data ?? []).map((r) => tagMap.get(r.id)).filter((n): n is string => Boolean(n)),
    }));
  } catch {
    return [];
  }
}

export default async function EventsPage() {
  const [events, settings] = await Promise.all([getEvents(), getSiteSettings()]);

  return (
    <>
      <PageBanner eyebrow="Calendar" title="Upcoming Events" image={settings?.eventsImage ?? "/events.png"} />
      <section className="py-16 md:py-24 bg-navy min-h-[40vh]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {events.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/50 text-lg">Nothing on at the moment.</p>
              <p className="text-white/30 text-sm mt-2">Check back soon!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {events.map((event) => (
                <EventItem key={event.id} event={event} tags={event.tags} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
