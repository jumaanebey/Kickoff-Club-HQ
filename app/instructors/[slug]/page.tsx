import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/db/supabase'
import { CourseCard } from '@/components/courses/course-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Award, Calendar, BookOpen } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: {
    slug: string
  }
}

async function getInstructorBySlug(slug: string) {
  const { data, error } = await supabase
    .from('instructors')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) return null
  return data
}

async function getCoursesByInstructor(instructorId: string) {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('instructor_id', instructorId)
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) return []
  return data
}

export default async function InstructorPage({ params }: PageProps) {
  const instructor = await getInstructorBySlug(params.slug)

  if (!instructor) {
    notFound()
  }

  const courses = await getCoursesByInstructor(instructor.id)

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0A0A0A]/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-orange-400">
            Kickoff Club HQ
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-white/70 hover:text-white">Home</Link>
            <Link href="/courses" className="text-white/70 hover:text-white">Courses</Link>
            <Link href="/auth/sign-in" className="text-white/70 hover:text-white">Sign In</Link>
          </nav>
        </div>
      </header>

      {/* Instructor Profile Header */}
      <section className="py-12 bg-gradient-to-br from-white/5 to-white/10">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                {instructor.profile_image_url ? (
                  <img
                    src={instructor.profile_image_url}
                    alt={instructor.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white/20 shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-orange-500/20 flex items-center justify-center text-4xl font-bold text-orange-400 border-4 border-white/20 shadow-lg">
                    {instructor.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2 text-white">{instructor.name}</h1>

                {instructor.credentials && (
                  <p className="text-lg text-white/70 mb-4">{instructor.credentials}</p>
                )}

                <div className="flex flex-wrap gap-4 mb-6">
                  {instructor.years_experience && (
                    <div className="flex items-center gap-2 text-white/70">
                      <Award className="h-5 w-5" />
                      <span>{instructor.years_experience} years experience</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-white/70">
                    <BookOpen className="h-5 w-5" />
                    <span>{courses.length} course{courses.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* Specialties */}
                {instructor.specialties && instructor.specialties.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-white/60 mb-2">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {instructor.specialties.map((specialty: string) => (
                        <Badge key={specialty} className="bg-white/10 border-white/20 text-white">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Social Links */}
                <div className="flex gap-3">
                  {instructor.website_url && (
                    <a
                      href={instructor.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-400 hover:text-orange-500"
                    >
                      Website
                    </a>
                  )}
                  {instructor.twitter_url && (
                    <a
                      href={instructor.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-400 hover:text-orange-500"
                    >
                      Twitter
                    </a>
                  )}
                  {instructor.linkedin_url && (
                    <a
                      href={instructor.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-400 hover:text-orange-500"
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      {instructor.bio && (
        <section className="py-12 border-b border-white/10">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-4 text-white">About</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-white/70 leading-relaxed">{instructor.bio}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Courses Section */}
      <section className="py-12">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-white">
              Courses by {instructor.name.split(' ')[0]}
            </h2>

            {courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg">
                <BookOpen className="h-12 w-12 mx-auto text-white/40 mb-3" />
                <p className="text-white/60">No courses available yet</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
