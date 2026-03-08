import FlashcardViewer from '@/components/FlashcardViewer'

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-slate-50/60">
      <div className="max-w-2xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight mb-3">Learn About Scams</h1>
        <p className="text-gray-600 text-base sm:text-lg mb-10 sm:mb-12 max-w-xl leading-relaxed">
          Flashcards and prevention tips to stay safe online.
        </p>

        <div className="space-y-4 sm:space-y-5 mb-14">
          <div className="bg-white border border-slate-200/80 rounded-xl p-6 sm:p-7 border-l-4 border-l-blue-500 shadow-sm">
            <p className="text-gray-700 text-base font-medium leading-relaxed">
              Never share passwords, Social Security numbers, or banking details by email or phone. Legitimate companies will not ask for these in unsolicited messages.
            </p>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-xl p-6 sm:p-7 border-l-4 border-l-amber-400 shadow-sm">
            <p className="text-gray-700 text-base font-medium leading-relaxed">
              Be wary of urgency. Scammers often say you must act &quot;immediately&quot; or &quot;within 24 hours.&quot; Take time to verify through official channels.
            </p>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-xl p-6 sm:p-7 border-l-4 border-l-red-400 shadow-sm">
            <p className="text-gray-700 text-base font-medium leading-relaxed">
              If something sounds too good to be true (prizes, refunds, inheritance), it usually is. Verify independently before clicking or calling.
            </p>
          </div>
        </div>

        <h2 className="text-black font-bold text-lg sm:text-xl mb-5">Scam types</h2>
        <FlashcardViewer />
      </div>
    </div>
  )
}
