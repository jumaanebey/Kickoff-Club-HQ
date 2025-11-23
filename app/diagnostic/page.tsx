import { createServerClient } from '@/database/supabase/server'

export const dynamic = 'force-dynamic'

export default async function DiagnosticPage() {
    const supabase = await createServerClient()

    // Test 1: Count all courses
    const { count: totalCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })

    // Test 2: Get all courses without filter
    const { data: allCourses, error: allError } = await supabase
        .from('courses')
        .select('id, title, slug, is_published')
        .limit(20)

    // Test 3: Get published courses
    const { data: publishedCourses, error: pubError } = await supabase
        .from('courses')
        .select('id, title, slug, is_published')
        .eq('is_published', true)
        .limit(20)

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-4xl font-bold mb-8">Database Diagnostic</h1>

            <div className="space-y-8">
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">Total Courses in Database</h2>
                    <p className="text-3xl text-yellow-400">{totalCount || 0}</p>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">All Courses (No Filter)</h2>
                    {allError && <p className="text-red-400">Error: {allError.message}</p>}
                    <pre className="text-sm overflow-auto">
                        {JSON.stringify(allCourses, null, 2)}
                    </pre>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">Published Courses Only</h2>
                    {pubError && <p className="text-red-400">Error: {pubError.message}</p>}
                    <pre className="text-sm overflow-auto">
                        {JSON.stringify(publishedCourses, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    )
}
