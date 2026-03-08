'use client'

import { useState, useRef } from 'react'
import RiskMeter from '@/components/RiskMeter'

type ScamResult = {
  scam_probability: number
  risk_level: string
  scam_type: string
  reason: string
  suspicious_phrases: string[]
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
    <div className="max-w-[680px] mx-auto p-6 flex flex-col">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:bg-gray-50"
      >
        <input
          ref={inputRef}
          type="file"
          accept="audio/*"
          onChange={handleFile}
          className="hidden"
          aria-hidden
        />
        <span className="text-4xl block mb-2">🎵</span>
        <p className="text-[1.1rem]">Click to upload an audio recording</p>
        <p className="text-[0.9rem] text-gray-400 mt-1">MP3, WAV, M4A supported</p>
      </div>

      {file && (
        <p className="mt-2">
          <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm">
            {file.name}
          </span>
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!file || loading}
        className="w-full py-3 text-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold mt-4"
      >
        {loading
          ? (loadingStep === 1 ? 'Transcribing...' : 'Analyzing...')
          : '🔍 Transcribe & Analyze'}
      </button>

      {loading && (
        <div className="flex flex-col items-center gap-3 mt-6">
          <div
            className="animate-spin border-4 border-blue-500 border-t-transparent rounded-full w-8 h-8"
            aria-hidden
          />
          <p className="text-gray-600">
            {loadingStep === 1
              ? '🎤 Transcribing audio with Whisper AI...'
              : '🔍 Analyzing transcript for scams...'}
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-4 mt-4 text-red-800">
          {error}
        </div>
      )}

      {transcript != null && (
        <div className="mt-6">
          <label className="font-bold block mb-2">📝 Transcript:</label>
          <div className="max-h-44 overflow-y-auto bg-gray-50 rounded-lg p-3 text-sm text-gray-900">
            {transcript || '(No transcript)'}
          </div>
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
