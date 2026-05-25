import { sanityClient } from "./client";

export async function getLatestSermon() {
  return sanityClient.fetch(
    `*[_type == "sermon"] | order(date desc) [0] {
      _id, title, slug, date, scripture,
      "speaker": speaker->{ name, role },
      "series": series->{ title, slug, artwork },
      youtubeUrl
    }`,
    {},
    { next: { tags: ["sermon"] } }
  );
}

export async function getAllSermons() {
  return sanityClient.fetch(
    `*[_type == "sermon"] | order(date desc) {
      _id, title, slug, date, scripture, tags,
      "speaker": speaker->{ name, role },
      "series": series->{ title, slug, artwork },
      youtubeUrl
    }`,
    {},
    { next: { tags: ["sermon"] } }
  );
}

export async function getSermonBySlug(slug: string) {
  return sanityClient.fetch(
    `*[_type == "sermon" && slug.current == $slug][0] {
      _id, title, slug, date, scripture, notes, tags,
      "speaker": speaker->{ name, role, photo },
      "series": series->{ title, slug, artwork, description, "_relatedSermons": *[_type == "sermon" && references(^._id)] | order(date desc) [0..3] { _id, title, slug, date } },
      youtubeUrl, audioUrl
    }`,
    { slug },
    { next: { tags: ["sermon"] } }
  );
}

export async function getAllSermonSeries() {
  return sanityClient.fetch(
    `*[_type == "sermonSeries"] | order(startDate desc) {
      _id, title, slug, artwork, description, startDate
    }`,
    {},
    { next: { tags: ["sermonSeries"] } }
  );
}

export async function getAboutPage() {
  return sanityClient.fetch(
    `{
      "page": *[_type == "page" && slug.current == "about"][0] { title, body },
      "staff": *[_type == "staff"] | order(order asc) { _id, name, role, photo, bio },
      "beliefs": *[_type == "page" && slug.current == "beliefs"][0] { body }
    }`,
    {},
    { next: { tags: ["page", "staff"] } }
  );
}

export async function getGivePage() {
  return sanityClient.fetch(
    `*[_type == "page" && slug.current == "give"][0] { title, body }`,
    {},
    { next: { tags: ["page"] } }
  );
}

export async function getSiteSettings() {
  return sanityClient.fetch(
    `*[_type == "siteSettings"][0] {
      siteName, tagline, address, serviceTime, contactEmail, socialLinks
    }`,
    {},
    { next: { tags: ["siteSettings"] } }
  );
}
