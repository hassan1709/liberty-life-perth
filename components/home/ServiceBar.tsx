import Link from "next/link";

export default function ServiceBar() {
  return (
    <div className="bg-navy-dark border-y border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 py-4 text-sm">
          <div className="flex items-center gap-2 text-white/70">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-rosegold flex-shrink-0">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 4.5v4l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>Sundays at <strong className="text-white">10:00 AM</strong></span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-white/20" />
          <div className="flex items-center gap-2 text-white/70">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-rosegold flex-shrink-0">
              <path d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6c0 3.75 4.5 8.5 4.5 8.5S12.5 9.75 12.5 6c0-2.485-2.015-4.5-4.5-4.5z" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span>Perth, <strong className="text-white">Western Australia</strong></span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-white/20" />
          <Link
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-rosegold hover:text-rosegold-light transition-colors font-medium"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M15.6 4.2a2 2 0 0 0-1.4-1.4C12.9 2.5 8 2.5 8 2.5s-4.9 0-6.2.3A2 2 0 0 0 .4 4.2C0 5.5 0 8 0 8s0 2.5.4 3.8a2 2 0 0 0 1.4 1.4c1.3.3 6.2.3 6.2.3s4.9 0 6.2-.3a2 2 0 0 0 1.4-1.4C16 10.5 16 8 16 8s0-2.5-.4-3.8zM6.4 10.4V5.6L10.6 8 6.4 10.4z" />
            </svg>
            Watch live
          </Link>
        </div>
      </div>
    </div>
  );
}
