"use client"

import { useEffect, useMemo, useState, type FormEvent } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { IconCalendar, IconCheck, IconLoader2, IconPhoto, IconUpload } from "@tabler/icons-react"
import { Attachment, AttachmentContent, AttachmentDescription, AttachmentMedia, AttachmentTitle, AttachmentTrigger } from "@/components/ui/attachment"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { createOrder } from "@/features/orders/actions/create-order.action"
import { createPaymentProofUploadIntent } from "@/features/orders/actions/create-payment-proof-upload.action"
import { useOrderCart } from "@/features/orders/hooks/use-order-cart"
import { usePaymentProofOcr } from "@/features/payments/hooks/use-payment-proof-ocr"
import { FULFILLMENT_SLOT_LIST, PAYMENT_CHANNEL_LIST, type FulfillmentTypeId, type PaymentChannelId } from "@/constants/payment"
import { minFulfillmentDate } from "@/features/orders/schema/order-checkout.schema"
import { cn } from "@/lib/utils"
import { formatFulfillmentDate, formatPhp } from "@/features/orders/utils/format"
import { PAYMENT_PROOF_ACCEPTED_TYPES, PAYMENT_PROOF_MAX_BYTES } from "@/features/orders/utils/payment-proof"

const dateValue = (date: Date) =>
  [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-")

export function CheckoutForm() {
  const router = useRouter()
  const { items, subtotalPhp, clear } = useOrderCart()
  const { analyze, isReading, result: ocrResult } = usePaymentProofOcr()
  const minDate = useMemo(() => minFulfillmentDate(), [])
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentTypeId>("pickup")
  const [paymentChannel, setPaymentChannel] = useState<PaymentChannelId>("unionbank")
  const [fulfillmentDate, setFulfillmentDate] = useState(dateValue(minDate))
  const [paymentProofKey, setPaymentProofKey] = useState<string | null>(null)
  const [proofName, setProofName] = useState<string | null>(null)
  const [proofPreviewUrl, setProofPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedChannel = PAYMENT_CHANNEL_LIST.find((channel) => channel.id === paymentChannel)!

  useEffect(() => () => {
    if (proofPreviewUrl) URL.revokeObjectURL(proofPreviewUrl)
  }, [proofPreviewUrl])

  const uploadProof = async (file: File | undefined) => {
    if (!file) return
    setError(null)
    if (!PAYMENT_PROOF_ACCEPTED_TYPES.includes(file.type as never)) {
      setError("Upload a JPEG, PNG, WebP, or GIF payment screenshot.")
      return
    }
    if (file.size > PAYMENT_PROOF_MAX_BYTES) {
      setError("Payment screenshot must be 5 MB or smaller.")
      return
    }
    setProofPreviewUrl(URL.createObjectURL(file))
    setUploading(true)
    try {
      const extension = file.name.split(".").pop() || "image"
      const intent = await createPaymentProofUploadIntent({ contentType: file.type, contentLength: file.size, extension })
      const response = await fetch(intent.uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } })
      if (!response.ok) throw new Error("Upload failed. Try again.")
      setPaymentProofKey(intent.key)
      setProofName(file.name)
      void analyze(file)
    } catch (uploadError) {
      setPaymentProofKey(null)
      setProofName(null)
      setProofPreviewUrl(null)
      setError(uploadError instanceof Error ? uploadError.message : "Payment proof upload failed.")
    } finally {
      setUploading(false)
    }
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    if (!items.length) return setError("Add at least one menu item before checkout.")
    if (!paymentProofKey) return setError("Upload your payment screenshot before submitting.")
    const fields = new FormData(event.currentTarget)
    setSubmitting(true)
    try {
      const result = await createOrder({
        customerName: fields.get("customerName"),
        customerPhone: fields.get("customerPhone"),
        customerEmail: fields.get("customerEmail"),
        fulfillmentType,
        fulfillmentDate,
        fulfillmentSlot: fields.get("fulfillmentSlot"),
        deliveryAddress: fields.get("deliveryAddress"),
        deliveryNotes: fields.get("deliveryNotes"),
        paymentChannel,
        paymentProofKey,
        items: items.map((line) => ({ variantId: line.id, quantity: line.quantity })),
      })
      clear()
      router.push(`/orders/${result.orderNumber}`)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not submit order. Try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      <FieldSet>
        <FieldLegend>1. Your details</FieldLegend>
        <FieldGroup className="grid gap-4 sm:grid-cols-2">
          <Field><FieldLabel htmlFor="customerName">Full name</FieldLabel><Input id="customerName" name="customerName" required minLength={2} autoComplete="name" /></Field>
          <Field><FieldLabel htmlFor="customerPhone">Mobile number</FieldLabel><Input id="customerPhone" name="customerPhone" required minLength={7} inputMode="tel" autoComplete="tel" placeholder="0917 310 2345" /></Field>
          <Field className="sm:col-span-2"><FieldLabel htmlFor="customerEmail">Email <span className="font-normal text-muted-foreground">(optional)</span></FieldLabel><Input id="customerEmail" name="customerEmail" type="email" autoComplete="email" /><FieldDescription>Order receipt sent here when provided.</FieldDescription></Field>
        </FieldGroup>
      </FieldSet>
      <Separator />
      <FieldSet>
        <FieldLegend>2. Pickup or delivery</FieldLegend>
        <div className="grid grid-cols-2 gap-3">
          {(["pickup", "delivery"] as const).map((type) => <Button key={type} type="button" variant={fulfillmentType === type ? "default" : "outline"} className="min-h-12 capitalize" onClick={() => setFulfillmentType(type)}>{type}</Button>)}
        </div>
        <FieldGroup className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel>Fulfillment date</FieldLabel>
            <Popover>
              <PopoverTrigger render={<Button type="button" variant="outline" className="min-h-11 w-full justify-start font-normal" />}><IconCalendar className="size-4" />{formatFulfillmentDate(new Date(`${fulfillmentDate}T00:00:00`))}</PopoverTrigger>
              <PopoverContent align="start" className="checkout-calendar w-auto border p-0"><Calendar mode="single" selected={new Date(`${fulfillmentDate}T00:00:00`)} disabled={{ before: minDate }} onSelect={(date) => date && setFulfillmentDate(dateValue(date))} /></PopoverContent>
            </Popover>
            <FieldDescription>Earliest date: {formatFulfillmentDate(minDate)}.</FieldDescription>
          </Field>
          <Field><FieldLabel>Time slot</FieldLabel><Select defaultValue="slot_10_12" name="fulfillmentSlot"><SelectTrigger className="min-h-11 w-full"><SelectValue>{(value: string | null) => FULFILLMENT_SLOT_LIST.find((slot) => slot.id === value)?.label ?? "Choose a time"}</SelectValue></SelectTrigger><SelectContent>{FULFILLMENT_SLOT_LIST.map((slot) => <SelectItem key={slot.id} value={slot.id}>{slot.label}</SelectItem>)}</SelectContent></Select></Field>
        </FieldGroup>
        {fulfillmentType === "delivery" ? <Field><FieldLabel htmlFor="deliveryAddress">Delivery address</FieldLabel><Textarea id="deliveryAddress" name="deliveryAddress" required minLength={5} autoComplete="street-address" placeholder="House/unit, street, barangay, city" /><FieldDescription>Delivery fee is not included in food subtotal.</FieldDescription></Field> : null}
        <Field><FieldLabel htmlFor="deliveryNotes">Notes <span className="font-normal text-muted-foreground">(optional)</span></FieldLabel><Textarea id="deliveryNotes" name="deliveryNotes" placeholder="Landmark, gate instructions, or other request" /></Field>
      </FieldSet>
      <Separator />
      <FieldSet>
        <FieldLegend>3. Pay and upload proof</FieldLegend>
        <div className="grid gap-3 sm:grid-cols-3">{PAYMENT_CHANNEL_LIST.map((channel) => <Button key={channel.id} type="button" variant={paymentChannel === channel.id ? "default" : "outline"} className="min-h-12" onClick={() => setPaymentChannel(channel.id)}>{channel.label}</Button>)}</div>
        <div className="rounded-xl border border-[#d5b26c] bg-[#fff9ea] p-4 text-sm text-[#51380e]"><p className="font-semibold">{selectedChannel.label}</p><p className="mt-1">{selectedChannel.accountName}</p><p>{selectedChannel.accountDetailLabel}: {selectedChannel.accountDetail}</p></div>
        <Field><FieldLabel htmlFor="paymentProof">Payment screenshot</FieldLabel><Input id="paymentProof" className="sr-only" type="file" accept={PAYMENT_PROOF_ACCEPTED_TYPES.join(",")} required onChange={(event) => void uploadProof(event.target.files?.[0])} aria-describedby="payment-proof-help" /><Attachment state={uploading ? "uploading" : proofName ? "done" : "idle"} className="w-full min-h-16"><AttachmentMedia variant={proofPreviewUrl ? "image" : "icon"}>{proofPreviewUrl ? <Image src={proofPreviewUrl} alt="Payment proof preview" fill unoptimized className="object-cover" /> : uploading ? <IconLoader2 className="animate-spin" /> : <IconPhoto />}</AttachmentMedia><AttachmentContent><AttachmentTitle>{proofName ?? "Upload payment screenshot"}</AttachmentTitle><AttachmentDescription>{uploading ? "Uploading proof…" : proofName ? "Uploaded. Select to replace." : "JPEG, PNG, WebP, or GIF · maximum 5 MB"}</AttachmentDescription></AttachmentContent><AttachmentTrigger render={<label htmlFor="paymentProof" aria-label="Upload payment screenshot" />} /></Attachment><FieldDescription id="payment-proof-help">Payment proof is required before submitting your order.</FieldDescription>{proofName ? <p className="flex items-center gap-2 text-sm text-emerald-800"><IconCheck className="size-4" /> {proofName} uploaded</p> : null}</Field>
        {isReading ? <p className="text-xs text-muted-foreground">Reading payment proof for hints…</p> : null}
        {ocrResult ? <p className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">OCR hint: {ocrResult.detectedChannel ?? "payment channel"}{ocrResult.detectedAmountPhp ? ` · ${formatPhp(ocrResult.detectedAmountPhp)}` : ""}. Admin still verifies payment.</p> : null}
      </FieldSet>
      <div className="rounded-xl bg-[#103d2d] p-4 text-white"><div className="flex justify-between font-semibold"><span>Food subtotal</span><span>{formatPhp(subtotalPhp)}</span></div><p className="mt-2 text-xs leading-5 text-emerald-50/75">Delivery fee not included. Prices subject to change. Payment proof stays pending admin review.</p></div>
      {error ? <FieldError>{error}</FieldError> : null}
      <Button type="submit" size="lg" className="w-full" disabled={submitting || uploading || !items.length || !paymentProofKey} isLoading={submitting}><IconUpload className={cn("size-4", submitting && "hidden")} /> Submit order for review</Button>
    </form>
  )
}
