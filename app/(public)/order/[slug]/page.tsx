import ProductPage from "@/features/orders/pages/ProductPage"

export const dynamic = "force-dynamic"

export default async function Page({ params }: PageProps<"/order/[slug]">) {
  const { slug } = await params
  return <ProductPage slug={slug} />
}
