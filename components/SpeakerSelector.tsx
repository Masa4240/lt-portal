'use client'

import { useEffect, useState } from 'react'
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from '@headlessui/react'

type Member = {
  id: string
  name: string
}

type Props = {
  value: string
  onChange: (value: string) => void
}

export default function SpeakerSelector({ value, onChange }: Props) {
  const [members, setMembers] = useState<Member[]>([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    const fetchMembers = async () => {
      const res = await fetch('/api/members')
      const data = await res.json()
      setMembers(data)
    }
    fetchMembers()
  }, [])

  const filteredMembers =
    query === ''
      ? members
      : members.filter((m) =>
          m.name.toLowerCase().includes(query.toLowerCase())
        )

  return (
    <Combobox value={value} onChange={onChange}>
      <div className="relative">
        <ComboboxInput
          placeholder="Speaker"
          className="w-full border p-2"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(val: string) => val}
        />
        <ComboboxOptions className="absolute mt-1 w-full border bg-white dark:bg-gray-800 z-10 max-h-60 overflow-y-auto rounded-md shadow-lg">
          {filteredMembers.map((member) => (
            <ComboboxOption
              key={member.id}
              value={member.name}
              className={({ active }) =>
                `px-4 py-2 cursor-pointer ${
                  active ? 'bg-blue-500 text-white' : ''
                }`
              }
            >
              {member.name}
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </div>
    </Combobox>
  )
}
