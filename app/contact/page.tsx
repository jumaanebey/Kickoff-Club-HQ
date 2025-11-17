import { ThemedHeader } from '@/components/layout/themed-header'
import { ContactContent } from '@/components/contact/contact-content'

export const metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Kickoff Club HQ team'
}

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <ThemedHeader activePage="contact" />
      <ContactContent />
    </div>
  )
}
