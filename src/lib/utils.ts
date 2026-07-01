/**
 * Format number as Indian Rupee (INR) currency
 */
export function formatCurrency(amount: number | string): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(numericAmount)) return '₹0.00'
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(numericAmount)
}

/**
 * Format weight in grams (e.g. 10.45 -> 10.450 g)
 */
export function formatWeight(weight: number | string): string {
  const numericWeight = typeof weight === 'string' ? parseFloat(weight) : weight
  if (isNaN(numericWeight)) return '0.000 g'
  
  return `${numericWeight.toFixed(3)} g`
}

/**
 * Clean joining of tailwind classes
 */
export function cn(...classes: (string | undefined | null | boolean)[]) {
  return classes.filter(Boolean).join(' ')
}

/**
 * Format UTC dates to readable format
 */
export function formatDate(dateString: string): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
