import Link from 'next/link'
import { supabase } from '@/lib/db/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Award, BookOpen } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getAllInstructors() {
  const { data, error } = await supabase
    .from('instructors')
    .select(`
      *,
      courses!courses_instructor_id_fkey(id)
    `)
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching instructors:', error)
    return []
  }

  return data
}

export default async function InstructorsPage() {
  const instructors = await getAllInstructors()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary-500">
            Kickoff Club HQ
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/">Home</Link>
            <Link href="/courses">Courses</Link>
            <Link href="/instructors" className="text-primary-500 font-medium">Instructors</Link>
            <Link href="/auth/sign-in">Sign In</Link>
          </nav>
        </div>
      </header>

      {/* Page Header */}
      <section className="py-12 bg-gradient-to-br from-primary-50 to-white">
        <div className="container px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Meet Our Expert Instructors
            </h1>
            <p className="text-lg text-gray-600">
              Learn from experienced coaches and players who are passionate about sharing their knowledge.
            </p>
          </div>
        </div>
      </section>

      {/* Instructors Grid */}
      <section className="py-12">
        <div className="container px-4">
          <div className="mb-6">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{instructors.length}</span> instructor{instructors.length !== 1 ? 's' : ''}
            </p>
          </div>

          {instructors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {instructors.map((instructor) => {
                const courseCount = instructor.courses?.length || 0

                return (
                  <Link key={instructor.id} href={`/instructors/${instructor.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        {/* Profile Image */}
                        <div className="flex justify-center mb-4">
                          {instructor.profile_image_url ? (
                            <img
                              src={instructor.profile_image_url}
                              alt={instructor.name}
                              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                            />
                          ) : (
                            <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-3xl font-bold text-primary-600 border-4 border-white shadow-md">
                              {instructor.name.charAt(0)}
                            </div>
                          )}
                        </div>

                        <CardTitle className="text-center text-xl">{instructor.name}</CardTitle>
                        {instructor.credentials && (
                          <CardDescription className="text-center">
                            {instructor.credentials}
                          </CardDescription>
                        )}
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Stats */}
                        <div className="flex justify-center gap-6 text-sm text-gray-600">
                          {instructor.years_experience && (
                            <div className="flex items-center gap-1">
                              <Award className="h-4 w-4" />
                              <span>{instructor.years_experience}+ years</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            <span>{courseCount} course{courseCount !== 1 ? 's' : ''}</span>
                          </div>
                        </div>

                        {/* Bio Preview */}
                        {instructor.bio && (
                          <p className="text-sm text-gray-600 line-clamp-3 text-center">
                            {instructor.bio}
                          </p>
                        )}

                        {/* Specialties */}
                        {instructor.specialties && instructor.specialties.length > 0 && (
                          <div className="flex flex-wrap gap-2 justify-center">
                            {instructor.specialties.slice(0, 3).map((specialty: string) => (
                              <Badge key={specialty} variant="secondary" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                            {instructor.specialties.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{instructor.specialties.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600">No instructors available yet</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
