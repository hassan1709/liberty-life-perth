import { defineType, defineField } from "sanity";

export const sermonSeries = defineType({
  name: "sermonSeries",
  title: "Sermon Series",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "artwork", title: "Artwork", type: "image", options: { hotspot: true } }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "startDate", title: "Start date", type: "date" }),
  ],
  preview: { select: { title: "title", subtitle: "startDate", media: "artwork" } },
});
