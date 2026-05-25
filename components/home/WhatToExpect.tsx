import SectionHeader from "@/components/ui/SectionHeader";

const cards = [
  {
    icon: "🎵",
    title: "Worship",
    description:
      "Contemporary, Spirit-led worship that draws your heart toward God. Expect passionate, live music that's both accessible and authentic.",
  },
  {
    icon: "📖",
    title: "Message",
    description:
      "Relevant, Bible-based teaching that applies to real life. Our messages are engaging, practical, and grounded in Scripture.",
  },
  {
    icon: "👶",
    title: "Kids",
    description:
      "A safe and fun environment for children from babies through to youth. Your kids will love it — and learn about Jesus.",
  },
  {
    icon: "🤝",
    title: "Community",
    description:
      "Connect with genuine people who care about each other. We eat together, grow together, and do life together.",
  },
];

export default function WhatToExpect() {
  return (
    <section className="py-20 md:py-28 bg-navy">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <SectionHeader
            eyebrow="First time?"
            title="What to expect"
            subtitle="We want you to feel at home from the moment you walk through the door."
            center
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:bg-white/8 transition-colors"
            >
              <span className="text-3xl">{card.icon}</span>
              <div>
                <h3 className="font-display text-xl font-medium text-white mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
