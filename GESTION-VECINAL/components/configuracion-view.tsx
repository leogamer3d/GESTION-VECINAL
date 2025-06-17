"use client"

import { CommunicationSettings } from "./communication-settings"
import { CasaManager } from "./casa-manager"
import { MultasManagement } from "./multas-management"
import { CategoriesManager } from "./categories-manager"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ConfiguracionView() {
  return (
    <div className="p-2 space-y-2 max-w-full h-screen overflow-hidden flex flex-col">
      {/* Header compacto */}
      <div className="flex-shrink-0">
        <h1 className="text-xl font-bold text-slate-900">Configuración</h1>
        <p className="text-slate-600 text-xs">Gestiona la configuración del sistema</p>
      </div>

      <Tabs defaultValue="comunicacion" className="w-full flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto flex-shrink-0">
          <TabsTrigger value="comunicacion" className="text-xs px-1 py-1.5">
            Comunicaciones
          </TabsTrigger>
          <TabsTrigger value="casas" className="text-xs px-1 py-1.5">
            Casas
          </TabsTrigger>
          <TabsTrigger value="multas" className="text-xs px-1 py-1.5">
            Multas
          </TabsTrigger>
          <TabsTrigger value="categorias" className="text-xs px-1 py-1.5">
            Categorías
          </TabsTrigger>
        </TabsList>

        <div className="mt-2 flex-1 overflow-y-auto">
          <TabsContent value="comunicacion" className="space-y-2 h-full overflow-y-auto">
            <CommunicationSettings />
          </TabsContent>
          <TabsContent value="casas" className="space-y-2 h-full overflow-y-auto">
            <CasaManager />
          </TabsContent>
          <TabsContent value="multas" className="space-y-2 h-full overflow-y-auto">
            <MultasManagement />
          </TabsContent>
          <TabsContent value="categorias" className="space-y-2 h-full overflow-y-auto">
            <CategoriesManager />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}