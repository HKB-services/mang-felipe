import { Section, Text } from "react-email";
import { APP_DETAILS } from "@/constants/app.details";
import { emailFontStack, emailTokens } from "@/emails/tokens";

export function EmailHeader() {
  return (
    <Section style={header}>
      <Text style={brandName}>{APP_DETAILS.name}</Text>
      <Text style={parentName}>{APP_DETAILS.parentCompany}</Text>
    </Section>
  );
}

const header = {
  backgroundColor: emailTokens.surface,
  borderBottom: `1px solid ${emailTokens.border}`,
  padding: "22px 28px",
};

const brandName = {
  color: emailTokens.ink,
  fontFamily: emailFontStack,
  fontSize: "20px",
  fontWeight: 800,
  lineHeight: "24px",
  margin: "0",
};

const parentName = {
  color: emailTokens.muted,
  fontFamily: emailFontStack,
  fontSize: "12px",
  lineHeight: "18px",
  margin: "2px 0 0",
};
