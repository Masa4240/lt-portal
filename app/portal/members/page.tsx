'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

type Member = {
  id: number
  name: string
  isValid: boolean
  chairCount: number
  speakerCount: number
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [name, setName] = useState('')
  const [sortOrder, setSortOrder] = useState<'name' | 'chair' | 'speaker'>('name')

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    const res = await axios.get('/api/members')
    setMembers(res.data)
  }

  const handleAdd = async () => {
    if (!name.trim()) return
    await axios.post('/api/members', { name })
    setName('')
    fetchMembers()
  }

  const sortedMembers = [...members].sort((a, b) => {
    if (sortOrder === 'name') {
      return a.name.localeCompare(b.name)
    } else if (sortOrder === 'chair') {
      return b.chairCount - a.chairCount
    } else if (sortOrder === 'speaker') {
      return b.speakerCount - a.speakerCount
    }
    return 0
  })

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">メンバー管理</h1>

      <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold dark:text-black">メンバー一覧</h2>
          <div className="flex gap-2 dark:text-black">
            <button
              onClick={() => setSortOrder('name')}
              className={`px-4 py-2 rounded-md ${sortOrder === 'name' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              ABC順
            </button>
            <button
              onClick={() => setSortOrder('chair')}
              className={`px-4 py-2 rounded-md ${sortOrder === 'chair' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Chair回数順
            </button>
            <button
              onClick={() => setSortOrder('speaker')}
              className={`px-4 py-2 rounded-md ${sortOrder === 'speaker' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              発表回数順
            </button>
          </div>
        </div>

        <ul className="space-y-2">
          {sortedMembers.map((member) => (
            <li key={member.id} className="border p-3 rounded-md shadow-sm flex justify-between items-center">
              <div>
                <div className="font-semibold dark:text-black">{member.name}</div>

                <div className="text-sm text-gray-600">
                  Chair: {member.chairCount} 回 / 発表: {member.speakerCount} 回
                </div>
              </div>
              <Link href={`/portal/agendas/edit/${member.id}`} className="text-blue-500 hover:underline">
                ✏️ 編集
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 dark:text-black">新しいメンバー追加</h2>
        <div className="flex space-x-2 dark:text-black">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="名前を入力"
            className="flex-1 border rounded-md p-2"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
          >
            追加
          </button>
        </div>
      </div>
    </div>
  )
}
