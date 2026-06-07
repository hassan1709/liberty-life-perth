import { sanityClient } from "./client";

export type TestimonyDocument = {
  _id: string;
  title: string;
  slug: { current: string };
  authorName: string;
  body: string;
  image?: unknown;
  youtubeUrl?: string;
  submittedAt: string;
};

export async function getTestimonies(page: number, perPage = 10): Promise<TestimonyDocument[]> {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return sanityClient.fetch(
    `*[_type == "testimony" && status == "published"] | order(submittedAt desc) [${start}...${end}] {
      _id, title, slug, authorName, body, image, youtubeUrl, submittedAt
    }`,
    {},
    { next: { tags: ["testimony"] } }
  );
}

export async function getTestimonyCount() {
  return sanityClient.fetch(
    `count(*[_type == "testimony" && status == "published"])`,
    {},
    { next: { tags: ["testimony"] } }
  );
}

export async function getTestimonyBySlug(slug: string) {
  return sanityClient.fetch(
    `*[_type == "testimony" && slug.current == $slug && status == "published"][0] {
      _id, title, slug, authorName, body, image, youtubeUrl, submittedAt
    }`,
    { slug },
    { next: { tags: ["testimony"] } }
  );
}

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

export type AnnouncementDocument = {
  _id: string;
  title: string;
  body?: unknown[];
  publishedAt: string;
  expiresAt?: string;
};

export async function getAnnouncements(): Promise<AnnouncementDocument[]> {
  return sanityClient.fetch(
    `*[_type == "announcement" && publishedAt <= now() && (expiresAt == null || expiresAt > now())] | order(publishedAt desc) {
      _id, title, body, publishedAt, expiresAt
    }`,
    {},
    { next: { tags: ["announcement"] } }
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

export type WhatToExpectCard = {
  icon?: string;
  title?: string;
  description?: string;
};

export type SiteSettings = {
  siteName?: string;
  tagline?: string;
  address?: string;
  serviceTimeLabel?: string;
  serviceTime?: string;
  serviceTime2Label?: string;
  serviceTime2?: string;
  contactEmail?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    youtubeStream?: string;
  };
  heroVideoMp4?: string;
  heroVideoWebm?: string;
  testimoniesImage?: string;
  announcementsImage?: string;
  eventsImage?: string;
  giveImage?: string;
  bankDetails?: {
    accountName?: string;
    bsb?: string;
    accountNumber?: string;
  };
  whatToExpect?: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    cards?: WhatToExpectCard[];
  };
  giveCta?: {
    eyebrow?: string;
    title?: string;
    body?: string;
  };
};

export async function getSiteSettings(): Promise<SiteSettings> {
  return sanityClient.fetch(
    `*[_type == "siteSettings"][0] {
      siteName, tagline, address, serviceTimeLabel, serviceTime, serviceTime2Label, serviceTime2, contactEmail, socialLinks,
      "heroVideoMp4": heroVideoMp4.asset->url,
      "heroVideoWebm": heroVideoWebm.asset->url,
      "testimoniesImage": testimoniesImage.asset->url,
      "announcementsImage": announcementsImage.asset->url,
      "eventsImage": eventsImage.asset->url,
      "giveImage": giveImage.asset->url,
      bankDetails,
      whatToExpect,
      giveCta
    }`,
    {},
    { next: { tags: ["siteSettings"] } }
  );
}
