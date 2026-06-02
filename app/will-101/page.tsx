import { cookies } from 'next/headers'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'General Will 101 — What You Need to Know Before You Start | WasiatHub',
  description: 'A complete guide to the General Will (Surat Wasiat Am) in Malaysia: who can make one, what assets can be included, executor and witness rules, and what happens without a will.',
}

export default async function Will101() {
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
          <span className="bg-blue-500/20 text-blue-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            {ms ? 'Baca Sebelum Mulakan' : 'Read Before You Start'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-4 leading-tight">
            {ms
              ? 'General Will 101 — Semua Yang Perlu Anda Tahu Tentang Surat Wasiat Am'
              : 'General Will 101 — Everything You Need to Know About Your Will'}
          </h1>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed">
            {ms
              ? 'Sebelum anda mula mengisi borang, luangkan 10 minit untuk memahami asas Surat Wasiat Am di Malaysia. Ia akan membantu anda membuat keputusan yang lebih tepat semasa proses pengisian.'
              : 'Before you start filling in the form, take 10 minutes to understand the basics of a General Will in Malaysia. It will help you make better decisions throughout the process.'}
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
              { anchor: '#apa-itu',       ms: '1. Apa itu Surat Wasiat Am?',        en: '1. What is a General Will?' },
              { anchor: '#siapa-boleh',   ms: '2. Siapa yang boleh membuatnya?',     en: '2. Who can make one?' },
              { anchor: '#kebebasan',     ms: '3. Kebebasan Penuh — Tiada Had ⅓',   en: '3. Complete Freedom — No ⅓ Limit' },
              { anchor: '#harta',         ms: '4. Harta yang boleh & tidak boleh',   en: '4. What can & cannot be included' },
              { anchor: '#penerima',      ms: '5. Siapa boleh menerima?',            en: '5. Who can receive?' },
              { anchor: '#executor',      ms: '6. Melantik Executor & Penjaga',      en: '6. Appointing an Executor & Guardian' },
              { anchor: '#saksi',         ms: '7. Syarat Saksi',                     en: '7. Witness Requirements' },
              { anchor: '#terbatal',      ms: '8. Bila Will Tidak Sah',              en: '8. When a Will Becomes Invalid' },
              { anchor: '#tiada-will',    ms: '9. Akibat Tiada Will',                en: '9. Consequences of No Will' },
            ].map(item => (
              <a key={item.anchor} href={item.anchor}
                className="text-sm text-blue-700 hover:text-blue-900 hover:underline py-0.5 transition-colors">
                {ms ? item.ms : item.en}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14 text-slate-700 text-sm leading-relaxed">

        {/* ─── 1. Apa itu Surat Wasiat Am ─── */}
        <section id="apa-itu">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            {ms ? '1. Apa Itu Surat Wasiat Am (General Will)?' : '1. What Is a General Will?'}
          </h2>
          <p>
            {ms
              ? 'Surat Wasiat Am adalah dokumen undang-undang bertulis di mana anda — semasa masih hidup dan waras akal — menyatakan hasrat anda tentang pengagihan harta selepas kematian. Di Malaysia, ia dikawal oleh Akta Wasiat 1959 (untuk Semenanjung Malaysia dan Sarawak) dan Ordinan Wasiat Sabah (Bab. 158) untuk Sabah.'
              : 'A General Will is a written legal document in which you — while alive and of sound mind — state your wishes about the distribution of your assets after death. In Malaysia, it is governed by the Wills Act 1959 (for Peninsular Malaysia and Sarawak) and the Wills Ordinance Sabah (Cap. 158) for Sabah.'}
          </p>
          <p className="mt-3">
            {ms
              ? 'Surat Wasiat Am hanya boleh dibuat oleh bukan Muslim. Untuk orang Islam, instrumen yang digunakan adalah Wasiat Islam yang tertakluk kepada Enakmen Wasiat Orang Islam negeri masing-masing.'
              : 'A General Will can only be made by non-Muslims. For Muslims, the relevant instrument is the Islamic Will (Wasiat), governed by each state\'s Islamic Will Enactment.'}
          </p>

          <div className="mt-5 bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 space-y-1">
            <p className="font-bold text-sm">{ms ? 'Elemen Asas Will yang Sah:' : 'Core Elements of a Valid Will:'}</p>
            <ul className="space-y-1 mt-2">
              {ms ? (
                <>
                  <li>① <strong>Pewasiat (Testator)</strong> — orang yang membuat Will, berumur 18+ (21+ di Sabah), waras akal</li>
                  <li>② <strong>Penerima Manfaat (Beneficiary)</strong> — sesiapa yang akan menerima harta</li>
                  <li>③ <strong>Harta (Estate)</strong> — aset yang ingin diserahkan</li>
                  <li>④ <strong>Executor</strong> — orang dilantik untuk melaksanakan Will</li>
                  <li>⑤ <strong>Saksi (Witnesses)</strong> — 2 orang saksi yang hadir serentak semasa tandatangan</li>
                </>
              ) : (
                <>
                  <li>① <strong>Testator</strong> — the person making the Will, aged 18+ (21+ in Sabah), of sound mind</li>
                  <li>② <strong>Beneficiary</strong> — anyone who will receive assets</li>
                  <li>③ <strong>Estate</strong> — the assets to be passed on</li>
                  <li>④ <strong>Executor</strong> — the person appointed to carry out the Will</li>
                  <li>⑤ <strong>Witnesses</strong> — 2 witnesses present simultaneously at the time of signing</li>
                </>
              )}
            </ul>
          </div>
        </section>

        {/* ─── 2. Siapa boleh membuat ─── */}
        <section id="siapa-boleh">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            {ms ? '2. Siapa Yang Boleh Membuat General Will?' : '2. Who Can Make a General Will?'}
          </h2>
          <p>
            {ms
              ? 'Akta Wasiat 1959 menetapkan syarat-syarat berikut untuk membuat Will yang sah. Kegagalan memenuhi mana-mana syarat ini boleh menyebabkan Will ditolak oleh mahkamah.'
              : 'The Wills Act 1959 sets out the following conditions for a valid Will. Failure to meet any of these may cause the Will to be rejected by the court.'}
          </p>

          <div className="mt-5 space-y-4">
            <div className="border border-slate-200 rounded-xl p-4">
              <p className="font-bold text-slate-800 text-xs mb-1">① {ms ? 'Bukan Muslim' : 'Non-Muslim'}</p>
              <p className="text-xs text-slate-600">
                {ms
                  ? 'Akta Wasiat 1959 hanya terpakai kepada bukan Muslim. Orang Islam yang ingin membuat dokumen pengagihan harta mesti menggunakan Wasiat Islam, bukan General Will.'
                  : 'The Wills Act 1959 only applies to non-Muslims. Muslims who wish to create an estate distribution document must use an Islamic Will (Wasiat), not a General Will.'}
              </p>
            </div>
            <div className="border border-slate-200 rounded-xl p-4">
              <p className="font-bold text-slate-800 text-xs mb-1">② {ms ? 'Umur minimum' : 'Minimum age'}</p>
              <p className="text-xs text-slate-600">
                {ms
                  ? '18 tahun ke atas (Semenanjung Malaysia dan Sarawak) — Seksyen 4, Akta Wasiat 1959. 21 tahun ke atas di Sabah (Ordinan Wasiat Sabah, Bab. 158). Tiada had umur maksimum selagi anda masih waras akal.'
                  : '18 years and above (Peninsular Malaysia and Sarawak) — Section 4, Wills Act 1959. 21 years and above in Sabah (Wills Ordinance Sabah, Cap. 158). There is no maximum age limit as long as you are of sound mind.'}
              </p>
            </div>
            <div className="border border-slate-200 rounded-xl p-4">
              <p className="font-bold text-slate-800 text-xs mb-1">③ {ms ? 'Waras akal (Sound mind)' : 'Sound mind'}</p>
              <p className="text-xs text-slate-600">
                {ms
                  ? 'Anda mesti faham apa yang anda lakukan, mengetahui harta yang anda ada, mengenali orang yang sepatutnya mendapat harta anda, dan membuat keputusan bebas tanpa paksaan atau pengaruh luar. Ini dikenali sebagai "testamentary capacity".'
                  : 'You must understand what you are doing, know the nature and extent of your assets, recognise those who might naturally expect to benefit, and be free from undue influence. This is known as "testamentary capacity."'}
              </p>
            </div>
            <div className="border border-slate-200 rounded-xl p-4">
              <p className="font-bold text-slate-800 text-xs mb-1">④ {ms ? 'Sukarela (No undue influence)' : 'Free from undue influence'}</p>
              <p className="text-xs text-slate-600">
                {ms
                  ? 'Will mestilah dibuat atas kehendak sendiri. Jika Will dibuat di bawah tekanan, ugutan, atau paksaan orang lain, mahkamah boleh mengisytiharkan Will itu tidak sah.'
                  : 'The Will must be made of your own free will. If a Will is made under pressure, threats, or coercion by another person, the court may declare it invalid.'}
              </p>
            </div>
          </div>
        </section>

        {/* ─── 3. Kebebasan penuh ─── */}
        <section id="kebebasan">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            {ms ? '3. Kebebasan Penuh — Tiada Had ⅓' : '3. Complete Freedom — No One-Third Limit'}
          </h2>
          <p>
            {ms
              ? 'Ini adalah perbezaan paling ketara antara General Will dan Wasiat Islam. Di bawah Akta Wasiat 1959, anda bebas mewasiatkan 100% harta anda kepada sesiapa yang anda pilih — tiada had satu pertiga, tiada pembahagian paksa seperti Faraid.'
              : 'This is the most significant difference between a General Will and an Islamic Will. Under the Wills Act 1959, you are free to bequeath 100% of your estate to anyone you choose — no one-third limit, no forced distribution formula like Faraid.'}
          </p>

          <div className="mt-5 bg-blue-50 border border-blue-200 rounded-xl p-5">
            <p className="font-bold text-blue-900 text-sm mb-3">{ms ? 'Contoh mudah:' : 'Simple example:'}</p>
            <div className="space-y-2 text-xs text-blue-800">
              <p>{ms ? '• Jumlah harta bersih: RM600,000' : '• Total net estate: RM600,000'}</p>
              <p>{ms ? '• Anda boleh mewasiatkan keseluruhan RM600,000 mengikut kehendak anda' : '• You may bequeath the full RM600,000 however you choose'}</p>
              <p>{ms ? '• Tiada formula tetap — anda yang tentukan siapa dapat berapa' : '• No fixed formula — you decide who gets what'}</p>
            </div>
          </div>

          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
            <p className="font-semibold">{ms ? '⚠ Satu pengecualian penting:' : '⚠ One important exception:'}</p>
            <p className="mt-1">
              {ms
                ? 'Walaupun anda bebas menentukan pembahagian harta, tanggungan anda (pasangan, anak, ibu bapa yang bergantung) boleh memohon kepada mahkamah untuk "reasonable provision" jika mereka tidak diberi layanan yang wajar dalam Will. Ini di bawah Akta Pewarisan (Peruntukan Keluarga) 1971.'
                : 'Although you have full freedom over distribution, your dependants (spouse, children, dependent parents) may apply to court for "reasonable provision" if they are not adequately provided for in the Will. This is under the Inheritance (Family Provision) Act 1971.'}
            </p>
          </div>
        </section>

        {/* ─── 4. Harta ─── */}
        <section id="harta">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            {ms ? '4. Harta Yang Boleh dan Tidak Boleh Dimasukkan' : '4. What Can and Cannot Be Included'}
          </h2>
          <p className="mb-4">
            {ms
              ? 'Walaupun anda mempunyai kebebasan penuh, terdapat kategori harta tertentu yang tidak boleh dikawal melalui Will kerana ia sudah mempunyai mekanisme pemindahan tersendiri di sisi undang-undang.'
              : 'Although you have full freedom, certain asset categories cannot be controlled through a Will because they already have their own legal transfer mechanisms.'}
          </p>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="border border-emerald-300 rounded-xl overflow-hidden">
              <div className="bg-emerald-600 px-4 py-2.5">
                <p className="text-white text-xs font-bold">✓ {ms ? 'BOLEH Dimasukkan' : 'CAN Be Included'}</p>
              </div>
              <div className="p-4 space-y-1 text-xs text-slate-700">
                {(ms ? [
                  'Wang simpanan (akaun semasa & simpanan)',
                  'Hartanah (tanah, rumah, premis)',
                  'Kenderaan bermotor',
                  'Saham, unit amanah & pelaburan',
                  'Barang kemas, emas & koleksi',
                  'Perniagaan atau saham syarikat',
                  'Aset digital (domain, kripto, dll)',
                  'Harta peribadi (perabot, seni, dll)',
                  'Harta yang dicagarkan (nyatakan hutang)',
                ] : [
                  'Cash savings (current & savings accounts)',
                  'Real estate (land, houses, premises)',
                  'Motor vehicles',
                  'Shares, unit trusts & investments',
                  'Jewellery, gold & collections',
                  'Business or company shares',
                  'Digital assets (domain, crypto, etc)',
                  'Personal property (furniture, art, etc)',
                  'Mortgaged property (state debt details)',
                ]).map((item, i) => (
                  <p key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 shrink-0 mt-0.5">✓</span>{item}
                  </p>
                ))}
              </div>
            </div>

            <div className="border border-red-200 rounded-xl overflow-hidden">
              <div className="bg-red-500 px-4 py-2.5">
                <p className="text-white text-xs font-bold">✗ {ms ? 'TIDAK BOLEH Dimasukkan' : 'CANNOT Be Included'}</p>
              </div>
              <div className="p-4 space-y-1 text-xs text-slate-700">
                {(ms ? [
                  'Wang KWSP/EPF (ada sistem penama tersendiri)',
                  'Polisi insurans dengan penama aktif',
                  'Hartanah dengan hak milikan bersama (joint tenancy) — secara automatik kepada penama hidup',
                  'Harta dalam amanah (trust)',
                  'Wang pencen kerajaan / PERKESO',
                  'Wang pinjaman (bukan milik anda)',
                ] : [
                  'EPF / KWSP (has its own nomination system)',
                  'Insurance policy with an active nominee',
                  'Joint tenancy property — automatically goes to the surviving owner',
                  'Assets held in trust',
                  'Government pension / SOCSO',
                  'Borrowed money (not your property)',
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
                ? 'Wang KWSP diserahkan kepada penama mengikut Akta KWSP — bukan melalui Will. Begitu juga insurans jiwa dengan penama aktif. Penama insurans bukan Muslim hanya bertindak sebagai ejen untuk menerima wang dan mengagihkannya kepada benefisiari Will, kecuali polisi menyatakan sebaliknya. Pastikan penama KWSP dan insurans anda dikemas kini secara berasingan.'
                : 'EPF money is paid to the nominee under the EPF Act — not through the Will. Similarly, life insurance with an active nominee. For non-Muslims, an insurance nominee acts as a trustee to receive and distribute the money to Will beneficiaries, unless the policy states otherwise. Ensure your EPF and insurance nominations are updated separately.'}
            </p>
          </div>
        </section>

        {/* ─── 5. Penerima manfaat ─── */}
        <section id="penerima">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            {ms ? '5. Siapa Yang Boleh Menerima Melalui Will?' : '5. Who Can Receive Through a Will?'}
          </h2>
          <p>
            {ms
              ? 'Hampir sesiapa sahaja boleh menjadi penerima manfaat dalam General Will — tiada sekatan agama, bangsa, atau warganegara. Ini memberikan fleksibiliti yang besar berbanding sistem Faraid.'
              : 'Almost anyone can be a beneficiary in a General Will — no restriction on religion, race, or nationality. This offers far greater flexibility than any forced distribution system.'}
          </p>

          <div className="mt-5 space-y-3">
            {[
              {
                tag: ms ? 'Anak angkat' : 'Adopted children',
                body: ms ? 'Hak penuh sebagai waris. Di bawah Akta Pengambilan Anak Angkat 1952, anak yang telah diadopsi secara sah mempunyai hak yang sama seperti anak kandung untuk mewarisi.' : 'Full inheritance rights. Under the Adoption Act 1952, a legally adopted child has the same rights as a biological child to inherit.',
                color: 'blue',
              },
              {
                tag: ms ? 'Anak tiri' : 'Stepchildren',
                body: ms ? 'Tiada hak automatik tanpa Will. Will adalah satu-satunya cara untuk memastikan anak tiri anda dilindungi — mereka tidak mewarisi secara automatik tanpa disebut dalam Will.' : 'No automatic rights without a Will. A Will is the only way to ensure your stepchildren are provided for — they do not inherit automatically unless named in the Will.',
                color: 'blue',
              },
              {
                tag: ms ? 'Anak yang belum dilahirkan' : 'Unborn child',
                body: ms ? 'Sah jika anak dilahirkan hidup dan mampu bertahan. Ini melindungi kepentingan bayi yang dikandung pada masa Will dibuat.' : 'Valid if the child is born alive and survives. This protects the interests of a child already conceived at the time the Will is made.',
                color: 'blue',
              },
              {
                tag: ms ? 'Badan amal & pertubuhan' : 'Charities & organisations',
                body: ms ? 'Anda boleh mewasiatkan harta kepada mana-mana badan amal, persatuan, atau pertubuhan yang berdaftar — tanpa had.' : 'You may bequeath assets to any registered charity, association, or organisation — without limitation.',
                color: 'blue',
              },
              {
                tag: ms ? 'Warganegara asing' : 'Foreign nationals',
                body: ms ? 'Boleh menjadi penerima manfaat. Tiada sekatan kewarganegaraan di bawah Akta Wasiat 1959 — seorang rakan atau pasangan bukan warganegara Malaysia boleh menerima harta melalui Will.' : 'Can be a beneficiary. There is no citizenship restriction under the Wills Act 1959 — a foreign friend or non-Malaysian partner can receive assets through a Will.',
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

        {/* ─── 6. Executor & Guardian ─── */}
        <section id="executor">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            {ms ? '6. Melantik Executor & Penjaga Anak' : '6. Appointing an Executor & Children\'s Guardian'}
          </h2>
          <p>
            {ms
              ? 'Executor adalah orang yang anda lantik untuk melaksanakan Will anda selepas kematian. Mereka akan memohon Grant of Probate dari mahkamah, mengumpul harta, menjelaskan hutang, dan mengagihkan harta kepada penerima manfaat.'
              : 'An executor is the person you appoint to carry out your Will after death. They will apply for a Grant of Probate from court, collect assets, settle debts, and distribute assets to beneficiaries.'}
          </p>

          <div className="mt-5 grid sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="font-bold text-blue-800 mb-2">{ms ? '✓ Syarat Executor' : '✓ Executor Requirements'}</p>
              <ul className="space-y-1 text-blue-700">
                <li>• {ms ? 'Berumur 18 tahun ke atas' : 'Aged 18 and above'}</li>
                <li>• {ms ? 'Waras akal' : 'Of sound mind'}</li>
                <li>• {ms ? 'Tiada sekatan agama atau bangsa' : 'No religion or race restriction'}</li>
                <li>• {ms ? 'Boleh juga menjadi penerima manfaat' : 'Can also be a beneficiary'}</li>
                <li>• {ms ? 'Boleh lantik sehingga 4 executor' : 'Up to 4 executors can be appointed'}</li>
                <li>• {ms ? 'Lantik Executor Sandaran sekiranya yang utama tidak dapat bertugas' : 'Appoint a substitute executor in case the primary cannot serve'}</li>
              </ul>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="font-bold text-slate-800 mb-2">{ms ? '📋 Tugas Executor' : '📋 Executor Duties'}</p>
              <ul className="space-y-1 text-slate-600">
                <li>• {ms ? 'Memohon Grant of Probate dari mahkamah' : 'Apply for Grant of Probate from court'}</li>
                <li>• {ms ? 'Mengenal pasti dan mengumpul semua harta' : 'Identify and collect all assets'}</li>
                <li>• {ms ? 'Menjelaskan hutang, cukai dan kos pentadbiran' : 'Settle debts, taxes and administration costs'}</li>
                <li>• {ms ? 'Mengagihkan harta kepada penerima manfaat' : 'Distribute assets to beneficiaries'}</li>
              </ul>
            </div>
          </div>

          <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl p-5">
            <p className="font-bold text-amber-900 text-sm mb-2">
              {ms ? '👶 Melantik Penjaga Anak (Testamentary Guardian)' : '👶 Appointing a Children\'s Guardian (Testamentary Guardian)'}
            </p>
            <p className="text-xs text-amber-800">
              {ms
                ? 'Jika anda mempunyai anak di bawah umur 18 tahun, Will adalah tempat anda melantik seseorang untuk menjaga mereka jika anda dan pasangan anda tiada. Ini dikenali sebagai Testamentary Guardian. Tanpa pelantikan ini, mahkamah akan membuat keputusan — dan pilihannya mungkin tidak sama dengan pilihan anda.'
                : 'If you have children under 18 years old, a Will is where you appoint someone to care for them if you and your partner are gone. This is known as a Testamentary Guardian. Without this appointment, the court decides — and their choice may not match yours.'}
            </p>
            <p className="text-xs text-amber-700 mt-2 font-medium">
              {ms
                ? '📌 Akta Penjagaan Kanak-Kanak 1961 — Seksyen 7'
                : '📌 Guardianship of Infants Act 1961 — Section 7'}
            </p>
          </div>
        </section>

        {/* ─── 7. Syarat Saksi ─── */}
        <section id="saksi">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            {ms ? '7. Syarat Saksi Dalam General Will' : '7. Witness Requirements for a General Will'}
          </h2>
          <p>
            {ms
              ? 'Syarat saksi di bawah Akta Wasiat 1959 berbeza daripada Wasiat Islam. Akta ini lebih longgar dari segi agama dan jantina, tetapi kehadiran serentak dan larangan penerima manfaat sebagai saksi tetap berkuat kuasa.'
              : 'Witness requirements under the Wills Act 1959 differ from an Islamic Will. The Act is more flexible on religion and gender, but simultaneous presence and the prohibition on beneficiaries as witnesses still apply strictly.'}
          </p>

          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-5 text-xs text-blue-800 space-y-3">
            <p className="font-bold text-sm">{ms ? 'Syarat Saksi (Akta Wasiat 1959, Seksyen 6):' : 'Witness Requirements (Wills Act 1959, Section 6):'}</p>
            <div className="space-y-2">
              <p>① <strong>{ms ? 'Bilangan:' : 'Number:'}</strong> {ms ? 'Tepat 2 orang saksi' : 'Exactly 2 witnesses'}</p>
              <p>② <strong>{ms ? 'Kehadiran:' : 'Presence:'}</strong> {ms ? 'Kedua-dua saksi mesti hadir serentak semasa pewasiat menandatangani Will' : 'Both witnesses must be present simultaneously when the testator signs the Will'}</p>
              <p>③ <strong>{ms ? 'Agama:' : 'Religion:'}</strong> {ms ? 'Tiada sekatan agama — boleh dari mana-mana agama' : 'No religious restriction — may be of any religion'}</p>
              <p>④ <strong>{ms ? 'Jantina:' : 'Gender:'}</strong> {ms ? 'Tiada sekatan jantina — lelaki atau perempuan' : 'No gender restriction — male or female'}</p>
              <p>⑤ <strong>{ms ? 'Warganegara:' : 'Nationality:'}</strong> {ms ? 'Tiada sekatan kewarganegaraan' : 'No nationality restriction'}</p>
              <p>⑥ <strong>{ms ? 'Umur:' : 'Age:'}</strong> {ms ? 'Mesti berumur 18 tahun ke atas' : 'Must be aged 18 and above'}</p>
            </div>
          </div>

          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-800">
            <p className="font-bold mb-1">{ms ? '✗ Saksi TIDAK BOLEH (Seksyen 9 & 10):' : '✗ A Witness MUST NOT (Sections 9 & 10):'}</p>
            <ul className="space-y-1">
              <li>• {ms ? 'Menjadi penerima manfaat dalam Will ini — pemberian kepada mereka akan terbatal (Will kekal sah)' : 'Be a beneficiary in this Will — their gift will be voided (the Will itself remains valid)'}</li>
              <li>• {ms ? 'Menjadi pasangan kepada penerima manfaat — hadiah kepada pasangan mereka akan terbatal' : 'Be the spouse of a beneficiary — the gift to their spouse will be voided'}</li>
              <li>• {ms ? 'Menjadi pewasiat itu sendiri' : 'Be the testator themselves'}</li>
              <li>• {ms ? 'Merupakan orang yang sama — kedua-dua saksi mestilah individu berlainan' : 'Be the same person — both witnesses must be different individuals'}</li>
            </ul>
            <p className="mt-2 text-red-700 font-medium">
              {ms
                ? '💡 Nota: Jika saksi adalah penerima manfaat, Will tidak terbatal — hanya pemberian kepada saksi tersebut yang terbatal. Walau bagaimanapun, elakkan keadaan ini untuk mengelakkan pertikaian.'
                : '💡 Note: If a witness is a beneficiary, the Will itself is not invalidated — only the specific gift to that witness is voided. However, avoid this situation to prevent disputes.'}
            </p>
          </div>
        </section>

        {/* ─── 8. Bila terbatal ─── */}
        <section id="terbatal">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            {ms ? '8. Bila Will Menjadi Tidak Sah atau Terbatal' : '8. When a Will Becomes Invalid or Is Revoked'}
          </h2>

          <div className="space-y-4">
            <div>
              <p className="font-semibold text-slate-800 mb-2">{ms ? 'Will terbatal secara automatik jika:' : 'A Will is automatically revoked if:'}</p>
              <ul className="space-y-2">
                {(ms ? [
                  { icon: '✗', text: 'Anda berkahwin selepas membuat Will (Seksyen 12, Akta Wasiat 1959) — perkahwinan baharu secara automatik terbatalkan Will lama, kecuali Will itu dibuat khusus "atas niat perkahwinan dengan orang tertentu"' },
                  { icon: '✗', text: 'Will baru dibuat kemudiannya — Will terbaharu biasanya menggantikan semua Will sebelumnya jika dinyatakan dengan jelas' },
                  { icon: '✗', text: 'Dokumen Will dimusnahkan secara fizikal dengan niat untuk membatalkannya — koyak, bakar, atau dipadam' },
                  { icon: '✗', text: 'Ditambah atau diubah melalui Kodicil (Codicil) — perubahan rasmi kepada Will sedia ada' },
                ] : [
                  { icon: '✗', text: 'You marry after making the Will (Section 12, Wills Act 1959) — a new marriage automatically revokes the old Will, unless the Will was made specifically "in contemplation of marriage to a named person"' },
                  { icon: '✗', text: 'A new Will is made — the most recent Will typically supersedes all prior ones if clearly stated' },
                  { icon: '✗', text: 'The Will document is physically destroyed with intent to revoke — torn, burned, or deleted' },
                  { icon: '✗', text: 'Amended or changed via a Codicil — a formal amendment to an existing Will' },
                ]).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-red-400 shrink-0 font-bold mt-0.5">{item.icon}</span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
              <p className="font-semibold">{ms ? '⚠ Perceraian tidak membatalkan Will:' : '⚠ Divorce does NOT revoke a Will:'}</p>
              <p className="mt-1">
                {ms
                  ? 'Berbeza dengan perkahwinan, perceraian tidak membatalkan Will di Malaysia. Walau bagaimanapun, sejak pindaan Akta Wasiat 1959 pada 1971, bekas pasangan dirawat seolah-olah mereka telah meninggal dunia pada tarikh perceraian untuk tujuan pemberian dalam Will — ertinya, pemberian kepada bekas pasangan akan gugur. Untuk elak kekeliruan, buat Will baru selepas perceraian.'
                  : 'Unlike marriage, divorce does not revoke a Will in Malaysia. However, since the 1971 amendment to the Wills Act 1959, a former spouse is treated as having predeceased the testator at the date of divorce for gift purposes — meaning gifts to the former spouse will lapse. To avoid ambiguity, make a new Will after a divorce.'}
              </p>
            </div>

            <div>
              <p className="font-semibold text-slate-800 mb-2">{ms ? 'Will tidak sah (void) dari awal jika:' : 'A Will is void from the outset if:'}</p>
              <ul className="space-y-2">
                {(ms ? [
                  'Pewasiat tidak mempunyai testamentary capacity pada masa penandatanganan',
                  'Will dibuat di bawah pengaruh atau paksaan (undue influence) atau penipuan (fraud)',
                  'Prosedur penandatanganan atau penyaksian tidak dipatuhi — saksi tidak hadir serentak, atau kurang daripada 2 saksi',
                ] : [
                  'The testator lacked testamentary capacity at the time of signing',
                  'The Will was made under undue influence, coercion, or fraud',
                  'The signing or witnessing procedure was not followed — witnesses not present simultaneously, or fewer than 2 witnesses',
                ]).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-red-400 shrink-0 font-bold">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ─── 9. Tiada Will ─── */}
        <section id="tiada-will">
          <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            {ms ? '9. Apa Yang Berlaku Jika Tiada Will?' : '9. What Happens If You Have No Will?'}
          </h2>
          <p>
            {ms
              ? 'Tanpa Will, harta anda diagihkan mengikut Akta Pembahagian 1958 — satu formula tetap yang tidak mengambil kira hasrat anda, hubungan khusus anda, atau tanggungan yang anda ada. Proses ini juga jauh lebih lambat dan mahal.'
              : 'Without a Will, your assets are distributed under the Distribution Act 1958 — a fixed formula that takes no account of your wishes, specific relationships, or the dependants you have. The process is also significantly slower and more costly.'}
          </p>

          <div className="mt-5 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-700 px-4 py-2.5">
              <p className="text-white text-xs font-bold">
                {ms ? 'Formula Akta Pembahagian 1958 (Tanpa Will):' : 'Distribution Act 1958 Formula (Without a Will):'}
              </p>
            </div>
            <div className="p-4 space-y-2 text-xs">
              {(ms ? [
                { situation: 'Pasangan + Anak',              formula: 'Pasangan ⅓ · Anak ⅔' },
                { situation: 'Pasangan + Ibu Bapa (tiada anak)', formula: 'Pasangan ½ · Ibu Bapa ½' },
                { situation: 'Pasangan + Anak + Ibu Bapa',   formula: 'Pasangan ¼ · Anak ½ · Ibu Bapa ¼' },
                { situation: 'Anak sahaja (tiada pasangan)', formula: 'Anak menerima keseluruhan' },
                { situation: 'Ibu Bapa sahaja',              formula: 'Ibu Bapa menerima keseluruhan' },
                { situation: 'Tiada sesiapa di atas',        formula: 'Jatuh kepada pihak paling dekat mengikut undang-undang' },
              ] : [
                { situation: 'Spouse + Children',              formula: 'Spouse ⅓ · Children ⅔' },
                { situation: 'Spouse + Parents (no children)', formula: 'Spouse ½ · Parents ½' },
                { situation: 'Spouse + Children + Parents',    formula: 'Spouse ¼ · Children ½ · Parents ¼' },
                { situation: 'Children only (no spouse)',      formula: 'Children receive the whole' },
                { situation: 'Parents only',                   formula: 'Parents receive the whole' },
                { situation: 'None of the above',              formula: 'Passes to nearest kin by law' },
              ]).map((row, i) => (
                <div key={i} className="flex justify-between items-center border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                  <span className="text-slate-700 font-medium">{row.situation}</span>
                  <span className="text-slate-500 text-right">{row.formula}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {(ms ? [
              { icon: '🔒', title: 'Harta dibekukan serta-merta', body: 'Semua aset — akaun bank, kenderaan, hartanah — dibekukan selepas kematian. Tiada siapa yang boleh mengakses atau menggunakannya sehingga proses pentadbiran selesai.' },
              { icon: '📄', title: 'Letter of Administration (LOA) — bukan Grant of Probate', body: 'Tanpa Will, keluarga perlu memohon Letter of Administration — yang memerlukan persetujuan semua waris, jaminan dua orang penjamin, dan proses mahkamah. Ini boleh mengambil masa 6 bulan hingga 5 tahun.' },
              { icon: '👶', title: 'Tiada penjaga yang anda pilih untuk anak', body: 'Mahkamah akan melantik penjaga anak-anak anda — bukan anda. Pilihan mahkamah mungkin tidak sama dengan pilihan anda sendiri.' },
              { icon: '💔', title: 'Anak tiri tidak mendapat apa-apa', body: 'Akta Pembahagian 1958 tidak mengiktiraf anak tiri sebagai waris. Tanpa Will yang menyebut nama mereka, mereka tidak akan menerima apa-apa.' },
            ] : [
              { icon: '🔒', title: 'Assets frozen immediately', body: 'All assets — bank accounts, vehicles, property — are frozen after death. No one can access or use them until the administration process is complete.' },
              { icon: '📄', title: 'Letter of Administration (LOA) — not Grant of Probate', body: 'Without a Will, family must apply for a Letter of Administration — requiring all heirs\' consent, bonds from two guarantors, and court proceedings. This can take 6 months to 5 years.' },
              { icon: '👶', title: 'No guardian of your choosing for your children', body: 'The court will appoint a guardian for your children — not you. The court\'s choice may not match your own wishes.' },
              { icon: '💔', title: 'Stepchildren receive nothing', body: 'The Distribution Act 1958 does not recognise stepchildren as heirs. Without a Will naming them, they will receive nothing.' },
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
        <section className="bg-slate-900 rounded-2xl p-8 text-center">
          <p className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
            {ms ? 'Anda sudah bersedia' : 'You\'re ready'}
          </p>
          <h3 className="text-white text-xl font-bold mb-3">
            {ms ? 'Mula Buat General Will Anda Sekarang' : 'Start Creating Your General Will Now'}
          </h3>
          <p className="text-slate-300 text-sm mb-6 max-w-md mx-auto">
            {ms
              ? 'Dokumen Will yang lengkap dan mematuhi Akta Wasiat 1959 Malaysia. Siap dalam 15 minit, dihantar terus ke e-mel anda.'
              : 'A complete Will document compliant with the Malaysian Wills Act 1959. Ready in 15 minutes, delivered straight to your email.'}
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-white text-slate-900 font-bold text-sm px-8 py-3 rounded-xl hover:bg-slate-100 transition-colors"
          >
            {ms ? 'Mulakan Will Saya →' : 'Start My Will →'}
          </Link>
          <p className="text-slate-400 text-xs mt-4">
            {ms ? 'Draf disimpan secara automatik. Bayar hanya apabila bersedia.' : 'Draft saved automatically. Pay only when ready.'}
          </p>
        </section>

        {/* ─── Copyright footer ─── */}
        <div className="border-t border-slate-200 pt-6 text-xs text-slate-400 space-y-2">
          <p>
            {ms
              ? '© 2026 WasiatHub (Wisely Horizon Sdn. Bhd.). Kandungan halaman ini adalah hak cipta WasiatHub dan ditulis berdasarkan kajian undang-undang Malaysia termasuk Akta Wasiat 1959, Akta Pembahagian 1958, Akta Penjagaan Kanak-Kanak 1961, dan Akta Pewarisan (Peruntukan Keluarga) 1971.'
              : '© 2026 WasiatHub (Wisely Horizon Sdn. Bhd.). The content of this page is copyright WasiatHub and is written based on research into Malaysian law including the Wills Act 1959, Distribution Act 1958, Guardianship of Infants Act 1961, and Inheritance (Family Provision) Act 1971.'}
          </p>
          <p>
            {ms
              ? 'Maklumat di sini adalah untuk tujuan pendidikan sahaja dan tidak merupakan nasihat undang-undang. Sila rujuk peguam atau penasihat harta pusaka yang berkelayakan untuk kes yang lebih kompleks.'
              : 'Information here is for educational purposes only and does not constitute legal advice. Please consult a qualified lawyer or estate planning adviser for more complex situations.'}
          </p>
        </div>

      </div>
    </div>
  )
}
