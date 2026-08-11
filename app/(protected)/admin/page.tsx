
import { redirect } from 'next/navigation'
import { ROUTES } from '@/constants/app.routes'

const page = () => {
    redirect(ROUTES.DASHBOARD)
}

export default page