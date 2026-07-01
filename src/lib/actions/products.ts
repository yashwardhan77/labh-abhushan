'use server'

import { createClient } from '@/lib/supabase/server'
import { uploadImage } from '@/lib/supabase/storage'
import { revalidatePath } from 'next/cache'
import { isSupabaseConfigured, mockDb } from './mockDb'

interface ProductFilters {
  search?: string
  categoryId?: string
  featured?: boolean
  page?: number
  limit?: number
  status?: string
}

export async function getProducts(filters: ProductFilters = {}) {
  try {
    if (!isSupabaseConfigured()) {
      const res = mockDb.getProducts(filters)
      return {
        success: true,
        data: res.data,
        count: res.count,
        totalPages: res.totalPages,
        currentPage: res.currentPage,
      }
    }

    const {
      search = '',
      categoryId = '',
      featured,
      page = 1,
      limit = 12,
      status,
    } = filters

    const supabase = await createClient()
    
    // We want to fetch the products and count them.
    // Query builder
    let query = supabase
      .from('products')
      .select('*, categories(id, name)', { count: 'exact' })

    if (search && search.trim() !== '') {
      const searchPattern = `%${search.trim()}%`
      query = query.or(`product_name.ilike.${searchPattern},description.ilike.${searchPattern},purity.ilike.${searchPattern}`)
    }

    if (categoryId && categoryId !== 'all') {
      query = query.eq('category_id', categoryId)
    }

    if (featured !== undefined) {
      query = query.eq('featured', featured)
    }

    if (status) {
      query = query.eq('status', status)
    }

    // Sort: newest first
    query = query.order('created_at', { ascending: false })

    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) throw error

    return {
      success: true,
      data,
      count: count || 0,
      totalPages: count ? Math.ceil(count / limit) : 0,
      currentPage: page,
    }
  } catch (error: any) {
    console.error('getProducts error:', error)
    return { success: false, error: error.message || 'Failed to fetch products' }
  }
}

export async function getProductById(id: string) {
  try {
    if (!isSupabaseConfigured()) {
      const data = mockDb.getProductById(id)
      return { success: true, data }
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(id, name)')
      .eq('id', id)
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error: any) {
    console.error('getProductById error:', error)
    return { success: false, error: error.message || 'Failed to fetch product details' }
  }
}

export async function createProduct(formData: {
  category_id: string
  product_name: string
  description?: string
  weight: number
  purity: string
  featured: boolean
  status: 'Available' | 'Out of Stock'
  imageBase64?: string
  additionalImagesBase64?: string[]
}) {
  try {
    const {
      category_id,
      product_name,
      description,
      weight,
      purity,
      featured,
      status,
      imageBase64,
      additionalImagesBase64 = [],
    } = formData

    if (!category_id) return { success: false, error: 'Category is required' }
    if (!product_name) return { success: false, error: 'Product name is required' }
    if (weight <= 0) return { success: false, error: 'Weight must be greater than 0' }
    if (!purity) return { success: false, error: 'Purity is required' }

    if (!isSupabaseConfigured()) {
      const data = mockDb.createProduct({
        category_id,
        product_name,
        description,
        weight,
        purity,
        featured,
        status,
        image_url: imageBase64,
        images: additionalImagesBase64,
      })
      revalidatePath('/')
      revalidatePath('/products')
      return { success: true, data }
    }

    let primaryImageUrl = ''
    if (imageBase64) {
      const uploadRes = await uploadImage(imageBase64, 'products')
      if (!uploadRes.success || !uploadRes.publicUrl) {
        return { success: false, error: uploadRes.error || 'Failed to upload primary image' }
      }
      primaryImageUrl = uploadRes.publicUrl
    }

    const additionalImageUrls: string[] = []
    for (const imgBase64 of additionalImagesBase64) {
      if (imgBase64) {
        const uploadRes = await uploadImage(imgBase64, 'products')
        if (uploadRes.success && uploadRes.publicUrl) {
          additionalImageUrls.push(uploadRes.publicUrl)
        }
      }
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          category_id,
          product_name,
          description,
          weight,
          purity,
          featured,
          status,
          image_url: primaryImageUrl || null,
          images: additionalImageUrls,
        },
      ])
      .select()
      .single()

    if (error) throw error

    revalidatePath('/')
    revalidatePath('/products')
    return { success: true, data }
  } catch (error: any) {
    console.error('createProduct error:', error)
    return { success: false, error: error.message || 'Failed to create product' }
  }
}

