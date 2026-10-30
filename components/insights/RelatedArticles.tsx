import Link from 'next/link'

type Slug =
  | 'kereta-tanpa-wasiat'
  | 'akaun-bank-dibekukan'
  | 'grant-of-probate-vs-loa'
  | 'salah-faham-wasiat'
  | 'epf-nomination-bukan-wasiat'

const TITLES: Record<Slug, { ms: string; en: string }> = {
  'kereta-tanpa-wasiat': {
    ms: 'Tukar Nama Kereta Arwah — Ini Proses Sebenar',
    en: "Transferring a Deceased's Car — The Real Process",
  },
  'akaun-bank-dibekukan': {
    ms: 'Akaun Bank Dibekukan Bila Meninggal Dunia',
    en: 'Bank Account Frozen When Someone Dies',
  },
  'grant-of-probate-vs-loa': {
    ms: 'Grant of Probate vs Letter of Administration — Apa Bezanya?',
    en: "Grant of Probate vs Letter of Administration — What's the Difference?",
  },
  'salah-faham-wasiat': {
    ms: '5 Salah Faham Tentang Wasiat Yang Ramai Percaya',
    en: '5 Misconceptions About Wills Many People Believe',
  },
  'epf-nomination-bukan-wasiat': {
    ms: 'EPF Nomination Bukan Wasiat',
    en: 'EPF Nomination Is NOT a Will',
  },
}

interface Props {
  slugs: Slug[]
  ms: boolean
  extra?: { href: string; labelMs: string; labelEn: string }
}

export function RelatedArticles({ slugs, ms, extra }: Props) {
  return (
    <div className="mt-8 p-5 bg-slate-50 border border-slate-200 rounded-xl text-sm">
      <p className="font-semibold text-slate-800 mb-2">{ms ? 'Baca juga:' : 'Read also:'}</p>
      {slugs.map((slug, i) => (
        <Link
          key={slug}
          href={`/insights/${slug}`}
          className={`text-emerald-600 hover:underline block ${i > 0 ? 'mt-1' : ''}`}
        >
          → {ms ? TITLES[slug].ms : TITLES[slug].en}
        </Link>
      ))}
      {extra && (
        <Link href={extra.href} className="text-emerald-600 hover:underline block mt-1">
          → {ms ? extra.labelMs : extra.labelEn}
        </Link>
      )}
    </div>
  )
}
