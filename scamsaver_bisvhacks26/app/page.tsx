'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');`,
        }}
      />
      <div
        className="min-h-screen"
        style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 60%)',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        <main className="max-w-[1100px] mx-auto px-8">
          {/* Hero: full viewport height, centered */}
          <section className="min-h-screen flex flex-col items-center justify-center text-center">
            <span className="rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-sm font-semibold px-4 py-1 inline-block mb-6">
              🛡️ AI-Powered Scam Protection
            </span>
            <h1
              className="font-extrabold leading-[1.1] mx-auto max-w-[14ch] sm:max-w-none"
              style={{
                fontSize: 'clamp(3rem, 7vw, 5.5rem)',
                letterSpacing: '-0.02em',
                color: '#0f0f1a',
              }}
            >
              <span className="block">Think before you act.</span>
              <span className="block text-blue-600">We&apos;ll think with you.</span>
            </h1>
            <p
              className="text-[1.15rem] font-normal mt-6 mx-auto max-w-[520px]"
              style={{ color: '#6b7280', lineHeight: 1.6 }}
            >
              Paste a message, upload a screenshot, or let ScamSaver listen to your call in real time. Know instantly if you&apos;re being scammed.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
              <Link
                href="/analyze"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full text-base font-semibold transition-colors"
                style={{ boxShadow: '0 4px 24px rgba(37,99,235,0.25)' }}
              >
                Get Started
              </Link>
              <Link
                href="/learn"
                className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-8 py-3.5 rounded-full text-base font-semibold transition-colors"
              >
                See how it works
              </Link>
            </div>
            <p className="text-sm text-gray-400 mt-3">
              🔒 Your messages are never stored or shared.
            </p>
          </section>

          {/* Feature cards */}
          <section className="py-16 sm:py-24">
            <h2 className="text-center mb-2 font-bold" style={{ fontSize: '1.75rem', color: '#0f0f1a' }}>
              Everything you need to stay safe
            </h2>
            <p className="text-gray-500 text-center mb-10">
              Five ways ScamSaver protects you
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                href="/analyze"
                className="group bg-white rounded-2xl p-7 border border-gray-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-4 text-xl">
                  📝
                </div>
                <h3 className="font-bold mb-1" style={{ fontSize: '1.05rem', color: '#0f0f1a' }}>
                  Analyze a Message
                </h3>
                <p className="text-[0.9rem] leading-[1.5]" style={{ color: '#6b7280' }}>
                  Paste any suspicious text or email for instant AI analysis.
                </p>
                <span className="block text-blue-600 text-right mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </Link>

              <Link
                href="/screenshot"
                className="group bg-white rounded-2xl p-7 border border-gray-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-4 text-xl">
                  🖼️
                </div>
                <h3 className="font-bold mb-1" style={{ fontSize: '1.05rem', color: '#0f0f1a' }}>
                  Scan a Screenshot
                </h3>
                <p className="text-[0.9rem] leading-[1.5]" style={{ color: '#6b7280' }}>
                  Upload an image and we&apos;ll extract and analyze the text automatically.
                </p>
                <span className="block text-blue-600 text-right mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </Link>

              <Link
                href="/audio"
                className="group bg-white rounded-2xl p-7 border border-gray-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-4 text-xl">
                  🎙️
                </div>
                <h3 className="font-bold mb-1" style={{ fontSize: '1.05rem', color: '#0f0f1a' }}>
                  Analyze a Recording
                </h3>
                <p className="text-[0.9rem] leading-[1.5]" style={{ color: '#6b7280' }}>
                  Upload a voicemail or call recording for full transcript analysis.
                </p>
                <span className="block text-blue-600 text-right mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </Link>

              <Link
                href="/live"
                className="group bg-white rounded-2xl p-7 border border-gray-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-4 text-xl">
                  📞
                </div>
                <h3 className="font-bold mb-1" style={{ fontSize: '1.05rem', color: '#0f0f1a' }}>
                  Live Call Protection
                </h3>
                <p className="text-[0.9rem] leading-[1.5]" style={{ color: '#6b7280' }}>
                  Press one button during a call and get real-time scam detection.
                </p>
                <span className="block text-blue-600 text-right mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </Link>

              <Link
                href="/learn"
                className="group bg-white rounded-2xl p-7 border border-gray-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] sm:col-span-2 lg:col-span-1"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-4 text-xl">
                  📚
                </div>
                <h3 className="font-bold mb-1" style={{ fontSize: '1.05rem', color: '#0f0f1a' }}>
                  Learn About Scams
                </h3>
                <p className="text-[0.9rem] leading-[1.5]" style={{ color: '#6b7280' }}>
                  Flashcards and tips to help you recognize scams before they happen.
                </p>
                <span className="block text-blue-600 text-right mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </Link>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
