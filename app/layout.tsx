// app/layout.tsx
import './globals.css'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function RootLayout({ children }: { children: React.ReactNode | null}) {
  // cookies() は非同期で取得する必要がある
  const cookieStore = await cookies()
  const pass = cookieStore.get('passcode')?.value

  // 簡単な認証チェック（'secret123'が合言葉）
  if (pass !== process.env.NEXT_PUBLIC_PASSCODE && !children) {
    redirect('/login')
  }

  return (
    <html lang="ja">
      <body className="p-8 font-sans bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}
