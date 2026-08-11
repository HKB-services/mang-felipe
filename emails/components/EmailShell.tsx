import type { ReactNode } from "react"
import { Body, Container, Head, Html, Preview, Section } from "react-email"
import { emailFontStack, emailTokens } from "@/emails/tokens"
import { EmailFooter } from "@/emails/components/EmailFooter"
import { EmailHeader } from "@/emails/components/EmailHeader"

type EmailShellProps = {
  preview: string
  logoUrl: string
  children: ReactNode
}

export function EmailShell({ preview, logoUrl, children }: EmailShellProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={card}>
          <EmailHeader logoUrl={logoUrl} />
          <Section style={content}>{children}</Section>
          <EmailFooter />
        </Container>
      </Body>
    </Html>
  )
}

const body = {
  backgroundColor: emailTokens.canvas,
  fontFamily: emailFontStack,
  margin: "0",
  padding: "32px 12px",
}

const card = {
  backgroundColor: emailTokens.surface,
  border: `1px solid ${emailTokens.border}`,
  borderRadius: "8px",
  margin: "0 auto",
  maxWidth: "600px",
  overflow: "hidden",
}

const content = {
  padding: "28px",
}
