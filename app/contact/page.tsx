import { cookies } from 'next/headers'
import Link from 'next/link'
import { ArrowLeft, Mail, Clock } from 'lucide-react'

export default async function ContactPage() {
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
          <h1 className="text-3xl font-bold text-white">{ms ? 'Hubungi Kami' : 'Contact Us'}</h1>
          <p className="text-slate-400 text-sm mt-2">
            {ms ? 'Kami sedia membantu anda.' : 'We are here to help.'}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
              <Mail className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">{ms ? 'E-mel Sokongan' : 'Support Email'}</h3>
            <p className="text-slate-500 text-sm mb-3">
              {ms ? 'Untuk pertanyaan umum, teknikal, atau pembayaran.' : 'For general, technical, or payment enquiries.'}
            </p>
            <a href="mailto:support@wasiathub.my" className="text-emerald-600 font-medium text-sm hover:underline">
              support@wasiathub.my
            </a>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
              <Clock className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">{ms ? 'Masa Respons' : 'Response Time'}</h3>
            <p className="text-slate-500 text-sm mb-3">
              {ms ? 'Kami biasanya membalas dalam masa 1–2 hari bekerja.' : 'We typically respond within 1–2 business days.'}
            </p>
            <p className="text-slate-600 text-sm font-medium">
              {ms ? 'Isnin – Jumaat, 9am – 6pm' : 'Monday – Friday, 9am – 6pm'}
            </p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <p className="text-amber-800 text-sm font-semibold mb-1">
            {ms ? '⚠ Untuk nasihat undang-undang' : '⚠ For legal advice'}
          </p>
          <p className="text-amber-700 text-sm">
            {ms
              ? 'WasiatHub tidak menyediakan nasihat undang-undang. Untuk pertanyaan perundangan, sila hubungi peguam berdaftar atau Peguam Syarie di Malaysia.'
              : 'WasiatHub does not provide legal advice. For legal enquiries, please contact a registered lawyer or Peguam Syarie in Malaysia.'}
          </p>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            {ms ? 'Soalan lazim? Semak ' : 'Have questions? Check our '}
            <a href="/#faq" className="text-emerald-600 hover:underline font-medium">
              {ms ? 'halaman Soal Jawab kami' : 'FAQ section'}
            </a>
            {ms ? ' dahulu.' : ' first.'}
          </p>
        </div>
      </div>
    </div>
  )
}
