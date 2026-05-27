import SectionHeader from "@/components/ui/SectionHeader";
import ContactForm from "./ContactForm";

export const revalidate = false;

export default function ContactPage() {
  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-14">
          <SectionHeader
            eyebrow="Get in touch"
            title="Contact us"
            subtitle="We'd love to hear from you. Reach out anytime — we always respond."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact form */}
          <ContactForm />

          {/* Info panel */}
          <div className="flex flex-col gap-8">
            {/* Service times */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xs font-medium uppercase tracking-widest text-rosegold mb-4">
                Service times
              </h3>
              <div className="flex flex-col gap-2 text-sm text-white/70">
                <div className="flex justify-between">
                  <span>Sunday morning</span>
                  <span className="text-white">10:00 AM</span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xs font-medium uppercase tracking-widest text-rosegold mb-4">
                Location
              </h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Unit 1/16 Roxby Ln<br />
                Willetton WA 6155
              </p>
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
              <div className="flex gap-4">
                {[
                  { label: "Facebook", href: "https://www.facebook.com/libertylifecentre" },
                  { label: "Instagram", href: "https://www.instagram.com/libertylifecentrewa" },
                  { label: "YouTube", href: "https://www.youtube.com/@libertylifeperth5011" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
