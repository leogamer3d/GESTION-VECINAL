
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Palette } from "lucide-react"
import { useIncomeCategories, useExpenseCategories } from "@/hooks/use-categories"

export function CategoriesManager() {
  const { categories: incomeCategories, addCategory: addIncomeCategory, updateCategory: updateIncomeCategory, deleteCategory: deleteIncomeCategory } = useIncomeCategories()
  const { categories: expenseCategories, addCategory: addExpenseCategory, updateCategory: updateExpenseCategory, deleteCategory: deleteExpenseCategory } = useExpenseCategories()

  const [showIncomeForm, setShowIncomeForm] = useState(false)
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [editingIncome, setEditingIncome] = useState<any>(null)
  const [editingExpense, setEditingExpense] = useState<any>(null)

  const [incomeFormData, setIncomeFormData] = useState({
    name: "",
    description: "",
    color: "#3b82f6",
    active: true,
  })

  const [expenseFormData, setExpenseFormData] = useState({
    name: "",
    description: "",
    color: "#ef4444",
    active: true,
  })

  const handleIncomeSubmit = () => {
    if (!incomeFormData.name) return

    if (editingIncome) {
      updateIncomeCategory(editingIncome.id, incomeFormData)
      setEditingIncome(null)
    } else {
      addIncomeCategory(incomeFormData)
    }

    setIncomeFormData({ name: "", description: "", color: "#3b82f6", active: true })
    setShowIncomeForm(false)
  }

  const handleExpenseSubmit = () => {
    if (!expenseFormData.name) return

    if (editingExpense) {
      updateExpenseCategory(editingExpense.id, expenseFormData)
      setEditingExpense(null)
    } else {
      addExpenseCategory(expenseFormData)
    }

    setExpenseFormData({ name: "", description: "", color: "#ef4444", active: true })
    setShowExpenseForm(false)
  }

  const handleEditIncome = (category: any) => {
    setEditingIncome(category)
    setIncomeFormData({
      name: category.name,
      description: category.description || "",
      color: category.color || "#3b82f6",
      active: category.active,
    })
    setShowIncomeForm(true)
  }

  const handleEditExpense = (category: any) => {
    setEditingExpense(category)
    setExpenseFormData({
      name: category.name,
      description: category.description || "",
      color: category.color || "#ef4444",
      active: category.active,
    })
    setShowExpenseForm(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Gestión de Categorías</h2>
        <p className="text-slate-600">Personaliza las categorías de ingresos y egresos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categorías de Ingresos */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-green-700">Categorías de Ingresos</CardTitle>
              <Button onClick={() => setShowIncomeForm(!showIncomeForm)} size="sm" className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Nueva
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showIncomeForm && (
              <div className="mb-6 p-4 border rounded-lg bg-green-50">
                <h3 className="font-medium mb-4">{editingIncome ? "Editar" : "Nueva"} Categoría de Ingreso</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Nombre</Label>
                    <Input
                      value={incomeFormData.name}
                      onChange={(e) => setIncomeFormData({ ...incomeFormData, name: e.target.value })}
                      placeholder="Nombre de la categoría"
                    />
                  </div>
                  <div>
                    <Label>Descripción</Label>
                    <Textarea
                      value={incomeFormData.description}
                      onChange={(e) => setIncomeFormData({ ...incomeFormData, description: e.target.value })}
                      placeholder="Descripción opcional"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label>Color</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={incomeFormData.color}
                          onChange={(e) => setIncomeFormData({ ...incomeFormData, color: e.target.value })}
                          className="w-12 h-8"
                        />
                        <div
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: incomeFormData.color }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label>Activa</Label>
                      <Switch
                        checked={incomeFormData.active}
                        onCheckedChange={(checked) => setIncomeFormData({ ...incomeFormData, active: checked })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleIncomeSubmit} size="sm">
                      {editingIncome ? "Actualizar" : "Crear"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowIncomeForm(false)
                        setEditingIncome(null)
                        setIncomeFormData({ name: "", description: "", color: "#3b82f6", active: true })
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {incomeCategories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: category.color }}
                    />
                    <div>
                      <div className="font-medium">{category.name}</div>
                      {category.description && (
                        <div className="text-sm text-slate-500">{category.description}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={category.active ? "default" : "secondary"}>
                      {category.active ? "Activa" : "Inactiva"}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => handleEditIncome(category)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    {!category.id.startsWith('cuota') && !category.id.startsWith('multa') && (
                      <Button variant="outline" size="sm" onClick={() => deleteIncomeCategory(category.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Categorías de Egresos */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-red-700">Categorías de Egresos</CardTitle>
              <Button onClick={() => setShowExpenseForm(!showExpenseForm)} size="sm" className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                Nueva
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showExpenseForm && (
              <div className="mb-6 p-4 border rounded-lg bg-red-50">
                <h3 className="font-medium mb-4">{editingExpense ? "Editar" : "Nueva"} Categoría de Egreso</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Nombre</Label>
                    <Input
                      value={expenseFormData.name}
                      onChange={(e) => setExpenseFormData({ ...expenseFormData, name: e.target.value })}
                      placeholder="Nombre de la categoría"
                    />
                  </div>
                  <div>
                    <Label>Descripción</Label>
                    <Textarea
                      value={expenseFormData.description}
                      onChange={(e) => setExpenseFormData({ ...expenseFormData, description: e.target.value })}
                      placeholder="Descripción opcional"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label>Color</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={expenseFormData.color}
                          onChange={(e) => setExpenseFormData({ ...expenseFormData, color: e.target.value })}
                          className="w-12 h-8"
                        />
                        <div
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: expenseFormData.color }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label>Activa</Label>
                      <Switch
                        checked={expenseFormData.active}
                        onCheckedChange={(checked) => setExpenseFormData({ ...expenseFormData, active: checked })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleExpenseSubmit} size="sm">
                      {editingExpense ? "Actualizar" : "Crear"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowExpenseForm(false)
                        setEditingExpense(null)
                        setExpenseFormData({ name: "", description: "", color: "#ef4444", active: true })
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {expenseCategories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: category.color }}
                    />
                    <div>
                      <div className="font-medium">{category.name}</div>
                      {category.description && (
                        <div className="text-sm text-slate-500">{category.description}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={category.active ? "default" : "secondary"}>
                      {category.active ? "Activa" : "Inactiva"}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => handleEditExpense(category)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    {!category.id.startsWith('mantenimiento') && !category.id.startsWith('servicios') && (
                      <Button variant="outline" size="sm" onClick={() => deleteExpenseCategory(category.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
