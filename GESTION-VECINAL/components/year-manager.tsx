"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Loader2 } from "lucide-react"

interface YearManagerProps {
  selectedYear: string
  onYearChange: (year: string) => void
  availableYears?: string[]
}

export function YearManager({ selectedYear, onYearChange, availableYears = [] }: YearManagerProps) {
  if (availableYears.length === 0) {
    return (
      <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Cargando...</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2">
      <Calendar className="h-4 w-4 text-slate-600" />
      <Select value={selectedYear} onValueChange={onYearChange}>
        <SelectTrigger className="w-24 border-0 bg-transparent">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {availableYears.map((year) => (
            <SelectItem key={year} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
