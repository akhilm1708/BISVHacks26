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

export default function LiveCallListener() {
  const [recording, setRecording] = useState(false)
  const [blob, setBlob] = useState<Blob | null>(null)
  const [transcript, setTranscript] = useState<string | null>(null)
  const [result, setResult] = useState<ScamResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  async function startRecording() {
    setError(null)
    setResult(null)
    setTranscript(null)
    setBlob(null)
    chunksRef.current = []
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
        if (chunksRef.current.length) {
          setBlob(new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' }))
        }
      }
      recorder.start()
      setRecording(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Microphone access denied')
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current = null
      setRecording(false)
    }
  }

  async function analyzeRecording() {
    if (!blob) return
    setLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('audio', blob, 'recording.webm')
      const res = await fetch('/api/audio', { method: 'POST', body: formData })
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
      <p className="text-gray-600 mb-4">
        Record a live call or conversation, then analyze it for scam risk.
      </p>

      {!recording && !blob && (
        <button
          type="button"
          onClick={startRecording}
          className="w-full py-4 text-lg bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          <span className="w-3 h-3 bg-white rounded-full animate-pulse" />
          Start recording
        </button>
      )}

      {recording && (
        <button
          type="button"
          onClick={stopRecording}
          className="w-full py-4 text-lg bg-gray-700 hover:bg-gray-800 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          <span className="w-3 h-3 bg-red-400 rounded-full" />
          Stop recording
        </button>
      )}

      {blob && !result && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-500">Recording ready. Analyze it below.</p>
          <button
            type="button"
            onClick={analyzeRecording}
            disabled={loading}
            className="w-full py-3 text-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-semibold"
          >
            {loading ? 'Transcribing & analyzing...' : '🔍 Analyze recording'}
          </button>
          <button
            type="button"
            onClick={() => { setBlob(null); setTranscript(null); setResult(null) }}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Record again
          </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center gap-3 mt-6">
          <div className="animate-spin border-4 border-blue-500 border-t-transparent rounded-full w-8 h-8" />
          <p className="text-gray-600">Transcribing and analyzing...</p>
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
          <div className="max-h-44 overflow-y-auto bg-gray-50 rounded-lg p-3 text-sm">
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
