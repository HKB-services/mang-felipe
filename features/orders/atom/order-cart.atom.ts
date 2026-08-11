"use client"

import { atomWithStorage } from "jotai/utils"
import type { CartLine } from "@/features/orders/types"

export const orderCartAtom = atomWithStorage<CartLine[]>("mang-felipe:order-cart", [])
