import { Column, Img, Row, Section, Text } from "react-email"
import { APP_DETAILS } from "@/constants/app.details"
import { emailFontStack, emailTokens } from "@/emails/tokens"

type EmailHeaderProps = {
  logoUrl: string
}

export function EmailHeader({ logoUrl }: EmailHeaderProps) {
  return (
    <Section style={header}>
      <Row>
        <Column style={{ width: "56px" }}>
          <Img
            alt="Mang Felipe logo"
            height="44"
            src={logoUrl}
            style={logo}
            width="44"
          />
        </Column>
        <Column>
          <Text style={brandName}>{APP_DETAILS.name}</Text>
          <Text style={parentName}>{APP_DETAILS.parentCompany}</Text>
        </Column>
      </Row>
    </Section>
  )
}

const header = {
  backgroundColor: emailTokens.hero,
  borderBottom: `3px solid ${emailTokens.gold}`,
  padding: "22px 28px",
}

const logo = {
  borderRadius: "8px",
  display: "block",
}

const brandName = {
  color: emailTokens.heroInk,
  fontFamily: emailFontStack,
  fontSize: "20px",
  fontWeight: 800,
  lineHeight: "24px",
  margin: "0",
}

const parentName = {
  color: "#dbeee5",
  fontFamily: emailFontStack,
  fontSize: "12px",
  lineHeight: "18px",
  margin: "2px 0 0",
}
