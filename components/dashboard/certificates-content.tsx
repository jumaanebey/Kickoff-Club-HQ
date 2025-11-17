'use client'

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CertificateCard } from "@/components/certificates/certificate-card"
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'

interface CertificatesContentProps {
  enrollments: any[] | null
}

export function CertificatesContent({ enrollments }: CertificatesContentProps) {
  const { colors } = useTheme()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className={cn("text-3xl font-bold mb-2", colors.text)}>My Certificates</h1>
        <p className={colors.textSecondary}>View and download your course completion certificates</p>
      </div>

      {/* Certificates List */}
      {enrollments && enrollments.length > 0 ? (
        <div className="space-y-4">
          {enrollments.map((enrollment: any) => (
            <CertificateCard key={enrollment.id} enrollment={enrollment} />
          ))}
        </div>
      ) : (
        <Card className={cn(colors.card, colors.cardBorder, "text-center py-12")}>
          <CardContent>
            <div className="text-6xl mb-4">🏆</div>
            <h3 className={cn("text-xl font-bold mb-2", colors.text)}>No certificates yet</h3>
            <p className={cn("mb-6", colors.textSecondary)}>
              Complete a course to earn your first certificate
            </p>
            <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
              <Link href="/courses">
                Browse Courses
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
