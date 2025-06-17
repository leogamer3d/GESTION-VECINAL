"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  TrendingUp,
  TrendingDown,
  FileText,
  BarChart3,
  Calendar,
  Receipt,
  Building2,
  Settings,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { EditableTitle } from "./editable-title"

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Ingresos",
    url: "/ingresos",
    icon: TrendingUp,
  },
  {
    title: "Egresos",
    url: "/egresos",
    icon: TrendingDown,
  },
  {
    title: "Reportes",
    url: "/reportes",
    icon: FileText,
  },
  {
    title: "Balance Anual",
    url: "/balance",
    icon: BarChart3,
  },
  {
    title: "Calendario",
    url: "/calendario",
    icon: Calendar,
  },
  {
    title: "Recibos",
    url: "/recibos",
    icon: Receipt,
  },
  {
    title: "Configuración",
    url: "/configuracion",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-slate-200">
      <SidebarHeader className="border-b border-slate-200 p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-blue-600/80 backdrop-blur-sm">
            <Building2 className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <EditableTitle />
            <p className="text-xs sm:text-sm text-slate-500 truncate">Sistema de Gestión</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-600 font-medium">Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="data-[active=true]:bg-blue-50 data-[active=true]:text-blue-700 data-[active=true]:border-r-2 data-[active=true]:border-blue-600 min-h-[40px] sm:min-h-[44px]"
                  >
                    <Link href={item.url} className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3">
                      <item.icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span className="text-sm sm:text-base truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
