"use client"

import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import type { CartLine } from "@/features/orders/types"

export const orderCartAtom = atomWithStorage<CartLine[]>("mang-felipe:order-cart", [])
export const cartSheetOpenAtom = atom(false)
