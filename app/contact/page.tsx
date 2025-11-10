import { ThemedHeader } from '@/components/layout/themed-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, MessageSquare } from 'lucide-react'

export const metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Kickoff Club HQ team'
}

export default function ContactPage() {
  // Get subject from URL params if provided
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
  const subject = searchParams?.get('subject') || ''

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <ThemedHeader activePage="contact" />

      <div className="container px-4 py-16 flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-xl text-muted-foreground">
              Have questions? We're here to help.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 rounded-lg border bg-background text-foreground"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 rounded-lg border bg-background text-foreground"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    defaultValue={subject === 'team-pricing' ? 'Team Pricing Inquiry' : ''}
                    className="w-full px-4 py-2 rounded-lg border bg-background text-foreground"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    className="w-full px-4 py-2 rounded-lg border bg-background text-foreground"
                    placeholder="Tell us more..."
                  />
                </div>

                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  Send Message
                </Button>
              </form>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Email Us</h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      We typically respond within 24 hours
                    </p>
                    <a href="mailto:kickoffclubhq@gmail.com" className="text-orange-500 hover:underline">
                      kickoffclubhq@gmail.com
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Live Chat</h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      Available Monday-Friday, 9am-5pm EST
                    </p>
                    <Button variant="outline" size="sm">
                      Start Chat
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-600/10">
                <h3 className="font-bold mb-2">Team Pricing</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Looking for team or organization pricing? We offer special rates for groups of 10+.
                </p>
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
