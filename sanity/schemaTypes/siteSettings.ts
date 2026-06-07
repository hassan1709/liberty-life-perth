import { defineType, defineField } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "siteName", title: "Site name", type: "string" }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({ name: "address", title: "Address", type: "text", rows: 3 }),
    defineField({ name: "serviceTimeLabel", title: "Service time 1 label", type: "string" }),
    defineField({ name: "serviceTime", title: "Service time 1", type: "string" }),
    defineField({ name: "serviceTime2Label", title: "Service time 2 label", type: "string" }),
    defineField({ name: "serviceTime2", title: "Service time 2", type: "string" }),
    defineField({ name: "contactEmail", title: "Contact email", type: "string" }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "object",
      fields: [
        defineField({ name: "facebook", title: "Facebook URL", type: "url" }),
        defineField({ name: "instagram", title: "Instagram URL", type: "url" }),
        defineField({ name: "youtube", title: "YouTube channel URL", type: "url" }),
        defineField({ name: "youtubeStream", title: "YouTube live stream URL", type: "url" }),
      ],
    }),
    defineField({ name: "heroVideoMp4", title: "Hero video (MP4)", type: "file", options: { accept: "video/mp4" } }),
    defineField({ name: "heroVideoWebm", title: "Hero video (WebM)", type: "file", options: { accept: "video/webm" } }),
    defineField({ name: "testimoniesImage", title: "Testimonies page banner image", type: "image" }),
    defineField({ name: "announcementsImage", title: "Announcements page banner image", type: "image" }),
    defineField({ name: "eventsImage", title: "Events page banner image", type: "image" }),
    defineField({ name: "giveImage", title: "Give page banner image", type: "image" }),
    defineField({
      name: "bankDetails",
      title: "Bank details (Give page)",
      type: "object",
      fields: [
        defineField({ name: "accountName", title: "Account name", type: "string" }),
        defineField({ name: "bsb", title: "BSB", type: "string" }),
        defineField({ name: "accountNumber", title: "Account number", type: "string" }),
      ],
    }),
    defineField({
      name: "whatToExpect",
      title: "What to Expect section",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "subtitle", title: "Subtitle", type: "string" }),
        defineField({
          name: "cards",
          title: "Cards",
          type: "array",
          of: [{
            type: "object",
            fields: [
              defineField({ name: "icon", title: "Icon (emoji)", type: "string" }),
              defineField({ name: "title", title: "Title", type: "string" }),
              defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
            ],
            preview: { select: { title: "title", subtitle: "icon" } },
          }],
        }),
      ],
    }),
    defineField({
      name: "giveCta",
      title: "Give CTA section",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "body", title: "Body text", type: "text", rows: 3 }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});
