type Props = {
  eyebrow?: string;
  title: string;
  image?: string;
};

export default function PageBanner({ eyebrow = "Liberty Life Perth", title, image }: Props) {
  return (
    <div
      className="relative h-64 md:h-96 bg-navy-dark overflow-hidden"
      style={image ? { backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
    >

      {image && <div className="absolute inset-0 bg-navy/40" aria-hidden />}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute w-[700px] h-[700px] rounded-full border border-white/5" />
        <div className="absolute w-[450px] h-[450px] rounded-full border border-white/5" />
        <div className="absolute w-[220px] h-[220px] rounded-full border border-rosegold/10" />
      </div>
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-8 bg-rosegold" />
          <span className="text-xs font-medium uppercase tracking-widest text-rosegold" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}>{eyebrow}</span>
          <div className="h-px w-8 bg-rosegold" />
        </div>
        <h1 className="font-display text-5xl md:text-7xl text-white drop-shadow-md">{title}</h1>
      </div>
    </div>
  );
}
