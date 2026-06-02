import { cookies } from 'next/headers'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function PrivacyPage() {
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
          <h1 className="text-3xl font-bold text-white">{ms ? 'Dasar Privasi' : 'Privacy Policy'}</h1>
          <p className="text-slate-400 text-sm mt-2">{ms ? 'Kemaskini: April 2026' : 'Last updated: April 2026'}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {ms ? (
          <div className="space-y-8 text-slate-700 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">1. Maklumat Yang Kami Kumpul</h2>
              <p>Apabila anda menggunakan WasiatHub, kami mengumpul maklumat berikut:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Maklumat akaun:</strong> Nama penuh, alamat e-mel, kata laluan (disulitkan)</li>
                <li><strong>Maklumat dokumen:</strong> No. Kad Pengenalan, tarikh lahir, jantina, alamat, no. telefon, agama, status perkahwinan, maklumat waris dan pelaksana</li>
                <li><strong>Maklumat pembayaran:</strong> Rekod transaksi pembayaran (kami tidak menyimpan maklumat kad atau akaun bank)</li>
                <li><strong>Data teknikal:</strong> Alamat IP, jenis peranti, dan data log untuk tujuan keselamatan</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">2. Penggunaan Maklumat</h2>
              <p>Maklumat anda digunakan untuk:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Menjana dokumen Wasiat atau Surat Wasiat anda</li>
                <li>Menghantar PDF dokumen ke e-mel anda</li>
                <li>Memproses pembayaran melalui pemproses pembayaran berlesen</li>
                <li>Menyediakan sokongan pelanggan</li>
                <li>Meningkatkan perkhidmatan kami</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">3. Perkongsian Maklumat</h2>
              <p>Kami <strong>tidak menjual</strong> maklumat peribadi anda kepada pihak ketiga. Maklumat dikongsi hanya dengan penyedia perkhidmatan berikut:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Penyedia perkhidmatan pangkalan data dan pengesahan (pelayan mungkin terletak di luar Malaysia)</li>
                <li>Penyedia perkhidmatan penghantaran e-mel</li>
                <li>Penyedia pemprosesan pembayaran yang berlesen di Malaysia</li>
                <li>Penyedia perkhidmatan hosting dan rangkaian penghantaran kandungan</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">4. Penyimpanan Data</h2>
              <p>Maklumat anda disimpan dengan selamat dalam pangkalan data yang disulitkan. Dokumen yang dijana disimpan sehingga anda memadamkan akaun anda atau meminta penghapusan data.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">5. Hak Anda</h2>
              <p>Anda berhak untuk:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Mengakses maklumat peribadi anda</li>
                <li>Meminta pembetulan maklumat yang tidak tepat</li>
                <li>Meminta penghapusan akaun dan data anda</li>
                <li>Menarik balik kebenaran pada bila-bila masa</li>
              </ul>
              <p className="mt-2">Untuk sebarang permintaan, hubungi kami di <a href="mailto:support@wasiathub.my" className="text-emerald-600 hover:underline">support@wasiathub.my</a></p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">6. Kuki (Cookies)</h2>
              <p>Kami menggunakan kuki sesi untuk mengekalkan log masuk anda dan pilihan bahasa. Kami tidak menggunakan kuki iklan atau penjejakan pihak ketiga.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">7. Hubungi Kami</h2>
              <p>Untuk sebarang pertanyaan berkaitan privasi: <a href="mailto:support@wasiathub.my" className="text-emerald-600 hover:underline">support@wasiathub.my</a></p>
            </section>
          </div>
        ) : (
          <div className="space-y-8 text-slate-700 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">1. Information We Collect</h2>
              <p>When you use WasiatHub, we collect the following information:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Account information:</strong> Full name, email address, password (encrypted)</li>
                <li><strong>Document information:</strong> IC number, date of birth, gender, address, phone, religion, marital status, beneficiary and executor details</li>
                <li><strong>Payment information:</strong> Payment transaction records (we do not store banking card or account details)</li>
                <li><strong>Technical data:</strong> IP address, device type, and log data for security purposes</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">2. Use of Information</h2>
              <p>Your information is used to:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Generate your Wasiat or General Will document</li>
                <li>Send your PDF document to your email</li>
                <li>Process payment via licensed payment processor</li>
                <li>Provide customer support</li>
                <li>Improve our services</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">3. Information Sharing</h2>
              <p>We <strong>do not sell</strong> your personal information to third parties. Information is shared only with the following service providers:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Cloud database and authentication service provider (servers may be located outside Malaysia)</li>
                <li>Email delivery service provider</li>
                <li>Licensed payment processing provider in Malaysia</li>
                <li>Web hosting and content delivery service provider</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">4. Data Retention</h2>
              <p>Your information is stored securely in an encrypted database. Generated documents are retained until you delete your account or request data deletion.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">5. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Access your personal information</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your account and data</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p className="mt-2">For any requests, contact us at <a href="mailto:support@wasiathub.my" className="text-emerald-600 hover:underline">support@wasiathub.my</a></p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">6. Cookies</h2>
              <p>We use session cookies to maintain your login state and language preference. We do not use advertising or third-party tracking cookies.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">7. Contact Us</h2>
              <p>For any privacy-related enquiries: <a href="mailto:support@wasiathub.my" className="text-emerald-600 hover:underline">support@wasiathub.my</a></p>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
