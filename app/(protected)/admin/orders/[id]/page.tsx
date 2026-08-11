import AdminOrderDetail from "@/features/admin/orders/pages/AdminOrderDetail"

export default async function Page({ params }: PageProps<"/admin/orders/[id]">) {
  const { id } = await params
  return <AdminOrderDetail orderId={id} />
}
