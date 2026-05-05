import { cookies } from 'next/headers'
import Link from 'next/link'
import { ArrowLeft, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Akaun Bank Dibekukan Bila Meninggal Dunia — Ini Yang Sebenarnya Berlaku',
  description: 'Ramai tidak tahu bahawa akaun bank si mati akan dibekukan secara automatik. Wang tidak boleh dikeluarkan oleh sesiapa — termasuk pasangan atau anak-anak — tanpa dokumen sah.',
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
          <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full">
            {ms ? 'Penting Diketahui' : 'Important to Know'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-4 leading-tight">
            {ms
              ? 'Akaun Bank Dibekukan Bila Meninggal Dunia — Ini Yang Sebenarnya Berlaku'
              : 'Bank Account Frozen When Someone Dies — What Really Happens'}
          </h1>
          <p className="text-slate-400 text-sm mt-3">
            {ms ? '1 Mei 2026 · 5 minit bacaan' : '1 May 2026 · 5 min read'}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-slate-700 text-sm leading-relaxed space-y-6">

          <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-5">
            <p className="text-amber-900 font-semibold text-base">
              {ms
                ? 'Situasi ini berlaku lebih kerap daripada yang disedari: Sebuah keluarga memerlukan wang untuk menguruskan perbelanjaan jenazah. Mereka pergi ke bank dengan buku akaun dan sijil kematian. Bank menolak permintaan mereka.'
                : 'This situation happens more often than realised: A family needs money to cover funeral expenses. They go to the bank with the account book and death certificate. The bank refuses their request.'}
            </p>
          </div>

          <h2 className="text-lg font-bold text-slate-900">
            {ms ? 'Mengapa Akaun Bank Dibekukan?' : 'Why Is the Bank Account Frozen?'}
          </h2>
          <p>
            {ms
              ? 'Apabila seseorang meninggal dunia, bank akan menerima notis kematian daripada pelbagai saluran — sama ada daripada JPN, waris yang memaklumkan, atau melalui sistem dalaman. Sebaik sahaja notis diterima, akaun akan dibekukan bagi melindungi harta pusaka si mati.'
              : 'When someone passes away, banks receive death notices through various channels — from the National Registration Department, heirs who inform them, or through internal systems. Once the notice is received, the account is frozen to protect the deceased\'s estate.'}
          </p>
          <p>
            {ms
              ? 'Ini bukan dasar bank semata-mata. Ia adalah keperluan undang-undang. Di bawah Akta Probet dan Pentadbiran 1959 dan undang-undang berkaitan, hanya pihak yang dilantik secara sah — sama ada melalui Grant of Probate atau Letter of Administration — yang berhak mengurus harta pusaka termasuk wang dalam akaun bank.'
              : 'This is not merely bank policy. It is a legal requirement. Under the Probate and Administration Act 1959 and related laws, only legally authorised parties — through Grant of Probate or Letter of Administration — are entitled to manage the estate including bank account funds.'}
          </p>

          <h2 className="text-lg font-bold text-slate-900">
            {ms ? 'Apa Yang Boleh dan Tidak Boleh Dilakukan?' : 'What Can and Cannot Be Done?'}
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <p className="font-semibold text-emerald-800 text-sm mb-2">✓ {ms ? 'Boleh Dilakukan' : 'Allowed'}</p>
              {(ms ? [
                'Maklumkan bank tentang kematian',
                'Mohon penyata akaun untuk rekod pusaka',
                'Renew direct debit utiliti (dalam tempoh tertentu)',
              ] : [
                'Inform the bank of the death',
                'Request account statements for estate records',
                'Renew utility direct debits (within certain period)',
              ]).map(i => (
                <p key={i} className="text-xs text-emerald-700 flex items-start gap-1 mt-1">
                  <CheckCircle className="w-3 h-3 shrink-0 mt-0.5" />{i}
                </p>
              ))}
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="font-semibold text-red-800 text-sm mb-2">✗ {ms ? 'Tidak Boleh Dilakukan' : 'Not Allowed'}</p>
              {(ms ? [
                'Keluarkan wang dari akaun',
                'Pindahkan wang ke akaun lain',
                'Tutup akaun',
                'Gunakan kad ATM si mati',
              ] : [
                'Withdraw money from the account',
                'Transfer money to another account',
                'Close the account',
                'Use the deceased\'s ATM card',
              ]).map(i => (
                <p key={i} className="text-xs text-red-700 flex items-start gap-1 mt-1">
                  <XCircle className="w-3 h-3 shrink-0 mt-0.5" />{i}
                </p>
              ))}
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800 text-sm">
                  {ms ? 'Amaran penting: Menggunakan akaun si mati adalah kesalahan undang-undang' : 'Important warning: Using a deceased\'s account is a legal offence'}
                </p>
                <p className="text-xs text-red-700 mt-1">
                  {ms
                    ? 'Walaupun anda adalah pasangan atau anak si mati, menggunakan kad ATM atau mengeluarkan wang dari akaun si mati selepas kematian tanpa kebenaran mahkamah boleh dianggap sebagai penyelewengan harta pusaka — yang boleh membawa kepada tindakan undang-undang.'
                    : 'Even if you are the spouse or child of the deceased, using the ATM card or withdrawing money from the account after death without court authorisation can be considered estate misappropriation — which can lead to legal action.'}
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-lg font-bold text-slate-900">
            {ms ? 'Proses Untuk Keluarkan Wang Arwah' : 'Process to Access Deceased\'s Bank Funds'}
          </h2>
          <div className="space-y-3">
            {(ms ? [
              { step: '1', title: 'Dapatkan dokumen pusaka', desc: 'Grant of Probate (jika ada wasiat) atau Letter of Administration (jika tiada wasiat) daripada Mahkamah Tinggi. Atau Perintah Agihan Pusaka Kecil untuk harta di bawah RM2 juta.' },
              { step: '2', title: 'Hantar dokumen ke bank', desc: 'Serahkan dokumen asal kepada cawangan bank bersama-sama dengan IC waris yang berwibawa dan dokumen sokongan lain yang diperlukan oleh bank.' },
              { step: '3', title: 'Tunggu kelulusan bank', desc: 'Bank akan memproses permohonan dan mengesahkan kesahihan dokumen. Tempoh pemprosesan berbeza mengikut bank dan nilai akaun.' },
              { step: '4', title: 'Agihkan mengikut perintah mahkamah', desc: 'Wang yang dikeluarkan mesti diagihkan mengikut arahan wasiat atau perintah mahkamah — bukan atas budi bicara individu.' },
            ] : [
              { step: '1', title: 'Obtain estate documents', desc: 'Grant of Probate (if there is a will) or Letter of Administration (if no will) from the High Court. Or Small Estate Distribution Order for estates under RM2 million.' },
              { step: '2', title: 'Submit documents to bank', desc: 'Present original documents to the bank branch along with the authorised heir\'s IC and other supporting documents required by the bank.' },
              { step: '3', title: 'Await bank approval', desc: 'The bank will process the application and verify document authenticity. Processing time varies by bank and account value.' },
              { step: '4', title: 'Distribute per court order', desc: 'Money released must be distributed according to the will\'s instructions or court order — not at an individual\'s discretion.' },
            ]).map(item => (
              <div key={item.step} className="flex gap-3">
                <div className="w-7 h-7 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">{item.step}</div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{item.title}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-lg font-bold text-slate-900">
            {ms ? 'Bagaimana Wasiat Mempercepatkan Proses Ini?' : 'How Does a Will Speed Up This Process?'}
          </h2>
          <p>
            {ms
              ? 'Dengan wasiat yang sah, pelaksana (wasi) yang telah ditetapkan boleh terus memohon Grant of Probate tanpa perlu mendapatkan persetujuan semua waris. Mahkamah memproses permohonan ini dengan lebih pantas kerana arahan pembahagian sudah jelas.'
              : 'With a valid will, the appointed executor can directly apply for Grant of Probate without needing all heirs\' consent. The court processes this faster because distribution instructions are already clear.'}
          </p>
          <p>
            {ms
              ? 'Tanpa wasiat, waris perlu memohon Letter of Administration — yang memerlukan persetujuan semua waris yang berhak, perlantikan pentadbir oleh mahkamah, dan jaminan (bond) daripada dua penjamin. Proses ini jauh lebih panjang dan mahal.'
              : 'Without a will, heirs must apply for a Letter of Administration — which requires consent from all entitled heirs, court-appointed administrator, and a bond from two guarantors. This process is much longer and more expensive.'}
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-500">
            <p>📌 {ms
              ? 'Rujukan undang-undang: Akta Probet dan Pentadbiran 1959 | Akta Harta Pusaka Kecil (Pembahagian) 1955 | Akta Wasiat 1959 | Undang-undang perbankan Malaysia. Prosedur sebenar mungkin berbeza mengikut bank dan jenis akaun.'
              : 'Legal references: Probate and Administration Act 1959 | Small Estates (Distribution) Act 1955 | Wills Act 1959 | Malaysian banking laws. Actual procedures may vary by bank and account type.'}
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
            <p className="font-semibold text-emerald-800 mb-2">💡 {ms ? 'Kesimpulan' : 'Key takeaway'}</p>
            <p className="text-sm text-emerald-700">
              {ms
                ? 'Membekukan akaun bukan tindakan bank semata-mata — ia adalah proses undang-undang untuk melindungi hak semua waris. Wasiat memastikan proses ini berjalan lebih lancar, lebih cepat, dan mengelakkan pertikaian.'
                : 'Account freezing is not merely a bank action — it is a legal process to protect all heirs\' rights. A will ensures this process runs more smoothly, faster, and avoids disputes.'}
            </p>
          </div>

        </div>

        <div className="mt-8 p-5 bg-slate-50 border border-slate-200 rounded-xl text-sm">
          <p className="font-semibold text-slate-800 mb-2">{ms ? 'Baca juga:' : 'Read also:'}</p>
          <Link href="/insights/kereta-tanpa-wasiat" className="text-emerald-600 hover:underline block">
            → {ms ? 'Tukar Nama Kereta Arwah — Ini Proses Sebenar' : 'Transferring a Deceased\'s Car — The Real Process'}
          </Link>
          <Link href="/insights/grant-of-probate-vs-loa" className="text-emerald-600 hover:underline block mt-1">
            → {ms ? 'Grant of Probate vs Letter of Administration — Apa Bezanya?' : 'Grant of Probate vs Letter of Administration — What\'s the Difference?'}
          </Link>
        </div>

        <div className="mt-6 p-6 bg-slate-900 rounded-2xl text-center">
          <p className="text-white font-bold text-lg mb-2">
            {ms ? 'Permudahkan proses untuk keluarga anda.' : 'Make it easier for your family.'}
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
