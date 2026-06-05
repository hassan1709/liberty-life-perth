export type ValidationResult = {
  valid: boolean
  reason: string | null
}

export type BibleVerse = {
  reference: string
  text: string
}

export type PrayerResponse = {
  message: string
  verses: BibleVerse[]
  closing: string
}

export type AuditResult = {
  valid: boolean
  issues: string[]
}

export type PrayerRequestBody = {
  name?: string
  email?: string
  prayerRequest: string
}
