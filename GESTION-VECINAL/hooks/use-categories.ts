
"use client"

import { useState, useEffect } from 'react'
import { categoriesManager, type IncomeCategory, type ExpenseCategory } from '@/lib/categories-config'

export function useIncomeCategories() {
  const [categories, setCategories] = useState<IncomeCategory[]>([])

  useEffect(() => {
    setCategories(categoriesManager.getIncomeCategories())
  }, [])

  const addCategory = (category: Omit<IncomeCategory, 'id'>) => {
    const newCategory = categoriesManager.addIncomeCategory(category)
    setCategories(categoriesManager.getIncomeCategories())
    return newCategory
  }

  const updateCategory = (id: string, updates: Partial<IncomeCategory>) => {
    categoriesManager.updateIncomeCategory(id, updates)
    setCategories(categoriesManager.getIncomeCategories())
  }

  const deleteCategory = (id: string) => {
    categoriesManager.deleteIncomeCategory(id)
    setCategories(categoriesManager.getIncomeCategories())
  }

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
  }
}

export function useExpenseCategories() {
  const [categories, setCategories] = useState<ExpenseCategory[]>([])

  useEffect(() => {
    setCategories(categoriesManager.getExpenseCategories())
  }, [])

  const addCategory = (category: Omit<ExpenseCategory, 'id'>) => {
    const newCategory = categoriesManager.addExpenseCategory(category)
    setCategories(categoriesManager.getExpenseCategories())
    return newCategory
  }

  const updateCategory = (id: string, updates: Partial<ExpenseCategory>) => {
    categoriesManager.updateExpenseCategory(id, updates)
    setCategories(categoriesManager.getExpenseCategories())
  }

  const deleteCategory = (id: string) => {
    categoriesManager.deleteExpenseCategory(id)
    setCategories(categoriesManager.getExpenseCategories())
  }

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
  }
}
