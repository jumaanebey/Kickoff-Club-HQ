'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface SaveCourseButtonProps {
  courseId: string
  isSaved?: boolean
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export function SaveCourseButton({
  courseId,
  isSaved = false,
  variant = 'outline',
  size = 'default',
  className
}: SaveCourseButtonProps) {
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(isSaved)
  const router = useRouter()

  const handleSave = async () => {
    setLoading(true)

    try {
      const { saveCourse, unsaveCourse } = await import('@/app/actions/saved-courses')
      const formData = new FormData()
      formData.append('courseId', courseId)

      const result = saved ? await unsaveCourse(formData) : await saveCourse(formData)

      if (result.success) {
        setSaved(!saved)
        router.refresh()
      }
    } catch (error) {
      console.error('Save/unsave error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleSave}
      disabled={loading}
      variant={variant}
      size={size}
      className={className}
    >
      {loading ? '...' : saved ? '💾 Saved' : 'Save for Later'}
    </Button>
  )
}
