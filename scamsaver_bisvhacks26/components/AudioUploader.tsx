'use client'

import { useState, useRef } from 'react'
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

export default function AudioUploader() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [transcript, setTranscript] = useState<string | null>(null)
  const [result, setResult] = useState<ScamResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState<0 | 1 | 2>(0)
  const [error, setError] = useState<string | null>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setTranscript(null)
    setResult(null)
    setError(null)
  }

  async function handleSubmit() {
    if (!file) return
    setLoadingStep(1)
    setLoading(true)
    setError(null)
    setResult(null)
    setTranscript(null)
    try {
      const formData = new FormData()
      formData.append('audio', file)
      const res = await fetch('/api/audio', { method: 'POST', body: formData })
      setLoadingStep(2)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Analysis failed')
      setTranscript(data.transcript)
      setResult(data.analysis)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-0 py-2 flex flex-col">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        className="border-2 border-dashed border-slate-200 rounded-2xl p-12 sm:p-16 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all"
      >
        <input
          ref={inputRef}
          type="file"
          accept="audio/*"
          onChange={handleFile}
          className="hidden"
          aria-hidden
        />
        <span className="text-4xl sm:text-5xl block mb-4 text-gray-300">🎵</span>
        <p className="text-gray-600 font-medium text-base sm:text-lg">Click to upload an audio recording</p>
        <p className="text-gray-400 text-sm sm:text-base mt-1.5">MP3, WAV, M4A supported</p>
      </div>

      {file && (
        <p className="mt-4">
          <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-4 py-2 text-sm font-medium">
            {file.name}
          </span>
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!file || loading}
        className="w-full py-4 sm:py-4.5 text-base font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl mt-6 transition-all shadow-sm hover:shadow-md"
      >
        {loading
          ? (loadingStep === 1 ? 'Transcribing...' : 'Analyzing...')
          : '🔍 Transcribe & Analyze'}
      </button>

      {loading && (
        <div className="flex flex-col items-center gap-4 mt-8">
          <div
            className="animate-spin border-4 border-blue-600 border-t-transparent rounded-full w-9 h-9"
            aria-hidden
          />
          <p className="text-gray-500 text-base font-medium">
            {loadingStep === 1
              ? '🎤 Transcribing audio with Whisper AI...'
              : '🔍 Analyzing transcript for scams...'}
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mt-6 text-red-700 text-base leading-relaxed">
          {error}
        </div>
      )}

      {transcript != null && (
        <div className="mt-6">
          <label className="text-black font-semibold text-base sm:text-lg mb-3 block">📝 Transcript:</label>
          <div className="max-h-44 overflow-y-auto bg-slate-50 border border-slate-100 rounded-xl p-4 sm:p-5 font-mono text-sm text-gray-600 leading-relaxed">
            {transcript || '(No transcript)'}
          </div>
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
