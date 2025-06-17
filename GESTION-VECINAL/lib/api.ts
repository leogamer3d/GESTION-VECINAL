"use client"

// Simulación de base de datos en localStorage
const DB_KEYS = {
  INGRESOS: "db_ingresos",
  EGRESOS: "db_egresos",
  EVENTOS: "db_eventos",
  CASAS: "db_casas",
  CONFIG: "db_config",
  YEARS: "db_years",
}

export interface Ingreso {
  id: string
  fecha: string
  tipo: string
  casa: string
  monto: number
  estado: string
  year: string
  descripcion?: string
}

export interface Egreso {
  id: string
  fecha: string
  categoria: string
  descripcion: string
  monto: number
  proveedor: string
  year: string
}

export interface Evento {
  id: string
  titulo: string
  fecha: string
  hora: string
  lugar: string
  tipo: string
  participantes: number
  estado: string
  year: string
  descripcion?: string
}

export interface Casa {
  id: string
  numero: string
  nombre: string
  propietario: string
  estado: "activa" | "inactiva"
  email?: string
  telefono?: string
}

export interface Config {
  nombreResidencial: string
  direccion: string
  telefono: string
  email: string
  cuotaMensual: number
  monedaDefault: string
}

// Simular delay de red
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Funciones de API para Ingresos
export const ingresosAPI = {
  async getAll(year: string): Promise<Ingreso[]> {
    await delay(500)
    const data = localStorage.getItem(`${DB_KEYS.INGRESOS}_${year}`)
    return data ? JSON.parse(data) : []
  },

  async create(ingreso: Omit<Ingreso, "id">): Promise<Ingreso> {
    await delay(300)
    const newIngreso = { ...ingreso, id: Date.now().toString() }
    const existing = await this.getAll(ingreso.year)
    const updated = [newIngreso, ...existing]
    localStorage.setItem(`${DB_KEYS.INGRESOS}_${ingreso.year}`, JSON.stringify(updated))
    return newIngreso
  },

  async update(id: string, year: string, updates: Partial<Ingreso>): Promise<Ingreso> {
    await delay(300)
    const existing = await this.getAll(year)
    const index = existing.findIndex((item) => item.id === id)
    if (index === -1) throw new Error("Ingreso no encontrado")

    existing[index] = { ...existing[index], ...updates }
    localStorage.setItem(`${DB_KEYS.INGRESOS}_${year}`, JSON.stringify(existing))
    return existing[index]
  },

  async delete(id: string, year: string): Promise<void> {
    await delay(300)
    const existing = await this.getAll(year)
    const filtered = existing.filter((item) => item.id !== id)
    localStorage.setItem(`${DB_KEYS.INGRESOS}_${year}`, JSON.stringify(filtered))
  },
}

// Funciones de API para Egresos
export const egresosAPI = {
  async getAll(year: string): Promise<Egreso[]> {
    await delay(500)
    const data = localStorage.getItem(`${DB_KEYS.EGRESOS}_${year}`)
    return data ? JSON.parse(data) : []
  },

  async create(egreso: Omit<Egreso, "id">): Promise<Egreso> {
    await delay(300)
    const newEgreso = { ...egreso, id: Date.now().toString() }
    const existing = await this.getAll(egreso.year)
    const updated = [newEgreso, ...existing]
    localStorage.setItem(`${DB_KEYS.EGRESOS}_${egreso.year}`, JSON.stringify(updated))
    return newEgreso
  },

  async update(id: string, year: string, updates: Partial<Egreso>): Promise<Egreso> {
    await delay(300)
    const existing = await this.getAll(year)
    const index = existing.findIndex((item) => item.id === id)
    if (index === -1) throw new Error("Egreso no encontrado")

    existing[index] = { ...existing[index], ...updates }
    localStorage.setItem(`${DB_KEYS.EGRESOS}_${year}`, JSON.stringify(existing))
    return existing[index]
  },

  async delete(id: string, year: string): Promise<void> {
    await delay(300)
    const existing = await this.getAll(year)
    const filtered = existing.filter((item) => item.id !== id)
    localStorage.setItem(`${DB_KEYS.EGRESOS}_${year}`, JSON.stringify(filtered))
  },
}

// Funciones de API para Eventos
export const eventosAPI = {
  async getAll(year: string): Promise<Evento[]> {
    await delay(500)
    const data = localStorage.getItem(`${DB_KEYS.EVENTOS}_${year}`)
    return data ? JSON.parse(data) : []
  },

  async create(evento: Omit<Evento, "id">): Promise<Evento> {
    await delay(300)
    const newEvento = { ...evento, id: Date.now().toString() }
    const existing = await this.getAll(evento.year)
    const updated = [...existing, newEvento]
    localStorage.setItem(`${DB_KEYS.EVENTOS}_${evento.year}`, JSON.stringify(updated))
    return newEvento
  },

  async update(id: string, year: string, updates: Partial<Evento>): Promise<Evento> {
    await delay(300)
    const existing = await this.getAll(year)
    const index = existing.findIndex((item) => item.id === id)
    if (index === -1) throw new Error("Evento no encontrado")

    existing[index] = { ...existing[index], ...updates }
    localStorage.setItem(`${DB_KEYS.EVENTOS}_${year}`, JSON.stringify(existing))
    return existing[index]
  },

  async delete(id: string, year: string): Promise<void> {
    await delay(300)
    const existing = await this.getAll(year)
    const filtered = existing.filter((item) => item.id !== id)
    localStorage.setItem(`${DB_KEYS.EVENTOS}_${year}`, JSON.stringify(filtered))
  },
}

