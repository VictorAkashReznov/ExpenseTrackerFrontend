// Date formatting utilities
export const formatDate = (dateString, options = {}) => {
  const date = new Date(dateString)
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
  
  return date.toLocaleDateString('en-US', { ...defaultOptions, ...options })
}

export const formatDateShort = (dateString) => {
  return formatDate(dateString, { month: 'short', day: 'numeric' })
}

export const formatDateLong = (dateString) => {
  return formatDate(dateString, { 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Currency formatting utilities
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const formatNumber = (number, decimals = 0) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number)
}

// Category utilities
export const categoryConfig = {
  food: {
    label: 'Food & Dining',
    color: '#FF6B6B',
    icon: 'restaurant',
  },
  transport: {
    label: 'Transportation',
    color: '#4ECDC4',
    icon: 'directions_car',
  },
  housing: {
    label: 'Housing',
    color: '#45B7D1',
    icon: 'home',
  },
  shopping: {
    label: 'Shopping',
    color: '#96CEB4',
    icon: 'shopping_cart',
  },
  health: {
    label: 'Health & Medical',
    color: '#FFEAA7',
    icon: 'local_hospital',
  },
  education: {
    label: 'Education',
    color: '#DDA0DD',
    icon: 'school',
  },
  other: {
    label: 'Other',
    color: '#98D8C8',
    icon: 'category',
  },
}

export const getCategoryConfig = (category) => {
  return categoryConfig[category?.toLowerCase()] || categoryConfig.other
}

export const getCategoryLabel = (category) => {
  return getCategoryConfig(category).label
}

export const getCategoryColor = (category) => {
  return getCategoryConfig(category).color
}

// Validation utilities
export const validateExpense = (expense) => {
  const errors = {}
  
  if (!expense.title?.trim()) {
    errors.title = 'Title is required'
  }
  
  if (!expense.amount || expense.amount <= 0) {
    errors.amount = 'Amount must be greater than 0'
  }
  
  if (!expense.category) {
    errors.category = 'Category is required'
  }
  
  if (!expense.date) {
    errors.date = 'Date is required'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

// Array utilities
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key]
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {})
}

export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (direction === 'desc') {
      return bVal > aVal ? 1 : bVal < aVal ? -1 : 0
    }
    
    return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
  })
}

// Date range utilities
export const getDateRanges = () => {
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfWeek = new Date(startOfToday)
  startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay())
  
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  
  return {
    today: {
      start: startOfToday,
      end: now,
    },
    week: {
      start: startOfWeek,
      end: now,
    },
    month: {
      start: startOfMonth,
      end: now,
    },
    year: {
      start: startOfYear,
      end: now,
    },
  }
}

export const isDateInRange = (date, range) => {
  const checkDate = new Date(date)
  return checkDate >= range.start && checkDate <= range.end
}

// Local storage utilities
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return defaultValue
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  },
  
  clear: () => {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  },
}

// Debounce utility
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Export utilities
export const exportToCSV = (data, filename = 'expenses.csv') => {
  if (!data.length) return
  
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value
      }).join(',')
    )
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
