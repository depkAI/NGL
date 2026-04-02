'use client'

import { useState } from 'react'

const questions = [
  { key: 'q1', label: 'Be honest… what do you really think about NeuroStack?', color: 'bg-blue-100' },
  { key: 'q2', label: 'What’s your honest opinion about Sakthi (CEO)? How is he while working with the team?', color: 'bg-green-100' },
  { key: 'q3', label: 'What do you think about Kiran (MD)? How is he in terms of work and interaction?', color: 'bg-yellow-100' },
  { key: 'q4', label: 'How’s your current workspace? Comfortable or needs improvement?', color: 'bg-pink-100' },
  { key: 'q5', label: 'How is the team around you? Are people helpful and easy to reach out to?', color: 'bg-purple-100' },
  { key: 'q6', label: 'Anything you’d like to change or improve? Say it freely 👀', color: 'bg-indigo-100' }
]

export default function Home() {
  const [answers, setAnswers] = useState({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
    q6: ''
  })
  const [currentStep, setCurrentStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (question: string, value: string) => {
    setAnswers(prev => ({ ...prev, [question]: value }))
    setError('')
  }

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const allAnswered = Object.values(answers).every(a => a.trim() !== '')
    if (!allAnswered) {
      setError('Please answer all questions before submitting.')
      return
    }
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedback: answers })
    })
    if (res.ok) {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md text-center border border-white/20">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Thank You! 🎉</h1>
          <p className="text-gray-600 italic">Your feedback has been submitted anonymously.</p>
        </div>
      </main>
    )
  }

  const currentQuestion = questions[currentStep]

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-8">
      <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
        <h1 className="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">
          NGL
        </h1>
        <p className="text-center text-gray-600 mb-8 italic text-lg">Your honest opinions matter. Answer freely and anonymously.</p>
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`h-3 flex-1 mx-1 rounded-full transition-all duration-300 ${index <= currentStep ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg' : 'bg-gray-300'}`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 font-medium">Question {currentStep + 1} of {questions.length}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xl font-semibold text-gray-800 mb-3 italic">
              {currentQuestion.label}
            </label>
            <textarea
              value={answers[currentQuestion.key as keyof typeof answers]}
              onChange={(e) => handleChange(currentQuestion.key, e.target.value)}
              className={`w-full border-2 border-gray-300 rounded-xl px-4 py-3 h-32 ${currentQuestion.color} focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-200 resize-none shadow-inner`}
              placeholder="Share your thoughts..."
            />
          </div>
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-8 py-3 bg-gray-300 text-gray-700 rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-all duration-200 shadow-md"
            >
              ← Previous
            </button>
            {currentStep < questions.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Next →
              </button>
            ) : (
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Submit Feedback ✨
              </button>
            )}
          </div>
        </form>
        {error && <p className="text-red-500 text-center mt-4 font-semibold">{error}</p>}
        <a href="/admin" className="block text-center mt-8 text-blue-500 hover:text-blue-700 transition-colors font-medium">Admin</a>
      </div>
    </main>
  )
}