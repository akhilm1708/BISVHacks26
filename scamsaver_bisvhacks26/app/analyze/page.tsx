import MessageAnalyzer from '@/components/MessageAnalyzer'

export default function AnalyzePage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 60%)' }}
    >
      <div className="max-w-[720px] mx-auto px-8 py-8">
        <h1
          className="font-extrabold mb-2"
          style={{ fontSize: '2rem', color: '#0f0f1a' }}
        >
          Analyze a Message
        </h1>
        <p className="text-base mb-8" style={{ color: '#6b7280' }}>
          Paste a suspicious message below and get an instant AI analysis.
        </p>
        <MessageAnalyzer />
      </div>
    </div>
  )
}
