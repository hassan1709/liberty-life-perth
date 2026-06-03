import Button from "@/components/ui/Button";
import PrayerRequestButton from "@/components/ui/PrayerRequestButton";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-navy">
      {/* Circle motif background decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-white/8" />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-rosegold/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-rosegold/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center gap-8 pt-24 pb-16">
        <div className="flex items-center gap-2">
          <div className="h-px w-8 bg-rosegold" />
          <span className="text-xs font-medium uppercase tracking-widest text-rosegold">
            Perth, Western Australia
          </span>
          <div className="h-px w-8 bg-rosegold" />
        </div>

        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-medium text-white leading-tight">
          A church where you&apos;re{" "}
          <span className="text-rosegold italic">not a member</span>{" "}
          but you&apos;re family
        </h1>

        <p className="text-lg text-white/60 max-w-xl leading-relaxed">
          We&apos;re a warm, welcoming community in Perth. Come as you are and find your place with us.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <PrayerRequestButton size="lg" />
          <Button href="https://www.youtube.com/@libertylifeperth5011" variant="outline" size="lg" external>
            Watch online
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="mt-8 flex flex-col items-center gap-2 text-white/30 animate-bounce">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4v12M4 10l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </section>
  );
}
