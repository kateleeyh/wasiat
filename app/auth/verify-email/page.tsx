import Link from 'next/link'
import { Mail } from 'lucide-react'

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-sm p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="w-7 h-7 text-primary" />
          </div>
        </div>

        <h1 className="text-xl font-bold text-foreground mb-2">Semak e-mel anda</h1>
        <p className="text-muted-foreground text-sm mb-1">
          Kami telah menghantar e-mel pengesahan ke alamat e-mel anda.
        </p>
        <p className="text-muted-foreground text-sm mb-6">
          Sila klik pautan dalam e-mel tersebut untuk mengaktifkan akaun WasiatHub anda.
        </p>

        <div className="bg-muted/50 rounded-lg p-4 text-left text-sm text-muted-foreground mb-6 space-y-1">
          <p>• Semak folder <strong>Spam</strong> atau <strong>Junk</strong> jika tiada e-mel.</p>
          <p>• E-mel dihantar dari <strong>services@wasiathub.my</strong></p>
          <p>• Pautan sah selama <strong>24 jam</strong>.</p>
        </div>

        <Link
          href="/auth/login"
          className="text-sm text-primary hover:underline"
        >
          Kembali ke halaman log masuk
        </Link>
      </div>
    </div>
  )
}
