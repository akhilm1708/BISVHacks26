import LiveCallListener from '@/components/LiveCallListener'

export default function LivePage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] p-6">
      <div className="max-w-[680px] mx-auto">
        <h1 className="text-3xl font-extrabold mb-2">Live call analysis</h1>
        <p className="text-gray-600 mb-6">
          Record a call or conversation and analyze it for scam risk.
        </p>
        <LiveCallListener />
      </div>
    </div>
  )
}
