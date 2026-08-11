import type { ReactNode } from "react"
import { Button } from "react-email"
import { emailFontStack, emailTokens } from "@/emails/tokens"

type EmailButtonProps = {
  href: string
  children: ReactNode
}

export function EmailButton({ href, children }: EmailButtonProps) {
  return (
    <Button
      href={href}
      style={{
        backgroundColor: emailTokens.accent,
        borderRadius: "6px",
        color: emailTokens.heroInk,
        display: "inline-block",
        fontFamily: emailFontStack,
        fontSize: "15px",
        fontWeight: 700,
        lineHeight: "20px",
        padding: "12px 20px",
        textDecoration: "none",
      }}
    >
      {children}
    </Button>
  )
}
