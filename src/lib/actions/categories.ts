'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { isSupabaseConfigured, mockDb } from './mockDb'

export async function getCategories() {
  try {
    if (!isSupabaseConfigured()) {
      const data = mockDb.getCategories()
      return { success: true, data }
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    return { success: true, data }
  } catch (error: any) {
    console.error('getCategories error:', error)
    return { success: false, error: error.message || 'Failed to fetch categories' }
  }
}

export async function createCategory(name: string) {
  try {
    if (!name || name.trim() === '') {
      return { success: false, error: 'Category name is required' }
    }

    if (!isSupabaseConfigured()) {
      const data = mockDb.createCategory(name.trim())
      revalidatePath('/')
      revalidatePath('/products')
      return { success: true, data }
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name: name.trim() }])
      .select()
      .single()

    if (error) throw error

    revalidatePath('/')
    revalidatePath('/products')
    return { success: true, data }
  } catch (error: any) {
    console.error('createCategory error:', error)
    return { success: false, error: error.message || 'Failed to create category' }
  }
}

export async function updateCategory(id: string, name: string) {
  try {
    if (!name || name.trim() === '') {
      return { success: false, error: 'Category name is required' }
    }

    if (!isSupabaseConfigured()) {
      const data = mockDb.updateCategory(id, name.trim())
      revalidatePath('/')
      revalidatePath('/products')
      return { success: true, data }
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('categories')
      .update({ name: name.trim() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/')
    revalidatePath('/products')
    return { success: true, data }
  } catch (error: any) {
    console.error('updateCategory error:', error)
    return { success: false, error: error.message || 'Failed to update category' }
  }
}

export async function deleteCategory(id: string) {
  try {
    if (!isSupabaseConfigured()) {
      mockDb.deleteCategory(id)
      revalidatePath('/')
      revalidatePath('/products')
      return { success: true }
    }

    const supabase = await createClient()
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/')
    revalidatePath('/products')
    return { success: true }
  } catch (error: any) {
    console.error('deleteCategory error:', error)
    return { success: false, error: error.message || 'Failed to delete category' }
  }
}
