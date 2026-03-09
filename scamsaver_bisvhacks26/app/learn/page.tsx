import FlashcardViewer from '@/components/FlashcardViewer'

export default function LearnPage() {
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
          Learn About Scams
        </h1>
        <p className="text-base mb-8" style={{ color: '#6b7280' }}>
          Flashcards and prevention tips to stay safe online.
        </p>

        <div className="space-y-4 mb-10">
          <div
            className="bg-white rounded-2xl border border-gray-100 p-7 transition-all duration-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] border-l-4 border-l-blue-500"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
          >
            <p className="text-base font-medium leading-relaxed" style={{ color: '#6b7280' }}>
              Never share passwords, Social Security numbers, or banking details by email or phone. Legitimate companies will not ask for these in unsolicited messages.
            </p>
          </div>
          <div
            className="bg-white rounded-2xl border border-gray-100 p-7 transition-all duration-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] border-l-4 border-l-amber-400"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
          >
            <p className="text-base font-medium leading-relaxed" style={{ color: '#6b7280' }}>
              Be wary of urgency. Scammers often say you must act &quot;immediately&quot; or &quot;within 24 hours.&quot; Take time to verify through official channels.
            </p>
          </div>
          <div
            className="bg-white rounded-2xl border border-gray-100 p-7 transition-all duration-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] border-l-4 border-l-red-400"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
          >
            <p className="text-base font-medium leading-relaxed" style={{ color: '#6b7280' }}>
              If something sounds too good to be true (prizes, refunds, inheritance), it usually is. Verify independently before clicking or calling.
            </p>
          </div>
        </div>

        <h2
          className="font-bold mb-5"
          style={{ fontSize: '1.125rem', color: '#0f0f1a' }}
        >
          Scam types
        </h2>
        <FlashcardViewer />
      </div>
    </div>
  )
}
