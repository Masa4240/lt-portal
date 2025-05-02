'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const [input, setInput] = useState('')
  const router = useRouter()

  const handleLogin = () => {
    console.log("login")
    if (input === process.env.NEXT_PUBLIC_PASSCODE) {
      console.log("succcess")
      document.cookie = `passcode=${input}; path=/`
      router.push('/portal')
    } else {
      alert('Invalid code')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-32 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-xl font-bold mb-4">Input pass code</h1>
      <input
        type="password"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border px-3 py-2 rounded w-full mb-4"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Enter
      </button>
    </div>
  )
}
