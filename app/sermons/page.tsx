import { Suspense } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import SermonGrid from "@/components/sermons/SermonGrid";
import SeriesFilter from "@/components/sermons/SeriesFilter";
import { getAllSermons, getAllSermonSeries } from "@/lib/sanity/queries";

export const revalidate = 86400;

export default async function SermonsPage({
  searchParams,
}: {
  searchParams: Promise<{ series?: string }>;
}) {
  const params = await searchParams;
  const [sermons, allSeries] = await Promise.all([
    getAllSermons(),
    getAllSermonSeries(),
  ]);

  const filtered = params.series
    ? sermons.filter((s: { series?: { slug: { current: string } } }) =>
        s.series?.slug?.current === params.series
      )
    : sermons;

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <SectionHeader
            eyebrow="Messages"
            title="Sermons"
            subtitle="Watch or listen to our past messages."
          />
        </div>

        {allSeries.length > 0 && (
          <div className="mb-8">
            <Suspense>
              <SeriesFilter series={allSeries} />
            </Suspense>
          </div>
        )}

        <SermonGrid sermons={filtered} />
      </div>
    </div>
  );
}
