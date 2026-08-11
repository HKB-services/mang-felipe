export type OrderMenuVariant = {
  id: string
  label: string
  portionLabel: string
  pricePhp: number
}

export type OrderMenuItem = {
  id: string
  name: string
  slug: string
  description: string | null
  notes: string | null
  code: string | null
  imageUrl: string
  variants: OrderMenuVariant[]
}

export type OrderMenuCategory = {
  id: string
  name: string
  slug: string
  description: string | null
  sortOrder: number
  items: OrderMenuItem[]
}

export type CartLine = OrderMenuVariant & {
  menuItemId: string
  itemName: string
  quantity: number
}
