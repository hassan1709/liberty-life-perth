"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PrayerRequestButton from "@/components/ui/PrayerRequestButton";

type NavLink = {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
};

const links: NavLink[] = [
  { href: "/", label: "Home" },
  {
    href: "/about",
    label: "About",
    children: [
      { href: "/about/pastor", label: "Message from our Pastor" },
    ],
  },
  { href: "/testimonies", label: "Testimonies" },
  { href: "/announcements", label: "Announcements" },
  { href: "/events", label: "Events" },
  { href: "/give", label: "Give" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-navy/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 overflow-visible">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-badge.png"
              alt="Liberty Life Perth"
              width={800}
              height={800}
              loading="eager"
              priority
              className="object-contain h-28 md:h-36 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) =>
              link.children ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(link.href)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={link.href}
                    onClick={(e) => {
                      if (openDropdown !== link.href) {
                        e.preventDefault();
                        setOpenDropdown(link.href);
                      } else {
                        setOpenDropdown(null);
                      }
                    }}
                    className="text-sm font-medium text-white/80 hover:text-white transition-colors flex items-center gap-2"
                  >
                    {link.label}
                    <span className="text-white/60 text-sm">▾</span>
                  </Link>
                  {openDropdown === link.href && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3">
                      <div className="bg-navy-dark border border-white/10 rounded-xl py-2 min-w-[220px] shadow-xl">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                            onClick={() => setOpenDropdown(null)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-white/80 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
            <PrayerRequestButton size="sm" />
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span
                className={`block h-0.5 bg-white transition-all origin-center ${open ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`block h-0.5 bg-white transition-all ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 bg-white transition-all origin-center ${open ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-navy-dark border-t border-white/10">
          <nav className="flex flex-col px-4 py-4 gap-4">
            {links.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  className="text-base font-medium text-white/80 hover:text-white transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className="mt-2 ml-4 flex flex-col gap-2 border-l border-white/10 pl-3">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="text-sm text-white/60 hover:text-white transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <PrayerRequestButton size="sm" />
          </nav>
        </div>
      )}
    </header>
  );
}
