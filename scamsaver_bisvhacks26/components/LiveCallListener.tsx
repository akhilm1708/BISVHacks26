'use client'

import { useState, useRef, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'
import RiskMeter from '@/components/RiskMeter'

type SuspiciousPhrase = { phrase: string; reason: string }

type ScamResult = {
  scam_probability: number
  risk_level: string
  scam_type: string
  reason: string
  suspicious_phrases: (string | SuspiciousPhrase)[]
  recommended_action: string
}

type RiskDataPoint = {
  time: string
  probability: number
}

function getTimeLabel(startTimeRef: React.MutableRefObject<number>): string {
  const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
  const minutes = Math.floor(elapsed / 60)
  const seconds = elapsed % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export default function LiveCallListener() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [result, setResult] = useState<ScamResult | null>(null)
  const [riskHistory, setRiskHistory] = useState<RiskDataPoint[]>([])
  const [error, setError] = useState<string | null>(null)
  const [secondsElapsed, setSecondsElapsed] = useState(0)

  const recognitionRef = useRef<any>(null)
  const analysisIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const transcriptBoxRef = useRef<HTMLDivElement | null>(null)
  const startTimeRef = useRef<number>(0)
  const latestTranscriptRef = useRef<string>('')

  async function startListening() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.')
      return
    }

    const SpeechRecognitionAPI =
      (typeof window !== 'undefined' &&
        ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)) ||
      null
    if (!SpeechRecognitionAPI) {
      setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.')
      return
    }

    const recognition = new SpeechRecognitionAPI()
    recognitionRef.current = recognition

    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event: any) => {
      let fullTranscript = ''
      for (let i = 0; i < event.results.length; i++) {
        fullTranscript += event.results[i][0].transcript
      }
      setTranscript(fullTranscript)
      latestTranscriptRef.current = fullTranscript
    }

    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone access in your browser settings.')
        stopListening()
      }
    }

    recognition.start()
    startTimeRef.current = Date.now()
    setIsListening(true)
    setError(null)
    setRiskHistory([])
    setSecondsElapsed(0)
    setTranscript('')
    latestTranscriptRef.current = ''

    timerRef.current = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1)
    }, 1000)

    analysisIntervalRef.current = setInterval(async () => {
      const currentTranscript = latestTranscriptRef.current
      if (!currentTranscript || currentTranscript.trim() === '') return

      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: currentTranscript }),
        })
        const data = await res.json()

        if (data.scam_probability !== undefined) {
          setResult(data as ScamResult)
          setRiskHistory((prev) => [
            ...prev,
            {
              time: getTimeLabel(startTimeRef),
              probability: data.scam_probability,
            },
          ])
        }
      } catch (err) {
        console.error('Analysis failed:', err)
      }
    }, 2000)
  }

  function stopListening() {
    recognitionRef.current?.stop()
    recognitionRef.current = null
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current)
      analysisIntervalRef.current = null
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setIsListening(false)
  }

  useEffect(() => {
    return () => {
      stopListening()
    }
  }, [])

  useEffect(() => {
    const el = transcriptBoxRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [transcript])

  const elapsedLabel = `${Math.floor(secondsElapsed / 60)}:${(secondsElapsed % 60).toString().padStart(2, '0')}`
  const showWarning =
    (result?.scam_probability ?? 0) > 75 || riskHistory.some((p) => p.probability > 75)

  const maxRisk = riskHistory.length > 1 ? Math.max(...riskHistory.map((p) => p.probability)) : null
  const avgRisk =
    riskHistory.length > 1
      ? Math.round(riskHistory.reduce((a, b) => a + b.probability, 0) / riskHistory.length)
      : null
  const peakColor =
    maxRisk != null
      ? maxRisk >= 75
        ? 'text-red-600'
        : maxRisk >= 40
          ? 'text-amber-600'
          : 'text-green-600'
      : ''

  return (
    <div className="max-w-[720px] mx-auto px-6 py-6 flex flex-col">
      {!isListening ? (
        <button
          type="button"
          onClick={startListening}
          className="w-full py-5 text-lg font-bold bg-green-600 hover:bg-green-700 text-white rounded-2xl shadow-sm transition-all"
        >
          ▶ Start Call Protection
        </button>
      ) : (
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={stopListening}
            className="w-full py-5 text-lg font-bold bg-red-600 hover:bg-red-700 text-white rounded-2xl shadow-sm transition-all"
          >
            ⏹ Stop Listening
          </button>
          <div className="flex items-center gap-2 text-red-600 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span>🎤 Listening... {elapsedLabel}</span>
          </div>
        </div>
      )}

      {result != null && (
        <div className="mt-6 space-y-4 transition-all duration-500">
          <RiskMeter probability={result.scam_probability} />

          <div
            className="bg-white rounded-2xl border border-gray-100 p-7 transition-all duration-200"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
          >
            <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-900 mb-3">Why this might be a scam</h3>
            <p className="text-base leading-relaxed" style={{ color: '#6b7280' }}>
              {result.reason}
            </p>
          </div>

          <div
            className="bg-white rounded-2xl border border-gray-100 p-7 transition-all duration-200"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
          >
            <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-900 mb-3">Suspicious phrases found</h3>
            {result.suspicious_phrases?.length > 0 ? (
              <ul className="space-y-3">
                {result.suspicious_phrases.map((item, i) => (
                  <li key={i} className="flex flex-col gap-1.5">
                    <span className="bg-blue-50 text-blue-600 border border-blue-200 rounded-full px-3.5 py-1 text-sm font-medium w-fit">
                      {typeof item === 'string' ? item : item.phrase}
                    </span>
                    {typeof item === 'object' && item.reason && (
                      <span className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>{item.reason}</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-base" style={{ color: '#6b7280' }}>No specific phrases flagged.</p>
            )}
          </div>

          <div
            className="bg-white rounded-2xl border border-gray-100 p-7 transition-all duration-200"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
          >
            <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-900 mb-3">What you should do</h3>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-base leading-relaxed text-blue-900">
              {result.recommended_action}
            </div>
          </div>
        </div>
      )}

      {showWarning && (
        <div className="w-full bg-red-600 text-white rounded-2xl p-6 text-center mt-4 text-[1.1rem] font-bold">
          <div>🚨 WARNING: This call shows signs of a scam.</div>
          <div>Do NOT share personal or financial information.</div>
        </div>
      )}

      {riskHistory.length >= 1 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-base text-gray-900">📈 Risk Over Time</span>
            <span className="text-[0.75rem] text-gray-500 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500" /> Safe
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Suspicious
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500" /> High Risk
              </span>
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={riskHistory} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => v + '%'}
              />
              <Tooltip
                formatter={(value: unknown): [React.ReactNode, string] => [
                  typeof value === 'number' ? value + '%' : String(value),
                  'Scam Risk',
                ]}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.85rem',
                }}
              />
              <ReferenceLine y={40} stroke="#fbbf24" strokeDasharray="4 4" strokeWidth={1} />
              <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1} />
              <Line
                type="monotone"
                dataKey="probability"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={(props: { cx?: number; cy?: number; payload?: RiskDataPoint }) => {
                  const { cx, cy, payload } = props
                  if (cx == null || cy == null || !payload) return null
                  const color =
                    payload.probability >= 75
                      ? '#ef4444'
                      : payload.probability >= 40
                        ? '#f59e0b'
                        : '#22c55e'
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={4}
                      fill={color}
                      stroke="white"
                      strokeWidth={2}
                      key={cx}
                    />
                  )
                }}
                activeDot={{ r: 6 }}
                isAnimationActive={true}
                animationDuration={300}
              />
            </LineChart>
          </ResponsiveContainer>
          {riskHistory.length > 1 && maxRisk != null && avgRisk != null && (
            <p className="text-[0.85rem] text-gray-500 text-center mt-3">
              Peak risk: <span className={`font-semibold ${peakColor}`}>{maxRisk}%</span>
              {'  •  '}
              Average risk: {avgRisk}%
            </p>
          )}
        </div>
      )}

      {(isListening || transcript.length > 0) && (
        <div className="mt-6">
          <label className="font-bold block mb-2 text-gray-900">Live Transcript:</label>
          <div
            ref={transcriptBoxRef}
            className="max-h-[160px] overflow-y-auto bg-gray-50 rounded-xl p-4 text-[0.9rem] text-gray-800"
          >
            {transcript.trim() ? (
              transcript
            ) : (
              <span className="text-gray-400 italic">Waiting for speech...</span>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4 text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  )
}
