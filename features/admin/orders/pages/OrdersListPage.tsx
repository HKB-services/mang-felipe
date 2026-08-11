import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconClipboardList } from "@tabler/icons-react"

const OrdersListPage = () => {
  return (
    <section className="w-full py-4 sm:py-8">
      <Badge variant="secondary">Orders</Badge>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">All orders</h1>
      <p className="mt-2 leading-7 text-muted-foreground">
        Review incoming orders, payment proofs, and fulfillment details here.
      </p>
      <Card className="mt-8 py-0 shadow-none">
        <CardHeader className="items-center py-14 text-center">
          <div className="mb-2 flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <IconClipboardList className="size-5" aria-hidden />
          </div>
          <CardTitle>Order review is being prepared</CardTitle>
          <CardContent className="px-0 text-muted-foreground">
            This workspace will list new orders and provide the review actions
            for each payment proof.
          </CardContent>
        </CardHeader>
      </Card>
    </section>
  )
}

export default OrdersListPage
