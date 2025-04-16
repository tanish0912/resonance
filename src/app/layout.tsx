import './globals.css'
import type { Metadata } from 'next'
import { AuthProvider } from '@/lib/auth-context'
import { SettingsProvider } from '@/lib/settings-context'

export const metadata: Metadata = {
  title: 'Resonance',
  description: 'Next-generation music streaming platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <SettingsProvider>
            {children}
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
