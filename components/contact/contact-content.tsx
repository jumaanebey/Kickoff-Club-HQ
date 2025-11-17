'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, MessageSquare } from 'lucide-react'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'

interface ContactContentProps {
  subject?: string
}

export function ContactContent({ subject = '' }: ContactContentProps) {
  const { colors } = useTheme()

  return (
    <div className={cn("container px-4 py-16 flex-1", colors.text)}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={cn("text-4xl md:text-5xl font-bold mb-4", colors.text)}>Get in Touch</h1>
          <p className={cn("text-xl", colors.textMuted)}>
            Have questions? We're here to help.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className={cn("p-8", colors.card)}>
            <h2 className={cn("text-2xl font-bold mb-6", colors.text)}>Send us a message</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className={cn("block text-sm font-medium mb-2", colors.textSecondary)}>
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border",
                    colors.input,
                    colors.inputBorder,
                    colors.inputText,
                    colors.inputPlaceholder
                  )}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className={cn("block text-sm font-medium mb-2", colors.textSecondary)}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border",
                    colors.input,
                    colors.inputBorder,
                    colors.inputText,
                    colors.inputPlaceholder
                  )}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className={cn("block text-sm font-medium mb-2", colors.textSecondary)}>
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  defaultValue={subject === 'team-pricing' ? 'Team Pricing Inquiry' : ''}
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border",
                    colors.input,
                    colors.inputBorder,
                    colors.inputText,
                    colors.inputPlaceholder
                  )}
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className={cn("block text-sm font-medium mb-2", colors.textSecondary)}>
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border",
                    colors.input,
                    colors.inputBorder,
                    colors.inputText,
                    colors.inputPlaceholder
                  )}
                  placeholder="Tell us more..."
                />
              </div>

              <Button className={cn("w-full", colors.primary, colors.primaryHover, colors.primaryText)}>
                Send Message
              </Button>
            </form>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card className={cn("p-6", colors.card)}>
              <div className="flex items-start gap-4">
                <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0", colors.primary, "bg-opacity-20")}>
                  <Mail className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className={cn("font-bold mb-2", colors.text)}>Email Us</h3>
                  <p className={cn("text-sm mb-2", colors.textMuted)}>
                    We typically respond within 24 hours
                  </p>
                  <a href="mailto:kickoffclubhq@gmail.com" className={cn(colors.link, colors.linkHover, "hover:underline")}>
                    kickoffclubhq@gmail.com
                  </a>
                </div>
              </div>
            </Card>

            <Card className={cn("p-6", colors.card)}>
              <div className="flex items-start gap-4">
                <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0", colors.primary, "bg-opacity-20")}>
                  <MessageSquare className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className={cn("font-bold mb-2", colors.text)}>Live Chat</h3>
                  <p className={cn("text-sm mb-2", colors.textMuted)}>
                    Available Monday-Friday, 9am-5pm EST
                  </p>
                  <Button variant="outline" size="sm" disabled>
                    Coming Soon
                  </Button>
                </div>
              </div>
            </Card>

            <Card className={cn("p-6 bg-gradient-to-br from-orange-500/10 to-orange-600/10", colors.card)}>
              <h3 className={cn("font-bold mb-2", colors.text)}>Team Pricing</h3>
              <p className={cn("text-sm mb-4", colors.textMuted)}>
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
  )
}
