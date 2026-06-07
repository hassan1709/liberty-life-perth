import { getTestimonies, getTestimonyCount, getSiteSettings, type TestimonyDocument } from "@/lib/sanity/queries";
import TestimonyCard from "@/components/testimonies/TestimonyCard";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import PageBanner from "@/components/ui/PageBanner";
import Link from "next/link";

export const dynamic = "force-dynamic";

const PER_PAGE = 12;

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function TestimoniesPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));

  const [testimonies, total, settings] = await Promise.all([
    getTestimonies(page, PER_PAGE),
    getTestimonyCount(),
    getSiteSettings(),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <>
      <PageBanner title="Testimonies" image={settings?.testimoniesImage ?? "/testimonies.png"} />

      {/* Intro + grid */}
      <section className="py-16 md:py-24 bg-navy">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <SectionHeader
              eyebrow="Stories of faith"
              title="God is at work"
              subtitle="Real stories from real people — how God has moved in our community."
            />
            <div className="shrink-0">
              <Button href="/testimonies/submit">Share your testimony</Button>
            </div>
          </div>

          {testimonies.length === 0 ? (
            <p className="text-white/40 text-center py-24 text-sm">
              No testimonies yet — be the first to share.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonies.map((t: TestimonyDocument) => (
                  <TestimonyCard key={t._id} testimony={t} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
                  {page > 1 && (
                    <Link
                      href={`/testimonies?page=${page - 1}`}
                      className="px-4 py-2 rounded-full border border-white/20 text-white/70 hover:border-white/40 hover:text-white text-sm transition-colors"
                    >
                      ← Previous
                    </Link>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/testimonies?page=${p}`}
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-colors ${
                        p === page
                          ? "bg-rosegold text-white"
                          : "border border-white/20 text-white/70 hover:border-white/40 hover:text-white"
                      }`}
                    >
                      {p}
                    </Link>
                  ))}
                  {page < totalPages && (
                    <Link
                      href={`/testimonies?page=${page + 1}`}
                      className="px-4 py-2 rounded-full border border-white/20 text-white/70 hover:border-white/40 hover:text-white text-sm transition-colors"
                    >
                      Next →
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
