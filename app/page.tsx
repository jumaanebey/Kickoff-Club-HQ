import { Header } from "@/components/marketing/header"
import { HeroSection } from "@/components/sections/hero-section"
import { FeaturedCoursesSection } from "@/components/sections/featured-courses-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { PricingSection } from "@/components/sections/pricing-section"
import { OrganizationStructuredData, WebsiteStructuredData } from '@/components/seo/structured-data'
import { HomePageClient } from "./home-client"

export default function HomePage() {
  return (
    <>
      <Header />
      <OrganizationStructuredData />
      <WebsiteStructuredData />
      <HomePageClient />
    </>
  )
}
