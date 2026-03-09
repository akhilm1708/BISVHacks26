'use client'

import { useState } from 'react'
import RiskMeter from '@/components/RiskMeter'

type SuspiciousPhrase = { phrase: string; reason: string }

type ScamResult = {
  scam_probability: number
  risk_level: string
  scam_type: string
  reason: string
  suspicious_phrases: SuspiciousPhrase[]
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
    <div className="max-w-[720px] mx-auto flex flex-col">
      <label className="font-semibold text-base mb-3 block" style={{ color: '#0f0f1a' }}>
        Paste a suspicious message below
      </label>

      <textarea
        rows={6}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full bg-white border border-gray-200 rounded-xl p-4 text-base resize-y focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 placeholder:text-gray-400 leading-relaxed"
        style={{ color: '#0f0f1a' }}
        placeholder="Paste email, text message, or link here..."
      />

      <div className="flex flex-row gap-2 flex-wrap mt-3">
        {PRE_FILLS.map(({ label, text }) => (
          <button
            key={label}
            type="button"
            onClick={() => setMessage(text)}
            className="border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
          >
            {label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading || message.trim() === ''}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3.5 rounded-full font-semibold mt-6 transition-colors"
        style={{ boxShadow: '0 4px 24px rgba(37,99,235,0.25)' }}
      >
        {loading ? 'Analyzing...' : '🔍 Analyze Message'}
      </button>

      {loading && (
        <div className="flex flex-col items-center gap-4 mt-8">
          <div
            className="animate-spin border-4 border-blue-600 border-t-transparent rounded-full w-9 h-9"
            aria-hidden
          />
          <p className="text-base font-medium" style={{ color: '#6b7280' }}>
            Analyzing with AI...
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-6 text-red-700 text-base leading-relaxed">
          {error}
        </div>
      )}

      {result !== null && !loading && (
        <div className="mt-10 space-y-6">
          <RiskMeter probability={result.scam_probability} />

          <div
            className="bg-white rounded-2xl border border-gray-100 p-7 transition-all duration-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
          >
            <h3 className="font-semibold text-sm uppercase tracking-wide mb-3" style={{ color: '#0f0f1a' }}>
              Why this might be a scam
            </h3>
            <p className="text-base leading-relaxed max-w-prose" style={{ color: '#6b7280' }}>
              {result.reason}
            </p>
          </div>

          <div
            className="bg-white rounded-2xl border border-gray-100 p-7 transition-all duration-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
          >
            <h3 className="font-semibold text-sm uppercase tracking-wide mb-3" style={{ color: '#0f0f1a' }}>
              Suspicious phrases found
            </h3>
            {result.suspicious_phrases.length > 0 ? (
              <ul className="space-y-3">
                {result.suspicious_phrases.map((item, i) => (
                  <li key={i} className="flex flex-col gap-1.5">
                    <span className="bg-blue-50 text-blue-600 border border-blue-200 rounded-full px-3.5 py-1 text-sm font-medium w-fit">
                      {typeof item === 'string' ? item : item.phrase}
                    </span>
                    {typeof item === 'object' && item.reason && (
                      <span className="text-sm pl-0.5 leading-relaxed" style={{ color: '#6b7280' }}>
                        {item.reason}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-base" style={{ color: '#6b7280' }}>
                No specific phrases flagged.
              </p>
            )}
          </div>

          <div
            className="bg-white rounded-2xl border border-gray-100 p-7 transition-all duration-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
          >
            <h3 className="font-semibold text-sm uppercase tracking-wide mb-3" style={{ color: '#0f0f1a' }}>
              What you should do
            </h3>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-base leading-relaxed text-blue-900">
              {result.recommended_action}
            </div>
          </div>

          <div id="audio-warning-slot" />
        </div>
      )}
    </div>
  )
}
