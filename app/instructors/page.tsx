import Link from 'next/link'
import { supabase } from '@/lib/db/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Award, BookOpen } from 'lucide-react'
import { Header } from '@/components/layout/header'

export const dynamic = 'force-dynamic'

async function getAllInstructors() {
  try {
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

    return data || []
  } catch (error) {
    console.error('Exception fetching instructors:', error)
    return []
  }
}

export default async function InstructorsPage() {
  const instructors = await getAllInstructors()

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <Header activePage="instructors" />

      {/* Page Header */}
      <section className="py-20 bg-[#0A0A0A] border-b border-white/10">
        <div className="container px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
              Meet Our Expert Instructors
            </h1>
            <p className="text-lg md:text-xl text-white/60 leading-relaxed">
              Learn from experienced coaches and players who are passionate about sharing their knowledge.
            </p>
          </div>
        </div>
      </section>

      {/* Instructors Grid */}
      <section className="py-12 bg-[#0A0A0A]">
        <div className="container px-4">
          <div className="mb-6">
            <p className="text-white/60">
              Showing <span className="font-semibold text-white">{instructors.length}</span> instructor{instructors.length !== 1 ? 's' : ''}
            </p>
          </div>

          {instructors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {instructors.map((instructor) => {
                const courseCount = instructor.courses?.length || 0

                return (
                  <Link key={instructor.id} href={`/instructors/${instructor.slug}`}>
                    <Card className="h-full bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all">
                      <CardHeader>
                        {/* Profile Image */}
                        <div className="flex justify-center mb-4">
                          {instructor.profile_image_url ? (
                            <img
                              src={instructor.profile_image_url}
                              alt={instructor.name}
                              className="w-24 h-24 rounded-full object-cover border-4 border-white/20 shadow-md"
                            />
                          ) : (
                            <div className="w-24 h-24 rounded-full bg-orange-500/20 flex items-center justify-center text-3xl font-bold text-orange-400 border-4 border-white/20 shadow-md">
                              {instructor.name.charAt(0)}
                            </div>
                          )}
                        </div>

                        <CardTitle className="text-center text-xl text-white">{instructor.name}</CardTitle>
                        {instructor.credentials && (
                          <CardDescription className="text-center text-white/60">
                            {instructor.credentials}
                          </CardDescription>
                        )}
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Stats */}
                        <div className="flex justify-center gap-6 text-sm text-white/60">
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
                          <p className="text-sm text-white/60 line-clamp-3 text-center leading-relaxed">
                            {instructor.bio}
                          </p>
                        )}

                        {/* Specialties */}
                        {instructor.specialties && instructor.specialties.length > 0 && (
                          <div className="flex flex-wrap gap-2 justify-center">
                            {instructor.specialties.slice(0, 3).map((specialty: string) => (
                              <Badge key={specialty} className="text-xs bg-white/10 border-white/20 text-white">
                                {specialty}
                              </Badge>
                            ))}
                            {instructor.specialties.length > 3 && (
                              <Badge className="text-xs bg-white/5 border-white/10 text-white/60">
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
            <div className="text-center py-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
              <BookOpen className="h-12 w-12 mx-auto text-white/40 mb-3" />
              <p className="text-white/60">No instructors available yet</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
