'use client'

import { useState, useEffect } from 'react'
import { Agenda } from '../page'

export default function PortalPage() {
  const [agendas, setAgendas] = useState<Agenda[]>([])
  useEffect(() => {
    const fetchAgendas = async () => {
      const response = await fetch('/api/agendas')
      if (response.ok) {
        const data = await response.json()
        setAgendas(data)
      } else {
        alert('アジェンダの取得に失敗しました。')
      }
    }

    fetchAgendas()
  }, [])

  return (
    <div>
      <section>
        <h2 className="text-2xl font-bold mb-4">📅 アジェンダ一覧</h2>
        <div className="space-y-4">
          {agendas.map((agenda, index) => (
            <div key={index} className="rounded-2xl shadow-md border p-4 bg-white space-y-4">
              <div className="text-xl font-bold">{agenda.date}</div>
              <div className="space-y-2">
                {agenda.titles.map((title: string, i: number) => (
                  <div key={i} className="bg-gray-100 rounded-lg p-2 shadow-sm">
                    <div className="font-semibold">{title}</div>
                    <div className="text-sm text-gray-600">
                      発表者: {agenda.speakers[i] || '（未設定）'}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-700">Chair: {agenda.chair}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
