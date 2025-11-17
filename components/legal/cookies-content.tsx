'use client'

import { LegalPageWrapper, LegalSection, LegalSubSection, LegalParagraph, LegalList } from './legal-page-wrapper'

export function CookiesContent() {
  return (
    <LegalPageWrapper
      title="Cookie Policy"
      lastUpdated="November 4, 2025"
      footerLinks={[
        { href: '/legal/privacy', label: 'Privacy Policy' },
        { href: '/legal/terms', label: 'Terms of Service' },
        { href: '/legal/refund', label: 'Refund Policy' },
      ]}
    >
      <LegalSection title="1. What Are Cookies?">
        <LegalParagraph>
          Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our services.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="2. Types of Cookies We Use">
        <LegalSubSection title="2.1 Essential Cookies">
          <LegalParagraph>
            These cookies are necessary for our website to function properly:
          </LegalParagraph>
          <LegalList>
            <li><strong>Authentication:</strong> Keep you logged in</li>
            <li><strong>Security:</strong> Protect against fraud and abuse</li>
            <li><strong>Session Management:</strong> Remember your preferences during your visit</li>
          </LegalList>
        </LegalSubSection>

        <LegalSubSection title="2.2 Analytics Cookies">
          <LegalParagraph>
            These help us understand how visitors use our website:
          </LegalParagraph>
          <LegalList>
            <li>Pages visited and time spent</li>
            <li>How you navigate through our site</li>
            <li>Error messages encountered</li>
          </LegalList>
        </LegalSubSection>

        <LegalSubSection title="2.3 Functional Cookies">
          <LegalParagraph>
            These enhance your experience by remembering your choices:
          </LegalParagraph>
          <LegalList>
            <li>Language preferences</li>
            <li>Video player settings</li>
            <li>Course progress tracking</li>
          </LegalList>
        </LegalSubSection>
      </LegalSection>

      <LegalSection title="3. Managing Cookies">
        <LegalParagraph>
          You can control cookies through your browser settings. Most browsers allow you to:
        </LegalParagraph>
        <LegalList>
          <li>View and delete cookies</li>
          <li>Block third-party cookies</li>
          <li>Block all cookies</li>
          <li>Clear cookies when you close your browser</li>
        </LegalList>
        <LegalParagraph>
          <strong>Note:</strong> Blocking essential cookies may prevent you from using certain features of our website.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="4. Third-Party Cookies">
        <LegalParagraph>
          We use the following third-party services that may set cookies:
        </LegalParagraph>
        <LegalList>
          <li><strong>Stripe:</strong> Payment processing and fraud prevention</li>
          <li><strong>Supabase:</strong> Authentication and database services</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="5. Contact Us">
        <LegalParagraph>
          Questions about our use of cookies? Contact us at privacy@kickoffclubhq.com
        </LegalParagraph>
      </LegalSection>
    </LegalPageWrapper>
  )
}
