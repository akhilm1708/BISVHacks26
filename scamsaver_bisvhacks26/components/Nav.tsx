'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Home' },
  { href: '/analyze', label: 'Analyze' },
  { href: '/screenshot', label: 'Screenshot' },
  { href: '/audio', label: 'Recording' },
  { href: '/live', label: 'Live Call' },
  { href: '/learn', label: 'Learn' },
]

export default function Nav() {
  const pathname = usePathname()
  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-slate-200/80 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1100px] mx-auto px-5 sm:px-8 h-16 sm:h-[4.25rem] flex items-center justify-between">
        <Link
          href="/"
          className="font-extrabold text-black text-lg sm:text-xl tracking-tight hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <img src="/scamsaver-logo.png" alt="" className="inline-block w-auto" style={{ height: '1em' }} />
          ScamSaver
        </Link>
        <div className="flex items-center gap-5 sm:gap-8">
          {links.filter((l) => l.href !== '/').map(({ href, label }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`text-sm sm:text-base font-medium transition-colors py-2 px-1 -mx-1 rounded-lg ${
                  isActive
                    ? 'text-blue-600 font-semibold bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-slate-100'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
