"use client"

export interface MultaConfig {
  id: string
  nombre: string
  descripcion: string
  monto: number
  activa: boolean
  categoria: string
}

const MULTAS_KEY = "db_multas_config"

const defaultMultas: MultaConfig[] = [
  {
    id: "1",
    nombre: "Pago Tardío",
    descripcion: "Multa por pago después de la fecha límite",
    monto: 250,
    activa: true,
    categoria: "Pagos",
  },
  {
    id: "2",
    nombre: "Ruido Excesivo",
    descripcion: "Multa por generar ruido después de las 10 PM",
    monto: 500,
    activa: true,
    categoria: "Convivencia",
  },
  {
    id: "3",
    nombre: "Mal Uso de Áreas Comunes",
    descripcion: "Multa por no respetar las reglas de áreas comunes",
    monto: 300,
    activa: true,
    categoria: "Áreas Comunes",
  },
  {
    id: "4",
    nombre: "Mascotas sin Correa",
    descripcion: "Multa por mascotas sin correa en áreas comunes",
    monto: 200,
    activa: true,
    categoria: "Mascotas",
  },
  {
    id: "5",
    nombre: "Estacionamiento Indebido",
    descripcion: "Multa por estacionarse en lugar no asignado",
    monto: 400,
    activa: true,
    categoria: "Estacionamiento",
  },
]

export const multasConfig = {
  async getMultas(): Promise<MultaConfig[]> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const data = localStorage.getItem(MULTAS_KEY)
    if (!data) {
      localStorage.setItem(MULTAS_KEY, JSON.stringify(defaultMultas))
      return defaultMultas
    }

    return JSON.parse(data)
  },

  async createMulta(multa: Omit<MultaConfig, "id">): Promise<MultaConfig> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const multas = await this.getMultas()
    const newMulta: MultaConfig = {
      ...multa,
      id: Date.now().toString(),
    }

    const updated = [...multas, newMulta]
    localStorage.setItem(MULTAS_KEY, JSON.stringify(updated))

    return newMulta
  },

  async updateMulta(id: string, updates: Partial<MultaConfig>): Promise<MultaConfig> {
    await new Promise((resolve) => setTimeout(resolve, 400))

    const multas = await this.getMultas()
    const index = multas.findIndex((m) => m.id === id)

    if (index === -1) {
      throw new Error("Multa no encontrada")
    }

    multas[index] = { ...multas[index], ...updates }
    localStorage.setItem(MULTAS_KEY, JSON.stringify(multas))

    return multas[index]
  },

  async deleteMulta(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const multas = await this.getMultas()
    const filtered = multas.filter((m) => m.id !== id)

    localStorage.setItem(MULTAS_KEY, JSON.stringify(filtered))
  },
}
