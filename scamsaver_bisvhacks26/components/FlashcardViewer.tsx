'use client'

import { useState, useEffect } from 'react'

type Flashcard = {
  id: number
  front: string
  back: string
  category: string
}

export default function FlashcardViewer() {
  const [cards, setCards] = useState<Flashcard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/flashcards')
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        if (data.error) throw new Error(data.error)
        setCards(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Could not load flashcards')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <div className="animate-spin border-4 border-blue-500 border-t-transparent rounded-full w-10 h-10" />
        <p className="text-gray-600">Loading flashcards...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-300 rounded-xl p-4 text-red-800">
        {error}
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        No flashcards available.
      </div>
    )
  }

  const card = cards[index]
  return (
    <div className="flex flex-col items-center">
      <span className="text-sm text-gray-400 mb-2">
        Card {index + 1} of {cards.length} · {card.category}
      </span>
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="w-full min-h-[200px] rounded-2xl border-2 border-gray-200 bg-white p-6 text-left shadow-sm hover:border-blue-300 transition-colors"
      >
        <p className="text-lg font-medium text-gray-900">
          {flipped ? card.back : card.front}
        </p>
        <p className="text-sm text-gray-400 mt-2">Tap to flip</p>
      </button>
      <div className="flex gap-2 mt-4">
        <button
          type="button"
          onClick={() => { setIndex((i) => (i <= 0 ? cards.length - 1 : i - 1)); setFlipped(false) }}
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
        >
          ← Previous
        </button>
        <button
          type="button"
          onClick={() => { setIndex((i) => (i >= cards.length - 1 ? 0 : i + 1)); setFlipped(false) }}
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
