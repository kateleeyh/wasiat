import { cookies } from 'next/headers'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wasiat 101 — Apa Yang Anda Perlu Tahu Sebelum Mulakan | WasiatHub',
  description: 'Panduan lengkap Wasiat Islam: had satu pertiga, harta yang boleh diwasiatkan, syarat saksi, pelantikan wasi, dan akibat tiada wasiat. Ditulis dalam Bahasa Melayu dan Inggeris.',
}

export default async function Wasiat101() {
  const cookieStore = await cookies()
  const ms = (cookieStore.get('locale')?.value ?? 'ms') === 'ms'

  return (
    <div className="min-h-screen bg-white">

      {/* ── Header ── */}
      <div className="bg-slate-900 pt-16 pb-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <Link href="/" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
            ← {ms ? 'Laman Utama' : 'Home'}
          </Link>
          <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            {ms ? 'Baca Sebelum Mulakan' : 'Read Before You Start'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-4 leading-tight">
            {ms
              ? 'Wasiat 101 — Semua Yang Perlu Anda Tahu Tentang Wasiat Islam'
              : 'Wasiat 101 — Everything You Need to Know About Your Islamic Will'}
          </h1>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed">
            {ms
              ? 'Sebelum anda mula mengisi borang, luangkan 10 minit untuk memahami asas Wasiat Islam. Ia akan membantu anda membuat keputusan yang lebih tepat semasa proses pengisian.'
              : 'Before you start filling in the form, take 10 minutes to understand the basics of Islamic Will. It will help you make better decisions throughout the process.'}
          </p>
          <p className="text-slate-500 text-xs mt-3">
            {ms ? '© 2026 WasiatHub · Kandungan asal WasiatHub' : '© 2026 WasiatHub · Original WasiatHub content'}
          </p>
        </div>
      </div>

      {/* ── Table of Contents ── */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            {ms ? 'Kandungan' : 'Contents'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
            {[
              { anchor: '#apa-itu', ms: '1. Apa itu Wasiat?', en: '1. What is a Wasiat?' },
              { anchor: '#mengapa-penting', ms: '2. Mengapa ia penting?', en: '2. Why does it matter?' },
              { anchor: '#satu-pertiga', ms: '3. Had Satu Pertiga (⅓)', en: '3. The One-Third Rule (⅓)' },
              { anchor: '#harta', ms: '4. Harta yang boleh & tidak boleh', en: '4. What can & cannot be included' },
              { anchor: '#penerima', ms: '5. Siapa boleh menerima?', en: '5. Who can receive?' },
              { anchor: '#wasi', ms: '6. Melantik Wasi (Pelaksana)', en: '6. Appointing a Wasi (Executor)' },
              { anchor: '#saksi', ms: '7. Syarat Saksi', en: '7. Witness Requirements' },
              { anchor: '#terbatal', ms: '8. Bila Wasiat Tidak Sah', en: '8. When a Wasiat Becomes Invalid' },
              { anchor: '#tiada-wasiat', ms: '9. Akibat Tiada Wasiat', en: '9. Consequences of No Wasiat' },
            ].map(item => (
              <a key={item.anchor} href={item.anchor}
                className="text-sm text-emerald-700 hover:text-emerald-900 hover:underline py-0.5 transition-colors">
                {ms ? item.ms : item.en}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14 text-slate-700 text-sm leading-relaxed">

        {/* ─── 1. Apa itu Wasiat ─── */}
        <section id="apa-itu">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            {ms ? '1. Apa Itu Wasiat?' : '1. What Is a Wasiat?'}
          </h2>
          <p>
            {ms
              ? 'Wasiat Islam adalah satu dokumen bertulis di mana anda — semasa masih hidup dan sihat akal — menyatakan hasrat anda tentang pengagihan harta selepas kematian. Berbeza dengan Surat Wasiat Am (General Will) yang dikawal oleh Akta Wasiat 1959, Wasiat Islam tertakluk kepada Enakmen Wasiat Orang Islam negeri masing-masing dan mesti mematuhi prinsip Syariah.'
              : 'An Islamic Will (Wasiat) is a written document in which you — while alive and of sound mind — state your wishes regarding the distribution of your assets after death. Unlike a General Will governed by the Wills Act 1959, a Wasiat is subject to each state\'s Islamic Will Enactment and must comply with Syariah principles.'}
          </p>
          <p className="mt-3">
            {ms
              ? 'Wasiat bukan sekadar soal harta. Ia juga tempat anda melantik seseorang yang anda percayai (Wasi) untuk menguruskan urusan harta anda, serta menentukan penjaga bagi anak-anak yang masih kecil jika berlaku sesuatu yang tidak dijangka.'
              : 'A Wasiat is not just about assets. It is also where you appoint someone you trust (a Wasi) to manage your estate matters, and designate a guardian for young children should the unexpected happen.'}
          </p>

          <div className="mt-5 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-800 space-y-1">
            <p className="font-bold text-sm">{ms ? 'Rukun Wasiat (4 perkara wajib ada):' : 'The 4 Pillars of a Valid Wasiat:'}</p>
            {ms ? (
              <ul className="space-y-1 mt-2">
                <li>① <strong>Pewasiat (Testator)</strong> — orang yang membuat wasiat</li>
                <li>② <strong>Penerima Manfaat (Beneficiary)</strong> — orang yang menerima harta</li>
                <li>③ <strong>Harta (Property)</strong> — harta yang ingin diwasiatkan</li>
                <li>④ <strong>Sighah</strong> — ikrar (tawaran) dan penerimaan yang jelas</li>
              </ul>
            ) : (
              <ul className="space-y-1 mt-2">
                <li>① <strong>Testator (Pewasiat)</strong> — the person making the Wasiat</li>
                <li>② <strong>Beneficiary</strong> — the person receiving assets</li>
                <li>③ <strong>Property (Harta)</strong> — the assets to be bequeathed</li>
                <li>④ <strong>Sighah</strong> — a clear offer (ijab) and acceptance (kabul)</li>
              </ul>
            )}
          </div>
        </section>

        {/* ─── 2. Mengapa penting ─── */}
        <section id="mengapa-penting">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            {ms ? '2. Mengapa Wasiat Penting?' : '2. Why Does a Wasiat Matter?'}
          </h2>
          <p>
            {ms
              ? 'Ramai yang beranggapan bahawa Faraid sudah cukup untuk menguruskan harta selepas kematian. Ini benar sebahagiannya — tetapi Faraid hanya menentukan siapa mendapat apa. Ia tidak melantik sesiapa untuk menguruskan proses tersebut, dan ia tidak mengambil kira situasi keluarga yang tidak standard.'
              : 'Many assume Faraid is sufficient to handle their estate after death. That\'s partly true — but Faraid only determines who gets what. It doesn\'t appoint anyone to manage the process, and it doesn\'t account for non-standard family situations.'}
          </p>
          <div className="mt-5 grid sm:grid-cols-2 gap-4">
            {[
              {
                title: ms ? 'Anak angkat atau anak tiri' : 'Adopted or stepchildren',
                body: ms ? 'Tidak ada hak di bawah Faraid. Tanpa Wasiat, mereka tidak akan menerima apa-apa.' : 'Have no Faraid rights. Without a Wasiat, they inherit nothing.',
                color: 'amber',
              },
              {
                title: ms ? 'Ibu bapa bukan Islam (Muallaf)' : 'Non-Muslim parents (Converts)',
                body: ms ? 'Tidak boleh mewarisi melalui Faraid. Wasiat adalah satu-satunya cara untuk memastikan mereka terlindungi.' : 'Cannot inherit via Faraid. A Wasiat is the only way to provide for them.',
                color: 'amber',
              },
              {
                title: ms ? 'Harta yang tidak dikenal pasti' : 'Unidentified assets',
                body: ms ? 'Tanpa Wasi yang dilantik, akaun bank, unit amanah atau saham yang terlupa mungkin kekal beku selama bertahun-tahun.' : 'Without an appointed Wasi, forgotten bank accounts, unit trusts or shares may remain frozen for years.',
                color: 'amber',
              },
              {
                title: ms ? 'Penjagaan anak-anak' : 'Child guardianship',
                body: ms ? 'Jika anda tiada wasiat, mahkamah yang akan menentukan siapa menjaga anak anda — bukan anda.' : 'Without a Wasiat, the court decides who raises your children — not you.',
                color: 'amber',
              },
            ].map((item, i) => (
              <div key={i} className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="font-semibold text-amber-900 text-xs mb-1">{item.title}</p>
                <p className="text-xs text-amber-800">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 3. Had Satu Pertiga ─── */}
        <section id="satu-pertiga">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            {ms ? '3. Had Satu Pertiga (⅓) — Peraturan Paling Penting' : '3. The One-Third Rule (⅓) — The Most Important Rule'}
          </h2>
          <p>
            {ms
              ? 'Ini adalah peraturan paling unik dalam Wasiat Islam dan yang paling sering disalah faham. Anda hanya boleh mewasiatkan sehingga satu pertiga (⅓) daripada harta bersih anda kepada penerima yang bukan waris Faraid. Dua pertiga (⅔) selebihnya akan diagihkan mengikut Faraid secara automatik.'
              : 'This is the most unique rule in Islamic Will and the one most often misunderstood. You may only bequeath up to one-third (⅓) of your net estate to recipients who are not Faraid heirs. The remaining two-thirds (⅔) is automatically distributed according to Faraid.'}
          </p>

          <div className="mt-5 bg-blue-50 border border-blue-200 rounded-xl p-5">
            <p className="font-bold text-blue-900 text-sm mb-3">{ms ? 'Contoh mudah:' : 'Simple example:'}</p>
            <div className="space-y-2 text-xs text-blue-800">
              <p>{ms ? '• Jumlah harta bersih: RM600,000' : '• Total net estate: RM600,000'}</p>
              <p>{ms ? '• Had maksimum yang boleh diwasiatkan: RM200,000 (⅓)' : '• Maximum you can bequeath via Wasiat: RM200,000 (⅓)'}</p>
              <p>{ms ? '• Baki RM400,000 (⅔) diagihkan mengikut Faraid kepada waris' : '• Remaining RM400,000 (⅔) distributed via Faraid to rightful heirs'}</p>
            </div>
            <div className="mt-3 pt-3 border-t border-blue-200 text-xs text-blue-700">
              <p className="font-semibold">{ms ? 'Pengecualian:' : 'Exception:'}</p>
              <p className="mt-1">
                {ms
                  ? 'Jika semua waris Faraid bersetuju selepas kematian anda, lebih daripada ⅓ boleh diagihkan mengikut wasiat. Persetujuan ini mestilah sukarela dan selepas kematian, bukan sebelumnya.'
                  : 'If all Faraid heirs unanimously agree after your death, more than ⅓ may be distributed as per the Wasiat. This agreement must be voluntary and given after death, not before.'}
              </p>
            </div>
          </div>

          <div className="mt-4 bg-slate-100 rounded-xl p-4 text-xs text-slate-600">
            <p className="font-semibold text-slate-700">{ms ? 'Nota penting:' : 'Important note:'}</p>
            <p className="mt-1">
              {ms
                ? '"Harta bersih" bermaksud harta selepas ditolak semua hutang, kos pengurusan jenazah, dan perbelanjaan pentadbiran harta. Had ⅓ dikira berdasarkan jumlah ini, bukan jumlah kasar harta anda.'
                : '"Net estate" means assets after deducting all debts, funeral costs, and estate administration expenses. The ⅓ limit is calculated on this figure, not your gross assets.'}
            </p>
          </div>
        </section>

        {/* ─── 4. Harta ─── */}
        <section id="harta">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            {ms ? '4. Harta Yang Boleh dan Tidak Boleh Diwasiatkan' : '4. What Can and Cannot Be Included in a Wasiat'}
          </h2>
          <p className="mb-4">
            {ms
              ? 'Tidak semua harta boleh dimasukkan dalam Wasiat. Memahami perbezaan ini akan mengelakkan konflik atau kekeliruan apabila Wasiat dilaksanakan kelak.'
              : 'Not all assets can be included in a Wasiat. Understanding this distinction will prevent disputes or confusion when the Wasiat is eventually executed.'}
          </p>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="border border-emerald-300 rounded-xl overflow-hidden">
              <div className="bg-emerald-600 px-4 py-2.5">
                <p className="text-white text-xs font-bold">✓ {ms ? 'BOLEH Diwasiatkan' : 'CAN Be Included'}</p>
              </div>
              <div className="p-4 space-y-1 text-xs text-slate-700">
                {(ms ? [
                  'Wang simpanan (akaun semasa & simpanan)',
                  'Tabung Haji',
                  'ASB / Unit Amanah',
                  'Saham & pelaburan',
                  'Kenderaan bermotor',
                  'Barang kemas & emas',
                  'Tanah & hartanah',
                  'Bangunan & premis perniagaan',
                  'Harta yang dicagarkan/digadai (nyatakan butiran hutang)',
                ] : [
                  'Cash savings (current & savings accounts)',
                  'Tabung Haji',
                  'ASB / Unit Trusts',
                  'Shares & investments',
                  'Motor vehicles',
                  'Jewellery & gold',
                  'Land & real estate',
                  'Buildings & business premises',
                  'Charged/mortgaged property (state debt details)',
                ]).map((item, i) => (
                  <p key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 shrink-0 mt-0.5">✓</span>{item}
                  </p>
                ))}
              </div>
            </div>

            <div className="border border-red-200 rounded-xl overflow-hidden">
              <div className="bg-red-500 px-4 py-2.5">
                <p className="text-white text-xs font-bold">✗ {ms ? 'TIDAK BOLEH Diwasiatkan' : 'CANNOT Be Included'}</p>
              </div>
              <div className="p-4 space-y-1 text-xs text-slate-700">
                {(ms ? [
                  'Wang pencen (pension)',
                  'PERKESO / SOCSO',
                  'Wang KWSP (ada prosedur penama tersendiri)',
                  'Harta yang telah diwakafkan',
                  'Harta yang telah dijual atau dipindah milik',
                  'Harta yang diperoleh melalui Hibah',
                  'Wang pinjaman (bukan milik anda)',
                  'Wang saguhati & insurans (ada penama)',
                ] : [
                  'Pension money',
                  'PERKESO / SOCSO',
                  'EPF / KWSP (has its own nomination process)',
                  'Property already under Wakaf',
                  'Assets already sold or transferred',
                  'Assets received via Hibah',
                  'Borrowed money (not your property)',
                  'Gratuity & insurance (has nominees)',
                ]).map((item, i) => (
                  <p key={i} className="flex items-start gap-2">
                    <span className="text-red-500 shrink-0 mt-0.5">✗</span>{item}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
            <p className="font-semibold">{ms ? '⚠ Tentang KWSP & Insurans:' : '⚠ About EPF & Insurance:'}</p>
            <p className="mt-1">
              {ms
                ? 'Penama KWSP dan insurans adalah berbeza daripada Wasiat. Wang ini diserahkan kepada penama dan bukan sebahagian daripada harta wasiat. Pastikan penama KWSP dan polisi insurans anda dikemas kini secara berasingan.'
                : 'EPF and insurance nominations are separate from a Wasiat. These funds go directly to nominees and do not form part of the Wasiat estate. Ensure your EPF and insurance nominations are updated separately.'}
            </p>
          </div>
        </section>

        {/* ─── 5. Penerima manfaat ─── */}
        <section id="penerima">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            {ms ? '5. Siapa Yang Boleh Menerima Melalui Wasiat?' : '5. Who Can Receive Through a Wasiat?'}
          </h2>
          <p>
            {ms
              ? 'Secara asasnya, Wasiat bertujuan untuk memberikan harta kepada mereka yang tidak dilindungi oleh Faraid — atau mendapat bahagian kecil di bawah Faraid. Waris Faraid (seperti isteri, anak, ibu bapa) boleh menerima melalui Wasiat tetapi memerlukan persetujuan semua waris lain kerana had ⅓ berkuat kuasa.'
              : 'Fundamentally, a Wasiat is meant to provide for those not covered by Faraid — or who receive a small share under Faraid. Faraid heirs (such as spouse, children, parents) can receive through a Wasiat but require the agreement of all other heirs since the ⅓ limit applies.'}
          </p>

          <div className="mt-5 space-y-3">
            {[
              {
                tag: ms ? 'Anak angkat / Anak tiri' : 'Adopted / Stepchildren',
                body: ms ? 'Tidak ada hak Faraid. Anda boleh mewasiatkan sehingga ⅓ harta kepada mereka melalui Wasiat.' : 'No Faraid rights. You may bequeath up to ⅓ of your estate to them via Wasiat.',
                color: 'blue',
              },
              {
                tag: ms ? 'Muallaf — ibu bapa bukan Islam' : 'Converts (Muallaf) — Non-Muslim parents',
                body: ms ? 'Ibu bapa bukan Islam anda boleh menerima harta daripada Wasiat anda sehingga had ⅓. Jika melebihi ⅓, semua waris perlu bersetuju.' : 'Your non-Muslim parents can receive from your Wasiat up to the ⅓ limit. If exceeding ⅓, all heirs must consent.',
                color: 'blue',
              },
              {
                tag: ms ? 'Anak yang belum dilahirkan' : 'Unborn child',
                body: ms ? 'Wasiat kepada anak yang belum lahir adalah sah jika anak tersebut dilahirkan hidup dalam tempoh yang diiktiraf mengikut undang-undang Islam.' : 'A bequest to an unborn child is valid if the child is born alive within the period recognised under Islamic law.',
                color: 'blue',
              },
              {
                tag: ms ? 'Pertubuhan amal / NGO' : 'Charitable organisations / NGOs',
                body: ms ? 'Anda boleh mewasiatkan sebahagian harta kepada badan amal, masjid, atau mana-mana pertubuhan Islam yang sah.' : 'You may bequeath a portion of your estate to charities, mosques, or any legitimate Islamic organisation.',
                color: 'blue',
              },
            ].map((item, i) => (
              <div key={i} className="border border-blue-200 rounded-xl p-4 bg-blue-50">
                <p className="text-xs font-bold text-blue-800 mb-1">{item.tag}</p>
                <p className="text-xs text-blue-700">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 6. Wasi ─── */}
        <section id="wasi">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            {ms ? '6. Melantik Wasi (Pelaksana)' : '6. Appointing a Wasi (Executor)'}
          </h2>
          <p>
            {ms
              ? 'Wasi adalah orang yang anda lantik untuk melaksanakan Wasiat anda selepas kematian. Mereka bertanggungjawab untuk mengenal pasti harta, menyelesaikan hutang, memohon Surat Kuasa Mentadbir, dan mengagihkan harta kepada penerima yang ditetapkan.'
              : 'A Wasi is the person you appoint to execute your Wasiat after death. They are responsible for identifying your assets, settling debts, applying for Letters of Administration, and distributing assets to your named beneficiaries.'}
          </p>

          <div className="mt-5 grid sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <p className="font-bold text-emerald-800 mb-2">{ms ? '✓ Syarat Wasi' : '✓ Wasi Requirements'}</p>
              <ul className="space-y-1 text-emerald-700">
                <li>• {ms ? 'Berumur 18 tahun ke atas' : 'Aged 18 and above'}</li>
                <li>• {ms ? 'Sihat akal' : 'Of sound mind'}</li>
                <li>• {ms ? 'Lelaki atau perempuan — tiada sekatan jantina' : 'Male or female — no gender restriction'}</li>
                <li>• {ms ? 'Boleh juga menjadi penerima manfaat' : 'Can also be a beneficiary'}</li>
                <li>• {ms ? 'Seseorang yang anda percayai sepenuhnya' : 'Someone you trust completely'}</li>
              </ul>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="font-bold text-slate-800 mb-2">{ms ? '📋 Tugas Wasi' : '📋 Wasi Duties'}</p>
              <ul className="space-y-1 text-slate-600">
                <li>• {ms ? 'Memohon Surat Kuasa Mentadbir (LOA)' : 'Apply for Letters of Administration'}</li>
                <li>• {ms ? 'Mengenal pasti dan mengumpul semua harta' : 'Identify and collect all assets'}</li>
                <li>• {ms ? 'Menyelesaikan hutang dan cukai' : 'Settle debts and taxes'}</li>
                <li>• {ms ? 'Mengagihkan harta mengikut Wasiat & Faraid' : 'Distribute assets per Wasiat & Faraid'}</li>
              </ul>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-500 italic">
            {ms
              ? '💡 Tip: Lantik juga Wasi Sandaran (backup) sekiranya Wasi Utama tidak dapat menjalankan tugas apabila tiba masanya.'
              : '💡 Tip: Also appoint a backup Wasi in case your primary Wasi is unable to serve when the time comes.'}
          </p>
        </section>

        {/* ─── 7. Syarat Saksi ─── */}
        <section id="saksi">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            {ms ? '7. Syarat Saksi Dalam Wasiat Islam' : '7. Witness Requirements for an Islamic Will'}
          </h2>
          <p>
            {ms
              ? 'Syarat saksi bagi Wasiat Islam adalah berbeza daripada Surat Wasiat Am. Di bawah undang-undang Syariah, kriteria saksi adalah lebih spesifik kerana keterangan mereka mungkin diperlukan di Mahkamah Syariah jika Wasiat dicabar.'
              : 'Witness requirements for an Islamic Will differ from a General Will. Under Syariah law, witness criteria are more specific as their testimony may be needed in Syariah Court if the Wasiat is challenged.'}
          </p>

          <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-xs text-emerald-800 space-y-3">
            <p className="font-bold text-sm">{ms ? 'Syarat Saksi (Enakmen Mahkamah Syariah):' : 'Witness Requirements (Syariah Court Enactments):'}</p>
            <div className="space-y-2">
              <p>① <strong>{ms ? 'Bilangan:' : 'Number:'}</strong> {ms ? '2 orang saksi lelaki, ATAU 1 orang saksi lelaki dan 2 orang saksi perempuan' : '2 male witnesses, OR 1 male witness and 2 female witnesses'}</p>
              <p>② <strong>{ms ? 'Agama:' : 'Religion:'}</strong> {ms ? 'Mestilah beragama Islam' : 'Must be Muslim'}</p>
              <p>③ <strong>{ms ? 'Umur & akal:' : 'Age & mind:'}</strong> {ms ? 'Baligh (matang) dan \'aqil (sihat akal)' : 'Baligh (mature) and \'aqil (of sound mind)'}</p>
              <p>④ <strong>{ms ? '\'Adil:' : '\'Adil:'}</strong> {ms ? 'Seseorang yang berkelakuan baik dan boleh dipercayai' : 'A person of good character and trustworthiness'}</p>
              <p>⑤ <strong>{ms ? 'Ingatan baik:' : 'Good memory:'}</strong> {ms ? 'Mampu mengingati dan memberi keterangan yang tepat' : 'Able to recall and provide accurate testimony'}</p>
            </div>
          </div>

          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-800">
            <p className="font-bold mb-1">{ms ? '✗ Saksi TIDAK BOLEH:' : '✗ A Witness MUST NOT:'}</p>
            <ul className="space-y-1">
              <li>• {ms ? 'Menjadi penerima manfaat dalam Wasiat ini (pemberian kepada mereka akan terbatal)' : 'Be a beneficiary in this Wasiat (their gift will be void)'}</li>
              <li>• {ms ? 'Menjadi pasangan kepada penerima manfaat' : 'Be the spouse of a beneficiary'}</li>
              <li>• {ms ? 'Menjadi pewasiat itu sendiri' : 'Be the testator themselves'}</li>
              <li>• {ms ? 'Merupakan orang yang sama (kedua-dua saksi mestilah berbeza)' : 'Be the same person (both witnesses must be different individuals)'}</li>
            </ul>
          </div>
        </section>

        {/* ─── 8. Bila terbatal ─── */}
        <section id="terbatal">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            {ms ? '8. Bila Wasiat Menjadi Tidak Sah atau Terbatal' : '8. When a Wasiat Becomes Invalid or Is Revoked'}
          </h2>

          <div className="space-y-3">
            <p className="font-semibold text-slate-800">{ms ? 'Wasiat terbatal secara automatik jika:' : 'A Wasiat is automatically void if:'}</p>
            <ul className="space-y-2 text-sm">
              {(ms ? [
                'Pewasiat hilang akal dan meninggal dunia dalam keadaan tersebut',
                'Penerima manfaat meninggal dunia sebelum pewasiat',
                'Harta yang diwasiatkan musnah atau tidak wujud lagi',
                'Pewasiat sendiri membatalkan Wasiat (secara lisan, bertulis, atau melalui tindakan)',
                'Penerima manfaat terbukti menyebabkan kematian pewasiat — sama ada secara langsung atau tidak langsung',
              ] : [
                'The testator loses their mind and dies in that state',
                'The beneficiary passes away before the testator',
                'The bequeathed asset is destroyed or no longer exists',
                'The testator revokes the Wasiat (verbally, in writing, or through action)',
                'The beneficiary is proven to have caused the testator\'s death — directly or indirectly',
              ]).map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-red-400 shrink-0 font-bold">✗</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600">
              <p className="font-semibold text-slate-700">{ms ? 'Cara membatalkan Wasiat secara sengaja:' : 'How to intentionally revoke a Wasiat:'}</p>
              <p className="mt-2">
                {ms
                  ? 'Anda boleh membatalkan Wasiat pada bila-bila masa semasa hayat anda dengan membuat Wasiat baru yang menggantikan yang lama, atau dengan menyatakan secara jelas (lisan atau bertulis) hasrat untuk membatalkannya. Menjual atau memindah milik harta yang diwasiatkan juga secara tersirat membatalkan wasiat ke atas harta tersebut.'
                  : 'You may revoke a Wasiat at any time during your lifetime by creating a new Wasiat that supersedes the old one, or by clearly stating (verbally or in writing) your intention to revoke it. Selling or transferring a bequeathed asset also implicitly revokes the bequest for that asset.'}
              </p>
            </div>
          </div>
        </section>

        {/* ─── 9. Tiada Wasiat ─── */}
        <section id="tiada-wasiat">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            {ms ? '9. Apa Yang Berlaku Jika Tiada Wasiat?' : '9. What Happens If You Have No Wasiat?'}
          </h2>
          <p>
            {ms
              ? 'Tiada Wasiat bukan bermakna harta anda tidak akan diagihkan — ia bermakna anda tidak lagi mempunyai kawalan ke atas bagaimana, kepada siapa, dan bila ia diagihkan.'
              : 'Having no Wasiat does not mean your assets won\'t be distributed — it means you no longer have control over how, to whom, and when they are distributed.'}
          </p>

          <div className="mt-5 space-y-3">
            {(ms ? [
              { icon: '🔒', title: 'Harta dibekukan', body: 'Semua harta anda — akaun bank, kenderaan, hartanah — dibekukan serta-merta selepas kematian anda. Keluarga tidak boleh mengakses atau menggunakannya sehingga proses pentadbiran selesai.' },
              { icon: '⏳', title: 'Proses yang panjang', body: 'Tanpa Wasi yang dilantik, proses pentadbiran harta boleh mengambil masa 3 hingga 10 tahun. Ini memberi tekanan besar kepada keluarga yang anda tinggalkan.' },
              { icon: '👶', title: 'Nasib anak-anak tidak terjamin', body: 'Harta untuk anak-anak bawah umur akan diserahkan kepada Amanah Raya Berhad sehingga mereka mencapai usia 18 tahun — tanpa pilihan daripada anda.' },
              { icon: '💔', title: 'Anak angkat & orang yang anda sayangi mungkin tidak mendapat apa-apa', body: 'Faraid hanya mengiktiraf waris mengikut hubungan darah dan perkahwinan yang sah dari sisi Islam. Mereka yang anda sayangi tetapi tidak ada hubungan darah tidak akan mendapat apa-apa.' },
            ] : [
              { icon: '🔒', title: 'Assets frozen', body: 'All your assets — bank accounts, vehicles, property — are immediately frozen after your death. Family members cannot access or use them until the administration process is complete.' },
              { icon: '⏳', title: 'Lengthy process', body: 'Without an appointed Wasi, estate administration can take 3 to 10 years. This places enormous pressure on the family you leave behind.' },
              { icon: '👶', title: 'Children\'s future left uncertain', body: 'Assets for underage children will be transferred to Amanah Raya Berhad until they turn 18 — with no input from you on how they are managed.' },
              { icon: '💔', title: 'Loved ones may receive nothing', body: 'Faraid only recognises heirs through blood ties and valid Islamic marriage. Those you care about without such a legal connection will receive nothing.' },
            ]).map((item, i) => (
              <div key={i} className="flex gap-4 border border-slate-200 rounded-xl p-4">
                <span className="text-2xl shrink-0">{item.icon}</span>
                <div>
                  <p className="font-semibold text-slate-800 text-sm mb-1">{item.title}</p>
                  <p className="text-xs text-slate-600">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="bg-emerald-900 rounded-2xl p-8 text-center">
          <p className="text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
            {ms ? 'Anda sudah bersedia' : 'You\'re ready'}
          </p>
          <h3 className="text-white text-xl font-bold mb-3">
            {ms ? 'Mula Buat Wasiat Anda Sekarang' : 'Start Creating Your Wasiat Now'}
          </h3>
          <p className="text-emerald-200 text-sm mb-6 max-w-md mx-auto">
            {ms
              ? 'Dokumen Wasiat Islam yang lengkap dan mematuhi Enakmen Wasiat Orang Islam. Siap dalam 15 minit, dihantar terus ke e-mel anda.'
              : 'A complete Islamic Will document compliant with the Islamic Will Enactments. Ready in 15 minutes, delivered straight to your email.'}
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-white text-emerald-900 font-bold text-sm px-8 py-3 rounded-xl hover:bg-emerald-50 transition-colors"
          >
            {ms ? 'Mulakan Wasiat Saya →' : 'Start My Wasiat →'}
          </Link>
          <p className="text-emerald-400 text-xs mt-4">
            {ms ? 'Draf disimpan secara automatik. Bayar hanya apabila bersedia.' : 'Draft saved automatically. Pay only when ready.'}
          </p>
        </section>

        {/* ─── Copyright footer ─── */}
        <div className="border-t border-slate-200 pt-6 text-xs text-slate-400 space-y-2">
          <p>
            {ms
              ? '© 2026 WasiatHub (Wisely Horizon Sdn. Bhd.). Kandungan halaman ini adalah hak cipta WasiatHub dan ditulis berdasarkan kajian undang-undang Malaysia termasuk Enakmen Wasiat Orang Islam negeri-negeri, Akta Pembahagian 1958, dan Enakmen Keterangan Mahkamah Syariah.'
              : '© 2026 WasiatHub (Wisely Horizon Sdn. Bhd.). The content of this page is copyright WasiatHub and is written based on research into Malaysian law including state Islamic Will Enactments, Distribution Act 1958, and Syariah Court Evidence Enactments.'}
          </p>
          <p>
            {ms
              ? 'Maklumat di sini adalah untuk tujuan pendidikan sahaja dan tidak merupakan nasihat undang-undang. Sila rujuk peguam Syarie atau pegawai agama untuk kes yang lebih kompleks.'
              : 'Information here is for educational purposes only and does not constitute legal advice. Please consult a Syarie lawyer or religious officer for more complex cases.'}
          </p>
        </div>

      </div>
    </div>
  )
}
