'use server'

import { createClient } from '@/lib/supabase/server'
import { uploadImage } from '@/lib/supabase/storage'
import { revalidatePath } from 'next/cache'
import { isSupabaseConfigured, mockDb } from './mockDb'

export async function getBanners(activeOnly = false) {
  try {
    if (!isSupabaseConfigured()) {
      const data = mockDb.getBanners()
      return { success: true, data: activeOnly ? data.filter(b => b.active) : data }
    }

    const supabase = await createClient()
    let query = supabase.from('banners').select('*').order('created_at', { ascending: false })

    if (activeOnly) {
      query = query.eq('active', true)
    }

    const { data, error } = await query

    if (error) throw error
    return { success: true, data }
  } catch (error: any) {
    console.error('getBanners error:', error)
    return { success: false, error: error.message || 'Failed to fetch banners' }
  }
}

export async function createBanner(title: string, imageBase64: string) {
  try {
    if (!title || title.trim() === '') {
      return { success: false, error: 'Banner title is required' }
    }
    if (!imageBase64) {
      return { success: false, error: 'Banner image is required' }
    }

    if (!isSupabaseConfigured()) {
      const data = mockDb.createBanner(title.trim(), imageBase64)
      revalidatePath('/')
      return { success: true, data }
    }

    // Upload image first
    const uploadRes = await uploadImage(imageBase64, 'banners')
    if (!uploadRes.success || !uploadRes.publicUrl) {
      return { success: false, error: uploadRes.error || 'Failed to upload banner image' }
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('banners')
      .insert([
        {
          title: title.trim(),
          image_url: uploadRes.publicUrl,
          active: true,
        },
      ])
      .select()
      .single()

    if (error) throw error

    revalidatePath('/')
    return { success: true, data }
  } catch (error: any) {
    console.error('createBanner error:', error)
    return { success: false, error: error.message || 'Failed to create banner' }
  }
}

export async function toggleBannerActive(id: string, active: boolean) {
  try {
    if (!isSupabaseConfigured()) {
      const data = mockDb.toggleBannerActive(id, active)
      revalidatePath('/')
      return { success: true, data }
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('banners')
      .update({ active })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/')
    return { success: true, data }
  } catch (error: any) {
    console.error('toggleBannerActive error:', error)
    return { success: false, error: error.message || 'Failed to toggle banner status' }
  }
}

export async function deleteBanner(id: string) {
  try {
    if (!isSupabaseConfigured()) {
      mockDb.deleteBanner(id)
      revalidatePath('/')
      return { success: true }
    }

    const supabase = await createClient()
    
    // First, let's get the image URL to delete from storage if needed
    const { data: banner } = await supabase
      .from('banners')
      .select('image_url')
      .eq('id', id)
      .single()

    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', id)

    if (error) throw error

    // Attempt to delete from storage if it's stored in our bucket
    if (banner?.image_url) {
      try {
        const urlParts = banner.image_url.split('/storage/v1/object/public/jewellery/')
        if (urlParts.length > 1) {
          const filePath = urlParts[1]
          await supabase.storage.from('jewellery').remove([filePath])
        }
      } catch (err) {
        console.error('Failed to delete banner image from storage bucket:', err)
      }
    }

    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error('deleteBanner error:', error)
    return { success: false, error: error.message || 'Failed to delete banner' }
  }
}
