import LandingNavbar from '@/features/landing/components/LandingNavbar'
import LandingFooter from '@/features/landing/components/LandingFooter'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <LandingNavbar />
            <main>
                {children}
            </main>
            <LandingFooter />
        </>
    )
}

export default layout