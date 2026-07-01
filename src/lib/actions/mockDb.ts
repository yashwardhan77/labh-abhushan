// In-memory mock database store for Labh Abhushan
// Active when process.env.NEXT_PUBLIC_SUPABASE_URL contains "your-project-id"

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return !!(
    url &&
    url !== '' &&
    !url.includes('your-project-id') &&
    key &&
    key !== '' &&
    !key.includes('placeholder')
  )
}

export interface MockCategory {
  id: string
  name: string
  created_at: string
}

export interface MockBanner {
  id: string
  title: string
  image_url: string
  active: boolean
  created_at: string
}

export interface MockProduct {
  id: string
  category_id: string
  product_name: string
  description: string
  weight: number
  purity: string
  image_url: string
  images: string[]
  featured: boolean
  status: string
  created_at: string
}

export interface MockEnquiry {
  id: string
  name: string
  mobile: string
  email: string | null
  message: string
  created_at: string
}

// Initial mock data
const initialCategories = [
  { id: 'cat-gold-111', name: 'Gold', created_at: new Date(Date.now() - 3600000 * 24 * 30).toISOString() },
  { id: 'cat-silver-222', name: 'Silver', created_at: new Date(Date.now() - 3600000 * 24 * 29).toISOString() },
  { id: 'cat-diamonds-333', name: 'Diamonds', created_at: new Date(Date.now() - 3600000 * 24 * 28).toISOString() },
]

const initialBanners = [
  {
    id: 'ban-1',
    title: 'Heritage Bridal Masterpieces',
    image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop',
    active: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
  },
  {
    id: 'ban-2',
    title: 'Vibrant Daily Wear Ornaments',
    image_url: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1200&auto=format&fit=crop',
    active: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
  },
  {
    id: 'ban-3',
    title: 'Certified Solitaire Collection',
    image_url: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1200&auto=format&fit=crop',
    active: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
  },
]

const initialProducts = [
  {
    id: 'prod-1',
    category_id: 'cat-gold-111',
    product_name: 'Antique Gold Bridal Choker',
    description: 'A majestic hand-crafted royal antique choker, detailed with traditional filigree work and semi-precious emerald drops.',
    weight: 48.550,
    purity: '22K Gold (916)',
    image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=600&auto=format&fit=crop'
    ],
    featured: true,
    status: 'Available',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'prod-2',
    category_id: 'cat-diamonds-333',
    product_name: 'Diamond Solitaire Engagement Ring',
    description: 'Elegant classic solitaire diamond engagement ring, set in a brilliant 18K white gold crown setting.',
    weight: 4.250,
    purity: '18K Diamond',
    image_url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop',
    images: [],
    featured: true,
    status: 'Available',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'prod-3',
    category_id: 'cat-gold-111',
    product_name: 'Traditional Gold Kada Bangle',
    description: 'Broad ornate gold bangle featuring traditional HUID-hallmarked design work, perfect for heritage bridal styling.',
    weight: 24.800,
    purity: '22K Gold (916)',
    image_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop',
    images: [],
    featured: true,
    status: 'Available',
    created_at: new Date(Date.now() - 3600000 * 36).toISOString(),
  },
  {
    id: 'prod-4',
    category_id: 'cat-silver-222',
    product_name: 'Fine Silver Pooja Aarti Set',
    description: 'Pure fine silver puja plate, complete with a silver diya box, incense stand, and water tumbler for religious ceremonies.',
    weight: 350.000,
    purity: '999 Silver',
    image_url: 'https://images.unsplash.com/photo-1610484826967-09c5720778c7?q=80&w=600&auto=format&fit=crop',
    images: [],
    featured: true,
    status: 'Available',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'prod-5',
    category_id: 'cat-diamonds-333',
    product_name: 'Minimalist Diamond Pendant',
    description: 'A subtle day-wear diamond pendant, carrying a certified 0.25 carat VVS clarity round diamond.',
    weight: 2.800,
    purity: '18K Diamond',
    image_url: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=600&auto=format&fit=crop',
    images: [],
    featured: false,
    status: 'Available',
    created_at: new Date(Date.now() - 3600000 * 60).toISOString(),
  },
  {
    id: 'prod-6',
    category_id: 'cat-silver-222',
    product_name: 'Premium Silver Temple Choker',
    description: 'Handcrafted 92.5 sterling silver temple design collar necklace, oxidized for an elegant heritage look.',
    weight: 85.000,
    purity: '925 Silver',
    image_url: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=600&auto=format&fit=crop',
    images: [],
    featured: false,
    status: 'Available',
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
]

