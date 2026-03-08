'use client'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50/60">
      <main className="w-full max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <section className="text-center pt-16 sm:pt-24 pb-14 sm:pb-20">
          <h1 className="text-black font-black leading-[1.1] tracking-tight mx-auto max-w-[20ch] sm:max-w-none text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem]">
            AI-Powered Scam Protection
          </h1>
          <p className="text-gray-600 text-base sm:text-lg md:text-xl mt-5 sm:mt-6 mx-auto max-w-[32rem] leading-relaxed">
            Simple, fast, and free. Protect yourself and your family from online scams.
          </p>
          <span className="bg-blue-50 text-blue-700 text-sm sm:text-base font-medium px-5 py-2 rounded-full inline-block mt-6 border border-blue-100">
            🔒 Your messages are never stored
          </span>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mt-14 sm:mt-20">
          <Link
            href="/analyze"
            className="block bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-blue-200/80 transition-all duration-200 cursor-pointer group"
          >
            <span className="text-3xl sm:text-4xl block mb-4">📝</span>
            <h2 className="text-black font-bold text-lg sm:text-xl mb-2">Analyze a Message</h2>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">Paste a suspicious text or email</p>
            <span className="text-blue-600 text-sm sm:text-base mt-4 block font-semibold group-hover:translate-x-0.5 transition-transform inline-block">→</span>
          </Link>

          <Link
            href="/screenshot"
            className="block bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-blue-200/80 transition-all duration-200 cursor-pointer group"
          >
            <span className="text-3xl sm:text-4xl block mb-4">🖼️</span>
            <h2 className="text-black font-bold text-lg sm:text-xl mb-2">Scan a Screenshot</h2>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">Upload an image of a suspicious message</p>
            <span className="text-blue-600 text-sm sm:text-base mt-4 block font-semibold group-hover:translate-x-0.5 transition-transform inline-block">→</span>
          </Link>

          <Link
            href="/audio"
            className="block bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-blue-200/80 transition-all duration-200 cursor-pointer group"
          >
            <span className="text-3xl sm:text-4xl block mb-4">🎙️</span>
            <h2 className="text-black font-bold text-lg sm:text-xl mb-2">Analyze a Recording</h2>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">Upload a voicemail or phone call</p>
            <span className="text-blue-600 text-sm sm:text-base mt-4 block font-semibold group-hover:translate-x-0.5 transition-transform inline-block">→</span>
          </Link>

          <Link
            href="/live"
            className="block bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-blue-200/80 transition-all duration-200 cursor-pointer group"
          >
            <span className="text-3xl sm:text-4xl block mb-4">📞</span>
            <h2 className="text-black font-bold text-lg sm:text-xl mb-2">Live Call Protection</h2>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">Monitor a live call in real time</p>
            <span className="text-blue-600 text-sm sm:text-base mt-4 block font-semibold group-hover:translate-x-0.5 transition-transform inline-block">→</span>
          </Link>

          <Link
            href="/learn"
            className="block bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-blue-200/80 transition-all duration-200 cursor-pointer sm:col-span-2 group"
          >
            <span className="text-3xl sm:text-4xl block mb-4">📚</span>
            <h2 className="text-black font-bold text-lg sm:text-xl mb-2">Learn About Scams</h2>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">Flashcards and prevention tips</p>
            <span className="text-blue-600 text-sm sm:text-base mt-4 block font-semibold group-hover:translate-x-0.5 transition-transform inline-block">→</span>
          </Link>
        </div>
      </main>
    </div>
  )
}
