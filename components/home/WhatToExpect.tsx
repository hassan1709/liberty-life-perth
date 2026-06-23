import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import type { SiteSettings } from "@/lib/sanity/queries";

const DEFAULT_CARDS = [
  { icon: "__flags__", title: "Servicio en Español", description: "Fortnightly on Saturdays at 5:00 PM — a Spirit-filled service in Spanish for our Latin American community." },
  { icon: "🎵", title: "Worship", description: "Contemporary, Spirit-led worship that draws your heart toward God. Expect passionate, live music that's both accessible and authentic." },
  { icon: "📖", title: "Message", description: "Relevant, Bible-based teaching that applies to real life. Our messages are engaging, practical, and grounded in Scripture." },
  { icon: "👶", title: "Kids", description: "A safe and fun environment for children from babies through to youth. Your kids will love it — and learn about Jesus." },
  { icon: "🤝", title: "Community", description: "Connect with genuine people who care about each other. We eat together, grow together, and do life together." },
];

type Props = { settings?: SiteSettings };

export default function WhatToExpect({ settings }: Props) {
  const tagline = settings?.tagline ?? "A church where you're not a member but you're family.";
  const wte = settings?.whatToExpect;
  const eyebrow = wte?.eyebrow ?? "First time?";
  const title = wte?.title ?? "What to expect";
  const subtitle = wte?.subtitle ?? "We want you to feel at home from the moment you walk through the door.";
  const cards = wte?.cards?.length ? wte.cards : DEFAULT_CARDS;

  return (
    <section className="pt-10 pb-20 md:pt-12 md:pb-28 bg-navy">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="font-display text-3xl md:text-4xl font-medium text-white text-center mb-6">
          {tagline.split(/(not a member)/i).map((part, i) =>
            /not a member/i.test(part)
              ? <span key={i} className="text-rosegold italic">{part}</span>
              : part
          )}
        </p>

        <div className="flex items-center justify-center gap-6 mt-10 mb-16">
          {settings?.socialLinks?.facebook && (
            <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white/50 hover:text-rosegold transition-colors">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
          )}
          {settings?.socialLinks?.instagram && (
            <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/50 hover:text-rosegold transition-colors">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
          )}
          {(settings?.socialLinks?.youtube || settings?.socialLinks?.youtubeStream) && (
            <a href={settings.socialLinks?.youtube ?? settings.socialLinks?.youtubeStream} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-white/50 hover:text-rosegold transition-colors">
              <svg width="36" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
              </svg>
            </a>
          )}
        </div>

        <div className="border-t border-white/10 mb-16" />

        <div className="mb-12">
          <SectionHeader
            eyebrow={eyebrow}
            title={title}
            subtitle={subtitle}
            center
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:bg-white/8 transition-colors"
            >
              {card.icon === "__flags__" ? (
                <div className="flex items-center gap-1">
                  <Image src="/flag-australia.svg" alt="Australian flag" width={32} height={22} className="rounded-sm" />
                  <Image src="/spanish-flag.svg" alt="Spanish flag" width={32} height={22} className="rounded-sm" />
                </div>
              ) : (
                <span className="text-3xl">{card.icon}</span>
              )}
              <div>
                <h3 className="font-display text-xl font-medium text-white mb-2">{card.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
