'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { isSupabaseConfigured, mockDb } from './mockDb'

export async function getEnquiries(search = '') {
  try {
    if (!isSupabaseConfigured()) {
      const data = mockDb.getEnquiries(search)
      return { success: true, data }
    }

    const supabase = await createClient()
    let query = supabase.from('enquiries').select('*').order('created_at', { ascending: false })

    if (search && search.trim() !== '') {
      const searchTerm = `%${search.trim()}%`
      query = query.or(`name.ilike.${searchTerm},mobile.ilike.${searchTerm},email.ilike.${searchTerm},message.ilike.${searchTerm}`)
    }

    const { data, error } = await query

    if (error) throw error
    return { success: true, data }
  } catch (error: any) {
    console.error('getEnquiries error:', error)
    return { success: false, error: error.message || 'Failed to fetch enquiries' }
  }
}

export async function createEnquiry(
  name: string,
  mobile: string,
  email: string | null | undefined,
  message: string
) {
  try {
    if (!name || name.trim() === '') {
      return { success: false, error: 'Name is required' }
    }
    if (!mobile || mobile.trim() === '') {
      return { success: false, error: 'Mobile number is required' }
    }
    if (!message || message.trim() === '') {
      return { success: false, error: 'Message is required' }
    }

    if (!isSupabaseConfigured()) {
      const data = mockDb.createEnquiry(name.trim(), mobile.trim(), email?.trim() || null, message.trim())
      revalidatePath('/admin/dashboard')
      revalidatePath('/admin/enquiries')
      return { success: true, data }
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('enquiries')
      .insert([
        {
          name: name.trim(),
          mobile: mobile.trim(),
          email: email?.trim() || null,
          message: message.trim(),
        },
      ])
      .select()
      .single()

    if (error) throw error

    revalidatePath('/admin/dashboard')
    revalidatePath('/admin/enquiries')
    return { success: true, data }
  } catch (error: any) {
    console.error('createEnquiry error:', error)
    return { success: false, error: error.message || 'Failed to submit enquiry' }
  }
}

export async function deleteEnquiry(id: string) {
  try {
    if (!isSupabaseConfigured()) {
      mockDb.deleteEnquiry(id)
      revalidatePath('/admin/dashboard')
      revalidatePath('/admin/enquiries')
      return { success: true }
    }

    const supabase = await createClient()
    const { error } = await supabase
      .from('enquiries')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/dashboard')
    revalidatePath('/admin/enquiries')
    return { success: true }
  } catch (error: any) {
    console.error('deleteEnquiry error:', error)
    return { success: false, error: error.message || 'Failed to delete enquiry' }
  }
}
