'use client'

import { useState } from 'react'
import ChairSelector from '@/components/ChairSelector'
import SpeakerSelector from '@/components/SpeakerSelector'

export default function PortalPage() {
  const [newAgenda, setNewAgenda] = useState<{
    date: string
    chair: string
    presentations: { title: string; speaker: string }[]
  }>({
    date: '',
    chair: '',
    presentations: [{ title: '', speaker: '' }, { title: '', speaker: '' }], // 初期発表数を2にする
  })
  const handleAdd = async () => {
    if (!newAgenda.date || (!newAgenda.chair && newAgenda.chair !== 'TBD') || newAgenda.presentations.length === 0) {
      alert('全部ちゃんと入れてね')
      return
    }

    const chairValue = newAgenda.chair === 'TBD' ? null : newAgenda.chair

    const response = await fetch('/api/agendas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: newAgenda.date,
        chair: chairValue,
        titles: newAgenda.presentations.map((p) => p.title),
        speakers: newAgenda.presentations.map((p) => p.speaker),
      }),
    })

    if (response.ok) {
      alert('Success')
      setNewAgenda({
        date: '',
        chair: '',
        presentations: [{ title: '', speaker: '' }, { title: '', speaker: '' }],
      })
    } else {
      alert('エラーが発生しました。')
    }
  }


  return (
    <div className="p-6 space-y-12 max-w-5xl mx-auto">
      <section>
        <h2 className="text-2xl font-bold mb-4">➕ アジェンダ追加</h2>
        <div className="space-y-4">
          <input
            type="date"
            className="border p-2 w-full"
            value={newAgenda.date}
            onChange={(e) =>
              setNewAgenda({ ...newAgenda, date: e.target.value })
            }
          />

          <ChairSelector value={newAgenda.chair} onChange={(name) => setNewAgenda({ ...newAgenda, chair: name })} />


          {/* LT List */}
          <div className="space-y-2">
            {newAgenda.presentations.map((presentation, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  placeholder="title"
                  className="border p-2 flex-1"
                  value={presentation.title}
                  onChange={(e) => {
                    const updated = [...newAgenda.presentations]
                    updated[index].title = e.target.value
                    setNewAgenda({ ...newAgenda, presentations: updated })
                  }}
                />
                <SpeakerSelector
                value={presentation.speaker}
                onChange={(val) => {
                  const updated = [...newAgenda.presentations]
                  updated[index].speaker = val
                  setNewAgenda({ ...newAgenda, presentations: updated })
                  }}
                  />

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => {
                    const updated = newAgenda.presentations.filter((_, i) => i !== index)
                    setNewAgenda({ ...newAgenda, presentations: updated })
                  }}
                  className="text-red-500 hover:underline"
                >
                  delete
                </button>
              </div>
            ))}
          </div>

          {/* Add LT */}
          <button
            type="button"
            onClick={() =>
              setNewAgenda({
                ...newAgenda,
                presentations: [...newAgenda.presentations, { title: '', speaker: '' }],
              })
            }
            className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 dark:text-black"
          >
            ＋Add LT
          </button>
          <br />

          {/* Submit Button */}
          <button
            onClick={handleAdd}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add LT Agenda
          </button>
        </div>
      </section>
    </div>
  )
}
