import { Column, Heading, Link, Row, Section, Text } from "react-email";
import { EmailButton } from "@/emails/components/EmailButton";
import { EmailNotice } from "@/emails/components/EmailNotice";
import { EmailShell } from "@/emails/components/EmailShell";
import { emailFontStack, emailTokens } from "@/emails/tokens";

export type DeliveryTrackingEmailProps = {
  orderNumber: string;
  fulfillmentSummary: string;
  lalamoveTrackingUrl: string;
  trackUrl: string;
};

export function DeliveryTrackingEmail({
  orderNumber,
  fulfillmentSummary,
  lalamoveTrackingUrl,
  trackUrl,
}: DeliveryTrackingEmailProps) {
  return (
    <EmailShell
      preview={`Delivery tracking is ready for Mang Felipe order ${orderNumber}.`}
    >
      <Heading as="h1" style={heading}>
        Delivery tracking is ready
      </Heading>
      <Text style={bodyText}>
        Your rider tracking link is ready for Mang Felipe order{" "}
        <strong>{orderNumber}</strong>.
      </Text>

      <EmailNotice>
        Open the Lalamove link for live rider updates. Your Mang Felipe order
        status remains available through Track order.
      </EmailNotice>

      <Section style={summaryBox}>
        <SummaryRow label="Order number" value={orderNumber} />
        <SummaryRow label="Delivery window" value={fulfillmentSummary} />
      </Section>

      <Section style={{ marginTop: "24px" }}>
        <EmailButton href={lalamoveTrackingUrl}>
          Open Lalamove tracking
        </EmailButton>
      </Section>

      <Text style={bodyText}>
        You can also check your shop review status at{" "}
        <Link href={trackUrl} style={link}>
          Track order
        </Link>
        .
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

const previewProps: DeliveryTrackingEmailProps = {
  fulfillmentSummary: "Wednesday, August 12, 2026 · 10:00-12:00",
  lalamoveTrackingUrl: "https://www.lalamove.com/",
  orderNumber: "HM-20260812-ABCD",
  trackUrl: "https://example.com/track?order=HM-20260812-ABCD",
};

DeliveryTrackingEmail.PreviewProps = previewProps;

export default DeliveryTrackingEmail;

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
