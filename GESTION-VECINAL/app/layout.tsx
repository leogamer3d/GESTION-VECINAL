import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Gestión Vecinal",
  description: "Sistema de gestión para comunidades vecinales",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <SidebarProvider>
          <div className="flex min-h-dvh w-full overflow-hidden">
            <AppSidebar />
            <main className="flex-1 overflow-auto bg-gray-50/30 min-w-0">{children}</main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}
