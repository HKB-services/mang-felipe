import { OrderClient } from "@/features/orders/components/OrderClient"
import { getOrderMenu } from "@/features/orders/server/menu.server"

export default async function OrderPage() {
  const menu = await getOrderMenu()
  return <OrderClient menu={menu} />
}
