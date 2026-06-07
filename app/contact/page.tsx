import SectionHeader from "@/components/ui/SectionHeader";
import ContactForm from "./ContactForm";
import { getSiteSettings } from "@/lib/sanity/queries";

export const revalidate = 60;

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const serviceTimeLabel = settings?.serviceTimeLabel ?? "Sunday morning";
  const serviceTime = settings?.serviceTime ?? "Sundays at 10:00 AM";
  const serviceTime2Label = settings?.serviceTime2Label ?? "Saturday (fortnightly, Spanish)";
  const serviceTime2 = settings?.serviceTime2;
  const address = settings?.address ?? "Unit 1/16 Roxby Ln, Willetton WA 6155";
  const facebook = settings?.socialLinks?.facebook ?? "https://www.facebook.com/libertylifecentre";
  const instagram = settings?.socialLinks?.instagram ?? "https://www.instagram.com/libertylifecentrewa";
  const youtube = settings?.socialLinks?.youtube ?? "https://www.youtube.com/@libertylifeperth5011";

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <SectionHeader
            eyebrow="Get in touch"
            title="Contact us"
            subtitle="We'd love to hear from you. Reach out anytime — we always respond."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <ContactForm />

          <div className="flex flex-col gap-8">
            {/* Service times */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xs font-medium uppercase tracking-widest text-rosegold mb-4">
                Service times
              </h3>
              <div className="flex flex-col gap-2 text-sm text-white/70">
                <div className="flex justify-between">
                  <span>{serviceTimeLabel}</span>
                  <span className="text-white">{serviceTime}</span>
                </div>
                {serviceTime2 && (
                  <div className="flex justify-between">
                    <span>{serviceTime2Label}</span>
                    <span className="text-white">{serviceTime2}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xs font-medium uppercase tracking-widest text-rosegold mb-4">
                Location
              </h3>
              <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">{address}</p>
              <div className="mt-4 aspect-video rounded-xl overflow-hidden">
                <iframe
                  src="https://maps.google.com/maps?q=Unit+1%2F16+Roxby+Ln%2C+Willetton+WA+6155&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Liberty Life Perth location"
                />
              </div>
            </div>

            {/* Social links */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xs font-medium uppercase tracking-widest text-rosegold mb-4">
                Follow us
              </h3>
              <div className="flex gap-5">
                <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white/60 hover:text-rosegold transition-colors">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/60 hover:text-rosegold transition-colors">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a href={youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-white/60 hover:text-rosegold transition-colors">
                  <svg width="26" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
