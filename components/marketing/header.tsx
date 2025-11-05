import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getUser } from "@/app/actions/auth"
import { UserMenu } from "./user-menu"

export async function Header() {
  const user = await getUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary-500">Kickoff Club HQ</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/#features" className="text-sm font-medium hover:text-primary-500 transition-colors">
            Features
          </Link>
          <Link href="/#pricing" className="text-sm font-medium hover:text-primary-500 transition-colors">
            Pricing
          </Link>
          <Link href="/courses" className="text-sm font-medium hover:text-primary-500 transition-colors">
            Courses
          </Link>
          {user && (
            <Link href="/dashboard/my-courses" className="text-sm font-medium hover:text-primary-500 transition-colors">
              My Courses
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Link href="/auth/sign-in" className="text-sm font-medium hover:text-primary-500 transition-colors">
                Sign In
              </Link>
              <Button asChild>
                <Link href="/auth/sign-up">Start Free Trial</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
