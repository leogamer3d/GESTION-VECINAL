"use client"

import { useState, useEffect, useCallback } from "react"
import { multasConfig, type MultaConfig } from "@/lib/multas-config"

export function useMultas() {
  const [multas, setMultas] = useState<MultaConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMultas = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await multasConfig.getMultas()
      setMultas(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar multas")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMultas()
  }, [fetchMultas])

  const createMulta = async (multaData: Omit<MultaConfig, "id">) => {
    try {
      await multasConfig.createMulta(multaData)
      await fetchMultas()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear multa")
      throw err
    }
  }

  const updateMulta = async (id: string, updates: Partial<MultaConfig>) => {
    try {
      await multasConfig.updateMulta(id, updates)
      await fetchMultas()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar multa")
      throw err
    }
  }

  const deleteMulta = async (id: string) => {
    try {
      await multasConfig.deleteMulta(id)
      await fetchMultas()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar multa")
      throw err
    }
  }

  return {
    multas,
    loading,
    error,
    createMulta,
    updateMulta,
    deleteMulta,
    refetch: fetchMultas,
  }
}
