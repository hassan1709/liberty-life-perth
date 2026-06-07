import Button from "@/components/ui/Button";
import type { SiteSettings } from "@/lib/sanity/queries";

type Props = { settings?: SiteSettings };

export default function GiveCta({ settings }: Props) {
  const eyebrow = settings?.giveCta?.eyebrow ?? "Generosity";
  const title = settings?.giveCta?.title ?? "Make a difference through giving";
  const body = settings?.giveCta?.body ?? "Your generosity helps us reach people, grow community, and serve our city. Every gift makes an impact.";

  return (
    <section className="py-20 md:py-28 bg-navy-dark relative overflow-hidden">
      {/* Circle motif */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/5" />
        <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-rosegold/10" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-px w-8 bg-rosegold" />
          <span className="text-xs font-medium uppercase tracking-widest text-rosegold">{eyebrow}</span>
          <div className="h-px w-8 bg-rosegold" />
        </div>

        <h2 className="font-display text-4xl md:text-5xl font-medium text-white leading-tight">{title}</h2>

        <p className="text-white/60 text-base leading-relaxed max-w-md">{body}</p>

        <Button href="/give" size="lg">Give now</Button>
      </div>
    </section>
  );
}