const initialRates = {
  gold_rate: 73450.00,
  silver_rate: 89500.00,
  updated_at: new Date().toISOString(),
}

const initialEnquiries = [
  {
    id: 'enq-1',
    name: 'Ramesh Sharma',
    mobile: '+919822334455',
    email: 'ramesh@gmail.com',
    message: 'Hello, I am looking for a customized wedding set in 22K Gold. Could you please schedule a consultation call?',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'enq-2',
    name: 'Suhasini Rao',
    mobile: '+919988776655',
    email: 'suhasini.r@yahoo.com',
    message: 'Interested in the Diamond Solitaire Engagement Ring. Do you provide certificates from IGI or GIA?',
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
]

// Persistent in-memory storage across development hot-reloads
const globalStore = global as unknown as {
  mockBanners?: MockBanner[]
  mockCategories?: MockCategory[]
  mockProducts?: MockProduct[]
  mockRates?: typeof initialRates
  mockEnquiries?: MockEnquiry[]
}

if (!globalStore.mockBanners) globalStore.mockBanners = [...initialBanners]
if (!globalStore.mockCategories) globalStore.mockCategories = [...initialCategories]
if (!globalStore.mockProducts) globalStore.mockProducts = [...initialProducts]
if (!globalStore.mockRates) globalStore.mockRates = { ...initialRates }
if (!globalStore.mockEnquiries) globalStore.mockEnquiries = [...initialEnquiries] as MockEnquiry[]

export const mockDb = {
  // Banners
  getBanners: () => globalStore.mockBanners || [],
  createBanner: (title: string, imageUrl: string) => {
    const banner = {
      id: `ban-${Date.now()}`,
      title,
      image_url: imageUrl,
      active: true,
      created_at: new Date().toISOString(),
    }
    globalStore.mockBanners = [banner, ...(globalStore.mockBanners || [])]
    return banner
  },
  toggleBannerActive: (id: string, active: boolean) => {
    globalStore.mockBanners = (globalStore.mockBanners || []).map((b) =>
      b.id === id ? { ...b, active } : b
    )
    return (globalStore.mockBanners || []).find((b) => b.id === id)
  },
  deleteBanner: (id: string) => {
    globalStore.mockBanners = (globalStore.mockBanners || []).filter((b) => b.id !== id)
    return true
  },

  // Categories
  getCategories: () => globalStore.mockCategories || [],
  createCategory: (name: string) => {
    const category = {
      id: `cat-${Date.now()}`,
      name,
      created_at: new Date().toISOString(),
    }
    globalStore.mockCategories = [...(globalStore.mockCategories || []), category]
    return category
  },
  updateCategory: (id: string, name: string) => {
    globalStore.mockCategories = (globalStore.mockCategories || []).map((c) =>
      c.id === id ? { ...c, name } : c
    )
    return (globalStore.mockCategories || []).find((c) => c.id === id)
  },
  deleteCategory: (id: string) => {
    globalStore.mockCategories = (globalStore.mockCategories || []).filter((c) => c.id !== id)
    // Cascading delete mock products in this category
    globalStore.mockProducts = (globalStore.mockProducts || []).filter((p) => p.category_id !== id)
    return true
  },

  // Products
  getProducts: (filters: any = {}) => {
    let list = [...(globalStore.mockProducts || [])]

    if (filters.search && filters.search.trim() !== '') {
      const s = filters.search.toLowerCase().trim()
      list = list.filter(
        (p) =>
          p.product_name.toLowerCase().includes(s) ||
          p.description.toLowerCase().includes(s) ||
          p.purity.toLowerCase().includes(s)
      )
    }

    if (filters.categoryId && filters.categoryId !== 'all') {
      list = list.filter((p) => p.category_id === filters.categoryId)
    }

    if (filters.featured !== undefined) {
      list = list.filter((p) => p.featured === filters.featured)
    }

    if (filters.status) {
      list = list.filter((p) => p.status === filters.status)
    }

    // Newest first
    list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    const totalCount = list.length
    const page = filters.page || 1
    const limit = filters.limit || 12
    const from = (page - 1) * limit
    const to = from + limit

    const paginatedList = list.slice(from, to).map((p) => {
      const catObj = (globalStore.mockCategories || []).find((c) => c.id === p.category_id)
      return {
        ...p,
        categories: catObj ? { id: catObj.id, name: catObj.name } : { id: p.category_id, name: 'Jewellery' },
      }
    })

    return {
      data: paginatedList,
      count: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    }
  },
  getProductById: (id: string) => {
    const p = (globalStore.mockProducts || []).find((prod) => prod.id === id)
    if (!p) return null
    const catObj = (globalStore.mockCategories || []).find((c) => c.id === p.category_id)
    return {
      ...p,
      categories: catObj ? { id: catObj.id, name: catObj.name } : { id: p.category_id, name: 'Jewellery' },
    }
  },
  createProduct: (pData: any) => {
    const product = {
      id: `prod-${Date.now()}`,
      category_id: pData.category_id,
      product_name: pData.product_name,
      description: pData.description || '',
      weight: parseFloat(pData.weight) || 0,
      purity: pData.purity,
      image_url: pData.image_url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop',
      images: pData.images || [],
      featured: !!pData.featured,
      status: pData.status || 'Available',
      created_at: new Date().toISOString(),
    }
    globalStore.mockProducts = [product, ...(globalStore.mockProducts || [])]
    return product
  },
  updateProduct: (id: string, pData: any) => {
    globalStore.mockProducts = (globalStore.mockProducts || []).map((p) => {
      if (p.id === id) {
        return {
          ...p,
          category_id: pData.category_id ?? p.category_id,
          product_name: pData.product_name ?? p.product_name,
          description: pData.description ?? p.description,
          weight: pData.weight !== undefined ? parseFloat(pData.weight) : p.weight,
          purity: pData.purity ?? p.purity,
          image_url: pData.image_url ?? p.image_url,
          images: pData.images ?? p.images,
          featured: pData.featured !== undefined ? !!pData.featured : p.featured,
          status: pData.status ?? p.status,
        }
      }
      return p
    })
    return (globalStore.mockProducts || []).find((p) => p.id === id)
  },
  deleteProduct: (id: string) => {
    globalStore.mockProducts = (globalStore.mockProducts || []).filter((p) => p.id !== id)
    return true
  },

  // Rates
  getMetalRates: () => globalStore.mockRates || initialRates,
  updateMetalRates: (goldRate: number, silverRate: number) => {
    globalStore.mockRates = {
      gold_rate: goldRate,
      silver_rate: silverRate,
      updated_at: new Date().toISOString(),
    }
    return globalStore.mockRates
  },

  // Enquiries
  getEnquiries: (search = '') => {
    let list = [...(globalStore.mockEnquiries || [])]
    if (search && search.trim() !== '') {
      const s = search.toLowerCase().trim()
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(s) ||
          e.mobile.includes(s) ||
          (e.email && e.email.toLowerCase().includes(s)) ||
          e.message.toLowerCase().includes(s)
      )
    }
    list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    return list
  },
  createEnquiry: (name: string, mobile: string, email: string | null | undefined, message: string) => {
    const enquiry = {
      id: `enq-${Date.now()}`,
      name,
      mobile,
      email: email || null,
      message,
      created_at: new Date().toISOString(),
    }
    globalStore.mockEnquiries = [enquiry, ...(globalStore.mockEnquiries || [])]
    return enquiry
  },
  deleteEnquiry: (id: string) => {
    globalStore.mockEnquiries = (globalStore.mockEnquiries || []).filter((e) => e.id !== id)
    return true
  },
}
