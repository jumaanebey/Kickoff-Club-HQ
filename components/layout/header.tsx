import Link from 'next/link'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary-500">
          Kickoff Club HQ
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="hover:text-primary-500">Home</Link>
          <Link href="/courses" className="hover:text-primary-500">Courses</Link>
          <Link href="/podcast" className="hover:text-primary-500">Podcast</Link>
          <Link href="/instructors" className="hover:text-primary-500">Instructors</Link>
          <Link href="/auth/sign-in" className="hover:text-primary-500">Sign In</Link>
        </nav>
      </div>
    </header>
  )
}
