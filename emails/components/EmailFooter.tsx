import { Hr, Link, Section, Text } from "react-email"
import { APP_DETAILS } from "@/constants/app.details"
import { SHOP_CONTACT } from "@/constants/contact"
import { emailFontStack, emailTokens } from "@/emails/tokens"

export function EmailFooter() {
  return (
    <Section style={{ padding: "0 28px 28px" }}>
      <Hr style={{ borderColor: emailTokens.border, margin: "0 0 18px" }} />
      <Text style={footerText}>
        {APP_DETAILS.name} serves {APP_DETAILS.serviceAreas.join(", ")}.
      </Text>
      <Text style={footerText}>
        Need help? Message {SHOP_CONTACT.viberDisplay} or email{" "}
        <Link href={`mailto:${SHOP_CONTACT.email}`} style={footerLink}>
          {SHOP_CONTACT.email}
        </Link>
        .
      </Text>
      <Text style={finePrint}>
        Prices subject to change. Delivery fee not included unless confirmed by
        the shop.
      </Text>
    </Section>
  )
}

const footerText = {
  color: emailTokens.muted,
  fontFamily: emailFontStack,
  fontSize: "13px",
  lineHeight: "20px",
  margin: "0 0 6px",
}

const footerLink = {
  color: emailTokens.accent,
  textDecoration: "underline",
}

const finePrint = {
  ...footerText,
  fontSize: "12px",
  margin: "12px 0 0",
}
