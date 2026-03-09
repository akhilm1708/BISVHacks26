import FlashcardViewer from '@/components/FlashcardViewer'
import Link from 'next/link'

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
        <p className="text-base mb-10" style={{ color: '#6b7280' }}>
          Understand common scam types, the techniques scammers use, and how to protect yourself. Use the links below to check messages, screenshots, and calls with ScamSaver.
        </p>

        {/* Quick actions — links to other pages */}
        <section className="mb-12">
          <h2
            className="font-bold mb-4"
            style={{ fontSize: '1.25rem', color: '#0f0f1a' }}
          >
            Check something now
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/analyze"
              className="bg-white rounded-2xl border border-gray-100 p-5 transition-all duration-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] flex items-center gap-3 group"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            >
              <span className="text-2xl">📝</span>
              <div>
                <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Analyze a message</span>
                <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>Paste text or email</p>
              </div>
              <span className="ml-auto text-blue-600 text-sm font-medium">→</span>
            </Link>
            <Link
              href="/screenshot"
              className="bg-white rounded-2xl border border-gray-100 p-5 transition-all duration-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] flex items-center gap-3 group"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            >
              <span className="text-2xl">🖼️</span>
              <div>
                <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Scan a screenshot</span>
                <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>Upload an image</p>
              </div>
              <span className="ml-auto text-blue-600 text-sm font-medium">→</span>
            </Link>
            <Link
              href="/audio"
              className="bg-white rounded-2xl border border-gray-100 p-5 transition-all duration-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] flex items-center gap-3 group"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            >
              <span className="text-2xl">🎙️</span>
              <div>
                <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Analyze a recording</span>
                <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>Upload voicemail or call</p>
              </div>
              <span className="ml-auto text-blue-600 text-sm font-medium">→</span>
            </Link>
            <Link
              href="/live"
              className="bg-white rounded-2xl border border-gray-100 p-5 transition-all duration-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] flex items-center gap-3 group"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            >
              <span className="text-2xl">📞</span>
              <div>
                <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Live call protection</span>
                <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>Real-time during a call</p>
              </div>
              <span className="ml-auto text-blue-600 text-sm font-medium">→</span>
            </Link>
          </div>
        </section>

        {/* Common scam types */}
        <section className="mb-12">
          <h2
            className="font-bold mb-4"
            style={{ fontSize: '1.25rem', color: '#0f0f1a' }}
          >
            Common scam types
          </h2>
          <div className="space-y-4">
            <div
              className="bg-white rounded-2xl border border-gray-100 p-7 transition-all duration-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            >
              <h3 className="font-bold text-gray-900 mb-2">Phishing</h3>
              <p className="text-base leading-relaxed mb-3" style={{ color: '#6b7280' }}>
                Fake emails, texts, or websites that pretend to be banks, Amazon, the IRS, or other trusted organizations. They ask you to click a link, log in, or share personal or financial details.
              </p>
              <Link href="/analyze" className="text-blue-600 text-sm font-semibold hover:underline">
                Analyze a suspicious message →
              </Link>
            </div>
            <div
              className="bg-white rounded-2xl border border-gray-100 p-7 transition-all duration-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            >
              <h3 className="font-bold text-gray-900 mb-2">Tech support scams</h3>
              <p className="text-base leading-relaxed mb-3" style={{ color: '#6b7280' }}>
                Callers or pop-ups claim your computer has a virus or your account is compromised. They pressure you to give remote access, pay for &quot;fixes,&quot; or buy gift cards. Real companies don&apos;t contact you this way.
              </p>
              <Link href="/live" className="text-blue-600 text-sm font-semibold hover:underline">
                Protect yourself during a call →
              </Link>
            </div>
            <div
              className="bg-white rounded-2xl border border-gray-100 p-7 transition-all duration-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            >
              <h3 className="font-bold text-gray-900 mb-2">Prize & lottery scams</h3>
              <p className="text-base leading-relaxed mb-3" style={{ color: '#6b7280' }}>
                You &quot;won&quot; a gift card, vacation, or cash—but you must pay fees, taxes, or &quot;shipping&quot; first, or give your bank or card details. Legitimate prizes don&apos;t require upfront payment.
              </p>
              <Link href="/analyze" className="text-blue-600 text-sm font-semibold hover:underline">
                Check a prize message →
              </Link>
            </div>
            <div
              className="bg-white rounded-2xl border border-gray-100 p-7 transition-all duration-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            >
              <h3 className="font-bold text-gray-900 mb-2">Romance scams</h3>
              <p className="text-base leading-relaxed mb-3" style={{ color: '#6b7280' }}>
                Someone you met online builds a relationship, then asks for money for emergencies, travel, or &quot;investments.&quot; They may avoid video calls and make excuses. Never send money to someone you haven&apos;t met in person.
              </p>
              <Link href="/analyze" className="text-blue-600 text-sm font-semibold hover:underline">
                Analyze a message →
              </Link>
            </div>
            <div
              className="bg-white rounded-2xl border border-gray-100 p-7 transition-all duration-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            >
              <h3 className="font-bold text-gray-900 mb-2">IRS & government impersonation</h3>
              <p className="text-base leading-relaxed mb-3" style={{ color: '#6b7280' }}>
                Callers claim you owe taxes or have a warrant. They threaten arrest, lawsuits, or license suspension unless you pay immediately. The real IRS and government agencies don&apos;t demand payment by phone or gift cards.
              </p>
              <Link href="/live" className="text-blue-600 text-sm font-semibold hover:underline">
                Get help during a call →
              </Link>
            </div>
            <div
              className="bg-white rounded-2xl border border-gray-100 p-7 transition-all duration-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            >
              <h3 className="font-bold text-gray-900 mb-2">Grandparent & family emergency scams</h3>
              <p className="text-base leading-relaxed mb-3" style={{ color: '#6b7280' }}>
                A caller pretends to be a grandchild or relative in trouble—jail, hospital, overseas—and begs for money wired or sent right away. Always verify by calling the family member on a number you know before sending anything.
              </p>
              <Link href="/audio" className="text-blue-600 text-sm font-semibold hover:underline">
                Analyze a voicemail or recording →
              </Link>
            </div>
          </div>
        </section>

        {/* Techniques scammers use */}
        <section className="mb-12">
          <h2
            className="font-bold mb-4"
            style={{ fontSize: '1.25rem', color: '#0f0f1a' }}
          >
            Techniques scammers use
          </h2>
          <div className="space-y-4">
            <div
              className="bg-white rounded-2xl border border-gray-100 p-7 transition-all duration-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] border-l-4 border-l-blue-500"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            >
              <h3 className="font-semibold text-gray-900 mb-1">Urgency & fear</h3>
              <p className="text-base leading-relaxed" style={{ color: '#6b7280' }}>
                &quot;Act now,&quot; &quot;Your account will be closed,&quot; &quot;You&apos;ll be arrested.&quot; Scammers push you to decide before you can verify. Legitimate organizations give you time and ways to confirm.
              </p>
            </div>
            <div
              className="bg-white rounded-2xl border border-gray-100 p-7 transition-all duration-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] border-l-4 border-l-amber-400"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            >
              <h3 className="font-semibold text-gray-900 mb-1">Impersonation</h3>
              <p className="text-base leading-relaxed" style={{ color: '#6b7280' }}>
                They pretend to be your bank, the IRS, tech support, or a family member. Don&apos;t trust caller ID or email &quot;From&quot; names—they can be spoofed. Call back using a number from the official website or your statement.
              </p>
            </div>
            <div
              className="bg-white rounded-2xl border border-gray-100 p-7 transition-all duration-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] border-l-4 border-l-red-400"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            >
              <h3 className="font-semibold text-gray-900 mb-1">Too good to be true</h3>
              <p className="text-base leading-relaxed" style={{ color: '#6b7280' }}>
                Prizes, refunds, inheritance, or &quot;guaranteed&quot; returns. If you didn&apos;t enter a contest or expect a refund, be suspicious. Never pay fees or share details to &quot;claim&quot; something.
              </p>
            </div>
            <div
              className="bg-white rounded-2xl border border-gray-100 p-7 transition-all duration-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] border-l-4 border-l-blue-500"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            >
              <h3 className="font-semibold text-gray-900 mb-1">Never share these</h3>
              <p className="text-base leading-relaxed" style={{ color: '#6b7280' }}>
                Passwords, Social Security number, full bank or card numbers, one-time codes, or remote access to your device. Real companies won&apos;t ask for these by email, text, or unsolicited call.
              </p>
            </div>
          </div>
        </section>

        {/* Flashcards */}
        <section className="mb-8">
          <h2
            className="font-bold mb-5"
            style={{ fontSize: '1.25rem', color: '#0f0f1a' }}
          >
            Scam types flashcards
          </h2>
          <FlashcardViewer />
        </section>
      </div>
    </div>
  )
}
