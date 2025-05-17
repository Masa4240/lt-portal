'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Agenda } from '@/app/portal/page'
import ChairSelector from '@/components/ChairSelector'

export default function EditAgendaPage() {
  const { id } = useParams()
  const [agenda, setAgenda] = useState<Agenda | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/agendas/${id}`)
      const data = await res.json()
      setAgenda(data)
      console.log(res)
    }
    fetchData()
  }, [id])

  const handleChangeTitle = (index: number, value: string) => {
    if (!agenda) return
    const newTitles = [...agenda.titles]
    newTitles[index] = value
    setAgenda({ ...agenda, titles: newTitles })
  }

  const handleChangeSpeaker = (index: number, value: string) => {
    if (!agenda) return
    const newSpeakers = [...agenda.speakers]
    newSpeakers[index] = value
    setAgenda({ ...agenda, speakers: newSpeakers })
  }

  const handleSave = async () => {
    if (!agenda) return
    await fetch(`/api/agendas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agenda),
    })
    alert('更新しました！')
  }

  if (!agenda) return <p>Loading...</p>

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Edit LT Agenda on {agenda.date.slice(0, 10)}</h1>
      <div>
        <label className="block font-semibold">Chair</label>
        {/* <input
          value={agenda.chair}
          onChange={(e) => setAgenda({ ...agenda, chair: e.target.value })}
          className="w-full border px-2 py-1 rounded"
        /> */}
        <ChairSelector value={agenda.chair} onChange={(name) => setAgenda({ ...agenda, chair: name })} />
      </div>

      <h2 className="text-xl font-bold mt-6">Agendas</h2>

      {agenda.titles.map((title, i) => (
        <div key={i} className="border p-4 rounded space-y-2">
          <div>
            <label className="block font-semibold">Presentation Title</label>
            <input
              value={title}
              onChange={(e) => handleChangeTitle(i, e.target.value)}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Presenter</label>
            <input
              value={agenda.speakers[i]}
              onChange={(e) => handleChangeSpeaker(i, e.target.value)}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
        </div>
      ))}

      <button
        onClick={handleSave}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        保存
      </button>
    </div>
  )
}
