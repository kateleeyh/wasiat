import { cookies } from 'next/headers'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function TermsPage() {
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
          <h1 className="text-3xl font-bold text-white">{ms ? 'Terma Penggunaan' : 'Terms of Use'}</h1>
          <p className="text-slate-400 text-sm mt-2">{ms ? 'Kemaskini: April 2026' : 'Last updated: April 2026'}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {ms ? (
          <div className="space-y-8 text-slate-700 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">1. Penerimaan Terma</h2>
              <p>Dengan mengakses atau menggunakan perkhidmatan WasiatHub, anda bersetuju untuk terikat dengan Terma Penggunaan ini. Jika anda tidak bersetuju, sila hentikan penggunaan perkhidmatan kami.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">2. Keterangan Perkhidmatan</h2>
              <p>WasiatHub adalah platform penjana dokumen dalam talian yang membantu pengguna menyediakan dokumen Wasiat Islam dan Surat Wasiat Am berdasarkan undang-undang Malaysia. <strong>WasiatHub bukan firma guaman dan tidak memberikan nasihat undang-undang.</strong></p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">3. Kelayakan Pengguna</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Anda mesti berumur 18 tahun ke atas</li>
                <li>Anda mesti penduduk Malaysia atau warganegara Malaysia</li>
                <li>Untuk Wasiat, anda mesti beragama Islam</li>
                <li>Anda mesti sihat akal (mentally competent) semasa membuat wasiat</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">4. Pembayaran dan Bayaran Balik</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Pembayaran adalah satu kali sahaja per dokumen</li>
                <li>Harga semasa: RM79 (Wasiat atau Surat Wasiat), RM129 (Pakej Keluarga)</li>
                <li><strong>Tiada bayaran balik</strong> selepas PDF dokumen dijana dan dihantar</li>
                <li>Sekiranya dokumen gagal dijana atas kegagalan teknikal kami, kami akan memproses bayaran balik penuh</li>
                <li>Pembayaran diproses melalui pemproses pembayaran berlesen menggunakan FPX</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">5. Tanggungjawab Pengguna</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Anda bertanggungjawab memastikan semua maklumat yang dimasukkan adalah tepat dan benar</li>
                <li>Anda bertanggungjawab menandatangani dokumen di hadapan saksi yang layak</li>
                <li>Untuk Wasiat, anda bertanggungjawab mendaftarkan dokumen dengan Jabatan Agama Islam Negeri</li>
                <li>Anda tidak boleh menggunakan perkhidmatan ini untuk tujuan penipuan atau menyalahi undang-undang</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">6. Penafian Liabiliti</h2>
              <p>WasiatHub tidak bertanggungjawab atas:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Kesahihan undang-undang dokumen yang gagal ditandatangani atau didaftarkan dengan betul</li>
                <li>Maklumat yang tidak tepat yang dimasukkan oleh pengguna</li>
                <li>Pertikaian antara waris atau penerima manfaat</li>
                <li>Sebarang kerugian tidak langsung atau berbangkit</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">7. Undang-undang Terpakai</h2>
              <p>Terma ini ditadbir di bawah undang-undang Malaysia. Sebarang pertikaian tertakluk kepada bidang kuasa eksklusif mahkamah Malaysia.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">8. Pembatalan & Bayaran Balik</h2>
              <p className="mb-2">WasiatHub dikendalikan oleh <strong>WF Wealth Management Sdn. Bhd. (202101017850-M)</strong>. Semua permintaan pembatalan atau bayaran balik hendaklah dihantar terus kepada pasukan WasiatHub.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Sebelum PDF dijana:</strong> Pembayaran belum dikenakan — tiada bayaran balik diperlukan.</li>
                <li><strong>Selepas PDF dijana:</strong> Tiada bayaran balik kerana dokumen telah berjaya dijana dan dihantar. Walau bagaimanapun, jika kegagalan teknikal berlaku di pihak kami, bayaran balik penuh akan diproses.</li>
                <li><strong>Cara memohon:</strong> Hubungi kami di <a href="mailto:support@wasiathub.my" className="text-emerald-600 hover:underline">support@wasiathub.my</a> dengan menyatakan No. Rujukan dokumen dan sebab permohonan.</li>
                <li><strong>Masa pemprosesan:</strong> Permohonan bayaran balik yang diluluskan akan diproses dalam tempoh 7–14 hari bekerja.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">9. Pengendali Platform</h2>
              <p>WasiatHub (wasiathub.my) dikendalikan oleh <strong>WF Wealth Management Sdn. Bhd.</strong>, sebuah syarikat yang diperbadankan di Malaysia di bawah Akta Syarikat 2016 (No. Pendaftaran: 202101017850-M).</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">10. Hubungi Kami</h2>
              <p>Untuk pertanyaan berkaitan terma ini: <a href="mailto:support@wasiathub.my" className="text-emerald-600 hover:underline">support@wasiathub.my</a></p>
            </section>
          </div>
        ) : (
          <div className="space-y-8 text-slate-700 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">1. Acceptance of Terms</h2>
              <p>By accessing or using WasiatHub's services, you agree to be bound by these Terms of Use. If you do not agree, please discontinue use of our services.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">2. Description of Service</h2>
              <p>WasiatHub is an online document generation platform that helps users prepare Islamic Will (Wasiat) and General Will documents based on Malaysian law. <strong>WasiatHub is not a law firm and does not provide legal advice.</strong></p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">3. User Eligibility</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>You must be 18 years of age or older</li>
                <li>You must be a Malaysian resident or citizen</li>
                <li>For Wasiat, you must be a Muslim</li>
                <li>You must be of sound mind when making your will</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">4. Payment and Refunds</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Payment is one-time per document</li>
                <li>Current pricing: RM79 (Wasiat or General Will), RM129 (Family Bundle)</li>
                <li><strong>No refunds</strong> once the PDF document has been generated and delivered</li>
                <li>If a document fails to generate due to our technical error, a full refund will be processed</li>
                <li>Payments are processed via licensed payment processor using FPX</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">5. User Responsibilities</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>You are responsible for ensuring all information entered is accurate and truthful</li>
                <li>You are responsible for signing the document in front of qualified witnesses</li>
                <li>For Wasiat, you are responsible for registering the document with the State Islamic Religious Department</li>
                <li>You must not use this service for fraudulent or illegal purposes</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">6. Limitation of Liability</h2>
              <p>WasiatHub is not responsible for:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Legal validity of documents not properly signed or registered</li>
                <li>Inaccurate information entered by the user</li>
                <li>Disputes between heirs or beneficiaries</li>
                <li>Any indirect or consequential loss</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">7. Governing Law</h2>
              <p>These Terms are governed by the laws of Malaysia. Any disputes are subject to the exclusive jurisdiction of Malaysian courts.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">8. Cancellation & Refund Policy</h2>
              <p className="mb-2">WasiatHub is operated by <strong>WF Wealth Management Sdn. Bhd. (202101017850-M)</strong>. All cancellation or refund requests are handled directly by the WasiatHub team.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Before PDF is generated:</strong> No charge has been made — no refund required.</li>
                <li><strong>After PDF is generated:</strong> No refunds as the document has been successfully generated and delivered. However, if a technical failure occurs on our end, a full refund will be processed.</li>
                <li><strong>How to request:</strong> Email us at <a href="mailto:support@wasiathub.my" className="text-emerald-600 hover:underline">support@wasiathub.my</a> with your document Reference Number and reason for request.</li>
                <li><strong>Processing time:</strong> Approved refund requests will be processed within 7–14 business days.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">9. Platform Operator</h2>
              <p>WasiatHub (wasiathub.my) is operated by <strong>WF Wealth Management Sdn. Bhd.</strong>, a company incorporated in Malaysia under the Companies Act 2016 (Registration No: 202101017850-M).</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">10. Contact Us</h2>
              <p>For enquiries regarding these terms: <a href="mailto:support@wasiathub.my" className="text-emerald-600 hover:underline">support@wasiathub.my</a></p>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
