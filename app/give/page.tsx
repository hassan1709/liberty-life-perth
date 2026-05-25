import { PortableText } from "@portabletext/react";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { getGivePage } from "@/lib/sanity/queries";

export const revalidate = false;

export default async function GivePage() {
  const page = await getGivePage().catch(() => null);

  return (
    <div className="pt-24 pb-20 min-h-screen">
      {/* Hero */}
      <section className="py-16 md:py-24 border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-1/2 right-0 translate-x-1/3 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-rosegold/10" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Generosity"
            title="Give"
            subtitle="Your generosity enables us to reach people, build community, and serve our city."
          />
        </div>
      </section>

      {/* Giving options */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {/* Online giving */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col gap-5">
              <div className="w-12 h-12 rounded-full bg-rosegold/20 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-rosegold">
                  <rect x="2" y="5" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M2 9h16" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M6 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-2xl text-white mb-2">Give online</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Give securely online through our Planning Center giving page. One-off or recurring giving available.
                </p>
              </div>
              <Button href="https://giving.planningcenteronline.com" external size="md">
                Give online
              </Button>
            </div>

            {/* Bank transfer */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col gap-5">
              <div className="w-12 h-12 rounded-full bg-rosegold/20 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-rosegold">
                  <path d="M3 8l7-5 7 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="2" y="8" width="16" height="9" rx="1" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="8" y="12" width="4" height="5" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-2xl text-white mb-2">Bank transfer</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-4">
                  Transfer directly to our church account. Use your name as the reference.
                </p>
                <div className="flex flex-col gap-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/50">Account name</span>
                    <span className="text-white">Liberty Life Perth</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">BSB</span>
                    <span className="text-white font-mono">— — —</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Account</span>
                    <span className="text-white font-mono">— — — —</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rich text from Sanity */}
          {page?.body && (
            <div className="prose prose-invert max-w-none [&_p]:text-white/70 [&_h2]:font-display [&_h2]:text-white">
              <PortableText value={page.body} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
