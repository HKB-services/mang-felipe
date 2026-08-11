import OrderSuccessPage from "@/features/orders/pages/OrderSuccessPage"

export default async function Page({ params }: PageProps<"/orders/[orderNumber]">) {
  const { orderNumber } = await params
  return <OrderSuccessPage orderNumber={orderNumber} />
}
