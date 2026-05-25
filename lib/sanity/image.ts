import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "./client";

const builder = createImageUrlBuilder(sanityClient as Parameters<typeof createImageUrlBuilder>[0]);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
