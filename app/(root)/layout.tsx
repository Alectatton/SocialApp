import TopBar from '@/components/shared/TopBar'
import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import LeftSidebar from '@/components/shared/LeftSidebar'
import RightSidebar from '@/components/shared/RightSidebar'
import BottomBar from '@/components/shared/BottomBar'
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Socialize',
    description: 'Socialize is a social media platform that allows you to connect with friends and family.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
        <html lang="en">
            <body className={inter.className}>
                <TopBar />
                
                <main>
                    <LeftSidebar />

                    <section className="main-container">
                        <div className="w-full max-w-4xl">
                            {children}
                        </div>
                    </section>

                    <RightSidebar />
                </main>

                <BottomBar />
            </body>
        </html>
    </ClerkProvider>
  )
}
