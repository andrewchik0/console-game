import React from 'react'
import type { Metadata, Viewport } from 'next'
import { Roboto_Mono } from 'next/font/google'

import './globals.css'

import { name } from '@constants/general'

const inter = Roboto_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: name,
  description: name + ' game',
  icons: [
    {
      rel: 'icon',
      url: '/favicon.ico'
    }
  ]
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={inter.className}
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh'
        }}
      >
        {children}
      </body>
    </html>
  )
}