// Funciones de API para Casas
export const casasAPI = {
  async getAll(): Promise<Casa[]> {
    await delay(400)
    const data = localStorage.getItem(DB_KEYS.CASAS)
    if (!data) {
      // Datos iniciales
      const initialCasas: Casa[] = Array.from({ length: 45 }, (_, i) => ({
        id: (i + 1).toString(),
        numero: (i + 1).toString(),
        nombre: `Casa ${i + 1}`,
        propietario: `Propietario ${i + 1}`,
        estado: "activa" as const,
        email: `casa${i + 1}@email.com`,
        telefono: `+52 555 ${String(i + 1).padStart(4, "0")}`,
      }))
      localStorage.setItem(DB_KEYS.CASAS, JSON.stringify(initialCasas))
      return initialCasas
    }
    return JSON.parse(data)
  },

  async create(casa: Omit<Casa, "id">): Promise<Casa> {
    await delay(300)
    const newCasa = { ...casa, id: Date.now().toString() }
    const existing = await this.getAll()
    const updated = [...existing, newCasa]
    localStorage.setItem(DB_KEYS.CASAS, JSON.stringify(updated))
    return newCasa
  },

  async update(id: string, updates: Partial<Casa>): Promise<Casa> {
    await delay(300)
    const existing = await this.getAll()
    const index = existing.findIndex((item) => item.id === id)
    if (index === -1) throw new Error("Casa no encontrada")

    existing[index] = { ...existing[index], ...updates }
    localStorage.setItem(DB_KEYS.CASAS, JSON.stringify(existing))
    return existing[index]
  },

  async delete(id: string): Promise<void> {
    await delay(300)
    const existing = await this.getAll()
    const filtered = existing.filter((item) => item.id !== id)
    localStorage.setItem(DB_KEYS.CASAS, JSON.stringify(filtered))
  },
}

// Funciones de API para Configuración
export const configAPI = {
  async get(): Promise<Config> {
    await delay(300)
    const data = localStorage.getItem(DB_KEYS.CONFIG)
    if (!data) {
      const defaultConfig: Config = {
        nombreResidencial: "Mi Residencial",
        direccion: "Calle Principal #123",
        telefono: "+52 555 0000",
        email: "admin@miresidencial.com",
        cuotaMensual: 2500,
        monedaDefault: "MXN",
      }
      localStorage.setItem(DB_KEYS.CONFIG, JSON.stringify(defaultConfig))
      return defaultConfig
    }
    return JSON.parse(data)
  },

  async update(updates: Partial<Config>): Promise<Config> {
    await delay(300)
    const existing = await this.get()
    const updated = { ...existing, ...updates }
    localStorage.setItem(DB_KEYS.CONFIG, JSON.stringify(updated))
    return updated
  },
}

// Funciones de API para Años
export const yearsAPI = {
  async getAll(): Promise<string[]> {
    await delay(200)
    const data = localStorage.getItem(DB_KEYS.YEARS)
    if (!data) {
      const currentYear = new Date().getFullYear()
      // Incluir años desde 2020 hasta el año actual + 1
      const initialYears = []
      for (let year = 2020; year <= currentYear + 1; year++) {
        initialYears.push(year.toString())
      }
      initialYears.reverse() // Más recientes primero
      localStorage.setItem(DB_KEYS.YEARS, JSON.stringify(initialYears))
      return initialYears
    }
    return JSON.parse(data)
  },

  async create(year: string): Promise<string[]> {
    await delay(300)
    const existing = await this.getAll()
    if (!existing.includes(year)) {
      const updated = [...existing, year].sort((a, b) => Number.parseInt(b) - Number.parseInt(a))
      localStorage.setItem(DB_KEYS.YEARS, JSON.stringify(updated))
      return updated
    }
    return existing
  },
}

// Configuración de comunicaciones
export interface CommunicationConfig {
  emailFrom: string
  emailFromName: string
  whatsappNumber: string
  emailSignature: string
}

const COMMUNICATION_KEY = "db_communication_config"

export const communicationAPI = {
  async get(): Promise<CommunicationConfig> {
    await delay(300)
    const data = localStorage.getItem(COMMUNICATION_KEY)
    if (!data) {
      const defaultConfig: CommunicationConfig = {
        emailFrom: "admin@miresidencial.com",
        emailFromName: "Administración Residencial",
        whatsappNumber: "+52 555 1234567",
        emailSignature: "Saludos cordiales,\nAdministración del Residencial",
      }
      localStorage.setItem(COMMUNICATION_KEY, JSON.stringify(defaultConfig))
      return defaultConfig
    }
    return JSON.parse(data)
  },

  async update(updates: Partial<CommunicationConfig>): Promise<CommunicationConfig> {
    await delay(300)
    const existing = await this.get()
    const updated = { ...existing, ...updates }
    localStorage.setItem(COMMUNICATION_KEY, JSON.stringify(updated))
    return updated
  },
}
