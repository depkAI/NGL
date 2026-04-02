'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'

export default function SendPage() {
  const params = useParams()
  const username = params.username as string
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message) return
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient: username, message })
    })
    if (res.ok) {
      setSent(true)
      setMessage('')
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Send anonymous message to {username}</h1>
      {sent ? (
        <p className="text-green-500">Message sent!</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <textarea
            placeholder="Your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 mb-4 w-80 h-32"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </form>
      )}
    </main>
  )
}