import { OrganizationStructuredData, WebsiteStructuredData } from '@/components/seo/structured-data'
import { HomePageClient } from "./home-client"

export default function HomePage() {
  return (
    <>
      <OrganizationStructuredData />
      <WebsiteStructuredData />
      <HomePageClient />
    </>
  )
}
