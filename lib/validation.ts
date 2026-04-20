// ─── Shared form validation utilities ────────────────────────────────────────

// ── NRIC ─────────────────────────────────────────────────────────────────────

export function cleanIC(ic: string): string {
  return ic.replace(/\D/g, '').slice(0, 12)
}

export function formatIC(ic: string): string {
  const d = cleanIC(ic)
  if (d.length <= 6)  return d
  if (d.length <= 8)  return `${d.slice(0, 6)}-${d.slice(6)}`
  if (d.length <= 12) return `${d.slice(0, 6)}-${d.slice(6, 8)}-${d.slice(8)}`
  return d
}

export function isValidIC(ic: string): boolean {
  const d = cleanIC(ic)
  if (d.length !== 12) return false

  // Validate date portion: YYMMDD
  const yy = parseInt(d.slice(0, 2), 10)
  const mm = parseInt(d.slice(2, 4), 10)
  const dd = parseInt(d.slice(4, 6), 10)

  if (mm < 1 || mm > 12) return false
  const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  if (dd < 1 || dd > daysInMonth[mm - 1]) return false

  // State code (digits 7-8): 01-16 for states, 21-59 for countries, 60-74, 82, 83, 84, 90, 98, 99
  const state = parseInt(d.slice(6, 8), 10)
  if (state === 0) return false

  return true
}

// Last digit: odd = male, even = female
export function genderFromIC(ic: string): 'male' | 'female' | null {
  const d = cleanIC(ic)
  if (d.length !== 12) return null
  return parseInt(d[11], 10) % 2 === 1 ? 'male' : 'female'
}

// DOB extracted from IC (returns Date or null)
export function dobFromIC(ic: string): Date | null {
  const d = cleanIC(ic)
  if (d.length < 6) return null
  const yy = parseInt(d.slice(0, 2), 10)
  const mm = parseInt(d.slice(2, 4), 10)
  const dd = parseInt(d.slice(4, 6), 10)
  // Assume 2000+ if yy <= current year's last 2 digits, else 1900+
  const currentYY = new Date().getFullYear() % 100
  const year = yy <= currentYY ? 2000 + yy : 1900 + yy
  const date = new Date(Date.UTC(year, mm - 1, dd))
  if (isNaN(date.getTime())) return null
  return date
}

// ── Name ─────────────────────────────────────────────────────────────────────

export function toUpperName(name: string): string {
  return name.toUpperCase()
}

// Detect gender from Malay name (bin = male, binti/binte = female)
export function genderFromName(name: string): 'male' | 'female' | null {
  const lower = name.toLowerCase()
  if (/\bbin\b/.test(lower)) return 'male'
  if (/\bbinti\b|\bbinte\b/.test(lower)) return 'female'
  return null
}

// Cross-check name gender vs IC gender — returns warning string or null
export function genderMismatchWarning(name: string, ic: string, ms: boolean): string | null {
  const nameGender = genderFromName(name)
  const icGender   = genderFromIC(ic)
  if (!nameGender || !icGender) return null
  if (nameGender !== icGender) {
    return ms
      ? `Amaran: Nama mengandungi "${nameGender === 'male' ? 'BIN' : 'BINTI'}" tetapi No. IC menunjukkan jantina ${icGender === 'male' ? 'lelaki' : 'perempuan'}. Sila semak semula.`
      : `Warning: Name contains "${nameGender === 'male' ? 'BIN' : 'BINTI'}" but IC indicates ${icGender}. Please verify.`
  }
  return null
}

// ── Passport ──────────────────────────────────────────────────────────────────
// Malaysian passports: A + 8 digits. Foreign passports vary widely (6-20 alphanumeric).

export function isValidPassport(p: string): boolean {
  const clean = p.trim().replace(/\s/g, '')
  return clean.length >= 6 && clean.length <= 20 && /^[A-Za-z0-9]+$/.test(clean)
}

// Accepts either a valid Malaysian IC or a valid passport number
export function isValidIDNumber(id: string): boolean {
  if (!id.trim()) return false
  if (isValidIC(id)) return true
  return isValidPassport(id)
}

// ── Phone ─────────────────────────────────────────────────────────────────────

export function isValidPhone(phone: string): boolean {
  return /^(\+?60|0)\d{8,10}$/.test(phone.replace(/[-\s]/g, ''))
}

// ── Faraid relationship detection ─────────────────────────────────────────────

const FARAID_KEYWORDS_MS = [
  'anak', 'anak lelaki', 'anak perempuan', 'puteri', 'putera',
  'isteri', 'suami', 'ibu', 'emak', 'mak', 'bapa', 'ayah', 'abah',
  'datuk', 'nenek', 'atuk', 'tok', 'cucu',
  'adik', 'abang', 'kakak', 'adik beradik', 'saudara',
]
const FARAID_KEYWORDS_EN = [
  'son', 'daughter', 'child', 'children',
  'wife', 'husband', 'spouse',
  'mother', 'father', 'parent',
  'grandfather', 'grandmother', 'grandchild', 'grandchildren',
  'brother', 'sister', 'sibling',
]

export function isFaraidRelationship(relationship: string): boolean {
  const lower = relationship.toLowerCase().trim()
  if (!lower) return false
  return (
    FARAID_KEYWORDS_MS.some(k => lower.includes(k)) ||
    FARAID_KEYWORDS_EN.some(k => lower.includes(k))
  )
}

export function faraidWarning(ms: boolean): string {
  return ms
    ? 'Hubungan ini adalah waris Faraid. Peruntukan 1/3 kepada waris Faraid adalah TIDAK SAH kecuali semua waris Faraid lain bersetuju secara sukarela selepas kematian pewasiat.'
    : 'This relationship is a Faraid heir. A 1/3 bequest to a Faraid heir is VOID unless all other Faraid heirs give voluntary consent after the testator\'s death.'
}
