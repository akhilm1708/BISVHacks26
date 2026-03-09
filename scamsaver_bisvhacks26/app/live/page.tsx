import LiveCallListener from '@/components/LiveCallListener'

export default function LivePage() {
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
          Live Call Protection
        </h1>
        <p className="text-base mb-8" style={{ color: '#6b7280' }}>
          Press Start during a suspicious phone call. The AI will listen and warn you in real time.
        </p>
        <LiveCallListener />
      </div>
    </div>
  )
}
