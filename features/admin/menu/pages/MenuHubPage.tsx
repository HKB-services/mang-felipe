import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconToolsKitchen2 } from "@tabler/icons-react"

const MenuHubPage = () => {
  return (
    <section className="w-full py-4 sm:py-8">
      <Badge variant="secondary">Menu</Badge>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">Manage menu</h1>
      <p className="mt-2 leading-7 text-muted-foreground">
        Keep dishes, variants, prices, and availability ready for customers.
      </p>
      <Card className="mt-8 py-0 shadow-none">
        <CardHeader className="items-center py-14 text-center">
          <div className="mb-2 flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <IconToolsKitchen2 className="size-5" aria-hidden />
          </div>
          <CardTitle>Menu tools are being prepared</CardTitle>
          <CardContent className="px-0 text-muted-foreground">
            Categories, dishes, size variants, and availability controls will
            appear here.
          </CardContent>
        </CardHeader>
      </Card>
    </section>
  )
}

export default MenuHubPage
