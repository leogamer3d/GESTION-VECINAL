"use client"

import type React from "react"

import { useAuth } from "@/lib/auth"
import { LoginForm } from "./login-form"
import { LoadingSpinner } from "./loading-spinner"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner size="lg" text="Cargando aplicación..." />
  }

  if (!user) {
    return <LoginForm />
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 bg-gradient-to-br from-blue-50 to-slate-100">{children}</main>
      </div>
    </SidebarProvider>
  )
}
