import { getSiteSettings } from "@/lib/sanity/queries";

export default async function Hero() {
  const settings = await getSiteSettings();

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-navy">
      {/* Video background */}
      {settings?.heroVideoMp4 && (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
        >
          {settings.heroVideoWebm && <source src={settings.heroVideoWebm} type="video/webm" />}
          <source src={settings.heroVideoMp4} type="video/mp4" />
        </video>
      )}


      {/* Circle motif background decoration */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-white/8" />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-rosegold/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-rosegold/5 blur-3xl" />
      </div>

    </section>
  );
}
