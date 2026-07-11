import Hero from "@/components/home/Hero";
import ServiceBar from "@/components/home/ServiceBar";
import WhatToExpect from "@/components/home/WhatToExpect";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import GiveCta from "@/components/home/GiveCta";
import { pcFetch } from "@/lib/planningcenter/client";
import { getSiteSettings } from "@/lib/sanity/queries";
import type { PCEventsResponse, PCEventWithTags, PCTag } from "@/lib/planningcenter/types";

export const revalidate = 3600;

async function getUpcomingEvents(): Promise<PCEventWithTags[]> {
  try {
    const from = new Date().toISOString();
    const data: PCEventsResponse = await pcFetch(
      `/calendar/v2/event_instances?where[starts_at][gte]=${from}&per_page=3&order=starts_at&include=tags`,
      3600
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

export default async function HomePage() {
  const [events, settings] = await Promise.all([
    getUpcomingEvents(),
    getSiteSettings(),
  ]);

  return (
    <>
      <Hero />
      <ServiceBar settings={settings} />
      <WhatToExpect settings={settings} />
      {events.length > 0 && <UpcomingEvents events={events} />}
      <GiveCta settings={settings} />
    </>
  );
}
