import type { Metadata } from 'next'
import './globals.css'
import { WalletContextProvider } from '@/lib/WalletProvider'
import { AudioProvider } from '@/lib/AudioProvider'

export const metadata: Metadata = {
  title: 'THE DUNGEON - MMO Clicker Game',
  description: 'Enter the dungeon and fight monsters with other players in this epic MMO clicker game',
  keywords: ['game', 'mmo', 'clicker', 'dungeon', 'monster', 'multiplayer', 'solana', 'web3'],
  authors: [{ name: 'The Dungeon Team' }],
  openGraph: {
    title: 'THE DUNGEON - MMO Clicker Game',
    description: 'Enter the dungeon and fight monsters with other players',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="Dungeon" />
      </head>
      <body className="dungeon-atmosphere">
        <WalletContextProvider>
          <AudioProvider>
            {children}
          </AudioProvider>
        </WalletContextProvider>
      </body>
    </html>
  )
}