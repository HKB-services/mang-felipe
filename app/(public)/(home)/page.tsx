import BrandsSection from "@/features/landing/components/BrandsSection"
import HomeHeroSection from "@/features/landing/components/HomeHeroSection"
import HowItWorksSection from "@/features/landing/components/HowItWorksSection"
import LandingCtaSection from "@/features/landing/components/LandingCtaSection"

export default function Page() {
    return (
        <>
            <HomeHeroSection />
            <BrandsSection />
            <HowItWorksSection />
            <LandingCtaSection />
        </>
    )
}
