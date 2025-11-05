import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { getUser } from "@/app/actions/auth"
import { getCertificateData } from "@/lib/course-completion"
import { Button } from "@/components/ui/button"

interface CertificatePageProps {
  params: {
    courseId: string
  }
}

export default async function CertificatePage({ params }: CertificatePageProps) {
  const user = await getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  const certificateData = await getCertificateData(user.id, params.courseId)

  if (!certificateData) {
    notFound()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/certificates"
            className="text-sm text-gray-600 hover:text-gray-900 mb-2 inline-block"
          >
            ← Back to Certificates
          </Link>
          <h1 className="text-3xl font-bold">Certificate of Completion</h1>
        </div>
        <Button onClick={() => window.print()}>
          Download PDF
        </Button>
      </div>

      {/* Certificate */}
      <div className="bg-white border-8 border-double border-primary-600 p-12 print:border-black">
        <div className="text-center space-y-8">
          {/* Header */}
          <div>
            <h2 className="text-5xl font-bold text-primary-700 mb-2 print:text-black">
              Kickoff Club HQ
            </h2>
            <p className="text-lg text-gray-600">Certificate of Completion</p>
          </div>

          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-4">
            <div className="w-24 h-1 bg-primary-300 print:bg-gray-400"></div>
            <div className="text-4xl">🏈</div>
            <div className="w-24 h-1 bg-primary-300 print:bg-gray-400"></div>
          </div>

          {/* Certificate Text */}
          <div className="space-y-6">
            <p className="text-lg text-gray-600">This is to certify that</p>

            <p className="text-4xl font-bold text-gray-900">
              {certificateData.studentName}
            </p>

            <p className="text-lg text-gray-600">has successfully completed</p>

            <p className="text-3xl font-bold text-primary-700 print:text-black">
              {certificateData.courseName}
            </p>

            <div className="space-y-2">
              <p className="text-gray-600">
                Instructed by <span className="font-semibold">{certificateData.instructor}</span>
              </p>
              <p className="text-gray-600">
                Category:{' '}
                <span className="font-semibold">
                  {certificateData.category.replace(/_/g, ' ').toUpperCase()}
                </span>{' '}
                " Level:{' '}
                <span className="font-semibold">
                  {certificateData.level.charAt(0).toUpperCase() +
                    certificateData.level.slice(1)}
                </span>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-8 border-t-2 border-gray-200 mt-12">
            <div className="flex justify-between items-end">
              <div className="text-left">
                <p className="text-sm text-gray-600">Date of Completion</p>
                <p className="font-semibold">{certificateData.completionDate}</p>
              </div>

              <div className="text-center">
                <div className="w-48 border-t-2 border-gray-400 mb-2"></div>
                <p className="text-sm text-gray-600">Authorized Signature</p>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-600">Certificate ID</p>
                <p className="font-mono font-semibold">{certificateData.certificateId}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4 print:hidden">
        <Button variant="outline" asChild>
          <Link href="/dashboard/certificates">
            View All Certificates
          </Link>
        </Button>
        <Button variant="outline" onClick={() => window.print()}>
          Print Certificate
        </Button>
      </div>
    </div>
  )
}
