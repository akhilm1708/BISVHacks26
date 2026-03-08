import LiveCallListener from '@/components/LiveCallListener'

export default function LivePage() {
  return (
    <div className="min-h-screen bg-slate-50/60">
      <div className="max-w-2xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight mb-3">Live Call Protection</h1>
        <p className="text-gray-600 text-base sm:text-lg mb-10 sm:mb-12 max-w-xl leading-relaxed">
          Press Start during a suspicious phone call. The AI will listen and warn you in real time.
        </p>
        <LiveCallListener />
      </div>
    </div>
  )
}
