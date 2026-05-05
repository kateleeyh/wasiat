import { cookies } from 'next/headers'
import Link from 'next/link'
import { ArrowLeft, Clock, DollarSign, FileText, CheckCircle, XCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tukar Nama Kereta Arwah di Malaysia: Proses, Kos & Kenapa Boleh Cecah RM10,000+',
  description: 'Ramai sangka tukar nama kereta arwah mudah — sebenarnya perlu melalui proses pusaka yang boleh ambil setahun dan kos ribuan ringgit. Ini yang sebenarnya berlaku.',
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
          <span className="bg-red-500/20 text-red-300 text-xs font-bold px-3 py-1 rounded-full">
            {ms ? 'Situasi Sebenar' : 'Real Situation'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-4 leading-tight">
            {ms
              ? 'Tukar Nama Kereta Arwah di Malaysia: Proses, Kos Sebenar & Kenapa Boleh Cecah RM10,000+'
              : 'Transferring a Deceased\'s Car in Malaysia: The Real Process, Real Costs & Why It Can Reach RM10,000+'}
          </h1>
          <p className="text-slate-400 text-sm mt-3">
            {ms ? '1 Mei 2026 · 7 minit bacaan' : '1 May 2026 · 7 min read'}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-slate-700 text-sm leading-relaxed space-y-6">

          {/* Note */}
          <p className="text-xs text-slate-400 italic">
            {ms
              ? '* Kisah berikut adalah ilustrasi berdasarkan situasi sebenar yang lazim berlaku dalam proses pentadbiran pusaka di Malaysia. Nama adalah rekaan.' 
              : '* The following story is an illustration based on common real situations in Malaysian estate administration. Names are fictional.'}
          </p>

          {/* Story */}
          <div className="bg-slate-50 border-l-4 border-slate-300 rounded-r-xl p-5 space-y-3">
            {ms ? (
              <>
                <p className="text-slate-700">Arif tidak pernah sangka urusan sekecil ini boleh jadi begitu rumit.</p>
                <p className="text-slate-700">Beberapa minggu selepas ayahnya meninggal dunia, hidup mereka perlahan-lahan kembali normal. Rumah masih sama. Kereta Proton yang ayahnya gunakan setiap hari masih parkir di porch.</p>
                <p className="text-slate-700">Loan sudah lama habis dibayar. Road tax pun masih hidup.</p>
                <p className="text-slate-700 font-medium">&ldquo;Pergi JPJ, tukar nama. Selesai.&rdquo;</p>
                <p className="text-slate-700">Seminggu kemudian, Arif berdiri di kaunter JPJ dengan semua dokumen yang dia fikir sudah cukup — salinan IC, geran kereta, sijil kematian ayahnya.</p>
                <p className="text-slate-700">Pegawai di kaunter melihat dokumen itu, kemudian berkata:</p>
                <p className="text-slate-700 font-medium text-red-700">&ldquo;Tak boleh tukar nama tanpa dokumen mahkamah.&rdquo;</p>
                <p className="text-slate-700">Arif terpaku. Dalam perjalanan pulang, dia mula memahami sesuatu yang ramai rakyat Malaysia tidak sedar.</p>
              </>
            ) : (
              <>
                <p className="text-slate-700">Arif never imagined such a simple matter could become so complicated.</p>
                <p className="text-slate-700">Weeks after his father passed away, life slowly returned to normal. The house was the same. The Proton his father drove every day was still parked in the porch.</p>
                <p className="text-slate-700">The loan had been fully paid. Road tax was still valid.</p>
                <p className="text-slate-700 font-medium">&ldquo;Go to JPJ, transfer the name. Done.&rdquo;</p>
                <p className="text-slate-700">A week later, Arif stood at the JPJ counter with all the documents he thought were sufficient — IC copy, vehicle grant, his father&apos;s death certificate.</p>
                <p className="text-slate-700">The officer looked at the documents, then said:</p>
                <p className="text-slate-700 font-medium text-red-700">&ldquo;Cannot transfer ownership without a court document.&rdquo;</p>
                <p className="text-slate-700">Arif was stunned. On the way home, he began to understand something many Malaysians don&apos;t realise.</p>
              </>
            )}
          </div>

          <h2 className="text-lg font-bold text-slate-900">
            {ms ? 'Kenapa JPJ Tidak Boleh Proses Tanpa Dokumen Mahkamah?' : 'Why JPJ Cannot Process Without a Court Document?'}
          </h2>
          <p>
            {ms
              ? 'Di bawah Akta Pengangkutan Jalan 1987, apabila pemilik kenderaan meninggal dunia, kenderaan tersebut menjadi sebahagian daripada harta pusaka si mati. JPJ tidak mempunyai kuasa untuk memindahkan pemilikan harta pusaka — itu adalah bidang kuasa mahkamah.' 
              : 'Under the Road Transport Act 1987, when a vehicle owner passes away, the vehicle becomes part of the deceased&apos;s estate. JPJ has no authority to transfer estate property — that falls under court jurisdiction.'}
          </p>

          <div className="space-y-3">
            {(ms ? [
              { doc: 'Grant of Probate', desc: 'Diperolehi melalui Mahkamah Tinggi apabila si mati ada wasiat yang sah (di bawah Akta Probet dan Pentadbiran 1959). Pelaksana yang dilantik dalam wasiat boleh menguruskan harta pusaka.', badge: 'Ada wasiat', color: 'emerald' },
              { doc: 'Letter of Administration (LOA)', desc: 'Diperlukan apabila si mati tiada wasiat. Waris perlu mohon di Mahkamah Tinggi. Proses lebih panjang kerana tiada arahan pembahagian yang jelas.', badge: 'Tiada wasiat', color: 'amber' },
              { doc: 'Perintah Agihan Pusaka Kecil', desc: 'Di bawah Akta Harta Pusaka Kecil (Pembahagian) 1955, untuk harta pusaka di bawah RM2 juta (harta tak alih). Boleh dipohon di Pejabat Tanah atau Amanah Raya.', badge: 'Pusaka kecil', color: 'blue' },
            ] : [
              { doc: 'Grant of Probate', desc: 'Obtained through the High Court when the deceased had a valid will (under the Probate and Administration Act 1959). The appointed executor can manage the estate.', badge: 'With will', color: 'emerald' },
              { doc: 'Letter of Administration (LOA)', desc: 'Required when there is no will. Heirs must apply at the High Court. Longer process as there are no clear distribution instructions.', badge: 'Without will', color: 'amber' },
              { doc: 'Small Estate Distribution Order', desc: 'Under the Small Estates (Distribution) Act 1955, for estates below RM2 million (immovable property). Can be applied at Land Office or Amanah Raya.', badge: 'Small estate', color: 'blue' },
            ]).map(item => (
              <div key={item.doc} className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span className="font-bold text-slate-900 text-sm">{item.doc}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium bg-${item.color}-50 text-${item.color}-700`}>{item.badge}</span>
                </div>
                <p className="text-xs text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-lg font-bold text-slate-900">
            {ms ? 'Masa & Kos Sebenar' : 'Real Time & Cost'}
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-red-600" />
                <span className="font-bold text-red-800 text-sm">{ms ? 'Masa' : 'Time'}</span>
              </div>
              <p className="text-sm text-red-700 mb-2">
                {ms
                  ? 'Tanpa wasiat (LOA): Minimum 6 bulan, boleh melebihi 2 tahun. Dengan wasiat (Probate): 2–6 bulan.' 
                  : 'Without will (LOA): Minimum 6 months, can exceed 2 years. With will (Probate): 2–6 months.'}
              </p>
              <p className="text-xs text-red-500">
                {ms ? '*Tertakluk kepada beban kerja mahkamah dan kerumitan kes.' : '*Subject to court workload and case complexity.'}
              </p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-red-600" />
                <span className="font-bold text-red-800 text-sm">{ms ? 'Kos Anggaran' : 'Estimated Cost'}</span>
              </div>
              <table className="w-full text-xs">
                <tbody>
                  {(ms ? [
                    ['Yuran guaman / pentadbiran', 'RM1,500 – RM8,000+'],
                    ['Yuran mahkamah / setem', 'RM300 – RM1,000+'],
                    ['Tukar nama JPJ sahaja', '~RM100'],
                  ] : [
                    ['Legal / admin fees', 'RM1,500 – RM8,000+'],
                    ['Court / stamp fees', 'RM300 – RM1,000+'],
                    ['JPJ name transfer only', '~RM100'],
                  ]).map(([item, cost]) => (
                    <tr key={item} className="border-b border-red-100">
                      <td className="py-1 text-red-700">{item}</td>
                      <td className="py-1 text-right font-medium text-red-900">{cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-red-500 mt-2">
                {ms ? '*Anggaran umum. Kes sebenar mungkin berbeza.' : '*General estimate. Actual cases may vary.'}
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="font-semibold text-amber-900 text-sm mb-2">
              {ms ? 'Yang paling ironi?' : 'The irony?'}
            </p>
            <p className="text-sm text-amber-800">
              {ms
                ? 'Apabila semua selesai, kos tukar nama di JPJ hanyalah sekitar RM100 sahaja. Kos sebenar adalah pada proses pusaka sebelum JPJ — bukan JPJ itu sendiri.'
                : 'When everything is done, the JPJ name transfer only costs about RM100. The real cost is in the estate process before JPJ — not JPJ itself.'}
            </p>
          </div>

          <h2 className="text-lg font-bold text-slate-900">
            {ms ? 'Boleh Guna Kereta Arwah Sementara Tunggu?' : 'Can You Use the Vehicle While Waiting?'}
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <p className="font-semibold text-emerald-800 text-sm mb-2">✓ {ms ? 'Boleh' : 'Allowed'}</p>
              {[ms ? 'Pandu kenderaan' : 'Drive the vehicle', ms ? 'Renew insurans' : 'Renew insurance', ms ? 'Renew road tax' : 'Renew road tax'].map(i => (
                <p key={i} className="text-xs text-emerald-700 flex items-center gap-1"><CheckCircle className="w-3 h-3" />{i}</p>
              ))}
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="font-semibold text-red-800 text-sm mb-2">✗ {ms ? 'Tidak Boleh' : 'Not Allowed'}</p>
              {[ms ? 'Jual kenderaan' : 'Sell the vehicle', ms ? 'Tukar nama' : 'Transfer ownership', ms ? 'Gadai kenderaan' : 'Pledge the vehicle'].map(i => (
                <p key={i} className="text-xs text-red-700 flex items-center gap-1"><XCircle className="w-3 h-3" />{i}</p>
              ))}
            </div>
          </div>

          <h2 className="text-lg font-bold text-slate-900">
            {ms ? 'Perbezaan Dengan & Tanpa Wasiat' : 'Difference With & Without a Will'}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="p-3 text-left font-bold text-slate-700 border border-slate-200">{ms ? 'Faktor' : 'Factor'}</th>
                  <th className="p-3 text-left font-bold text-emerald-700 border border-slate-200 bg-emerald-50">{ms ? 'Ada Wasiat' : 'With Will'}</th>
                  <th className="p-3 text-left font-bold text-red-700 border border-slate-200 bg-red-50">{ms ? 'Tiada Wasiat' : 'Without Will'}</th>
                </tr>
              </thead>
              <tbody>
                {(ms ? [
                  ['Dokumen', 'Grant of Probate', 'Letter of Administration'],
                  ['Masa', '2–6 bulan', '6 bulan – 2 tahun+'],
                  ['Kos anggaran', 'Lebih rendah', 'Lebih tinggi'],
                  ['Risiko konflik waris', 'Rendah', 'Tinggi'],
                  ['Keperluan persetujuan waris', 'Tidak perlu (executor ditetapkan)', 'Semua waris perlu bersetuju'],
                ] : [
                  ['Document', 'Grant of Probate', 'Letter of Administration'],
                  ['Time', '2–6 months', '6 months – 2 years+'],
                  ['Estimated cost', 'Lower', 'Higher'],
                  ['Heir conflict risk', 'Low', 'High'],
                  ['Heir consent required', 'No (executor appointed)', 'All heirs must agree'],
                ]).map(([factor, withWill, withoutWill]) => (
                  <tr key={factor} className="border border-slate-200">
                    <td className="p-3 font-medium text-slate-700 bg-slate-50">{factor}</td>
                    <td className="p-3 text-emerald-700 bg-emerald-50/30">{withWill}</td>
                    <td className="p-3 text-red-700 bg-red-50/30">{withoutWill}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-500">
            <p>📌 {ms
              ? 'Rujukan undang-undang: Akta Pengangkutan Jalan 1987 | Akta Probet dan Pentadbiran 1959 | Akta Harta Pusaka Kecil (Pembahagian) 1955 | Akta Wasiat 1959. Angka kos dan masa adalah anggaran — kes sebenar bergantung kepada nilai harta, bilangan waris, dan beban kerja mahkamah.'
              : 'Legal references: Road Transport Act 1987 | Probate and Administration Act 1959 | Small Estates (Distribution) Act 1955 | Wills Act 1959. Cost and time are estimates — actual cases depend on estate value, number of heirs, and court workload.'}
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
            <p className="font-semibold text-emerald-800 mb-2">
              {ms ? '💡 Arif mengambil hampir setahun untuk selesaikan semua ini.' : '💡 Arif took nearly a year to resolve everything.'}
            </p>
            <p className="text-sm text-emerald-700">
              {ms
                ? 'Sekarang dia faham: Wasiat bukan untuk orang kaya. Ia untuk sesiapa yang tidak mahu keluarga mereka melalui perkara yang sama.'
                : 'Now he understands: A will is not just for the wealthy. It is for anyone who does not want their family to go through the same thing.'}
            </p>
          </div>

        </div>

        <div className="mt-10 p-6 bg-slate-900 rounded-2xl text-center">
          <p className="text-white font-bold text-lg mb-2">
            {ms ? 'Jangan biar keluarga anda dalam situasi Arif.' : "Don't leave your family in Arif&apos;s situation."}
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
