import ForgotPasswordPage from '@/features/auth/pages/ForgotPasswordPage'
import { APP_DETAILS } from '@/constants/app.details'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Forgot Password · ${APP_DETAILS.name}`,
  description: `Reset your ${APP_DETAILS.name} account password.`,
}

const page = () => {
  return (
    <ForgotPasswordPage />
  )
}

export default page