import { NextResponse } from 'next/server'
import { getAllCourses } from '@/database/queries/courses'

export async function GET() {
  try {
    const courses = await getAllCourses()
    return NextResponse.json(courses)
  } catch (error: any) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}
