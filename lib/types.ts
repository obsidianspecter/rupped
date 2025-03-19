export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  additionalImages?: string[]
  category: string
  rating: number
  reviewCount: number
  isNew?: boolean
  features?: string[]
  specifications?: { name: string; value: string }[]
}