export async function updateProduct(
  id: string,
  formData: {
    category_id: string
    product_name: string
    description?: string
    weight: number
    purity: string
    featured: boolean
    status: 'Available' | 'Out of Stock'
    imageBase64?: string
    additionalImagesBase64?: string[]
    retainedImages?: string[]
    retainedPrimaryUrl?: string
  }
) {
  try {
    const {
      category_id,
      product_name,
      description,
      weight,
      purity,
      featured,
      status,
      imageBase64,
      additionalImagesBase64 = [],
      retainedImages = [],
      retainedPrimaryUrl = '',
    } = formData

    if (!category_id) return { success: false, error: 'Category is required' }
    if (!product_name) return { success: false, error: 'Product name is required' }
    if (weight <= 0) return { success: false, error: 'Weight must be greater than 0' }
    if (!purity) return { success: false, error: 'Purity is required' }

    if (!isSupabaseConfigured()) {
      const data = mockDb.updateProduct(id, {
        category_id,
        product_name,
        description,
        weight,
        purity,
        featured,
        status,
        image_url: imageBase64 || retainedPrimaryUrl,
        images: [...retainedImages, ...additionalImagesBase64],
      })
      revalidatePath('/')
      revalidatePath('/products')
      revalidatePath(`/products/${id}`)
      return { success: true, data }
    }

    let primaryImageUrl = retainedPrimaryUrl
    if (imageBase64) {
      const uploadRes = await uploadImage(imageBase64, 'products')
      if (!uploadRes.success || !uploadRes.publicUrl) {
        return { success: false, error: uploadRes.error || 'Failed to upload new primary image' }
      }
      primaryImageUrl = uploadRes.publicUrl
    }

    const newAdditionalUrls: string[] = []
    for (const imgBase64 of additionalImagesBase64) {
      if (imgBase64) {
        const uploadRes = await uploadImage(imgBase64, 'products')
        if (uploadRes.success && uploadRes.publicUrl) {
          newAdditionalUrls.push(uploadRes.publicUrl)
        }
      }
    }

    const finalAdditionalImages = [...retainedImages, ...newAdditionalUrls]

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .update({
        category_id,
        product_name,
        description,
        weight,
        purity,
        featured,
        status,
        image_url: primaryImageUrl || null,
        images: finalAdditionalImages,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath(`/products/${id}`)
    return { success: true, data }
  } catch (error: any) {
    console.error('updateProduct error:', error)
    return { success: false, error: error.message || 'Failed to update product' }
  }
}

export async function deleteProduct(id: string) {
  try {
    if (!isSupabaseConfigured()) {
      mockDb.deleteProduct(id)
      revalidatePath('/')
      revalidatePath('/products')
      return { success: true }
    }

    const supabase = await createClient()

    // Retrieve product images to clean storage
    const { data: product } = await supabase
      .from('products')
      .select('image_url, images')
      .eq('id', id)
      .single()

    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw error

    // Try deleting files from storage
    if (product) {
      const filesToDelete: string[] = []
      
      if (product.image_url) {
        const parts = product.image_url.split('/storage/v1/object/public/jewellery/')
        if (parts.length > 1) filesToDelete.push(parts[1])
      }

      if (product.images && Array.isArray(product.images)) {
        product.images.forEach((url: string) => {
          const parts = url.split('/storage/v1/object/public/jewellery/')
          if (parts.length > 1) filesToDelete.push(parts[1])
        })
      }

      if (filesToDelete.length > 0) {
        try {
          await supabase.storage.from('jewellery').remove(filesToDelete)
        } catch (err) {
          console.error('Failed to remove product images from storage:', err)
        }
      }
    }

    revalidatePath('/')
    revalidatePath('/products')
    return { success: true }
  } catch (error: any) {
    console.error('deleteProduct error:', error)
    return { success: false, error: error.message || 'Failed to delete product' }
  }
}
