import { defineType, defineField } from "sanity";

export const testimony = defineType({
  name: "testimony",
  title: "Testimony",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "authorName", title: "Author Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "authorEmail", title: "Author Email (internal only)", type: "string" }),
    defineField({ name: "body", title: "Testimony", type: "text", validation: (r) => r.required() }),
    defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "youtubeUrl", title: "YouTube URL", type: "url" }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["pending", "published", "rejected"] },
      initialValue: "published",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      options: { list: ["editor", "public"] },
      initialValue: "editor",
    }),
    defineField({ name: "submittedAt", title: "Submitted At", type: "datetime" }),
  ],
  orderings: [
    { title: "Newest first", name: "submittedAtDesc", by: [{ field: "submittedAt", direction: "desc" }] },
  ],
  preview: { select: { title: "title", subtitle: "authorName", description: "status" } },
});
