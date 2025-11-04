import { getAllCourses } from "@/lib/db/queries"
import { CourseCard } from "@/components/courses/course-card"

export default async function CoursesPage() {
  const courses = await getAllCourses()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <a href="/" className="text-2xl font-bold text-primary-500">Kickoff Club HQ</a>
          <nav className="flex items-center gap-6">
            <a href="/">Home</a>
            <a href="/courses" className="text-primary-500 font-medium">Courses</a>
            <a href="/auth/signin">Sign In</a>
          </nav>
        </div>
      </header>

      {/* Page Header */}
      <section className="py-12 bg-gradient-to-br from-primary-50 to-white">
        <div className="container px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Master Football Fundamentals
            </h1>
            <p className="text-lg text-gray-600">
              Choose from our structured courses designed by expert coaches. From beginner to advanced.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b bg-gray-50 py-4">
        <div className="container px-4">
          <div className="flex gap-4 items-center">
            <span className="text-sm font-medium">Filter by:</span>
            <button className="px-3 py-1.5 rounded-full bg-white border hover:border-primary-500 text-sm">
              All Categories
            </button>
            <button className="px-3 py-1.5 rounded-full bg-white border hover:border-primary-500 text-sm">
              All Levels
            </button>
            <button className="px-3 py-1.5 rounded-full bg-white border hover:border-primary-500 text-sm">
              All Tiers
            </button>
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <section className="py-12">
        <div className="container px-4">
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-2xl font-bold mb-2">No courses yet</h2>
              <p className="text-gray-600">
                Courses are being added. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
