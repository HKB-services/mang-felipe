import AdminCategoryDetail from "@/features/admin/menu/pages/AdminCategoryDetail"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <AdminCategoryDetail categoryId={id} />
}
