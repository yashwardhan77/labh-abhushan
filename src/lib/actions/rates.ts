'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { isSupabaseConfigured, mockDb } from './mockDb'

export async function getMetalRates() {
  try {
    if (!isSupabaseConfigured()) {
      const data = mockDb.getMetalRates()
      return { success: true, data }
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('metal_rates')
      .select('*')
      .eq('id', 1)
      .single()

    if (error) {
      // If table empty or row doesn't exist, return default values
      return { 
        success: true, 
        data: { gold_rate: 72500.00, silver_rate: 89000.00, updated_at: new Date().toISOString() } 
      }
    }
    return { success: true, data }
  } catch (error: any) {
    console.error('getMetalRates error:', error)
    return { success: false, error: error.message || 'Failed to fetch metal rates' }
  }
}

export async function updateMetalRates(goldRate: number, silverRate: number) {
  try {
    if (goldRate <= 0 || silverRate <= 0) {
      return { success: false, error: 'Rates must be positive numbers' }
    }

    if (!isSupabaseConfigured()) {
      const data = mockDb.updateMetalRates(goldRate, silverRate)
      revalidatePath('/')
      return { success: true, data }
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('metal_rates')
      .upsert({ id: 1, gold_rate: goldRate, silver_rate: silverRate, updated_at: new Date().toISOString() })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/')
    return { success: true, data }
  } catch (error: any) {
    console.error('updateMetalRates error:', error)
    return { success: false, error: error.message || 'Failed to update metal rates' }
  }
}
