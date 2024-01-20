'use client'

import NextAuthSessionProvider from "@/providers/sessionProviders"

export function ProviderServer( { children }: { children: React.ReactNode }) {
  return (
    <>
      <NextAuthSessionProvider>
      {children}
      </NextAuthSessionProvider>
    </>
  )
}