'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { enrollInCourse } from '@/app/actions/enrollment'
import { createClientComponentClient } from '@/lib/db/supabase-client'

interface EnrollButtonProps {
  courseId: string
  userId?: string
  isEnrolled?: boolean
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export function EnrollButton({
  courseId,
  userId,
  isEnrolled = false,
  variant = 'default',
  size = 'default',
  className
}: EnrollButtonProps) {
  const [loading, setLoading] = useState(false)
  const [enrolled, setEnrolled] = useState(isEnrolled)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleEnroll = async () => {
    setLoading(true)
    setError(null)

    // Check if user is authenticated (optional - server will also check)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/auth/sign-in?redirect=/courses')
      return
    }

    const formData = new FormData()
    formData.append('courseId', courseId)

    const result = await enrollInCourse(formData)

    if (result.success) {
      setEnrolled(true)
    } else {
      setError(result.error || 'Failed to enroll')
    }

    setLoading(false)
  }

  if (enrolled) {
    return (
      <Button
        variant="secondary"
        size={size}
        className={className}
        disabled
      >
        ✓ Enrolled
      </Button>
    )
  }

  return (
    <div className="w-full">
      <Button
        onClick={handleEnroll}
        disabled={loading}
        variant={variant}
        size={size}
        className={className}
      >
        {loading ? 'Enrolling...' : 'Enroll Now'}
      </Button>
      {error && (
        <p className="text-sm text-destructive mt-2">{error}</p>
      )}
    </div>
  )
}
