"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Series = {
  _id: string;
  title: string;
  slug: { current: string };
};

export default function SeriesFilter({ series }: { series: Series[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get("series") ?? "all";

  function handleChange(value: string) {
    const url = value === "all" ? "/sermons" : `/sermons?series=${value}`;
    router.push(url);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleChange("all")}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          current === "all"
            ? "bg-rosegold text-white"
            : "bg-white/10 text-white/70 hover:bg-white/15 hover:text-white"
        }`}
      >
        All series
      </button>
      {series.map((s) => (
        <button
          key={s._id}
          onClick={() => handleChange(s.slug.current)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            current === s.slug.current
              ? "bg-rosegold text-white"
              : "bg-white/10 text-white/70 hover:bg-white/15 hover:text-white"
          }`}
        >
          {s.title}
        </button>
      ))}
    </div>
  );
}
