import { defineType, defineField } from "sanity";

export const sermon = defineType({
  name: "sermon",
  title: "Sermon",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "speaker", title: "Speaker", type: "reference", to: [{ type: "staff" }] }),
    defineField({ name: "date", title: "Date", type: "date", validation: (r) => r.required() }),
    defineField({ name: "series", title: "Series", type: "reference", to: [{ type: "sermonSeries" }] }),
    defineField({ name: "scripture", title: "Scripture", type: "string" }),
    defineField({ name: "youtubeUrl", title: "YouTube URL", type: "url", validation: (r) => r.required() }),
    defineField({ name: "audioUrl", title: "Audio URL", type: "url" }),
    defineField({
      name: "notes",
      title: "Sermon notes",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),
    defineField({ name: "tags", title: "Tags", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
  ],
  orderings: [{ title: "Date (newest first)", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "date", description: "scripture" } },
});
