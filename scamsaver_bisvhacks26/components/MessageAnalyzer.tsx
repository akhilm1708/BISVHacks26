'use client'

import { useState } from 'react'
import RiskMeter from '@/components/RiskMeter'

type ScamResult = {
  scam_probability: number
  risk_level: string
  scam_type: string
  reason: string
  suspicious_phrases: string[]
  recommended_action: string
}

const PRE_FILLS = [
  {
    label: 'Try: Amazon Scam',
    text: "Your Amazon account has been locked. Click here immediately to verify your information or your account will be permanently deleted.",
  },
  {
    label: 'Try: IRS Scam',
    text: "This is the IRS. You owe back taxes and will be arrested unless you call us back immediately at 1-800-555-0199.",
  },
  {
    label: 'Try: Prize Scam',
    text: "Congratulations! You've won a $500 Walmart gift card. Enter your credit card details to claim your prize now.",
  },
] as const

export default function MessageAnalyzer() {
  const [message, setMessage] = useState('')
  const [result, setResult] = useState<ScamResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Analysis failed')
      setResult(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-[680px] mx-auto p-6 flex flex-col">
      <label className="text-[1.2rem] font-bold mb-2 block">
        Paste a suspicious message below
      </label>

      <textarea
        rows={6}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full text-[1.1rem] rounded-xl border border-gray-300 p-3 resize-y"
        placeholder="Paste email, text message, or link here..."
      />

      <div className="flex flex-row gap-2 flex-wrap mt-2">
        {PRE_FILLS.map(({ label, text }) => (
          <button
            key={label}
            type="button"
            onClick={() => setMessage(text)}
            className="text-sm px-3 py-1 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
          >
            {label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading || message.trim() === ''}
        className="w-full py-3 text-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold mt-4"
      >
        {loading ? 'Analyzing...' : '🔍 Analyze Message'}
      </button>

      {loading && (
        <div className="flex flex-col items-center gap-3 mt-6">
          <div
            className="animate-spin border-4 border-blue-500 border-t-transparent rounded-full w-8 h-8"
            aria-hidden
          />
          <p className="text-gray-600">Analyzing with AI...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-4 mt-4 text-red-800">
          {error}
        </div>
      )}

      {result !== null && !loading && (
        <div className="mt-6">
          <RiskMeter probability={result.scam_probability} />

          <div className="bg-white rounded-xl border border-gray-200 p-5 mt-4">
            <h3 className="font-bold text-[1.1rem] mb-2">Why this might be a scam</h3>
            <p className="text-gray-700">{result.reason}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 mt-4">
            <h3 className="font-bold text-[1.1rem] mb-2">Suspicious phrases found</h3>
            {result.suspicious_phrases.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {result.suspicious_phrases.map((phrase) => (
                  <span
                    key={phrase}
                    className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-sm"
                  >
                    {phrase}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No specific phrases flagged.</p>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 mt-4">
            <h3 className="font-bold text-[1.1rem] mb-2">What you should do</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-gray-800">
              {result.recommended_action}
            </div>
          </div>

          <div id="audio-warning-slot" />
        </div>
      )}
    </div>
  )
}
