import { PortableText } from "@portabletext/react";
import { getAnnouncements, getSiteSettings } from "@/lib/sanity/queries";
import PageBanner from "@/components/ui/PageBanner";

export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function AnnouncementsPage() {
  const [announcements, settings] = await Promise.all([
    getAnnouncements(),
    getSiteSettings(),
  ]);

  return (
    <>
      <PageBanner title="Announcements" image={settings?.announcementsImage ?? "/announcements.png"} />

      {/* Content */}
      <section className="py-16 md:py-24 bg-navy min-h-[40vh]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {announcements.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/50 text-lg">Nothing on at the moment.</p>
              <p className="text-white/30 text-sm mt-2">Check back soon!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {announcements.map((a) => (
                <article key={a._id} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
                  <p className="text-xs font-medium uppercase tracking-widest text-rosegold mb-3">
                    {formatDate(a.publishedAt)}
                  </p>
                  <h2 className="font-display text-2xl md:text-3xl text-white mb-4">{a.title}</h2>
                  {a.body && (
                    <div className="text-white/60 leading-relaxed prose prose-invert prose-sm max-w-none">
                      <PortableText value={a.body as Parameters<typeof PortableText>[0]["value"]} />
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
