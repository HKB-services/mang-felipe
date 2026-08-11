import { ReactNode, Suspense } from "react"

import { AuthLayoutShell } from "@/features/auth/components/AuthLayoutShell"

const AuthLayout = ({ children }: { children: ReactNode }): ReactNode => {
  return (
    <Suspense>
      <AuthLayoutShell>{children}</AuthLayoutShell>
    </Suspense>
  )
}

export default AuthLayout
