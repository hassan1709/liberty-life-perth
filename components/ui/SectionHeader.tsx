type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
};

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  center = false,
}: SectionHeaderProps) {
  return (
    <div className={`flex flex-col gap-3 ${center ? "items-center text-center" : ""}`}>
      {eyebrow && (
        <span className="text-xs font-medium uppercase tracking-widest text-rosegold">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl md:text-4xl font-medium leading-tight text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="text-white/60 text-base leading-relaxed max-w-xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
