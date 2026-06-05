type VerseCardProps = {
  reference: string
  text: string
}

export default function VerseCard({ reference, text }: VerseCardProps) {
  const encodedRef = encodeURIComponent(reference)
  const bibleGatewayUrl = `https://www.biblegateway.com/passage/?search=${encodedRef}&version=NIV`

  return (
    <div className="relative bg-navy border border-rosegold/20 rounded-2xl p-5 overflow-hidden">
      {/* Circle motif */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full border border-rosegold/10 pointer-events-none" />
      <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full border border-rosegold/10 pointer-events-none" />

      <p className="text-rosegold text-sm font-semibold mb-2 tracking-wide">{reference}</p>
      <p className="text-white/80 text-sm leading-relaxed italic">&ldquo;{text}&rdquo;</p>
      <a
        href={bibleGatewayUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-3 text-xs text-white/30 hover:text-rosegold transition-colors"
      >
        Read in context →
      </a>
    </div>
  )
}
