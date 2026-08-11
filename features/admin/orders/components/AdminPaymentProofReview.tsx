"use client"

import { useEffect } from "react"
import { IconAlertTriangle, IconCheck, IconLoader2 } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PAYMENT_CHANNELS, type PaymentChannelId } from "@/constants/payment"
import { usePaymentProofOcr } from "@/features/payments/hooks/use-payment-proof-ocr"
import { formatPhp } from "@/features/orders/utils/format"

type AdminPaymentProofReviewProps = {
  proofUrl: string | null
  proofOcrUrl: string | null
  uploadedAt: string | null
  paymentChannel: PaymentChannelId
  expectedSubtotalPhp: number
}

function formatUploadedAt(uploadedAt: string | null) {
  if (!uploadedAt) return "No upload timestamp"
  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(uploadedAt))
}

function sameAmount(left: number | null, right: number) {
  return left !== null && Math.round(left) === right
}

export function AdminPaymentProofReview({
  proofUrl,
  proofOcrUrl,
  uploadedAt,
  paymentChannel,
  expectedSubtotalPhp,
}: AdminPaymentProofReviewProps) {
  const { analyze, error, isReading, result } = usePaymentProofOcr()
  const expectedChannel = PAYMENT_CHANNELS[paymentChannel]
  const amountMatches = sameAmount(result?.detectedAmountPhp ?? null, expectedSubtotalPhp)
  const channelMatches = result?.detectedChannel === paymentChannel

  useEffect(() => {
    if (!proofOcrUrl) return
    const proofUrlForOcr = proofOcrUrl
    let cancelled = false

    async function analyzeProof() {
      const response = await fetch(proofUrlForOcr)
      if (!response.ok) throw new Error("Payment proof image could not be loaded")
      const proofBlob = await response.blob()
      if (!cancelled) void analyze(proofBlob)
    }

    void analyzeProof().catch(() => {
      if (!cancelled) void analyze(proofUrlForOcr)
    })

    return () => {
      cancelled = true
    }
  }, [analyze, proofOcrUrl])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment proof</CardTitle>
        <p className="text-sm text-muted-foreground">
          Uploaded {formatUploadedAt(uploadedAt)}. OCR is assistive only, admin
          still verifies payment manually.
        </p>
      </CardHeader>
      <CardContent className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <div className="overflow-hidden rounded-lg border bg-muted/30">
          {proofUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- signed R2 proof URL is admin-only and short-lived.
            <img
              alt="Uploaded payment proof"
              className="max-h-[640px] w-full object-contain"
              src={proofUrl}
            />
          ) : (
            <div className="flex min-h-72 items-center justify-center p-6 text-sm text-muted-foreground">
              No payment proof image available.
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-lg border p-4">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Expected payment
            </p>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Channel</span>
                <span className="font-medium">{expectedChannel.label}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Food subtotal</span>
                <span className="font-medium">{formatPhp(expectedSubtotalPhp)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Extracted details
              </p>
              {isReading ? (
                <Badge variant="secondary">
                  <IconLoader2 className="size-3 animate-spin" />
                  Reading
                </Badge>
              ) : null}
            </div>

            {error ? (
              <p className="mt-3 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            {result ? (
              <div className="mt-3 space-y-3 text-sm">
                <ProofRow
                  label="Detected channel"
                  status={channelMatches ? "match" : "warn"}
                  value={
                    result.detectedChannel
                      ? PAYMENT_CHANNELS[result.detectedChannel].label
                      : "Not detected"
                  }
                />
                <ProofRow
                  label="Detected amount"
                  status={amountMatches ? "match" : "warn"}
                  value={
                    result.detectedAmountPhp
                      ? formatPhp(result.detectedAmountPhp)
                      : "Not detected"
                  }
                />
                <ProofRow
                  label="Reference"
                  value={result.detectedReference ?? "Not detected"}
                />
                <ProofRow
                  label="Account hint"
                  value={result.matchedAccountHint ?? "No account match found"}
                />
                <ProofRow
                  label="OCR confidence"
                  value={`${Math.round(result.confidence * 100)}%`}
                />
                <details className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
                  <summary className="cursor-pointer font-medium text-foreground">
                    Raw extracted text
                  </summary>
                  <p className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap">
                    {result.rawText || "No text extracted."}
                  </p>
                </details>
              </div>
            ) : !isReading ? (
              <p className="mt-3 text-sm text-muted-foreground">
                No extracted details yet.
              </p>
            ) : null}
          </div>

          {proofUrl ? (
            <Button
              nativeButton={false}
              variant="outline"
              render={<a href={proofUrl} rel="noreferrer" target="_blank" />}
            >
              Open full image
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

function ProofRow({
  label,
  value,
  status,
}: {
  label: string
  value: string
  status?: "match" | "warn"
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b pb-2 last:border-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="flex max-w-[65%] items-center justify-end gap-1.5 text-right font-medium">
        {status === "match" ? <IconCheck className="size-4 text-emerald-600" /> : null}
        {status === "warn" ? (
          <IconAlertTriangle className="size-4 text-amber-600" />
        ) : null}
        {value}
      </span>
    </div>
  )
}
