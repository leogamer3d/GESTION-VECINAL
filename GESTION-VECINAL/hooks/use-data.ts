"use client"

import { useState, useEffect, useCallback } from "react"
import { ingresosAPI, egresosAPI, eventosAPI, casasAPI, configAPI, yearsAPI } from "@/lib/api"
import type { Ingreso, Egreso, Evento, Casa, Config } from "@/lib/api"

interface UseDataState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseDataActions<T> {
  refetch: () => Promise<void>
  create: (item: any) => Promise<void>
  update: (id: string, updates: any) => Promise<void>
  delete: (id: string) => Promise<void>
}

// Hook para Ingresos
export function useIngresos(year: string) {
  const [state, setState] = useState<UseDataState<Ingreso[]>>({
    data: null,
    loading: true,
    error: null,
  })

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await ingresosAPI.getAll(year)
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState({ data: null, loading: false, error: error instanceof Error ? error.message : "Error desconocido" })
    }
  }, [year])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const actions: UseDataActions<Ingreso[]> = {
    refetch: fetchData,
    create: async (ingreso) => {
      try {
        await ingresosAPI.create({ ...ingreso, year })
        await fetchData()
      } catch (error) {
        setState((prev) => ({ ...prev, error: error instanceof Error ? error.message : "Error al crear" }))
        throw error
      }
    },
    update: async (id, updates) => {
      try {
        await ingresosAPI.update(id, year, updates)
        await fetchData()
      } catch (error) {
        setState((prev) => ({ ...prev, error: error instanceof Error ? error.message : "Error al actualizar" }))
        throw error
      }
    },
    delete: async (id) => {
      try {
        await ingresosAPI.delete(id, year)
        await fetchData()
      } catch (error) {
        setState((prev) => ({ ...prev, error: error instanceof Error ? error.message : "Error al eliminar" }))
        throw error
      }
    },
  }

  return { ...state, ...actions }
}

// Hook para Egresos
export function useEgresos(year: string) {
  const [state, setState] = useState<UseDataState<Egreso[]>>({
    data: null,
    loading: true,
    error: null,
  })

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await egresosAPI.getAll(year)
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState({ data: null, loading: false, error: error instanceof Error ? error.message : "Error desconocido" })
    }
  }, [year])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const actions: UseDataActions<Egreso[]> = {
    refetch: fetchData,
    create: async (egreso) => {
      try {
        await egresosAPI.create({ ...egreso, year })
        await fetchData()
      } catch (error) {
        setState((prev) => ({ ...prev, error: error instanceof Error ? error.message : "Error al crear" }))
        throw error
      }
    },
    update: async (id, updates) => {
      try {
        await egresosAPI.update(id, year, updates)
        await fetchData()
      } catch (error) {
        setState((prev) => ({ ...prev, error: error instanceof Error ? error.message : "Error al actualizar" }))
        throw error
      }
    },
    delete: async (id) => {
      try {
        await egresosAPI.delete(id, year)
        await fetchData()
      } catch (error) {
        setState((prev) => ({ ...prev, error: error instanceof Error ? error.message : "Error al eliminar" }))
        throw error
      }
    },
  }

  return { ...state, ...actions }
}

// Hook para Eventos
export function useEventos(year: string) {
  const [state, setState] = useState<UseDataState<Evento[]>>({
    data: null,
    loading: true,
    error: null,
  })

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await eventosAPI.getAll(year)
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState({ data: null, loading: false, error: error instanceof Error ? error.message : "Error desconocido" })
    }
  }, [year])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const actions: UseDataActions<Evento[]> = {
    refetch: fetchData,
    create: async (evento) => {
      try {
        await eventosAPI.create({ ...evento, year })
        await fetchData()
      } catch (error) {
        setState((prev) => ({ ...prev, error: error instanceof Error ? error.message : "Error al crear" }))
        throw error
      }
    },
    update: async (id, updates) => {
      try {
        await eventosAPI.update(id, year, updates)
        await fetchData()
      } catch (error) {
        setState((prev) => ({ ...prev, error: error instanceof Error ? error.message : "Error al actualizar" }))
        throw error
      }
    },
    delete: async (id) => {
      try {
        await eventosAPI.delete(id, year)
        await fetchData()
      } catch (error) {
        setState((prev) => ({ ...prev, error: error instanceof Error ? error.message : "Error al eliminar" }))
        throw error
      }
    },
  }

  return { ...state, ...actions }
}

// Hook para Casas
export function useCasas() {
  const [state, setState] = useState<UseDataState<Casa[]>>({
    data: null,
    loading: true,
    error: null,
  })

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await casasAPI.getAll()
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState({ data: null, loading: false, error: error instanceof Error ? error.message : "Error desconocido" })
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const actions: UseDataActions<Casa[]> = {
    refetch: fetchData,
    create: async (casa) => {
      try {
        await casasAPI.create(casa)
        await fetchData()
      } catch (error) {
        setState((prev) => ({ ...prev, error: error instanceof Error ? error.message : "Error al crear" }))
        throw error
      }
    },
    update: async (id, updates) => {
      try {
        await casasAPI.update(id, updates)
        await fetchData()
      } catch (error) {
        setState((prev) => ({ ...prev, error: error instanceof Error ? error.message : "Error al actualizar" }))
        throw error
      }
    },
    delete: async (id) => {
      try {
        await casasAPI.delete(id)
        await fetchData()
      } catch (error) {
        setState((prev) => ({ ...prev, error: error instanceof Error ? error.message : "Error al eliminar" }))
        throw error
      }
    },
  }

  return { ...state, ...actions }
}

// Hook para Configuración
export function useConfig() {
  const [state, setState] = useState<UseDataState<Config>>({
    data: null,
    loading: true,
    error: null,
  })

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await configAPI.get()
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState({ data: null, loading: false, error: error instanceof Error ? error.message : "Error desconocido" })
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const update = async (updates: Partial<Config>) => {
    try {
      const updated = await configAPI.update(updates)
      setState({ data: updated, loading: false, error: null })
    } catch (error) {
      setState((prev) => ({ ...prev, error: error instanceof Error ? error.message : "Error al actualizar" }))
      throw error
    }
  }

  return { ...state, update, refetch: fetchData }
}

// Hook para Años
export function useYears() {
  const [state, setState] = useState<UseDataState<string[]>>({
    data: null,
    loading: true,
    error: null,
  })

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await yearsAPI.getAll()
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState({ data: null, loading: false, error: error instanceof Error ? error.message : "Error desconocido" })
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const createYear = async (year: string) => {
    try {
      const updated = await yearsAPI.create(year)
      setState({ data: updated, loading: false, error: null })
    } catch (error) {
      setState((prev) => ({ ...prev, error: error instanceof Error ? error.message : "Error al crear año" }))
      throw error
    }
  }

  return { ...state, createYear, refetch: fetchData }
}
