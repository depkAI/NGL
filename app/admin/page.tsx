'use client'

import { useEffect, useState } from 'react'

interface Feedback {
  id: string
  feedback: {
    q1: string
    q2: string
    q3: string
    q4: string
    q5: string
    q6: string
  }
  timestamp: string
}

export default function AdminPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (isLoggedIn) {
      fetch('/api/messages')
        .then(res => res.json())
        .then(setFeedbacks)
    }
  }, [isLoggedIn])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (loginId === 'admin' && password === 'password') {
      setIsLoggedIn(true)
      setLoginError('')
    } else {
      setLoginError('Invalid login ID or password.')
    }
  }

  const handleNext = () => {
    if (currentIndex < feedbacks.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this response?')) {
      const res = await fetch(`/api/messages?id=${feedbacks[currentIndex].id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        const newFeedbacks = feedbacks.filter((_, index) => index !== currentIndex)
        setFeedbacks(newFeedbacks)
        if (currentIndex > 0) {
          setCurrentIndex(currentIndex - 1)
        }
      }
    }
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md border border-white/20">
          <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Login ID</label>
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-300"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-300"
                required
              />
            </div>
            {loginError && <p className="text-red-500 text-center">{loginError}</p>}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
            >
              Login
            </button>
          </form>
        </div>
      </main>
    )
  }

  if (feedbacks.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-8">
        <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
          <h1 className="text-4xl font-bold mb-8 text-gray-800 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Admin - Feedbacks</h1>
          <p className="text-center text-gray-600 text-lg">No feedbacks yet.</p>
        </div>
      </main>
    )
  }

  const currentFeedback = feedbacks[currentIndex]

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-8">
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Admin - Feedbacks</h1>
          <p className="text-gray-600 font-semibold">User {currentIndex + 1} of {feedbacks.length}</p>
        </div>

        <div className="border-2 border-gray-200 rounded-xl p-6 bg-gradient-to-r from-white to-gray-50 shadow-lg">
          <p className="text-sm text-gray-500 mb-6 italic">Submitted: {new Date(currentFeedback.timestamp).toLocaleString()}</p>
          <div className="space-y-4">
            <div>
              <strong className="text-purple-700 italic">Be honest… what do you really think about NeuroStack?</strong>
              <p className="mt-2 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">{currentFeedback.feedback.q1}</p>
            </div>
            <div>
              <strong className="text-green-700 italic">What's your honest opinion about Sakthi (CEO)? How is he while working with the team?</strong>
              <p className="mt-2 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">{currentFeedback.feedback.q2}</p>
            </div>
            <div>
              <strong className="text-yellow-700 italic">What do you think about Kiran (MD)? How is he in terms of work and interaction?</strong>
              <p className="mt-2 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">{currentFeedback.feedback.q3}</p>
            </div>
            <div>
              <strong className="text-pink-700 italic">How's your current workspace? Comfortable or needs improvement?</strong>
              <p className="mt-2 p-3 bg-pink-50 rounded-lg border-l-4 border-pink-400">{currentFeedback.feedback.q4}</p>
            </div>
            <div>
              <strong className="text-purple-700 italic">How is the team around you? Are people helpful and easy to reach out to?</strong>
              <p className="mt-2 p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">{currentFeedback.feedback.q5}</p>
            </div>
            <div>
              <strong className="text-indigo-700 italic">Anything you'd like to change or improve? Say it freely 👀</strong>
              <p className="mt-2 p-3 bg-indigo-50 rounded-lg border-l-4 border-indigo-400">{currentFeedback.feedback.q6}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-all duration-200 shadow-md"
          >
            ← Previous User
          </button>
          <button
            onClick={handleDelete}
            className="px-6 py-3 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition-all duration-200 shadow-md"
          >
            🗑️ Delete Response
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === feedbacks.length - 1}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md"
          >
            Next User →
          </button>
        </div>
      </div>
    </main>
  )
}