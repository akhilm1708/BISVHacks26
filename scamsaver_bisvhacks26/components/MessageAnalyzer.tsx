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
    <div className="max-w-2xl mx-auto px-0 py-2 flex flex-col">
      <label className="text-black font-semibold text-base sm:text-lg mb-3 block">
        Paste a suspicious message below
      </label>

      <textarea
        rows={6}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full text-base sm:text-[1rem] text-black rounded-xl border border-slate-200 p-4 sm:p-5 resize-y bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 min-h-[8rem] leading-relaxed"
        placeholder="Paste email, text message, or link here..."
      />

      <div className="flex flex-row gap-2 flex-wrap mt-3">
        {PRE_FILLS.map(({ label, text }) => (
          <button
            key={label}
            type="button"
            onClick={() => setMessage(text)}
            className="text-sm font-medium text-gray-500 hover:text-blue-600 border border-slate-200 hover:border-blue-300 rounded-lg px-4 py-2 bg-white transition-all"
          >
            {label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading || message.trim() === ''}
        className="w-full py-4 sm:py-4.5 text-base font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl mt-6 transition-all shadow-sm hover:shadow-md"
      >
        {loading ? 'Analyzing...' : '🔍 Analyze Message'}
      </button>

      {loading && (
        <div className="flex flex-col items-center gap-4 mt-8">
          <div
            className="animate-spin border-4 border-blue-600 border-t-transparent rounded-full w-9 h-9"
            aria-hidden
          />
          <p className="text-gray-500 text-base font-medium">Analyzing with AI...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mt-6 text-red-700 text-base leading-relaxed">
          {error}
        </div>
      )}

      {result !== null && !loading && (
        <div className="mt-10 space-y-6">
          <RiskMeter probability={result.scam_probability} />

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-sm">
            <h3 className="text-black font-semibold text-sm uppercase tracking-wide text-slate-700 mb-3">Why this might be a scam</h3>
            <p className="text-gray-600 text-base leading-relaxed max-w-prose">{result.reason}</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-sm">
            <h3 className="text-black font-semibold text-sm uppercase tracking-wide text-slate-700 mb-3">Suspicious phrases found</h3>
            {result.suspicious_phrases.length > 0 ? (
              <ul className="space-y-3">
                {result.suspicious_phrases.map((item, i) => (
                  <li key={i} className="flex flex-col gap-1.5">
                    <span className="bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3.5 py-1 text-sm font-medium w-fit">
                      {typeof item === 'string' ? item : item.phrase}
                    </span>
                    {typeof item === 'object' && item.reason && (
                      <span className="text-gray-600 text-sm sm:text-base pl-0.5 leading-relaxed">{item.reason}</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-base">No specific phrases flagged.</p>
            )}
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-sm">
            <h3 className="text-black font-semibold text-sm uppercase tracking-wide text-slate-700 mb-3">What you should do</h3>
            <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-5 text-blue-900 text-base leading-relaxed">
              {result.recommended_action}
            </div>
          </div>

          <div id="audio-warning-slot" />
        </div>
      )}
    </div>
  )
}
