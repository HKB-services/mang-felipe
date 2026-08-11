import LandingNavbar from '@/features/landing/components/LandingNavbar'
import LandingFooter from '@/features/landing/components/LandingFooter'
import ScrollToTop from '@/features/landing/components/ScrollToTop'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <LandingNavbar />
            <main>
                {children}
            </main>
            <LandingFooter />
            <ScrollToTop />
        </>
    )
}

export default layout