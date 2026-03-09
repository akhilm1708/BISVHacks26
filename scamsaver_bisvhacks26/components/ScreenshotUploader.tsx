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

export default function ScreenshotUploader() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [extractedText, setExtractedText] = useState<string | null>(null)
  const [result, setResult] = useState<ScamResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
    setExtractedText(null)
    setResult(null)
    setError(null)
  }

  async function handleSubmit() {
    if (!file) return
    setLoadingMsg('Extracting text from image...')
    setLoading(true)
    setError(null)
    setResult(null)
    setExtractedText(null)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await fetch('/api/screenshot', { method: 'POST', body: formData })
      setLoadingMsg('Analyzing for scams...')
      const contentType = res.headers.get('content-type') ?? ''
      let data: { error?: string; extracted_text?: string; analysis?: ScamResult }
      const raw = await res.text()
      if (contentType.includes('application/json')) {
        try {
          data = JSON.parse(raw)
        } catch {
          throw new Error('Invalid response from server. Please try again.')
        }
      } else {
        throw new Error(raw || 'Scan failed. Please try again or use a clearer image.')
      }
      if (!res.ok) throw new Error(data.error ?? 'Scan failed')
      setExtractedText(data.extracted_text ?? null)
      setResult(data.analysis ?? null)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message.startsWith('Unexpected token') || message.includes('is not valid JSON')
        ? 'Scan failed. The image could not be read or analyzed. Please try a clearer screenshot or a different image.'
        : message)
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
          accept="image/*"
          onChange={handleFile}
          className="hidden"
          aria-hidden
        />
        <span className="text-4xl sm:text-5xl block mb-4 text-gray-300">📎</span>
        <p className="text-gray-600 font-medium text-base sm:text-lg">Click to upload a screenshot</p>
        <p className="text-gray-400 text-sm sm:text-base mt-1.5">JPG, PNG, WEBP supported</p>
      </div>

      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          className="max-h-72 object-contain rounded-xl mx-auto mt-6 border border-slate-200 shadow-sm"
        />
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!file || loading}
        className="w-full py-4 sm:py-4.5 text-base font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl mt-6 transition-all shadow-sm hover:shadow-md"
      >
        {loading ? 'Scanning...' : '🔍 Scan for Scams'}
      </button>

      {loading && (
        <div className="flex flex-col items-center gap-4 mt-8">
          <div
            className="animate-spin border-4 border-blue-600 border-t-transparent rounded-full w-9 h-9"
            aria-hidden
          />
          <p className="text-gray-500 text-base font-medium">{loadingMsg}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mt-6 text-red-700 text-base leading-relaxed">
          {error}
        </div>
      )}

      {extractedText != null && (
        <div className="mt-6">
          <label className="text-black font-semibold text-base sm:text-lg mb-3 block">Text found in image:</label>
          <div className="max-h-40 overflow-y-auto bg-slate-50 border border-slate-100 rounded-xl p-4 sm:p-5 font-mono text-sm text-gray-600 leading-relaxed">
            {extractedText || '(No text extracted)'}
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
