import Link from 'next/link'
import { cn } from '@/lib/utils'

interface HeaderProps {
  activePage?: 'home' | 'courses' | 'podcast' | 'instructors'
}

export function Header({ activePage }: HeaderProps = {}) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary-500">
          Kickoff Club HQ
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className={cn(
              "hover:text-primary-500",
              activePage === 'home' && "text-primary-500 font-medium"
            )}
          >
            Home
          </Link>
          <Link
            href="/courses"
            className={cn(
              "hover:text-primary-500",
              activePage === 'courses' && "text-primary-500 font-medium"
            )}
          >
            Courses
          </Link>
          <Link
            href="/podcast"
            className={cn(
              "hover:text-primary-500",
              activePage === 'podcast' && "text-primary-500 font-medium"
            )}
          >
            Podcast
          </Link>
          <Link
            href="/instructors"
            className={cn(
              "hover:text-primary-500",
              activePage === 'instructors' && "text-primary-500 font-medium"
            )}
          >
            Instructors
          </Link>
          <Link href="/auth/sign-in" className="hover:text-primary-500">Sign In</Link>
        </nav>
      </div>
    </header>
  )
}
