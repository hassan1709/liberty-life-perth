import Hero from "@/components/home/Hero";
import ServiceBar from "@/components/home/ServiceBar";
import WhatToExpect from "@/components/home/WhatToExpect";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import GiveCta from "@/components/home/GiveCta";
import { pcFetch } from "@/lib/planningcenter/client";
import { getSiteSettings } from "@/lib/sanity/queries";
import type { PCEventsResponse } from "@/lib/planningcenter/types";

export const revalidate = 3600;

async function getUpcomingEvents() {
  try {
    const data: PCEventsResponse = await pcFetch(
      "/calendar/v2/event_instances?filter=upcoming&per_page=3&order=starts_at",
      3600
    );
    return data.data ?? [];
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
