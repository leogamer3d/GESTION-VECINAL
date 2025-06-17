"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Edit2, Check, X } from "lucide-react"

export function EditableTitle() {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState("Mi Residencial")

  const handleSave = () => {
    setIsEditing(false)
    // Aquí se guardaría en la base de datos
  }

  const handleCancel = () => {
    setIsEditing(false)
    setTitle(title) // Restaurar valor original
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-7 text-lg font-semibold"
          autoFocus
        />
        <Button size="sm" variant="ghost" onClick={handleSave}>
          <Check className="h-4 w-4 text-green-600" />
        </Button>
        <Button size="sm" variant="ghost" onClick={handleCancel}>
          <X className="h-4 w-4 text-red-600" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 group">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setIsEditing(true)}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Edit2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
