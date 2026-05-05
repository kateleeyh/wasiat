import { cookies } from 'next/headers'
import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Grant of Probate vs Letter of Administration — Apa Bezanya?',
  description: 'Dua dokumen mahkamah yang diperlukan untuk mengurus harta pusaka di Malaysia. Ketahui perbezaan, proses, kos, dan masa untuk setiap satu.',
}

export default async function Article() {
  const cookieStore = await cookies()
  const ms = (cookieStore.get('locale')?.value ?? 'ms') === 'ms'

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-900 pt-16 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <Link href="/insights" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {ms ? 'Kembali ke Insights' : 'Back to Insights'}
          </Link>
          <span className="bg-blue-500/20 text-blue-300 text-xs font-bold px-3 py-1 rounded-full">
            {ms ? 'Panduan Undang-undang' : 'Legal Guide'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-4 leading-tight">
            {ms
              ? 'Grant of Probate vs Letter of Administration — Apa Bezanya dan Mana Satu Anda Perlukan?'
              : 'Grant of Probate vs Letter of Administration — What\'s the Difference?'}
          </h1>
          <p className="text-slate-400 text-sm mt-3">
            {ms ? '1 Mei 2026 · 5 minit bacaan' : '1 May 2026 · 5 min read'}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-slate-700 text-sm leading-relaxed space-y-6">

          <p>
            {ms
              ? 'Apabila seseorang meninggal dunia di Malaysia, harta pusakanya tidak boleh disentuh tanpa dokumen mahkamah yang sah. Dua dokumen utama yang diperlukan adalah Grant of Probate dan Letter of Administration — dan ramai tidak faham perbezaannya sehingga terpaksa melalui proses yang lebih sukar.'
              : 'When someone passes away in Malaysia, their estate cannot be touched without a valid court document. The two main documents required are Grant of Probate and Letter of Administration — and many people don\'t understand the difference until they face the harder process.'}
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-emerald-900">Grant of Probate</span>
              </div>
              <p className="text-xs text-emerald-700 leading-relaxed">
                {ms
                  ? 'Dokumen yang dikeluarkan oleh Mahkamah Tinggi untuk mengesahkan wasiat seseorang adalah sah dan memberi kuasa kepada pelaksana (executor/wasi) yang dinamakan dalam wasiat untuk mengurus harta pusaka.'
                  : 'A document issued by the High Court confirming that a person\'s will is valid and granting authority to the named executor to administer the estate.'}
              </p>
              <div className="mt-3 pt-3 border-t border-emerald-200">
                <p className="text-xs font-semibold text-emerald-800">{ms ? 'Digunakan apabila:' : 'Used when:'}</p>
                <p className="text-xs text-emerald-700 mt-1">✓ {ms ? 'Si mati ada wasiat yang sah' : 'Deceased had a valid will'}</p>
              </div>
            </div>
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-amber-600" />
                <span className="font-bold text-amber-900">Letter of Administration (LOA)</span>
              </div>
              <p className="text-xs text-amber-700 leading-relaxed">
                {ms
                  ? 'Dokumen yang dikeluarkan oleh Mahkamah Tinggi apabila si mati tiada wasiat, melantik seorang pentadbir (administrator) untuk mengurus harta pusaka mengikut undang-undang.'
                  : 'A document issued by the High Court when the deceased had no will, appointing an administrator to manage the estate according to law.'}
              </p>
              <div className="mt-3 pt-3 border-t border-amber-200">
                <p className="text-xs font-semibold text-amber-800">{ms ? 'Digunakan apabila:' : 'Used when:'}</p>
                <p className="text-xs text-amber-700 mt-1">✗ {ms ? 'Si mati tiada wasiat' : 'Deceased had no will'}</p>
              </div>
            </div>
          </div>

          <h2 className="text-lg font-bold text-slate-900">
            {ms ? 'Perbandingan Terperinci' : 'Detailed Comparison'}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="p-3 text-left font-bold text-slate-700 border border-slate-200">{ms ? 'Faktor' : 'Factor'}</th>
                  <th className="p-3 text-left font-bold text-emerald-700 border border-slate-200 bg-emerald-50">Grant of Probate</th>
                  <th className="p-3 text-left font-bold text-amber-700 border border-slate-200 bg-amber-50">Letter of Administration</th>
                </tr>
              </thead>
              <tbody>
                {(ms ? [
                  ['Syarat utama', 'Ada wasiat yang sah', 'Tiada wasiat'],
                  ['Undang-undang berkaitan', 'Akta Probet & Pentadbiran 1959', 'Akta Probet & Pentadbiran 1959'],
                  ['Siapa yang memohon', 'Pelaksana (executor/wasi) yang ditetapkan dalam wasiat', 'Waris terdekat (pasangan, anak, ibu bapa)'],
                  ['Persetujuan waris', 'Tidak diperlukan', 'Semua waris berhak perlu bersetuju'],
                  ['Jaminan (bond)', 'Biasanya tidak diperlukan', 'Diperlukan — dua penjamin'],
                  ['Masa anggaran', '2–6 bulan', '6 bulan – 2 tahun+'],
                  ['Kos anggaran', 'Lebih rendah', 'Lebih tinggi'],
                  ['Risiko pertikaian', 'Rendah', 'Tinggi — terutama jika waris ramai'],
                ] : [
                  ['Main requirement', 'Valid will exists', 'No will'],
                  ['Relevant law', 'Probate & Administration Act 1959', 'Probate & Administration Act 1959'],
                  ['Who applies', 'Executor/Wasi named in the will', 'Next of kin (spouse, children, parents)'],
                  ['Heir consent', 'Not required', 'All entitled heirs must agree'],
                  ['Bond/guarantee', 'Usually not required', 'Required — two guarantors'],
                  ['Estimated time', '2–6 months', '6 months – 2+ years'],
                  ['Estimated cost', 'Lower', 'Higher'],
                  ['Dispute risk', 'Low', 'High — especially with many heirs'],
                ]).map(([factor, probate, loa]) => (
                  <tr key={factor} className="border border-slate-200">
                    <td className="p-3 font-medium text-slate-700 bg-slate-50">{factor}</td>
                    <td className="p-3 text-slate-600 bg-emerald-50/30">{probate}</td>
                    <td className="p-3 text-slate-600 bg-amber-50/30">{loa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-lg font-bold text-slate-900">
            {ms ? 'Apakah Perintah Agihan Pusaka Kecil?' : 'What Is a Small Estate Distribution Order?'}
          </h2>
          <p>
            {ms
              ? 'Selain daripada dua dokumen di atas, terdapat satu lagi laluan untuk harta pusaka kecil: Perintah Agihan Pusaka Kecil di bawah Akta Harta Pusaka Kecil (Pembahagian) 1955.'
              : 'Besides the two documents above, there is another route for smaller estates: the Small Estate Distribution Order under the Small Estates (Distribution) Act 1955.'}
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2 text-xs text-blue-800">
            <p className="font-semibold">{ms ? 'Perintah Agihan Pusaka Kecil — Syarat:' : 'Small Estate Distribution Order — Conditions:'}</p>
            {(ms ? [
              'Harta tak alih (hartanah) tidak melebihi RM2 juta',
              'Dipohon di Pejabat Tanah & Galian atau Amanah Raya Berhad',
              'Lebih mudah dan murah berbanding mahkamah tinggi',
              'Tidak merangkumi semua jenis harta (contoh: saham, perniagaan)',
            ] : [
              'Immovable property (real estate) does not exceed RM2 million',
              'Applied at Land & Mines Office or Amanah Raya Berhad',
              'Easier and cheaper than High Court',
              'Does not cover all asset types (e.g. shares, business)',
            ]).map(item => <p key={item}>• {item}</p>)}
          </div>

          <h2 className="text-lg font-bold text-slate-900">
            {ms ? 'Proses Memohon Grant of Probate (Ringkas)' : 'Applying for Grant of Probate (Summary)'}
          </h2>
          <div className="space-y-2">
            {(ms ? [
              'Pelaksana (wasi) sediakan petisyen dan afidavit',
              'Serahkan wasiat asal dan dokumen sokongan ke Mahkamah Tinggi',
              'Mahkamah sahkan kesahihan wasiat',
              'Grant of Probate dikeluarkan',
              'Pelaksana gunakan dokumen ini untuk urus semua harta pusaka',
            ] : [
              'Executor prepares petition and affidavit',
              'Submit original will and supporting documents to High Court',
              'Court verifies will validity',
              'Grant of Probate issued',
              'Executor uses this document to manage all estate assets',
            ]).map((step, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <div className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-xs shrink-0">{i + 1}</div>
                <p className="text-slate-700 mt-0.5">{step}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-500">
            <p>📌 {ms
              ? 'Rujukan undang-undang: Akta Probet dan Pentadbiran 1959 | Akta Harta Pusaka Kecil (Pembahagian) 1955 | Kaedah-Kaedah Mahkamah 2012. Proses sebenar mungkin berbeza mengikut kes dan negeri. Sila rujuk peguam bertauliah untuk nasihat khusus.'
              : 'Legal references: Probate and Administration Act 1959 | Small Estates (Distribution) Act 1955 | Rules of Court 2012. Actual process may vary by case and state. Consult a qualified lawyer for specific advice.'}
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
            <p className="font-semibold text-emerald-800 mb-2">💡 {ms ? 'Kesimpulan mudah' : 'Simple conclusion'}</p>
            <p className="text-sm text-emerald-700">
              {ms
                ? 'Ada wasiat = Grant of Probate (lebih cepat, lebih murah, kurang konflik). Tiada wasiat = Letter of Administration (lebih lama, lebih mahal, risiko pertikaian lebih tinggi). Pilihan ada di tangan anda sekarang.'
                : 'Have a will = Grant of Probate (faster, cheaper, less conflict). No will = Letter of Administration (longer, more expensive, higher dispute risk). The choice is in your hands now.'}
            </p>
          </div>

        </div>

        <div className="mt-8 p-5 bg-slate-50 border border-slate-200 rounded-xl text-sm">
          <p className="font-semibold text-slate-800 mb-2">{ms ? 'Baca juga:' : 'Read also:'}</p>
          <Link href="/insights/kereta-tanpa-wasiat" className="text-emerald-600 hover:underline block">
            → {ms ? 'Tukar Nama Kereta Arwah — Ini Proses Sebenar' : 'Transferring a Deceased\'s Car — The Real Process'}
          </Link>
          <Link href="/insights/akaun-bank-dibekukan" className="text-emerald-600 hover:underline block mt-1">
            → {ms ? 'Akaun Bank Dibekukan Bila Meninggal — Ini Yang Berlaku' : 'Bank Account Frozen When Someone Dies'}
          </Link>
        </div>

        <div className="mt-6 p-6 bg-slate-900 rounded-2xl text-center">
          <p className="text-white font-bold text-lg mb-2">
            {ms ? 'Pastikan proses mudah untuk keluarga anda.' : 'Ensure an easier process for your family.'}
          </p>
          <p className="text-slate-400 text-sm mb-5">
            {ms ? 'Buat wasiat dalam 15 minit. Dari RM79.' : 'Create your will in 15 minutes. From RM79.'}
          </p>
          <Link href="/auth/register"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
            {ms ? 'Buat Wasiat Sekarang' : 'Create Your Will Now'}
          </Link>
        </div>
      </div>
    </div>
  )
}
