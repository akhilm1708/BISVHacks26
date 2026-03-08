'use client'

import { useEffect, useRef, useState } from 'react'
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
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [result, setResult] = useState<ScamResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const transcriptBoxRef = useRef<HTMLDivElement | null>(null)

  async function startListening() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.start(5000)

      setIsListening(true)
      setError(null)

      if (intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = setInterval(async () => {
        try {
          if (chunksRef.current.length === 0) return
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
          chunksRef.current = []

          const formData = new FormData()
          formData.append('audio', blob, 'chunk.webm')

          const res = await fetch('/api/audio', { method: 'POST', body: formData })
          const data = await res.json()

          if (data.transcript) setTranscript((prev) => prev + ' ' + data.transcript)
          if (data.analysis) setResult(data.analysis)

          if (!res.ok) throw new Error(data.error ?? 'Audio analysis failed')
        } catch (e: unknown) {
          setError(e instanceof Error ? e.message : 'Audio analysis failed')
        }
      }, 10000)
    } catch {
      setError(
        'Microphone access denied. Please allow microphone access in your browser settings.'
      )
    }
  }

  function stopListening() {
    mediaRecorderRef.current?.stop()
    mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop())
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
    setIsListening(false)
  }

  useEffect(() => {
    const el = transcriptBoxRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [transcript])

  useEffect(() => {
    return () => {
      stopListening()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="max-w-[680px] mx-auto p-6 flex flex-col">
      {!isListening ? (
        <button
          type="button"
          onClick={startListening}
          className="w-full py-4 text-xl font-bold bg-green-600 hover:bg-green-700 text-white rounded-2xl"
        >
          ▶ Start Call Protection
        </button>
      ) : (
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={stopListening}
            className="w-full py-4 text-xl font-bold bg-red-600 hover:bg-red-700 text-white rounded-2xl"
          >
            ⏹ Stop Listening
          </button>

          <div className="flex items-center gap-2 text-gray-700">
            <span className="animate-pulse w-3 h-3 rounded-full bg-red-500" />
            <span>🎤 Listening to call...</span>
          </div>
        </div>
      )}

      {(isListening || transcript.length > 0) && (
        <div className="mt-6">
          <label className="font-bold block mb-2">Live Transcript:</label>
          <div
            ref={transcriptBoxRef}
            className="max-h-48 overflow-y-auto bg-gray-50 rounded-xl p-4 text-sm"
          >
            {transcript.trim().length > 0 ? (
              transcript.trim()
            ) : (
              <span className="text-gray-500 italic">Waiting for speech...</span>
            )}
          </div>
        </div>
      )}

      {result && (
        <div className="mt-6">
          <RiskMeter probability={result.scam_probability} />
        </div>
      )}

      {result && result.scam_probability > 75 && (
        <div
          className="w-full bg-red-600 text-white rounded-2xl p-6 text-center mt-4"
          style={{ fontSize: '1.2rem', fontWeight: 700 }}
        >
          <div>🚨 WARNING: This call shows signs of a scam.</div>
          <div>Do NOT share personal or financial information.</div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-4 mt-4 text-red-800">
          {error}
        </div>
      )}
    </div>
  )
}
