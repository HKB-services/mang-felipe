
import { Metadata } from 'next'
import LoginPage from '@/features/auth/pages/LoginPage'
import { APP_DETAILS } from '@/constants/app.details'

export const metadata: Metadata = {
  title: `Login · ${APP_DETAILS.name}`,
  description: `Sign in to ${APP_DETAILS.name} admin.`,
}

const page = () => {
  return (
   <LoginPage />
  )
}

export default page