// app/portal/layout.tsx

import Link from 'next/link'

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <div className="w-60 bg-gray-100 p-6 space-y-6">
        <h2 className="text-2xl font-bold mb-8">Portal</h2>
        <nav className="flex flex-col space-y-4">
          <Link href="/portal" className="text-lg hover:underline">
            🟡 Home
          </Link>
          <Link href="/portal/new" className="text-lg hover:underline">
            ✏️ New Agenda
          </Link>
          <Link href="/portal/history" className="text-lg hover:underline">
            📚 History
          </Link>
          <Link href="/portal/members" className="text-lg hover:underline">
          👥 Hub-Members
          </Link>
        </nav>
      </div>
      <div className="flex-1 p-8 overflow-y-auto">{children}</div>
    </div>
  )
}