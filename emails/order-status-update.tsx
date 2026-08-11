import { Column, Heading, Link, Row, Section, Text } from "react-email";
import { EmailButton } from "@/emails/components/EmailButton";
import { EmailNotice } from "@/emails/components/EmailNotice";
import { EmailShell } from "@/emails/components/EmailShell";
import { emailFontStack, emailTokens } from "@/emails/tokens";

export type OrderStatusUpdateEmailProps = {
  orderNumber: string;
  customerName: string;
  statusLabel: string;
  statusMessage: string;
  fulfillmentSummary: string;
  trackUrl: string;
};

export function OrderStatusUpdateEmail({
  orderNumber,
  customerName,
  statusLabel,
  statusMessage,
  fulfillmentSummary,
  trackUrl,
}: OrderStatusUpdateEmailProps) {
  const firstName = customerName.trim().split(/\s+/)[0] || "there";

  return (
    <EmailShell
      preview={`Mang Felipe order ${orderNumber} is now ${statusLabel.toLowerCase()}.`}
    >
      <Heading as="h1" style={heading}>
        Order status updated
      </Heading>
      <Text style={bodyText}>
        Hi {firstName}, your Mang Felipe order status changed.
      </Text>

      <Section style={codeBox}>
        <Text style={label}>Order number</Text>
        <Text style={orderCode}>{orderNumber}</Text>
      </Section>

      <EmailNotice>{statusMessage}</EmailNotice>

      <Section style={summaryBox}>
        <SummaryRow label="Status" value={statusLabel} />
        <SummaryRow label="Fulfillment" value={fulfillmentSummary} />
      </Section>

      <Section style={{ marginTop: "24px" }}>
        <EmailButton href={trackUrl}>Track order</EmailButton>
      </Section>

      <Text style={bodyText}>
        You can also open{" "}
        <Link href={trackUrl} style={link}>
          Track order
        </Link>{" "}
        anytime with your order number and mobile number.
      </Text>
    </EmailShell>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <Row style={summaryRow}>
      <Column style={{ width: "42%" }}>
        <Text style={summaryLabel}>{label}</Text>
      </Column>
      <Column>
        <Text style={summaryValue}>{value}</Text>
      </Column>
    </Row>
  );
}

const previewProps: OrderStatusUpdateEmailProps = {
  customerName: "Juan dela Cruz",
  fulfillmentSummary: "Delivery · Wednesday, August 12, 2026 · 10:00-12:00",
  orderNumber: "HM-20260812-ABCD",
  statusLabel: "Confirmed",
  statusMessage:
    "Good news — your order is confirmed. Please keep your order number handy.",
  trackUrl: "https://example.com/track?order=HM-20260812-ABCD",
};

OrderStatusUpdateEmail.PreviewProps = previewProps;

export default OrderStatusUpdateEmail;

const heading = {
  color: emailTokens.ink,
  fontFamily: emailFontStack,
  fontSize: "26px",
  fontWeight: 800,
  lineHeight: "32px",
  margin: "0 0 14px",
};

const bodyText = {
  color: emailTokens.ink,
  fontFamily: emailFontStack,
  fontSize: "15px",
  lineHeight: "24px",
  margin: "14px 0 0",
};

const codeBox = {
  backgroundColor: emailTokens.panel,
  border: `1px solid ${emailTokens.border}`,
  borderRadius: "8px",
  margin: "22px 0 0",
  padding: "16px",
};

const label = {
  color: emailTokens.muted,
  fontFamily: emailFontStack,
  fontSize: "12px",
  lineHeight: "16px",
  margin: "0 0 4px",
  textTransform: "uppercase" as const,
};

const orderCode = {
  color: emailTokens.ink,
  fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
  fontSize: "22px",
  fontWeight: 800,
  letterSpacing: "0",
  lineHeight: "28px",
  margin: "0",
};

const summaryBox = {
  border: `1px solid ${emailTokens.border}`,
  borderRadius: "8px",
  margin: "22px 0 0",
  overflow: "hidden",
};

const summaryRow = {
  borderBottom: `1px solid ${emailTokens.border}`,
};

const summaryLabel = {
  color: emailTokens.muted,
  fontFamily: emailFontStack,
  fontSize: "13px",
  lineHeight: "20px",
  margin: "0",
  padding: "12px 14px",
};

const summaryValue = {
  color: emailTokens.ink,
  fontFamily: emailFontStack,
  fontSize: "14px",
  fontWeight: 700,
  lineHeight: "20px",
  margin: "0",
  padding: "12px 14px",
};

const link = {
  color: emailTokens.accent,
  fontWeight: 700,
  textDecoration: "underline",
};
