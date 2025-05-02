'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export type Agenda = {
  id: string
  date: string
  titles: string[]
  speakers: string[]
  chair: string
}

export default function PortalPage() {
  const [comingagendas, setcomingAgendas] = useState<Agenda[]>([])

  useEffect(() => {
    const fetchAgendas = async () => {
      const res = await fetch('/api/agendas')
      const data = await res.json()

      // 今日以降の日付に絞る
      const today = new Date()
      today.setHours(0, 0, 0, 0) 

      const upcoming = data
        .filter((agenda: Agenda) => new Date(agenda.date) >= today)
        .sort((a: Agenda, b: Agenda) => new Date(a.date).getTime() - new Date(b.date).getTime())

        setcomingAgendas(upcoming)
    }

    fetchAgendas()
  }, [])
  // const [agendas, setAgendas] = useState<Agenda[]>([])
  // useEffect(() => {
  //   const fetchAgendas = async () => {
  //     const response = await fetch('/api/agendas')
  //     if (response.ok) {
  //       const data = await response.json()
  //       setAgendas(data)
  //     } else {
  //       alert('アジェンダの取得に失敗しました。')
  //     }
  //   }

  //   fetchAgendas()
  // }, [])


  return (
    <div className="p-6 space-y-12 max-w-5xl mx-auto">
      <section>
        <h2 className="text-2xl font-bold mb-4">次回 & 次々回のアジェンダ</h2>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          {comingagendas.slice(0, 2).map((agenda) => (
            <div
              key={agenda.id}
              className="rounded-2xl shadow-md border p-4 bg-white space-y-4"
            >
              <div className="text-xl font-bold">{agenda.date}</div>

              <div className="space-y-2">
                {agenda.titles.map((title: string, i: number) => (
                  <div
                    key={i}
                    className="bg-gray-100 rounded-lg p-2 shadow-sm"
                  >
                    <div className="font-semibold">{title}</div>
                    <div className="text-sm text-gray-600">
                      発表者: {agenda.speakers[i] || '（未設定）'}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-700">Chair: {agenda.chair}</div>
              <Link href={`/portal/agendas/edit/${agenda.id}`} className="text-blue-500 hover:underline">
              ✏️ 編集
               </Link>
            </div>
          ))}
        </div>
      </section>      
    </div>
  )
}
