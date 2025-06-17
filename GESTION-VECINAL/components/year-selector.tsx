"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "lucide-react"

interface YearSelectorProps {
  onYearChange: (year: string) => void
}

export function YearSelector({ onYearChange }: YearSelectorProps) {
  const [selectedYear, setSelectedYear] = useState("2024")

  const years = ["2024", "2023", "2022", "2021", "2020"]

  const handleYearChange = (year: string) => {
    setSelectedYear(year)
    onYearChange(year)
  }

  return (
    <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2">
      <Calendar className="h-4 w-4 text-slate-600" />
      <Select value={selectedYear} onValueChange={handleYearChange}>
        <SelectTrigger className="w-24 border-0 bg-transparent">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
