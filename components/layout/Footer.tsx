import Link from "next/link";
import Image from "next/image";
import { getSiteSettings } from "@/lib/sanity/queries";

const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Unit+1%2F16+Roxby+Ln%2C+Willetton+WA+6155";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/testimonies", label: "Testimonies" },
  { href: "/announcements", label: "Announcements" },
  { href: "/events", label: "Events" },
  { href: "/give", label: "Give" },
  { href: "/contact", label: "Contact" },
];

export default async function Footer() {
  const settings = await getSiteSettings();

  const address = settings?.address ?? "Unit 1/16 Roxby Ln, Willetton WA 6155";
  const serviceTime = settings?.serviceTime ?? "Sundays at 10:00 AM";
  const facebook = settings?.socialLinks?.facebook ?? "https://www.facebook.com/libertylifecentre";
  const instagram = settings?.socialLinks?.instagram ?? "https://www.instagram.com/libertylifecentrewa";
  const youtube = settings?.socialLinks?.youtube ?? "https://www.youtube.com/@libertylifeperth5011";

  return (
    <footer className="bg-navy-dark border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo-no-bg.png"
                alt="Liberty Life Perth"
                width={1920}
                height={1080}
                className="object-contain h-16 w-auto"
              />
            </Link>
            <p className="text-sm text-white/60 leading-relaxed">
              A church where you&apos;re not a member but you&apos;re family.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-rosegold mb-4">
              Quick links
            </h3>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Service info */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-rosegold mb-4">
              Join us
            </h3>
            <div className="flex flex-col gap-2 text-sm text-white/60">
              <p>{serviceTime}</p>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-rosegold flex-shrink-0">
                  <path d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6c0 3.75 4.5 8.5 4.5 8.5S12.5 9.75 12.5 6c0-2.485-2.015-4.5-4.5-4.5z" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                {address}
              </a>
              <div className="flex gap-4 mt-3">
                <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white/60 hover:text-rosegold transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/60 hover:text-rosegold transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a href={youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-white/60 hover:text-rosegold transition-colors">
                  <svg width="22" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Liberty Life Perth. All rights reserved.
          </p>
          <p className="text-xs text-white/40">
            {address}
          </p>
        </div>
      </div>
    </footer>
  );
}
