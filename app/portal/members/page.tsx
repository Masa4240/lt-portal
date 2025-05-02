'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

type Member = {
  id: number
  name: string
  isValid: boolean
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [name, setName] = useState('')
  const [sortOrder, setSortOrder] = useState<'id' | 'name'>('id')

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
    if (sortOrder === 'id') {
      return a.id - b.id
    } else {
      return a.name.localeCompare(b.name)
    }
  })

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">メンバー管理</h1>

      <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">メンバー一覧</h2>
          <div>
            <button
              onClick={() => setSortOrder('id')}
              className={`px-4 py-2 rounded-l-md ${sortOrder === 'id' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              会員番号順
            </button>
            <button
              onClick={() => setSortOrder('name')}
              className={`px-4 py-2 rounded-r-md ${sortOrder === 'name' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              ABC順
            </button>
          </div>
        </div>

        <ul className="space-y-2">
          {sortedMembers.map((member) => (
            <li key={member.id} className="border p-3 rounded-md shadow-sm flex justify-between items-center">
              <div>
                <span className="font-semibold mr-2">#{member.id}</span>
                {member.name}
              </div>
              {!member.isValid && <span className="text-sm text-red-500">(無効)</span>}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">新しいメンバー追加</h2>
        <div className="flex space-x-2">
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
