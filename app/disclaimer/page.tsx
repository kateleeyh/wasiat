import { cookies } from 'next/headers'
import Link from 'next/link'
import { ArrowLeft, AlertTriangle } from 'lucide-react'

export default async function DisclaimerPage() {
  const cookieStore = await cookies()
  const ms = (cookieStore.get('locale')?.value ?? 'ms') === 'ms'

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-900 pt-16 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <Link href="/" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {ms ? 'Kembali' : 'Back'}
          </Link>
          <h1 className="text-3xl font-bold text-white">{ms ? 'Penafian' : 'Disclaimer'}</h1>
          <p className="text-slate-400 text-sm mt-2">{ms ? 'Kemaskini: April 2026' : 'Last updated: April 2026'}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-3 mb-8">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-amber-800 text-sm font-medium">
            {ms
              ? 'WasiatHub adalah platform penjana dokumen. Kami bukan firma guaman dan tidak memberikan nasihat undang-undang.'
              : 'WasiatHub is a document generation platform. We are not a law firm and do not provide legal advice.'}
          </p>
        </div>

        {ms ? (
          <div className="space-y-8 text-slate-700 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">Bukan Nasihat Undang-undang</h2>
              <p>Semua maklumat, kandungan, dan dokumen yang disediakan oleh WasiatHub adalah untuk tujuan maklumat am sahaja. Ia tidak boleh dianggap sebagai nasihat undang-undang, dan penggunaan perkhidmatan ini tidak mewujudkan hubungan peguam-anak guam.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">Kesahihan Dokumen</h2>
              <p>Dokumen yang dijana oleh WasiatHub perlu memenuhi syarat-syarat tambahan untuk berkuat kuasa dari segi undang-undang:</p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li><strong>Surat Wasiat Am</strong> — Mesti ditandatangani di hadapan 2 orang saksi yang bukan penerima manfaat, secara serentak, seperti yang dikehendaki oleh Akta Wasiat 1959.</li>
                <li><strong>Wasiat Islam</strong> — Mesti ditandatangani di hadapan 2 orang saksi Muslim yang layak. Pendaftaran dengan Jabatan Agama Islam Negeri amat disyorkan.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">Had Perkhidmatan</h2>
              <p>WasiatHub direka untuk kes-kes yang mudah. Kami mengesyorkan anda mendapatkan nasihat guaman profesional jika:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Anda memiliki harta perniagaan yang kompleks</li>
                <li>Terdapat pertikaian keluarga yang dijangkakan</li>
                <li>Anda mempunyai aset luar negara</li>
                <li>Anda memerlukan penstrukturan cukai harta</li>
                <li>Situasi keluarga anda adalah luar biasa atau kompleks</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">Ketepatan Maklumat</h2>
              <p>Walaupun kami berusaha memastikan maklumat yang disediakan adalah tepat dan terkini, undang-undang boleh berubah. WasiatHub tidak bertanggungjawab atas sebarang kesilapan, ketinggalan, atau keputusan yang dibuat berdasarkan maklumat dalam platform ini.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">Dapatkan Nasihat Profesional</h2>
              <p>Untuk kes yang memerlukan panduan khusus, sila hubungi:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Peguam berdaftar di Malaysia</li>
                <li>Peguam Syarie untuk hal-hal berkaitan Syariah</li>
                <li>Jabatan Agama Islam Negeri anda untuk pendaftaran Wasiat</li>
              </ul>
            </section>
          </div>
        ) : (
          <div className="space-y-8 text-slate-700 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">Not Legal Advice</h2>
              <p>All information, content, and documents provided by WasiatHub are for general informational purposes only. They should not be construed as legal advice, and use of this service does not create a solicitor-client relationship.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">Document Validity</h2>
              <p>Documents generated by WasiatHub require additional steps to be legally effective:</p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li><strong>General Will</strong> — Must be signed in the presence of 2 witnesses who are not beneficiaries, simultaneously, as required by the Wills Act 1959.</li>
                <li><strong>Islamic Will (Wasiat)</strong> — Must be signed in the presence of 2 qualified Muslim witnesses. Registration with the State Islamic Religious Department is strongly recommended.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">Limitations of Service</h2>
              <p>WasiatHub is designed for straightforward cases. We recommend seeking professional legal advice if:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>You own complex business assets</li>
                <li>Family disputes are anticipated</li>
                <li>You have assets overseas</li>
                <li>You require estate tax structuring</li>
                <li>Your family situation is unusual or complex</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">Accuracy of Information</h2>
              <p>While we strive to ensure the information provided is accurate and up to date, laws may change. WasiatHub accepts no responsibility for any errors, omissions, or decisions made based on information on this platform.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">Seek Professional Advice</h2>
              <p>For cases requiring specific guidance, please contact:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>A registered lawyer in Malaysia</li>
                <li>A Peguam Syarie for Syariah-related matters</li>
                <li>Your State Islamic Religious Department for Wasiat registration</li>
              </ul>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
