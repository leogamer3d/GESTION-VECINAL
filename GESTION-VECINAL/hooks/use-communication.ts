"use client"

import { useState, useEffect, useCallback } from "react"
import { communicationAPI, type CommunicationConfig } from "@/lib/api"

export function useCommunication() {
  const [config, setConfig] = useState<CommunicationConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConfig = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await communicationAPI.get()
      setConfig(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar configuración")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConfig()
  }, [fetchConfig])

  const updateConfig = async (updates: Partial<CommunicationConfig>) => {
    try {
      const updated = await communicationAPI.update(updates)
      setConfig(updated)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar configuración")
      throw err
    }
  }

  return {
    config,
    loading,
    error,
    updateConfig,
    refetch: fetchConfig,
  }
}
