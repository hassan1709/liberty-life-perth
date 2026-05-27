import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/sermons", label: "Sermons" },
  { href: "/events", label: "Events" },
  { href: "/give", label: "Give" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="bg-navy-dark border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo-white.png"
                alt="Liberty Life Perth"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="font-display text-lg font-medium text-white">
                Liberty Life Perth
              </span>
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
              <p>Sundays at 10:00 AM</p>
              <p>Unit 1/16 Roxby Ln, Willetton WA 6155</p>
              <div className="flex gap-4 mt-3">
                <a
                  href="https://www.facebook.com/libertylifecentre"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  Facebook
                </a>
                <a
                  href="https://www.instagram.com/libertylifecentrewa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  Instagram
                </a>
                <a
                  href="https://www.youtube.com/@libertylifeperth5011"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors"
                  aria-label="YouTube"
                >
                  YouTube
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
            Unit 1/16 Roxby Ln, Willetton WA 6155
          </p>
        </div>
      </div>
    </footer>
  );
}
