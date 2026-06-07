import { PortableText } from "@portabletext/react";
import PageBanner from "@/components/ui/PageBanner";
import { getGivePage, getSiteSettings } from "@/lib/sanity/queries";

export const revalidate = 60;

export default async function GivePage() {
  const [page, settings] = await Promise.all([
    getGivePage().catch(() => null),
    getSiteSettings(),
  ]);

  const bank = settings?.bankDetails;
  const accountName = bank?.accountName ?? "Liberty Life Centre";
  const bsb = bank?.bsb ?? "016-268";
  const accountNumber = bank?.accountNumber ?? "4956 4301 5";

  const bd = settings?.bottleDrive;
  const showBottleDrive = bd?.enabled !== false;

  return (
    <>
      <PageBanner eyebrow="Generosity" title="Give" image={settings?.giveImage ?? "/give.jpg"} />

      <section className="py-16 md:py-24 bg-navy min-h-[40vh]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
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
                    <span className="text-white">{accountName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">BSB</span>
                    <span className="text-white font-mono">{bsb}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Account</span>
                    <span className="text-white font-mono">{accountNumber}</span>
                  </div>
                </div>
              </div>
            </div>

            {showBottleDrive && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col gap-5">
                <div className="w-12 h-12 rounded-full bg-rosegold/20 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-rosegold">
                    <path d="M8 2h4v2.5c0 .5.2 1 .6 1.3L14 7.5V16a1 1 0 01-1 1H7a1 1 0 01-1-1V7.5l1.4-1.7c.4-.3.6-.8.6-1.3V2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M6 10h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-display text-2xl text-white mb-2">
                    {bd?.title ?? "Bottle drive"}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {bd?.description ?? "Bring your empty 10¢ and 20¢ refund containers to church. Every bottle counts — money collected goes directly to support a mission in India."}
                  </p>
                  <p className="text-white/40 text-xs mt-4">
                    {bd?.note ?? "Drop bottles off at church on Sundays or contact us to arrange collection."}
                  </p>
                </div>
              </div>
            )}
          </div>

          {page?.body && (
            <div className="prose prose-invert max-w-none [&_p]:text-white/70 [&_h2]:font-display [&_h2]:text-white">
              <PortableText value={page.body} />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
