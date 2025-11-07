import Link from 'next/link'
import { cn } from '@/lib/utils'

interface HeaderProps {
  activePage?: 'home' | 'courses' | 'podcast'
}

export function Header({ activePage }: HeaderProps = {}) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0A0A0A]/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-white">
          Kickoff Club HQ
        </Link>
        <nav className="flex items-center gap-6 text-white/80">
          <Link
            href="/"
            className={cn(
              "hover:text-white transition-colors",
              activePage === 'home' && "text-white font-medium"
            )}
          >
            Home
          </Link>
          <Link
            href="/courses"
            className={cn(
              "hover:text-white transition-colors",
              activePage === 'courses' && "text-white font-medium"
            )}
          >
            Courses
          </Link>
          <Link
            href="/podcast"
            className={cn(
              "hover:text-white transition-colors",
              activePage === 'podcast' && "text-white font-medium"
            )}
          >
            Podcast
          </Link>
          <Link href="/auth/sign-in" className="hover:text-white transition-colors">Sign In</Link>
        </nav>
      </div>
    </header>
  )
}
