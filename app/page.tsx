import Hero from "@/components/home/Hero";
import ServiceBar from "@/components/home/ServiceBar";
import WhatToExpect from "@/components/home/WhatToExpect";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import GiveCta from "@/components/home/GiveCta";
import { pcFetch } from "@/lib/planningcenter/client";
import type { PCEventsResponse } from "@/lib/planningcenter/types";

export const revalidate = 3600;

async function getUpcomingEvents() {
  try {
    const data: PCEventsResponse = await pcFetch(
      "/calendar/v2/events?filter=upcoming&per_page=3&include=event_instances",
      3600
    );
    return data.data ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const events = await getUpcomingEvents();

  return (
    <>
      <Hero />
      <ServiceBar />
      <WhatToExpect />
      {events.length > 0 && <UpcomingEvents events={events} />}
      <GiveCta />
    </>
  );
}
