"use client"

import { TextFormField } from "@/components/forms/TextFormField"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { stringFieldProps } from "@/lib/form-utils"
import { useLalamoveTrackingForm } from "@/features/orders/hooks/use-lalamove-tracking-form"

export function LalamoveTrackingForm({
  orderId,
  currentUrl,
  hasCustomerEmail,
}: {
  orderId: string
  currentUrl: string | null
  hasCustomerEmail: boolean
}) {
  const { form, loading } = useLalamoveTrackingForm({ orderId, currentUrl })
  const canResend = Boolean(currentUrl) && hasCustomerEmail

  return (
    <form action={() => form.handleSubmit()} className="flex flex-col gap-4">
      <form.Field name="lalamoveTrackingUrl">
        {(field) => (
          <TextFormField
            label="Lalamove tracking URL"
            type="url"
            placeholder="https://share.lalamove.com/..."
            {...stringFieldProps(field)}
          />
        )}
      </form.Field>

      <form.Field name="resendEmail">
        {(field) => (
          <div className="flex items-center gap-2">
            <Checkbox
              id={field.name}
              checked={field.state.value}
              disabled={!canResend}
              onCheckedChange={(checked) => field.handleChange(checked === true)}
            />
            <Label htmlFor={field.name} className="font-normal">
              Re-send tracking email to customer
            </Label>
          </div>
        )}
      </form.Field>
      {!hasCustomerEmail && (
        <p className="text-xs text-muted-foreground">
          No email on file for this order — customer will not be emailed.
        </p>
      )}

      <Button type="submit" isLoading={loading} className="w-full sm:w-auto">
        Save tracking link
      </Button>
    </form>
  )
}
