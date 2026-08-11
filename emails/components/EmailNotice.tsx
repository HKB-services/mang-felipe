import type { ReactNode } from "react";
import { Section, Text } from "react-email";
import { emailFontStack, emailTokens } from "@/emails/tokens";

type EmailNoticeProps = {
  children: ReactNode;
};

export function EmailNotice({ children }: EmailNoticeProps) {
  return (
    <Section style={notice}>
      <Text style={noticeText}>{children}</Text>
    </Section>
  );
}

const notice = {
  backgroundColor: emailTokens.notice,
  border: `1px solid ${emailTokens.border}`,
  borderRadius: "8px",
  margin: "22px 0",
  padding: "14px 16px",
};

const noticeText = {
  color: emailTokens.noticeInk,
  fontFamily: emailFontStack,
  fontSize: "14px",
  lineHeight: "21px",
  margin: "0",
};
