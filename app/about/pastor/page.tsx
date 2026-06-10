import { PortableText } from "@portabletext/react";
import PageBanner from "@/components/ui/PageBanner";
import { getPastorMessagePage } from "@/lib/sanity/queries";

export const revalidate = 60;

export default async function PastorMessagePage() {
  const data = await getPastorMessagePage().catch(() => null);

  return (
    <div className="min-h-screen">
      <PageBanner eyebrow="About" title="Message from our Pastor" />

      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {data?.body ? (
            <div className="prose prose-invert max-w-none [&_p]:text-white/70 [&_p]:leading-relaxed [&_p]:mb-6 [&_h2]:font-display [&_h2]:text-white [&_h3]:font-display [&_h3]:text-white">
              <PortableText value={data.body} />
            </div>
          ) : (
            <p className="text-white/40 italic">
              No content yet. Add it in Studio under Pages → pastor-message.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
