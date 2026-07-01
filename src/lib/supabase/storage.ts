import { createClient } from './server'

export async function uploadImage(base64Data: string, folderName: string) {
  try {
    const supabase = await createClient()

    // Check if valid base64 image data
    if (!base64Data.startsWith('data:image/')) {
      return { success: false, error: 'Invalid image format. Must be a base64 encoded image.' }
    }

    // Clean up base64 string
    const base64Clean = base64Data.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64Clean, 'base64')

    // Find the file extension and MIME type
    const matches = base64Data.match(/^data:(image\/\w+);base64,/)
    const contentType = matches ? matches[1] : 'image/jpeg'
    const fileExt = contentType.split('/')[1] || 'jpg'

    // Create unique filename
    const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`
    const filePath = `${folderName}/${uniqueFileName}`

    const { error } = await supabase.storage
      .from('jewellery')
      .upload(filePath, buffer, {
        contentType,
        upsert: true,
      })

    if (error) {
      // If error is bucket not found, guide them
      if (error.message.includes('bucket') || error.message.includes('not found')) {
        throw new Error('Supabase Storage bucket "jewellery" does not exist. Please create a public bucket named "jewellery" in your Supabase project dashboard.')
      }
      throw error
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from('jewellery').getPublicUrl(filePath)
    return { success: true, publicUrl: urlData.publicUrl }
  } catch (error: any) {
    console.error('Storage upload error:', error)
    return { success: false, error: error.message || 'Storage upload failed' }
  }
}
