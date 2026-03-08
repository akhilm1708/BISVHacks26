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
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Scan failed')
      setExtractedText(data.extracted_text)
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
          accept="image/*"
          onChange={handleFile}
          className="hidden"
          aria-hidden
        />
        <span className="text-4xl block mb-2">📎</span>
        <p className="text-[1.1rem]">Click to upload a screenshot</p>
        <p className="text-[0.9rem] text-gray-400 mt-1">JPG, PNG, WEBP supported</p>
      </div>

      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          className="max-h-72 object-contain rounded-xl mx-auto mt-4 border border-gray-200"
        />
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!file || loading}
        className="w-full py-3 text-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold mt-4"
      >
        {loading ? 'Scanning...' : '🔍 Scan for Scams'}
      </button>

      {loading && (
        <div className="flex flex-col items-center gap-3 mt-6">
          <div
            className="animate-spin border-4 border-blue-500 border-t-transparent rounded-full w-8 h-8"
            aria-hidden
          />
          <p className="text-gray-600">{loadingMsg}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-4 mt-4 text-red-800">
          {error}
        </div>
      )}

      {extractedText != null && (
        <div className="mt-6">
          <label className="font-bold block mb-2">Text found in image:</label>
          <div className="max-h-36 overflow-y-auto bg-gray-50 rounded-lg p-3 font-mono text-sm">
            {extractedText || '(No text extracted)'}
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

          {/* AudioWarning and SaveToNotes added in Prompt 7 */}
          <div id="audio-warning-slot" />
        </div>
      )}
    </div>
  )
}
