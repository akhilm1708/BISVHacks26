'use client'

import { useEffect, useRef, useState } from 'react'
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

// Web Speech API (browser built-in; not in all TS libs)
type SpeechRecognitionCtor = new () => {
  start: () => void
  stop: () => void
  abort: () => void
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((e: { resultIndex: number; results: { length: number; [i: number]: { isFinal: boolean; [0]: { transcript: string } } } }) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
}
const SpeechRecognitionAPI: SpeechRecognitionCtor | null =
  typeof window !== 'undefined'
    ? ((window as unknown as { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor }).SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition?: SpeechRecognitionCtor }).webkitSpeechRecognition) ||
      null
    : null

/** Remove consecutive repeated phrases (e.g. "hello I am from Amazon hello I am from Amazon" → once) so score isn't inflated. */
function dedupeRepeatedPhrases(text: string): string {
  const words = text.split(/\s+/)
  if (words.length < 4) return text
  for (let len = Math.min(12, Math.floor(words.length / 2)); len >= 2; len--) {
    for (let i = 0; i <= words.length - 2 * len; i++) {
      const a = words.slice(i, i + len).join(' ')
      const b = words.slice(i + len, i + 2 * len).join(' ')
      if (a === b) {
        return dedupeRepeatedPhrases([...words.slice(0, i + len), ...words.slice(i + 2 * len)].join(' '))
      }
    }
  }
  return text
}

export default function LiveCallListener() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [result, setResult] = useState<ScamResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<InstanceType<NonNullable<typeof SpeechRecognitionAPI>> | null>(null)
  const isListeningRef = useRef(false)
  const transcriptBoxRef = useRef<HTMLDivElement | null>(null)
  const transcriptRef = useRef('')
  const riskIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Keep ref in sync with full transcript (final + interim) so 5s risk interval sees current text during the call
  useEffect(() => {
    transcriptRef.current = [transcript, interimTranscript].filter(Boolean).join(' ').trim()
  }, [transcript, interimTranscript])

  function startListening() {
    if (!SpeechRecognitionAPI) {
      setError('Speech recognition is not supported in this browser. Try Chrome or Edge.')
      return
    }

    setError(null)
    setTranscript('')
    setInterimTranscript('')
    setResult(null)

    const recognition = new SpeechRecognitionAPI()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event: { resultIndex: number; results: { length: number; [i: number]: { isFinal: boolean; 0: { transcript: string } } } }) => {
      let finalAppend = ''
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i] as { isFinal: boolean; 0: { transcript: string } }
        const text = r[0].transcript.trim()
        if (!text) continue
        if (r.isFinal) {
          finalAppend += (finalAppend ? ' ' : '') + text
        } else {
          interim = text
        }
      }
      if (finalAppend) {
        setTranscript((prev) => {
          const next = (prev ? prev + ' ' + finalAppend : finalAppend).trim()
          return dedupeRepeatedPhrases(next)
        })
        setInterimTranscript('')
      }
      if (interim) setInterimTranscript(interim)
    }

    recognition.onerror = (event: { error: string }) => {
      if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone access in your browser settings.')
        stopListening()
      }
    }

    recognition.onend = () => {
      if (recognitionRef.current && isListeningRef.current) {
        try {
          recognitionRef.current.start()
        } catch {
          // ignore
        }
      }
    }

    try {
      recognition.start()
      recognitionRef.current = recognition
      isListeningRef.current = true
      setIsListening(true)
    } catch {
      setError('Could not start speech recognition. Please allow microphone access.')
      return
    }

    if (riskIntervalRef.current) clearInterval(riskIntervalRef.current)
    riskIntervalRef.current = setInterval(async () => {
      let text = transcriptRef.current.trim()
      if (!text) return
      text = dedupeRepeatedPhrases(text)
      if (!text.trim()) return
      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text }),
        })
        if (!res.ok) return
        const data = await res.json()
        setResult(data as ScamResult)
      } catch {
        // ignore
      }
    }, 5000)
  }

  function stopListening() {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
        recognitionRef.current.abort()
      } catch {
        // ignore
      }
      recognitionRef.current = null
    }
    if (riskIntervalRef.current) {
      clearInterval(riskIntervalRef.current)
      riskIntervalRef.current = null
    }
    isListeningRef.current = false
    setInterimTranscript('')
    setIsListening(false)
  }

  useEffect(() => {
    const el = transcriptBoxRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [transcript, interimTranscript])

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
          recognitionRef.current.abort()
        } catch {
          // ignore
        }
      }
      if (riskIntervalRef.current) clearInterval(riskIntervalRef.current)
    }
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
          <label className="font-bold block mb-2 text-gray-900">Live Transcript:</label>
          <div
            ref={transcriptBoxRef}
            className="max-h-48 overflow-y-auto bg-gray-50 rounded-xl p-4 text-sm text-gray-900"
          >
            {(transcript.trim() || interimTranscript.trim()) ? (
              [transcript.trim(), interimTranscript.trim()].filter(Boolean).join(' ')
            ) : (
              <span className="text-gray-500 italic">Waiting for speech...</span>
            )}
          </div>
        </div>
      )}

      {result && (
        <div className="mt-6">
          <RiskMeter probability={result.scam_probability} />

          <div className="bg-white rounded-xl border border-gray-200 p-5 mt-4">
            <h3 className="font-bold text-[1.1rem] mb-2 text-gray-900">Why this might be a scam</h3>
            <p className="text-gray-700">{result.reason}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 mt-4">
            <h3 className="font-bold text-[1.1rem] mb-2 text-gray-900">Suspicious phrases found</h3>
            {result.suspicious_phrases.length > 0 ? (
              <ul className="space-y-3">
                {result.suspicious_phrases.map((item, i) => (
                  <li key={i} className="flex flex-col gap-1">
                    <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-sm w-fit">
                      {typeof item === 'string' ? item : item.phrase}
                    </span>
                    {typeof item === 'object' && item.reason && (
                      <span className="text-sm text-gray-600 pl-1">{item.reason}</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No specific phrases flagged.</p>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 mt-4">
            <h3 className="font-bold text-[1.1rem] mb-2 text-gray-900">What you should do</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-gray-800">
              {result.recommended_action}
            </div>
          </div>
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
