import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return <div className="mf-canvas px-4 py-12 sm:px-6"><div className="mx-auto max-w-7xl space-y-6"><Skeleton className="h-40 w-full" /><Skeleton className="h-11 w-full max-w-xl" /><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-64 w-full" />)}</div></div></div>
}
