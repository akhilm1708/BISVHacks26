'use client'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center">
      <main className="w-full max-w-[720px] mx-auto p-8">
        <header className="mb-10">
          <h1 className="text-5xl font-extrabold text-gray-900">
            🛡️ ScamSaver
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            AI-powered scam protection — simple, fast, and free
          </p>
          <p className="mt-2 text-base text-green-600">
            🔒 Your messages are never stored or shared.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Link
            href="/analyze"
            className="block bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <span className="text-[2rem] block mb-2">📝</span>
            <h2 className="text-[1.4rem] font-bold text-gray-900">Analyze a Message</h2>
            <p className="mt-1 text-base text-gray-500">Paste a suspicious text or email</p>
          </Link>

          <Link
            href="/screenshot"
            className="block bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <span className="text-[2rem] block mb-2">🖼️</span>
            <h2 className="text-[1.4rem] font-bold text-gray-900">Scan a Screenshot</h2>
            <p className="mt-1 text-base text-gray-500">Upload an image of a suspicious message</p>
          </Link>

          <Link
            href="/audio"
            className="block bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <span className="text-[2rem] block mb-2">🎙️</span>
            <h2 className="text-[1.4rem] font-bold text-gray-900">Analyze a Recording</h2>
            <p className="mt-1 text-base text-gray-500">Upload a voicemail or phone call</p>
          </Link>

          <Link
            href="/live"
            className="block bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <span className="text-[2rem] block mb-2">📞</span>
            <h2 className="text-[1.4rem] font-bold text-gray-900">Live Call Protection</h2>
            <p className="mt-1 text-base text-gray-500">Monitor a live call in real time</p>
          </Link>

          <Link
            href="/learn"
            className="block bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:scale-105 transition-all duration-200 sm:col-span-2"
          >
            <span className="text-[2rem] block mb-2">📚</span>
            <h2 className="text-[1.4rem] font-bold text-gray-900">Learn About Scams</h2>
            <p className="mt-1 text-base text-gray-500">Flashcards and prevention tips</p>
          </Link>
        </div>
      </main>
    </div>
  )
}
