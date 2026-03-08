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
    <div className="max-w-2xl mx-auto px-0 py-2 flex flex-col">
      {!isListening ? (
        <button
          type="button"
          onClick={startListening}
          className="w-full py-5 sm:py-6 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-sm hover:shadow-md transition-all"
        >
          ▶ Start Call Protection
        </button>
      ) : (
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={stopListening}
            className="w-full py-5 sm:py-6 text-lg font-bold bg-slate-900 hover:bg-black text-white rounded-2xl shadow-sm hover:shadow-md transition-all"
          >
            ⏹ Stop Listening
          </button>

          <div className="flex items-center gap-2.5 text-blue-600 text-base font-medium mt-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            🎤 Listening to call...
          </div>
        </div>
      )}

      {(isListening || transcript.length > 0) && (
        <div className="mt-6">
          <label className="text-black font-semibold text-base sm:text-lg mb-3 block">Live Transcript:</label>
          <div
            ref={transcriptBoxRef}
            className="max-h-52 overflow-y-auto bg-slate-50 border border-slate-100 rounded-xl p-4 sm:p-5 text-base text-gray-600 leading-relaxed"
          >
            {(transcript.trim() || interimTranscript.trim()) ? (
              [transcript.trim(), interimTranscript.trim()].filter(Boolean).join(' ')
            ) : (
              <span className="text-gray-400 italic text-base">Waiting for speech...</span>
            )}
          </div>
        </div>
      )}

      {result && (
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
        </div>
      )}

      {result && result.scam_probability > 75 && (
        <div className="w-full bg-red-600 text-white rounded-2xl p-6 sm:p-8 text-center mt-8 font-bold text-lg sm:text-xl leading-snug">
          <div>🚨 WARNING: This call shows signs of a scam.</div>
          <div className="mt-1">Do NOT share personal or financial information.</div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mt-6 text-red-700 text-base leading-relaxed">
          {error}
        </div>
      )}
    </div>
  )
}
