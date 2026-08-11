export const formatPhp = (amount: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(amount)

export const formatFulfillmentDate = (date: Date) =>
  new Intl.DateTimeFormat("en-PH", { dateStyle: "full" }).format(date)
