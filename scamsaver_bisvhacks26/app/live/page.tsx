import LiveCallListener from '@/components/LiveCallListener'

export default function LivePage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] p-6">
      <div className="max-w-[680px] mx-auto">
        <h1 className="text-3xl font-extrabold mb-2">Live Call Protection</h1>
        <p className="text-gray-600 mb-6">
          Press Start during a suspicious phone call. The AI will listen and warn you in real
          time.
        </p>
        <LiveCallListener />
      </div>
    </div>
  )
}
