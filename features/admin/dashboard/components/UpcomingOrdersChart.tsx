"use client"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

const chartConfig = {
  orders: {
    label: "Confirmed orders",
    color: "var(--primary)",
  },
} satisfies ChartConfig

type UpcomingOrdersChartProps = {
  data: Array<{ date: string; label: string; orders: number }>
}

const UpcomingOrdersChart = ({ data }: UpcomingOrdersChartProps) => {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full aspect-auto">
      <BarChart accessibilityLayer data={data} margin={{ left: -16, right: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="orders" fill="var(--color-orders)" radius={[5, 5, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}

export default UpcomingOrdersChart
