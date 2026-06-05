import type { PrayerResponse } from "./types"

export const FALLBACK_RESPONSE: PrayerResponse = {
  message: "We received your prayer request and we are holding you in our hearts. You are not alone in whatever you are facing right now.",
  verses: [
    {
      reference: "Philippians 4:6-7",
      text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
    },
    {
      reference: "Psalm 34:18",
      text: "The Lord is close to the brokenhearted and saves those who are crushed in spirit.",
    },
  ],
  closing: "Our team will be praying for you personally — you are family here at Liberty Life Perth.",
}
