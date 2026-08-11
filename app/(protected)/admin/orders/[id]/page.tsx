import OrderDetailPage from "@/features/admin/orders/pages/OrderDetailPage"

export default async function Page({ params }: PageProps<"/admin/orders/[id]">) {
  const { id } = await params
  return <OrderDetailPage orderId={id} />
}
