
export interface IncomeCategory {
  id: string
  name: string
  description?: string
  color?: string
  active: boolean
}

export interface ExpenseCategory {
  id: string
  name: string
  description?: string
  color?: string
  active: boolean
}

export const defaultIncomeCategories: IncomeCategory[] = [
  { id: "cuota", name: "Cuota Mensual", description: "Cuotas mensuales de mantenimiento", color: "#22c55e", active: true },
  { id: "multa", name: "Multa", description: "Multas por pagos tardíos", color: "#ef4444", active: true },
  { id: "evento", name: "Evento", description: "Ingresos por eventos especiales", color: "#3b82f6", active: true },
  { id: "otro", name: "Otro", description: "Otros ingresos diversos", color: "#8b5cf6", active: true },
]

export const defaultExpenseCategories: ExpenseCategory[] = [
  { id: "mantenimiento", name: "Mantenimiento", description: "Reparaciones y mantenimiento general", color: "#ef4444", active: true },
  { id: "servicios", name: "Servicios", description: "Servicios públicos y utilities", color: "#f97316", active: true },
  { id: "limpieza", name: "Limpieza", description: "Servicios de limpieza", color: "#22c55e", active: true },
  { id: "seguridad", name: "Seguridad", description: "Servicios de seguridad", color: "#eab308", active: true },
  { id: "jardineria", name: "Jardinería", description: "Mantenimiento de áreas verdes", color: "#3b82f6", active: true },
  { id: "administracion", name: "Administración", description: "Gastos administrativos", color: "#8b5cf6", active: true },
]

export class CategoriesManager {
  private storageKey = 'residential-categories'

  getIncomeCategories(): IncomeCategory[] {
    if (typeof window === 'undefined') return defaultIncomeCategories
    
    const stored = localStorage.getItem(`${this.storageKey}-income`)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return defaultIncomeCategories
      }
    }
    return defaultIncomeCategories
  }

  getExpenseCategories(): ExpenseCategory[] {
    if (typeof window === 'undefined') return defaultExpenseCategories
    
    const stored = localStorage.getItem(`${this.storageKey}-expenses`)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return defaultExpenseCategories
      }
    }
    return defaultExpenseCategories
  }

  saveIncomeCategories(categories: IncomeCategory[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${this.storageKey}-income`, JSON.stringify(categories))
    }
  }

  saveExpenseCategories(categories: ExpenseCategory[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${this.storageKey}-expenses`, JSON.stringify(categories))
    }
  }

  addIncomeCategory(category: Omit<IncomeCategory, 'id'>): IncomeCategory {
    const newCategory = {
      ...category,
      id: `custom-${Date.now()}`,
    }
    const categories = this.getIncomeCategories()
    categories.push(newCategory)
    this.saveIncomeCategories(categories)
    return newCategory
  }

  addExpenseCategory(category: Omit<ExpenseCategory, 'id'>): ExpenseCategory {
    const newCategory = {
      ...category,
      id: `custom-${Date.now()}`,
    }
    const categories = this.getExpenseCategories()
    categories.push(newCategory)
    this.saveExpenseCategories(categories)
    return newCategory
  }

  updateIncomeCategory(id: string, updates: Partial<IncomeCategory>): void {
    const categories = this.getIncomeCategories()
    const index = categories.findIndex(cat => cat.id === id)
    if (index !== -1) {
      categories[index] = { ...categories[index], ...updates }
      this.saveIncomeCategories(categories)
    }
  }

  updateExpenseCategory(id: string, updates: Partial<ExpenseCategory>): void {
    const categories = this.getExpenseCategories()
    const index = categories.findIndex(cat => cat.id === id)
    if (index !== -1) {
      categories[index] = { ...categories[index], ...updates }
      this.saveExpenseCategories(categories)
    }
  }

  deleteIncomeCategory(id: string): void {
    const categories = this.getIncomeCategories().filter(cat => cat.id !== id)
    this.saveIncomeCategories(categories)
  }

  deleteExpenseCategory(id: string): void {
    const categories = this.getExpenseCategories().filter(cat => cat.id !== id)
    this.saveExpenseCategories(categories)
  }
}

export const categoriesManager = new CategoriesManager()
