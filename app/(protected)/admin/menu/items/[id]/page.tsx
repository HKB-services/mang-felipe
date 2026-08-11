import AdminItemDetail from "@/features/admin/menu/pages/AdminItemDetail"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <AdminItemDetail itemId={id} />
}
